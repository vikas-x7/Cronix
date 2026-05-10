import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JobsService } from '../jobs.service';

const mockPrisma = {
  job: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

const mockWorkspacesService = {
  checkOwnership: jest.fn(),
};

jest.mock('../../../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrisma),
}));

jest.mock('../../workspaces/workspaces.service', () => ({
  WorkspacesService: jest.fn().mockImplementation(() => mockWorkspacesService),
}));

import { PrismaService } from '../../../prisma/prisma.service';
import { WorkspacesService } from '../../workspaces/workspaces.service';

describe('JobsService', () => {
  let service: JobsService;
  let prisma: any;
  let workspacesService: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WorkspacesService, useValue: mockWorkspacesService },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prisma = module.get(PrismaService);
    workspacesService = module.get(WorkspacesService);
  });

  describe('create', () => {
    const validCronDto = {
      name: 'Daily Backup',
      type: 'CRON' as const,
      workspaceId: 'ws-1',
      endpoint: 'http://localhost:3000/backup',
      method: 'POST' as const,
      schedule: '0 0 * * *',
      retryCount: 3,
      retryDelay: 30,
      timeout: 30,
      failureEmail: false,
    };

    const validEventDto = {
      name: 'Webhook Handler',
      type: 'EVENT' as const,
      workspaceId: 'ws-1',
      endpoint: 'http://localhost:3000/webhook',
      method: 'GET' as const,
    };

    it('should create a CRON job', async () => {
      mockWorkspacesService.checkOwnership.mockResolvedValue({ id: 'ws-1' });
      mockPrisma.job.create.mockResolvedValue({
        id: 'job-1',
        name: 'Daily Backup',
        type: 'CRON',
        webhookToken: null,
      });

      const result = await service.create(validCronDto, 'user-1');

      expect(result).toEqual({
        id: 'job-1',
        name: 'Daily Backup',
        type: 'CRON',
        webhookToken: null,
      });
      expect(mockPrisma.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Daily Backup',
            type: 'CRON',
            schedule: '0 0 * * *',
          }),
        }),
      );
    });

    it('should throw BadRequestException for CRON without schedule', async () => {
      mockWorkspacesService.checkOwnership.mockResolvedValue({ id: 'ws-1' });

      await expect(
        service.create({ ...validCronDto, schedule: undefined }, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid cron expression', async () => {
      mockWorkspacesService.checkOwnership.mockResolvedValue({ id: 'ws-1' });

      await expect(
        service.create({ ...validCronDto, schedule: 'invalid-cron' }, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create an EVENT job with webhookToken', async () => {
      mockWorkspacesService.checkOwnership.mockResolvedValue({ id: 'ws-1' });
      mockPrisma.job.create.mockResolvedValue({
        id: 'job-2',
        name: 'Webhook Handler',
        type: 'EVENT',
        webhookToken: 'some-uuid',
      });

      const result = await service.create(validEventDto, 'user-1');

      expect(result.webhookToken).toBeTruthy();
      expect(result.type).toBe('EVENT');
    });

    it('should throw ForbiddenException if workspace not owned', async () => {
      mockWorkspacesService.checkOwnership.mockRejectedValue(
        new ForbiddenException("You don't have access to this workspace"),
      );

      await expect(service.create(validCronDto, 'user-2')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated jobs excluding DELETED by default', async () => {
      const jobs = [
        {
          id: 'job-1',
          name: 'Job 1',
          type: 'CRON',
          status: 'ACTIVE',
          endpoint: 'http://test.com',
          method: 'GET',
          schedule: '0 0 * * *',
          retryCount: 3,
          retryDelay: 30,
          timeout: 30,
          failureEmail: false,
          space: { id: 'ws-1', name: 'My Space' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.job.findMany.mockResolvedValue(jobs);
      mockPrisma.job.count.mockResolvedValue(1);

      const result = await service.findAll('user-1');

      expect(result.items).toHaveLength(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockPrisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: { not: 'DELETED' },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a job if owned by user', async () => {
      mockPrisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        name: 'Test Job',
        type: 'CRON',
        status: 'ACTIVE',
        endpoint: 'http://test.com',
        method: 'GET',
        headers: null,
        body: null,
        schedule: '0 0 * * *',
        webhookToken: null,
        retryCount: 3,
        retryDelay: 30,
        timeout: 30,
        failureEmail: false,
        space: { id: 'ws-1', name: 'Workspace', userId: 'user-1' },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.findOne('job-1', 'user-1');

      expect(result.id).toBe('job-1');
      expect(result.name).toBe('Test Job');
    });

    it('should throw NotFoundException if job does not exist', async () => {
      mockPrisma.job.findUnique.mockResolvedValue(null);

      await expect(service.findOne('job-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if job belongs to another user', async () => {
      mockPrisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        name: 'Test',
        type: 'CRON',
        status: 'ACTIVE',
        endpoint: 'http://test.com',
        method: 'GET',
        headers: null,
        body: null,
        schedule: null,
        webhookToken: null,
        retryCount: 3,
        retryDelay: 30,
        timeout: 30,
        failureEmail: false,
        space: { id: 'ws-1', name: 'Workspace', userId: 'user-2' },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.findOne('job-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update a job if owned by user', async () => {
      mockPrisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        space: { userId: 'user-1' },
      });
      mockPrisma.job.update.mockResolvedValue({
        id: 'job-1',
        name: 'Updated Job',
        status: 'ACTIVE',
      });

      const result = await service.update(
        'job-1',
        { name: 'Updated Job' },
        'user-1',
      );

      expect(result.name).toBe('Updated Job');
    });

    it('should throw BadRequestException for invalid cron on update', async () => {
      mockPrisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        space: { userId: 'user-1' },
      });

      await expect(
        service.update('job-1', { schedule: 'bad-cron' }, 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('pause', () => {
    it('should set job status to PAUSED', async () => {
      mockPrisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        space: { userId: 'user-1' },
      });
      mockPrisma.job.update.mockResolvedValue({
        id: 'job-1',
        name: 'Test Job',
        status: 'PAUSED',
      });

      const result = await service.pause('job-1', 'user-1');

      expect(result.status).toBe('PAUSED');
      expect(mockPrisma.job.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'PAUSED' },
        }),
      );
    });
  });

  describe('resume', () => {
    it('should set job status to ACTIVE', async () => {
      mockPrisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        space: { userId: 'user-1' },
      });
      mockPrisma.job.update.mockResolvedValue({
        id: 'job-1',
        name: 'Test Job',
        status: 'ACTIVE',
      });

      const result = await service.resume('job-1', 'user-1');

      expect(result.status).toBe('ACTIVE');
      expect(mockPrisma.job.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'ACTIVE' },
        }),
      );
    });
  });

  describe('delete', () => {
    it('should soft delete a job (status DELETED)', async () => {
      mockPrisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        space: { userId: 'user-1' },
      });
      mockPrisma.job.update.mockResolvedValue({
        id: 'job-1',
        name: 'Test Job',
        status: 'DELETED',
      });

      const result = await service.delete('job-1', 'user-1');

      expect(result.status).toBe('DELETED');
      expect(mockPrisma.job.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'DELETED' },
        }),
      );
    });
  });

  describe('runNow', () => {
    it('should return placeholder message', async () => {
      mockPrisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        space: { userId: 'user-1' },
      });

      const result = await service.runNow('job-1', 'user-1');

      expect(result).toEqual({ message: 'Job queued' });
    });

    it('should throw ForbiddenException if not owner', async () => {
      mockPrisma.job.findUnique.mockResolvedValue({
        id: 'job-1',
        space: { userId: 'user-2' },
      });

      await expect(service.runNow('job-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
