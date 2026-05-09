import { Module } from '@nestjs/common';
import { QueueModule } from '../queue/queue.module';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [QueueModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
