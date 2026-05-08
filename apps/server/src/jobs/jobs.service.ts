import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { isValidCron } from 'cron-validator';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private workspacesService: WorkspacesService,
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

    return {
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
  }

  async findOne(id: string, userId: string): Promise<any> {
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

    return {
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

    return { id: updated.id, name: updated.name, status: updated.status };
  }

  async pause(id: string, userId: string) {
    await this.verifyOwnership(id, userId);
    const job = await this.prisma.job.update({
      where: { id },
      data: { status: 'PAUSED' },
    });
    return { id: job.id, name: job.name, status: job.status };
  }

  async resume(id: string, userId: string) {
    await this.verifyOwnership(id, userId);
    const job = await this.prisma.job.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
    return { id: job.id, name: job.name, status: job.status };
  }

  async delete(id: string, userId: string) {
    await this.verifyOwnership(id, userId);
    const job = await this.prisma.job.update({
      where: { id },
      data: { status: 'DELETED' },
    });
    return { id: job.id, name: job.name, status: job.status };
  }

  async runNow(id: string, userId: string) {
    await this.verifyOwnership(id, userId);
    return { message: 'Job queued' };
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
