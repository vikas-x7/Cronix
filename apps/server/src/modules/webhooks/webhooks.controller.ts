import { Controller, Post, Param, Body, HttpCode } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PrismaService } from '../../prisma/prisma.service';
import { JobProducer } from '../queue/producers/job.producer';

@Controller('webhooks')
@Throttle({ default: { ttl: 60000, limit: 30 } })
export class WebhooksController {
  constructor(
    private prisma: PrismaService,
    private jobProducer: JobProducer,
  ) {}

  @Post(':token')
  @HttpCode(200)
  async handleWebhook(@Param('token') token: string, @Body() body: any) {
    const job = await this.prisma.job.findUnique({
      where: { webhookToken: token },
    });

    if (!job) {
      return { __message: 'Not found', statusCode: 404 };
    }

    if (job.status === 'PAUSED' || job.status === 'DELETED') {
      return { __message: 'Job is not active', statusCode: 400 };
    }

    await this.jobProducer.addJob(job.id, 'WEBHOOK');

    return { __message: 'Received' };
  }
}
