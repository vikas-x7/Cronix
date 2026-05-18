import type { ExecutionLog } from '../types/execution.types';

const LEVEL_COLORS: Record<string, string> = {
  INFO: 'text-gray-600',
  WARN: 'text-yellow-600',
  ERROR: 'text-red-600',
};

interface LogViewerProps {
  logs: ExecutionLog[];
}

export default function LogViewer({ logs }: LogViewerProps) {
  if (!logs.length) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-400">
        No logs available
      </div>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-4 font-mono text-xs">
      {logs.map((log) => (
        <div
          key={log.id}
          className={`py-0.5 ${LEVEL_COLORS[log.level] || 'text-gray-600'}`}
        >
          <span className="text-gray-400">[{log.timestamp}]</span>{' '}
          <span className="font-medium uppercase">{log.level}</span>{' '}
          <span>{log.message}</span>
        </div>
      ))}
    </div>
  );
}
