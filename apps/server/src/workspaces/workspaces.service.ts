import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkspaceDto, userId: string) {
    const existing = await this.prisma.space.findFirst({
      where: { name: dto.name, userId },
    });

    if (existing) {
      throw new ConflictException(
        `Workspace with name "${dto.name}" already exists`,
      );
    }

    const workspace = await this.prisma.space.create({
      data: { name: dto.name, userId },
    });

    return { id: workspace.id, name: workspace.name };
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.space.findMany({
        where: { userId },
        skip,
        take: limit,
        include: { _count: { select: { jobs: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.space.count({ where: { userId } }),
    ]);

    return {
      items: items.map((w) => ({
        id: w.id,
        name: w.name,
        jobsCount: w._count.jobs,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const workspace = await this.checkOwnership(id, userId);

    return {
      id: workspace.id,
      name: workspace.name,
      jobsCount: workspace._count.jobs,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }

  async update(id: string, dto: UpdateWorkspaceDto, userId: string) {
    await this.checkOwnership(id, userId);

    if (dto.name) {
      const duplicate = await this.prisma.space.findFirst({
        where: { name: dto.name, userId, id: { not: id } },
      });

      if (duplicate) {
        throw new ConflictException(
          `Workspace with name "${dto.name}" already exists`,
        );
      }
    }

    const workspace = await this.prisma.space.update({
      where: { id },
      data: dto,
    });

    return { id: workspace.id, name: workspace.name };
  }

  async delete(id: string, userId: string) {
    await this.checkOwnership(id, userId);
    await this.prisma.space.delete({ where: { id } });
    return { id };
  }

  private async checkOwnership(workspaceId: string, userId: string) {
    const workspace = await this.prisma.space.findUnique({
      where: { id: workspaceId },
      include: { _count: { select: { jobs: true } } },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.userId !== userId) {
      throw new ForbiddenException("You don't have access to this workspace");
    }

    return workspace;
  }
}
