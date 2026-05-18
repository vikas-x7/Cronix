'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getExecutions,
  getExecution,
  getExecutionLogs,
} from '../api/executions.api';

export function useExecutions(params?: { jobId?: string; status?: string }) {
  return useQuery({
    queryKey: ['executions', params],
    queryFn: () => getExecutions(params),
  });
}

export function useExecution(id: string) {
  return useQuery({
    queryKey: ['executions', 'detail', id],
    queryFn: () => getExecution(id),
    enabled: !!id,
  });
}

export function useExecutionLogs(id: string) {
  return useQuery({
    queryKey: ['executions', 'logs', id],
    queryFn: () => getExecutionLogs(id),
    enabled: !!id,
  });
}
