import { prisma } from '@/lib/prisma';
import type { Prisma } from '../../../generated/prisma/client';

export class ExecutionRepository {
  async findByCronJobId(cronJobId: string, limit = 50, offset = 0) {
    return prisma.execution.findMany({
      where: { cronJobId },
      orderBy: { executedAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findRecentByUserId(userId: string, limit = 10, offset = 0) {
    return prisma.execution.findMany({
      where: {
        cronJob: { userId },
      },
      include: {
        cronJob: {
          select: { id: true, title: true, url: true },
        },
      },
      orderBy: { executedAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async create(data: Prisma.ExecutionCreateInput) {
    return prisma.execution.create({ data });
  }

  async countByCronJobId(cronJobId: string) {
    const [total, succeeded, failed] = await Promise.all([
      prisma.execution.count({ where: { cronJobId } }),
      prisma.execution.count({ where: { cronJobId, success: true } }),
      prisma.execution.count({ where: { cronJobId, success: false } }),
    ]);
    return { total, succeeded, failed };
  }

  async getStatsByUserId(userId: string) {
    const [totalExecutions, successfulExecutions, failedExecutions] = await Promise.all([
      prisma.execution.count({ where: { cronJob: { userId } } }),
      prisma.execution.count({ where: { cronJob: { userId }, success: true } }),
      prisma.execution.count({ where: { cronJob: { userId }, success: false } }),
    ]);

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate: totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0,
    };
  }
}

export const executionRepository = new ExecutionRepository();
