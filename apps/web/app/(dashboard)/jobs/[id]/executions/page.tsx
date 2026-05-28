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
    <div className="w-full h-screen overflow-y-auto bg-[#0D0D0D] pr-2">
      <div className="py-3 bg-[#0D0D0D] flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push(`/jobs/${id}`)}
            className="text-[12px] text-neutral-500 hover:text-white transition mb-1"
          >
            &larr; {job?.name || 'Job'}
          </button>
          <h1 className="text-[20px] -tracking-[1px] text-white">
            Execution History
          </h1>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-neutral-700 bg-neutral-900 px-3 py-2 text-[12px] text-white focus:border-neutral-500 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
          <option value="RUNNING">Running</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>
      <div className="bg-[#1F1F1F] rounded-[10px] h-[92vh] overflow-y-auto">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-12">
            <p className="text-[13px] text-neutral-500">
              Failed to load executions
            </p>
            <button
              onClick={() => refetch()}
              className="mt-3 cursor-pointer border border-neutral-700 px-4 py-2 text-[12px] font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="p-6">
            <ExecutionTable
              executions={executions ?? []}
              onSelect={setSelected}
            />
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-neutral-900 border border-neutral-700 shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-neutral-700 bg-neutral-900 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Execution Detail
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="cursor-pointer text-neutral-400 hover:text-white transition"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Status
                  </p>
                  <div className="mt-1">
                    <ExecutionStatusBadge status={selected.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Trigger
                  </p>
                  <p className="mt-1 text-sm capitalize text-white">
                    {selected.trigger.toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Attempt
                  </p>
                  <p className="mt-1 text-sm text-white">{selected.attempt}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-neutral-500">
                    Duration
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {formatDuration(selected.duration)}
                  </p>
                </div>
              </div>

              {selected.error && (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase text-red-500">
                    Error Message
                  </p>
                  <div className="bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                    {selected.error}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-1 text-xs font-medium uppercase text-neutral-500">
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
