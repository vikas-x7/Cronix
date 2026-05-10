import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 2 * * *')
  async handleCleanup() {
    this.logger.log('Starting nightly cleanup...');
    await this.cleanOldLogs();
    await this.cleanOldExecutions();
    this.logger.log('Nightly cleanup completed.');
  }

  private async cleanOldLogs() {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const result = await this.prisma.log.deleteMany({
      where: {
        timestamp: { lt: cutoff },
      },
    });

    this.logger.log(`Deleted ${result.count} logs older than 7 days`);
  }

  private async cleanOldExecutions() {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await this.prisma.execution.deleteMany({
      where: {
        startedAt: { lt: cutoff },
      },
    });

    this.logger.log(`Deleted ${result.count} executions older than 30 days`);
  }
}
