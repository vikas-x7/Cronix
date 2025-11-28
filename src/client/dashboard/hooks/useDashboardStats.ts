import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Execution } from './useExecutions';

export interface DashboardStats {
  jobs: {
    total: number;
    active: number;
    paused: number;
  };
  executions: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    successRate: number;
  };
  recentExecutions: Execution[];
}

export function useDashboardStats(page = 1, limit = 10) {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', page, limit],
    queryFn: async () => {
      const { data } = await api.get(`/dashboard/stats?page=${page}&limit=${limit}`);
      return data.data;
    },
    refetchInterval: 30000, // auto-refresh every 30s
  });
}
