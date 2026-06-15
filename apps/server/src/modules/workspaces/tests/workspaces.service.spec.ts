import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { WorkspacesService } from '../workspaces.service';

const mockPrisma = {
  space: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  delByPattern: jest.fn(),
};

jest.mock('../../../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrisma),
}));

import { PrismaService } from '../../../prisma/prisma.service';
import { CacheService } from '../../cache/cache.service';

describe('WorkspacesService', () => {
  let service: WorkspacesService;
  let prisma: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspacesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<WorkspacesService>(WorkspacesService);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create a workspace', async () => {
      mockPrisma.space.findFirst.mockResolvedValue(null);
      mockPrisma.space.create.mockResolvedValue({
        id: 'ws-1',
        name: 'Production',
      });

      const result = await service.create({ name: 'Production' }, 'user-1');

      expect(result).toEqual({ id: 'ws-1', name: 'Production' });
      expect(mockPrisma.space.findFirst).toHaveBeenCalledWith({
        where: { name: 'Production', userId: 'user-1' },
      });
      expect(mockPrisma.space.create).toHaveBeenCalledWith({
        data: { name: 'Production', userId: 'user-1' },
      });
    });

    it('should throw ConflictException if name already exists for user', async () => {
      mockPrisma.space.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create({ name: 'Production' }, 'user-1'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated workspaces with jobs count', async () => {
      const spaces = [
        {
          id: 'ws-1',
          name: 'Prod',
          _count: { jobs: 5 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'ws-2',
          name: 'Dev',
          _count: { jobs: 2 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.space.findMany.mockResolvedValue(spaces);
      mockPrisma.space.count.mockResolvedValue(2);

      const result = await service.findAll('user-1', 1, 10);

      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toEqual({
        id: 'ws-1',
        name: 'Prod',
        jobsCount: 5,
        createdAt: spaces[0].createdAt,
        updatedAt: spaces[0].updatedAt,
      });
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should only return workspaces for the given user', async () => {
      mockPrisma.space.findMany.mockResolvedValue([]);
      mockPrisma.space.count.mockResolvedValue(0);

      await service.findAll('user-1', 1, 10);

      expect(mockPrisma.space.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a workspace if owned by user', async () => {
      const workspace = {
        id: 'ws-1',
        name: 'Prod',
        userId: 'user-1',
        _count: { jobs: 3 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.space.findUnique.mockResolvedValue(workspace);

      const result = await service.findOne('ws-1', 'user-1');

      expect(result.id).toBe('ws-1');
      expect(result.jobsCount).toBe(3);
    });

    it('should throw NotFoundException if workspace does not exist', async () => {
      mockPrisma.space.findUnique.mockResolvedValue(null);

      await expect(service.findOne('ws-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if workspace belongs to another user', async () => {
      mockPrisma.space.findUnique.mockResolvedValue({
        id: 'ws-1',
        name: 'Prod',
        userId: 'user-2',
        _count: { jobs: 0 },
      });

      await expect(service.findOne('ws-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update a workspace name', async () => {
      mockPrisma.space.findUnique.mockResolvedValue({
        id: 'ws-1',
        name: 'Prod',
        userId: 'user-1',
        _count: { jobs: 0 },
      });
      mockPrisma.space.findFirst.mockResolvedValue(null);
      mockPrisma.space.update.mockResolvedValue({
        id: 'ws-1',
        name: 'Production',
      });

      const result = await service.update(
        'ws-1',
        { name: 'Production' },
        'user-1',
      );

      expect(result).toEqual({ id: 'ws-1', name: 'Production' });
    });

    it('should throw ConflictException if new name already exists', async () => {
      mockPrisma.space.findUnique.mockResolvedValue({
        id: 'ws-1',
        name: 'Prod',
        userId: 'user-1',
        _count: { jobs: 0 },
      });
      mockPrisma.space.findFirst.mockResolvedValue({
        id: 'ws-2',
        name: 'Production',
      });

      await expect(
        service.update('ws-1', { name: 'Production' }, 'user-1'),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ForbiddenException if not owner', async () => {
      mockPrisma.space.findUnique.mockResolvedValue({
        id: 'ws-1',
        userId: 'user-2',
        _count: { jobs: 0 },
      });

      await expect(
        service.update('ws-1', { name: 'New' }, 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete a workspace if owned by user', async () => {
      mockPrisma.space.findUnique.mockResolvedValue({
        id: 'ws-1',
        name: 'Prod',
        userId: 'user-1',
        _count: { jobs: 0 },
      });
      mockPrisma.space.delete.mockResolvedValue({ id: 'ws-1' });

      const result = await service.delete('ws-1', 'user-1');

      expect(result).toEqual({ id: 'ws-1' });
      expect(mockPrisma.space.delete).toHaveBeenCalledWith({
        where: { id: 'ws-1' },
      });
    });

    it('should throw ForbiddenException if not owner', async () => {
      mockPrisma.space.findUnique.mockResolvedValue({
        id: 'ws-1',
        userId: 'user-2',
        _count: { jobs: 0 },
      });

      await expect(service.delete('ws-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if workspace does not exist', async () => {
      mockPrisma.space.findUnique.mockResolvedValue(null);

      await expect(service.delete('ws-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
