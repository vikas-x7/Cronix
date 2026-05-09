import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JobProducer {
  constructor(
    @InjectQueue('job-execution') private queue: Queue,
    private prisma: PrismaService,
  ) {}

  async addJob(jobId: string, trigger: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      throw new Error('Job not found');
    }

    await this.queue.add(
      'execute',
      {
        jobId,
        trigger,
      },
      {
        attempts: job.retryCount,
        backoff: { type: 'fixed', delay: job.retryDelay * 1000 },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );
  }
}
