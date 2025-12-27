import { useQuery, keepPreviousData } from '@tanstack/react-query';
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

export function useDashboardStats(page = 1, limit = 10, statusFilter = 'all', search = '') {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', page, limit, statusFilter, search],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set('page', page.toString());
      searchParams.set('limit', limit.toString());
      if (statusFilter !== 'all') searchParams.set('status', statusFilter);
      if (search) searchParams.set('search', search);

      const { data } = await api.get(`/dashboard/stats?${searchParams.toString()}`);
      return data.data;
    },
    placeholderData: keepPreviousData,
    refetchInterval: 30000, // auto-refresh every 30s
  });
}
