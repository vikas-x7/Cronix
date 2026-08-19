import api from '@/lib/api/axios';
import { API_ROUTES } from '@/shared/config/constants';
import type { Execution, ExecutionLog } from '../types/execution.types';

interface PaginatedResponse<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function getExecutions(params?: {
  jobId?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  items: Execution[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}> {
  const response = await api.get<{ data: PaginatedResponse<Execution> }>(
    API_ROUTES.EXECUTIONS.BASE,
    { params },
  );
  return response.data.data;
}

export async function getExecution(id: string): Promise<Execution> {
  const response = await api.get<{ data: Execution }>(
    API_ROUTES.EXECUTIONS.DETAIL(id),
  );
  return response.data.data;
}

export async function getExecutionLogs(id: string): Promise<ExecutionLog[]> {
  const response = await api.get<{ data: { logs: ExecutionLog[] } }>(
    API_ROUTES.EXECUTIONS.LOGS(id),
  );
  return response.data.data.logs;
}

export async function storeExecution(data: {
  jobId: string;
  httpStatus: number;
  status: 'SUCCESS' | 'FAILED';
  duration: number;
  response?: unknown;
  error?: string;
}): Promise<Execution> {
  const response = await api.post<{ data: Execution }>(
    API_ROUTES.EXECUTIONS.STORE,
    data,
  );
  return response.data.data;
}
