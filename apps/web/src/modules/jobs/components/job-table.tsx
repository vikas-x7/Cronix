'use client';

import { useRouter } from 'next/navigation';
import type { Job } from '../types/job.types';
import JobStatusBadge from './job-status-badge';
import JobTypeBadge from './job-type-badge';
import JobActions from './job-actions';
import { formatDate } from '@/shared/lib/utils';

interface JobTableProps {
  jobs: Job[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRun: (id: string) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

export default function JobTable({
  jobs,
  onPause,
  onResume,
  onRun,
  onDelete,
  isPending,
}: JobTableProps) {
  const router = useRouter();

  if (!jobs.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Name
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Type
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Schedule/Webhook
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Last Run
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              <td className="px-6 py-3 font-medium text-gray-900">
                {job.name}
              </td>
              <td className="px-6 py-3">
                <JobTypeBadge type={job.type} />
              </td>
              <td className="px-6 py-3">
                <JobStatusBadge status={job.status} />
              </td>
              <td className="px-6 py-3 text-gray-600">
                {job.type === 'CRON'
                  ? job.schedule || '—'
                  : job.webhookToken
                    ? 'Webhook'
                    : '—'}
              </td>
              <td className="px-6 py-3 text-gray-600">
                {job.lastRunAt ? formatDate(job.lastRunAt) : '—'}
              </td>
              <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                <JobActions
                  status={job.status}
                  onPause={() => onPause(job.id)}
                  onResume={() => onResume(job.id)}
                  onRun={() => onRun(job.id)}
                  onDelete={() => onDelete(job.id)}
                  isPending={isPending}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
