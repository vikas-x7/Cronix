import type { ExecutionStatus } from '../types/execution.types';

const STYLES: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  RUNNING: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
};

export default function ExecutionStatusBadge({ status }: { status: string }) {
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
