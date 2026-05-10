import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SchedulerService } from './scheduler.service';
import { CleanupService } from './cleanup.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'job-execution' })],
  providers: [SchedulerService, CleanupService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
