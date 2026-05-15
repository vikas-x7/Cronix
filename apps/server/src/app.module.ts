import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { QueueModule } from './modules/queue/queue.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { CacheModule } from './modules/cache/cache.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ExecutionsModule } from './modules/executions/executions.module';

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
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: process.env.UPSTASH_REDIS_HOST,
          port: 6379,
          password: process.env.UPSTASH_REDIS_TOKEN,
          tls: {},
        }),
      ),
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    WorkspacesModule,
    JobsModule,
    QueueModule,
    SchedulerModule,
    WebhooksModule,
    CacheModule,
    DashboardModule,
    NotificationsModule,
    ExecutionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
