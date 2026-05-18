export interface DashboardStats {
  jobs: {
    total: number;
    active: number;
    paused: number;
  };
  executions: {
    total: number;
    success: number;
    failed: number;
    successRate: number;
  };
  recentExecutions: DashboardRecentExecution[];
  upcomingJobs: DashboardUpcomingJob[];
}

export interface DashboardRecentExecution {
  id: string;
  jobName: string;
  status: string;
  trigger: string;
  duration: number;
  startedAt: string;
}

export interface DashboardUpcomingJob {
  id: string;
  name: string;
  nextRunAt: string;
}
