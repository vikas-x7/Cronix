export type JobType = 'CRON' | 'EVENT';
export type JobStatus = 'ACTIVE' | 'PAUSED' | 'FAILED';

export interface Job {
  id: string;
  name: string;
  type: JobType;
  status: JobStatus;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  schedule: string | null;
  webhookToken: string | null;
  webhookUrl?: string;
  retryCount: number;
  retryDelay: number;
  timeout: number;
  failureEmail: boolean;
  workspace: { id: string; name: string };
  lastRunAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobInput {
  name: string;
  type: JobType;
  workspaceId: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body?: Record<string, unknown>;
  schedule?: string;
  retryCount: number;
  retryDelay: number;
  timeout: number;
  failureEmail: boolean;
}

export interface JobFilters {
  workspaceId?: string;
  status?: JobStatus;
  type?: JobType;
}
