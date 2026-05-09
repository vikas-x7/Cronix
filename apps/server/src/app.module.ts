import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { JobsModule } from './jobs/jobs.module';
import { QueueModule } from './modules/queue/queue.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { CacheModule } from './modules/cache/cache.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.UPSTASH_REDIS_HOST,
        port: 6379,
        password: process.env.UPSTASH_REDIS_TOKEN,
        tls: {},
      },
    }),
    PrismaModule,
    AuthModule,
    WorkspacesModule,
    JobsModule,
    QueueModule,
    SchedulerModule,
    WebhooksModule,
    CacheModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
