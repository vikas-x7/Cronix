import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, prisma } from 'database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  get user(): PrismaClient['user'] {
    return this.prisma.user;
  }

  get account(): PrismaClient['account'] {
    return this.prisma.account;
  }

  get space(): PrismaClient['space'] {
    return this.prisma.space;
  }

  get job(): PrismaClient['job'] {
    return this.prisma.job;
  }

  get execution(): PrismaClient['execution'] {
    return this.prisma.execution;
  }

  get log(): PrismaClient['log'] {
    return this.prisma.log;
  }

  get $transaction(): PrismaClient['$transaction'] {
    return this.prisma.$transaction.bind(this.prisma);
  }
}
