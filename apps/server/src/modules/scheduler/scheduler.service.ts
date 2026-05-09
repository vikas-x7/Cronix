import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  constructor(
    @InjectQueue('job-execution') private queue: Queue,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const cronJobs = await this.prisma.job.findMany({
      where: { type: 'CRON', status: 'ACTIVE' },
    });

    for (const job of cronJobs) {
      if (job.schedule) {
        await this.addRepeatableJob(job.id, job.schedule);
      }
    }
  }

  async addRepeatableJob(jobId: string, cronExpression: string) {
    await this.queue.upsertJobScheduler(
      jobId,
      { pattern: cronExpression },
      {
        name: 'execute',
        data: { jobId, trigger: 'SCHEDULED' },
      },
    );
  }

  async removeRepeatableJob(jobId: string) {
    await this.queue.removeJobScheduler(jobId);
  }
}
