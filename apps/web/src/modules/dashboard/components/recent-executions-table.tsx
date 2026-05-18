import type { DashboardRecentExecution } from '../types/dashboard.types';
import { formatDate, formatDuration } from '@/shared/lib/utils';

interface RecentExecutionsTableProps {
  executions: DashboardRecentExecution[];
}

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  RUNNING: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
};

export default function RecentExecutionsTable({
  executions,
}: RecentExecutionsTableProps) {
  if (!executions.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">No recent executions</p>
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
              Status
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Trigger
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Duration
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {executions.map((exec) => (
            <tr key={exec.id} className="hover:bg-gray-50">
              <td className="px-6 py-3 font-medium text-gray-900">
                {exec.jobName}
              </td>
              <td className="px-6 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    STATUS_COLORS[exec.status] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {exec.status.toLowerCase()}
                </span>
              </td>
              <td className="px-6 py-3 capitalize text-gray-600">
                {exec.trigger.toLowerCase()}
              </td>
              <td className="px-6 py-3 text-gray-600">
                {formatDuration(exec.duration)}
              </td>
              <td className="px-6 py-3 text-gray-600">
                {formatDate(exec.startedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
