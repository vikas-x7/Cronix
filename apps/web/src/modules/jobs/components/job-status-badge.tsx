import type { JobStatus } from '../types/job.types';

const STYLES: Record<JobStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  FAILED: 'bg-red-100 text-red-700',
};

export default function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        STYLES[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status.toLowerCase()}
    </span>
  );
}
