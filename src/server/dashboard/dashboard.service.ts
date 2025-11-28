import { cronJobRepository } from '../cronjob/cronjob.repository';
import { executionRepository } from '../execution/execution.repository';
import { executionService } from '../execution/execution.service';

export class DashboardService {
  async getStats(userId: string, executionsPage = 1, executionsLimit = 10) {
    const executionsOffset = (executionsPage - 1) * executionsLimit;
    const [jobCounts, executionStats, recentExecutions] = await Promise.all([
      cronJobRepository.countByUserId(userId),
      executionRepository.getStatsByUserId(userId),
      executionService.getRecentByUser(userId, executionsLimit, executionsOffset),
    ]);

    let totalJobs = 0;
    let activeJobs = 0;
    let pausedJobs = 0;

    for (const group of jobCounts) {
      totalJobs += group._count._all;
      if (group.status === 'active') activeJobs = group._count._all;
      if (group.status === 'paused') pausedJobs = group._count._all;
    }

    return {
      jobs: {
        total: totalJobs,
        active: activeJobs,
        paused: pausedJobs,
      },
      executions: executionStats,
      recentExecutions,
    };
  }
}

export const dashboardService = new DashboardService();
