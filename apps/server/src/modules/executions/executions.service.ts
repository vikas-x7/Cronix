import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExecutionsService {
  constructor(private prisma: PrismaService) {}

  async store(
    userId: string,
    data: {
      jobId: string;
      httpStatus: number;
      status: 'SUCCESS' | 'FAILED';
      duration: number;
      response?: unknown;
      error?: string;
    },
  ) {
    const job = await this.prisma.job.findUnique({
      where: { id: data.jobId },
      include: { space: { select: { userId: true } } },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.space.userId !== userId) {
      throw new ForbiddenException("You don't have access to this job");
    }

    const execution = await this.prisma.execution.create({
      data: {
        jobId: data.jobId,
        status: data.status,
        trigger: 'MANUAL',
        attempt: 1,
        httpStatus: data.httpStatus,
        response: data.response ?? undefined,
        error: data.error ?? undefined,
        duration: data.duration,
        finishedAt: new Date(),
      },
    });

    await this.prisma.log.create({
      data: {
        executionId: execution.id,
        message:
          data.status === 'SUCCESS'
            ? 'Manual execution completed'
            : `Manual execution failed: ${data.error || 'HTTP ' + data.httpStatus}`,
        level: data.status === 'SUCCESS' ? 'INFO' : 'ERROR',
      },
    });

    return {
      id: execution.id,
      status: execution.status,
      trigger: execution.trigger,
      attempt: execution.attempt,
      httpStatus: execution.httpStatus,
      error: execution.error,
      duration: execution.duration,
      startedAt: execution.startedAt,
      finishedAt: execution.finishedAt,
      job: { id: job.id, name: job.name },
    };
  }

  async findAll(
    userId: string,
    jobId?: string,
    status?: string,
    page = 1,
    limit = 10,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      job: {
        space: { userId },
      },
    };

    if (jobId) {
      where.jobId = jobId;
    }

    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.execution.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startedAt: 'desc' },
        include: {
          job: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.execution.count({ where }),
    ]);

    return {
      items: items.map((e) => ({
        id: e.id,
        status: e.status,
        trigger: e.trigger,
        attempt: e.attempt,
        httpStatus: e.httpStatus,
        error: e.error,
        duration: e.duration,
        startedAt: e.startedAt,
        finishedAt: e.finishedAt,
        job: e.job,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<any> {
    const execution = await this.prisma.execution.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            space: { select: { id: true, name: true, userId: true } },
          },
        },
      },
    });

    if (!execution) {
      throw new NotFoundException('Execution not found');
    }

    if (execution.job.space.userId !== userId) {
      throw new ForbiddenException("You don't have access to this execution");
    }

    return {
      id: execution.id,
      status: execution.status,
      trigger: execution.trigger,
      attempt: execution.attempt,
      httpStatus: execution.httpStatus,
      error: execution.error,
      duration: execution.duration,
      startedAt: execution.startedAt,
      finishedAt: execution.finishedAt,
      job: {
        id: execution.job.id,
        name: execution.job.name,
        method: execution.job.method,
        endpoint: execution.job.endpoint,
        body: execution.job.body,
        headers: execution.job.headers,
        workspace: {
          id: execution.job.space.id,
          name: execution.job.space.name,
        },
      },
    };
  }

  async findLogs(executionId: string, userId: string): Promise<any> {
    const execution = await this.prisma.execution.findUnique({
      where: { id: executionId },
      include: {
        job: {
          include: {
            space: { select: { userId: true } },
          },
        },
      },
    });

    if (!execution) {
      throw new NotFoundException('Execution not found');
    }

    if (execution.job.space.userId !== userId) {
      throw new ForbiddenException("You don't have access to this execution");
    }

    const logs = await this.prisma.log.findMany({
      where: { executionId },
      orderBy: { timestamp: 'asc' },
      select: {
        id: true,
        message: true,
        level: true,
        timestamp: true,
      },
    });

    return { logs };
  }
}
