import { Injectable } from '@nestjs/common';
import { CronExpressionParser } from 'cron-parser';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async getStats(userId: string) {
    const cacheKey = `stats:${userId}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const stats = await this.calculateStats(userId);

    await this.cache.set(cacheKey, JSON.stringify(stats), 60);

    return stats;
  }

  private async calculateStats(userId: string) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalJobs, activeJobs, pausedJobs, executions, cronJobs] =
      await Promise.all([
        this.prisma.job.count({
          where: {
            space: { userId },
            status: { in: ['ACTIVE', 'PAUSED'] },
          },
        }),
        this.prisma.job.count({
          where: {
            space: { userId },
            status: 'ACTIVE',
          },
        }),
        this.prisma.job.count({
          where: {
            space: { userId },
            status: 'PAUSED',
          },
        }),
        this.prisma.execution.findMany({
          where: {
            job: { space: { userId } },
            startedAt: { gte: twentyFourHoursAgo },
          },
          include: {
            job: { select: { name: true } },
          },
          orderBy: { startedAt: 'desc' },
          take: 10,
        }),
        this.prisma.job.findMany({
          where: {
            space: { userId },
            type: 'CRON',
            status: 'ACTIVE',
            schedule: { not: null },
          },
          select: {
            id: true,
            name: true,
            schedule: true,
          },
        }),
      ]);

    const totalExecutions = executions.length;
    const successCount = executions.filter(
      (e) => e.status === 'SUCCESS',
    ).length;
    const failedCount = executions.filter((e) => e.status === 'FAILED').length;
    const successRate =
      totalExecutions > 0
        ? Math.round((successCount / totalExecutions) * 10000) / 100
        : 0;

    const recentExecutions = executions.slice(0, 10).map((e) => ({
      id: e.id,
      jobName: e.job.name,
      status: e.status,
      trigger: e.trigger,
      duration: e.duration,
      startedAt: e.startedAt,
    }));

    const upcomingJobs = cronJobs
      .map((job) => {
        try {
          const interval = CronExpressionParser.parse(job.schedule!);
          const nextRunAt = interval.next().toDate().toISOString();
          return { id: job.id, name: job.name, nextRunAt };
        } catch {
          return null;
        }
      })
      .filter((j): j is NonNullable<typeof j> => j !== null)
      .sort(
        (a, b) =>
          new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime(),
      )
      .slice(0, 5);

    return {
      jobs: {
        total: totalJobs,
        active: activeJobs,
        paused: pausedJobs,
      },
      executions: {
        total: totalExecutions,
        success: successCount,
        failed: failedCount,
        successRate,
      },
      recentExecutions,
      upcomingJobs,
    };
  }
}
