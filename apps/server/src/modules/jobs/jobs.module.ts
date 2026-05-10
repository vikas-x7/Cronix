import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { QueueModule } from '../queue/queue.module';
import { SchedulerModule } from '../scheduler/scheduler.module';

@Module({
  imports: [WorkspacesModule, QueueModule, SchedulerModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
