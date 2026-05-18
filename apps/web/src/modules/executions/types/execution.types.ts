export type ExecutionStatus = 'SUCCESS' | 'FAILED' | 'RUNNING' | 'PENDING';
export type ExecutionTrigger = 'SCHEDULED' | 'MANUAL' | 'WEBHOOK';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface Execution {
  id: string;
  jobId: string;
  status: ExecutionStatus;
  trigger: ExecutionTrigger;
  attempt: number;
  httpStatus?: number | null;
  error?: string | null;
  duration: number;
  startedAt: string;
  finishedAt?: string;
  job: { id: string; name: string };
}

export interface ExecutionLog {
  id: string;
  message: string;
  level: LogLevel;
  timestamp: string;
}
