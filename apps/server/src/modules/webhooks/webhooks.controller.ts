import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
      throw new NotFoundException('Not found');
    }

    if (job.status === 'PAUSED' || job.status === 'DELETED') {
      throw new BadRequestException('Job is not active');
    }

    await this.jobProducer.addJob(job.id, 'WEBHOOK');

    return { __message: 'Received' };
  }
}
