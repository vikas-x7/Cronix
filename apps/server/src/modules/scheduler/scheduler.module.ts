import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'job-execution' })],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
