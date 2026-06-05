import api from '@/shared/lib/axios';
import { API_ROUTES } from '@/shared/config/constants';
import type { Job, CreateJobInput } from '../types/job.types';

interface PaginatedResponse<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function getJobs(params?: {
  workspaceId?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<{
  items: Job[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}> {
  const response = await api.get<{ data: PaginatedResponse<Job> }>(
    API_ROUTES.JOBS.BASE,
    { params },
  );
  return response.data.data;
}

export async function getJob(id: string): Promise<Job> {
  const response = await api.get<{ data: Job }>(API_ROUTES.JOBS.DETAIL(id));
  return response.data.data;
}

export async function createJob(data: CreateJobInput): Promise<Job> {
  const response = await api.post<{ data: Job }>(API_ROUTES.JOBS.BASE, data);
  return response.data.data;
}

export async function updateJob(
  id: string,
  data: Partial<CreateJobInput>,
): Promise<Job> {
  const response = await api.patch<{ data: Job }>(
    API_ROUTES.JOBS.DETAIL(id),
    data,
  );
  return response.data.data;
}

export async function deleteJob(id: string): Promise<void> {
  await api.delete(API_ROUTES.JOBS.DETAIL(id));
}

export async function pauseJob(id: string): Promise<Job> {
  const response = await api.post<{ data: Job }>(API_ROUTES.JOBS.PAUSE(id));
  return response.data.data;
}

export async function resumeJob(id: string): Promise<Job> {
  const response = await api.post<{ data: Job }>(API_ROUTES.JOBS.RESUME(id));
  return response.data.data;
}

export async function runJob(id: string): Promise<void> {
  await api.post(API_ROUTES.JOBS.RUN(id));
}
