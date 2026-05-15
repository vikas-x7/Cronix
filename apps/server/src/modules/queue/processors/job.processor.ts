import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import axios from 'axios';
import { PrismaService } from '../../../prisma/prisma.service';
import { CacheService } from '../../cache/cache.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Processor('job-execution')
export class JobProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private notifications: NotificationsService,
  ) {
    super();
  }

  async process(job: Job) {
    const { jobId, trigger } = job.data;
    const attempt = job.attemptsMade + 1;

    const jobData = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!jobData) throw new Error('Job not found');

    const execution = await this.prisma.execution.create({
      data: {
        jobId,
        status: 'RUNNING',
        trigger,
        attempt,
      },
    });

    await this.prisma.log.create({
      data: {
        executionId: execution.id,
        message: 'Job started',
        level: 'INFO',
      },
    });

    const startTime = Date.now();

    try {
      const response = await axios({
        method: jobData.method as any,
        url: jobData.endpoint,
        headers: (jobData.headers as Record<string, string>) || {},
        data: jobData.body ?? undefined,
        timeout: jobData.timeout * 1000,
        validateStatus: () => true,
      });

      await this.prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: 'SUCCESS',
          httpStatus: response.status,
          response: response.data ?? null,
          duration: Date.now() - startTime,
          finishedAt: new Date(),
        },
      });

      await this.prisma.log.create({
        data: {
          executionId: execution.id,
          message: 'Job completed successfully',
          level: 'INFO',
        },
      });

      await this.invalidateCache(jobData.spaceId);
    } catch (error: any) {
      await this.prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          error: error.message,
          finishedAt: new Date(),
        },
      });

      await this.prisma.log.create({
        data: {
          executionId: execution.id,
          message: `Job failed: ${error.message}`,
          level: 'ERROR',
        },
      });

      if (attempt >= jobData.retryCount && jobData.failureEmail) {
        await this.notifications.sendJobFailureEmail(jobId, error.message);
      }

      await this.invalidateCache(jobData.spaceId);

      throw error;
    }
  }

  private async invalidateCache(spaceId: string) {
    try {
      const space = await this.prisma.space.findUnique({
        where: { id: spaceId },
        select: { userId: true },
      });
      if (space) {
        await this.cache.del(`stats:${space.userId}`);
      }
    } catch {
      // silent fail for cache invalidation
    }
  }
}
