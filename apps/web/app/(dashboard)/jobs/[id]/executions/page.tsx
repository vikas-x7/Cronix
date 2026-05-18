'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useExecutions,
  useExecutionLogs,
  ExecutionTable,
  ExecutionStatusBadge,
  LogViewer,
} from '@/modules/executions';
import { useJob } from '@/modules/jobs';
import PageHeader from '@/shared/layout/page-header';
import { formatDuration } from '@/shared/lib/utils';
import { HiOutlineXMark } from 'react-icons/hi2';
import type { Execution } from '@/modules/executions';

export default function ExecutionsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: job } = useJob(id);
  const [statusFilter, setStatusFilter] = useState('');
  const {
    data: executions,
    isLoading,
    isError,
    refetch,
  } = useExecutions({
    jobId: id,
    status: statusFilter || undefined,
  });
  const [selected, setSelected] = useState<Execution | null>(null);
  const { data: logs } = useExecutionLogs(selected?.id ?? '');

  return (
    <div>
      <div className="mb-2">
        <button
          onClick={() => router.push(`/jobs/${id}`)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; {job?.name || 'Job'}
        </button>
      </div>

      <PageHeader title="Execution History">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
          <option value="RUNNING">Running</option>
          <option value="PENDING">Pending</option>
        </select>
      </PageHeader>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
          <p className="text-sm text-gray-500">Failed to load executions</p>
          <button
            onClick={() => refetch()}
            className="mt-3 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      ) : (
        <ExecutionTable executions={executions ?? []} onSelect={setSelected} />
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Execution Detail
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Status
                  </p>
                  <div className="mt-1">
                    <ExecutionStatusBadge status={selected.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Trigger
                  </p>
                  <p className="mt-1 text-sm capitalize text-gray-900">
                    {selected.trigger.toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Attempt
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {selected.attempt}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Duration
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDuration(selected.duration)}
                  </p>
                </div>
              </div>

              {selected.error && (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase text-red-500">
                    Error Message
                  </p>
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {selected.error}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                  Logs
                </p>
                <LogViewer logs={logs ?? []} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
