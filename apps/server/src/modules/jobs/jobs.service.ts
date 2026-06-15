import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { isValidCron } from 'cron-validator';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { JobProducer } from '../queue/producers/job.producer';
import { SchedulerService } from '../scheduler/scheduler.service';
import { CacheService } from '../cache/cache.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private workspacesService: WorkspacesService,
    private jobProducer: JobProducer,
    private schedulerService: SchedulerService,
    private cache: CacheService,
  ) {}

  async create(dto: CreateJobDto, userId: string) {
    await this.workspacesService.checkOwnership(dto.workspaceId, userId);

    if (dto.type === 'CRON') {
      if (!dto.schedule) {
        throw new BadRequestException(
          'Schedule is required for CRON type jobs',
        );
      }
      if (!isValidCron(dto.schedule)) {
        throw new BadRequestException('Invalid cron expression');
      }
    }

    let webhookToken: string | undefined;
    if (dto.type === 'EVENT') {
      webhookToken = randomUUID();
    }

    const job = await this.prisma.job.create({
      data: {
        name: dto.name,
        type: dto.type,
        endpoint: dto.endpoint,
        method: dto.method,
        headers: dto.headers ?? undefined,
        body: dto.body ?? undefined,
        schedule: dto.schedule,
        webhookToken,
        retryCount: dto.retryCount ?? 3,
        retryDelay: dto.retryDelay ?? 30,
        timeout: dto.timeout ?? 30,
        failureEmail: dto.failureEmail ?? false,
        spaceId: dto.workspaceId,
      },
    });

    if (dto.type === 'CRON' && job.schedule) {
      await this.schedulerService.addRepeatableJob(job.id, job.schedule);
    }

    await this.cache.del(`stats:${userId}`);
    await this.cache.delByPattern(`jobs:list:${userId}:*`);

    return {
      id: job.id,
      name: job.name,
      type: job.type,
      webhookToken: job.webhookToken,
    };
  }

  async findAll(
    userId: string,
    workspaceId?: string,
    status?: string,
    page = 1,
    limit = 10,
  ): Promise<any> {
    const cacheKey = `jobs:list:${userId}:${workspaceId || ''}:${status || ''}:${page}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const skip = (page - 1) * limit;

    const where: any = {
      space: { userId },
    };

    if (workspaceId) {
      where.spaceId = workspaceId;
    }

    if (status) {
      where.status = status;
    }

    where.status = where.status ?? { not: 'DELETED' };

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          space: { select: { id: true, name: true } },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    const result = {
      items: items.map((j) => ({
        id: j.id,
        name: j.name,
        type: j.type,
        status: j.status,
        endpoint: j.endpoint,
        method: j.method,
        schedule: j.schedule,
        retryCount: j.retryCount,
        retryDelay: j.retryDelay,
        timeout: j.timeout,
        failureEmail: j.failureEmail,
        workspace: j.space,
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.cache.set(cacheKey, JSON.stringify(result), 30);

    return result;
  }

  async findOne(id: string, userId: string): Promise<any> {
    const cacheKey = `job:${id}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed._userId === userId) {
        const { _userId, ...data } = parsed;
        return data;
      }
    }

    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        space: { select: { id: true, name: true, userId: true } },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.space.userId !== userId) {
      throw new ForbiddenException("You don't have access to this job");
    }

    const result = {
      id: job.id,
      name: job.name,
      type: job.type,
      status: job.status,
      endpoint: job.endpoint,
      method: job.method,
      headers: job.headers,
      body: job.body,
      schedule: job.schedule,
      webhookToken: job.webhookToken,
      retryCount: job.retryCount,
      retryDelay: job.retryDelay,
      timeout: job.timeout,
      failureEmail: job.failureEmail,
      workspace: { id: job.space.id, name: job.space.name },
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };

    await this.cache.set(
      cacheKey,
      JSON.stringify({ ...result, _userId: userId }),
      60,
    );

    return result;
  }

  async update(id: string, dto: UpdateJobDto, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { space: { select: { userId: true } } },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.space.userId !== userId) {
      throw new ForbiddenException("You don't have access to this job");
    }

    if (dto.schedule && !isValidCron(dto.schedule)) {
      throw new BadRequestException('Invalid cron expression');
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: dto,
    });

    if (
      updated.type === 'CRON' &&
      updated.status === 'ACTIVE' &&
      dto.schedule
    ) {
      await this.schedulerService.removeRepeatableJob(updated.id);
      await this.schedulerService.addRepeatableJob(updated.id, dto.schedule);
    }

    await this.cache.del(`stats:${userId}`);
    await this.cache.del(`job:${id}`);
    await this.cache.delByPattern(`jobs:list:${userId}:*`);

    return { id: updated.id, name: updated.name, status: updated.status };
  }

  async pause(id: string, userId: string) {
    const jobData = await this.verifyOwnership(id, userId);
    const job = await this.prisma.job.update({
      where: { id },
      data: { status: 'PAUSED' },
    });
    if (jobData.type === 'CRON') {
      await this.schedulerService.removeRepeatableJob(id);
    }
    await this.cache.del(`stats:${userId}`);
    await this.cache.del(`job:${id}`);
    await this.cache.delByPattern(`jobs:list:${userId}:*`);
    return { id: job.id, name: job.name, status: job.status };
  }

  async resume(id: string, userId: string) {
    const jobData = await this.verifyOwnership(id, userId);
    const job = await this.prisma.job.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
    if (jobData.type === 'CRON' && jobData.schedule) {
      await this.schedulerService.addRepeatableJob(id, jobData.schedule);
    }
    await this.cache.del(`stats:${userId}`);
    await this.cache.del(`job:${id}`);
    await this.cache.delByPattern(`jobs:list:${userId}:*`);
    return { id: job.id, name: job.name, status: job.status };
  }

  async delete(id: string, userId: string) {
    const jobData = await this.verifyOwnership(id, userId);
    const job = await this.prisma.job.update({
      where: { id },
      data: { status: 'DELETED' },
    });
    if (jobData.type === 'CRON') {
      await this.schedulerService.removeRepeatableJob(id);
    }
    await this.cache.del(`stats:${userId}`);
    await this.cache.del(`job:${id}`);
    await this.cache.delByPattern(`jobs:list:${userId}:*`);
    return { id: job.id, name: job.name, status: job.status };
  }

  async runNow(id: string, userId: string) {
    await this.verifyOwnership(id, userId);
    await this.jobProducer.addJob(id, 'MANUAL');
    return { __message: 'Job queued successfully' };
  }

  private async verifyOwnership(jobId: string, userId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { space: { select: { userId: true } } },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.space.userId !== userId) {
      throw new ForbiddenException("You don't have access to this job");
    }

    return job;
  }
}
