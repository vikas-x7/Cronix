import { executionRepository } from './execution.repository';

export class ExecutionService {
  async getByJobId(cronJobId: string, limit = 50, offset = 0) {
    return executionRepository.findByCronJobId(cronJobId, limit, offset);
  }

  async getRecentByUser(userId: string, limit = 10, offset = 0, statusFilter?: string, search?: string) {
    return executionRepository.findRecentByUserId(userId, limit, offset, statusFilter, search);
  }

  async getJobStats(cronJobId: string) {
    return executionRepository.countByCronJobId(cronJobId);
  }

  async getUserStats(userId: string) {
    return executionRepository.getStatsByUserId(userId);
  }
}

export const executionService = new ExecutionService();
