import type { JobType } from '../types/job.types';

const STYLES: Record<JobType, string> = {
  CRON: 'bg-blue-100 text-blue-700',
  EVENT: 'bg-purple-100 text-purple-700',
};

export default function JobTypeBadge({ type }: { type: JobType }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${
        STYLES[type]
      }`}
    >
      {type}
    </span>
  );
}
