import type { DashboardUpcomingJob } from '../types/dashboard.types';
import { formatDate } from '@/shared/lib/utils';

interface UpcomingJobsListProps {
  jobs: DashboardUpcomingJob[];
}

export default function UpcomingJobsList({ jobs }: UpcomingJobsListProps) {
  if (!jobs.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">No upcoming jobs</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Job Name
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Next Run At
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50">
              <td className="px-6 py-3 font-medium text-gray-900">
                {job.name}
              </td>
              <td className="px-6 py-3 text-gray-600">
                {formatDate(job.nextRunAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
