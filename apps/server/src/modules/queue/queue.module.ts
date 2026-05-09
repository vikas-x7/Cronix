import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JobProducer } from './producers/job.producer';
import { JobProcessor } from './processors/job.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'job-execution' })],
  providers: [JobProducer, JobProcessor],
  exports: [JobProducer],
})
export class QueueModule {}
