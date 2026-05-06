import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../../packages/database/generated/prisma/client.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      errorFormat: 'minimal',
      log:
        process.env.NODE_ENV === 'production'
          ? ['warn', 'error']
          : ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  get user() {
    return this.prisma.user;
  }

  get account() {
    return this.prisma.account;
  }

  get space() {
    return this.prisma.space;
  }

  get job() {
    return this.prisma.job;
  }

  get execution() {
    return this.prisma.execution;
  }

  get log() {
    return this.prisma.log;
  }

  get $transaction() {
    return this.prisma.$transaction.bind(this.prisma);
  }
}
