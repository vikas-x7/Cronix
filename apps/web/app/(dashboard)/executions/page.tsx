'use client';

import { useState, useEffect } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiLayout,
  FiPlusCircle,
  FiFilter,
  FiRefreshCw,
} from 'react-icons/fi';
import Link from 'next/link';
import { useDashboard } from '@/modules/dashboard';
import StatusBadge from '@/shared/components/status-badge';
import PageLoader from '@/shared/components/page-loader';

export default function ExecutionsList() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'success' | 'failed'
  >('all');
  const limit = 20;
  const { data: stats, isLoading, isFetching, error, refetch } = useDashboard();

  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery]);

  if (isLoading && !stats) return <PageLoader />;

  if (error)
    return (
      <div className="w-full h-screen bg-neutral-950">
        <div className="border-b px-4 py-3 bg-neutral-900/50 border-neutral-800">
          <h1 className="text-[20px] -tracking-[1px] text-white">Executions</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-[13px] text-neutral-500">
            Failed to load executions
          </p>
        </div>
      </div>
    );

  const recentExecs = stats?.recentExecutions ?? [];
  const filteredExecs = recentExecs.filter((exec) => {
    if (statusFilter !== 'all') {
      const s = exec.status === 'SUCCESS' ? 'success' : 'failed';
      if (s !== statusFilter) return false;
    }
    if (
      searchQuery &&
      !exec.jobName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-neutral-950">
      <div className="border-b px-4 py-3 bg-neutral-900/50 border-neutral-800 flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px] text-white">Executions</h1>
      </div>
      <div className="p-2 border-b border-neutral-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-[13px] font-medium text-white">
              <FiLayout size={14} />
              Overview
            </button>
            <div className="w-px h-4 bg-neutral-700 mx-1" />
            <Link href="/jobs/new">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 text-[13px] font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                <FiPlusCircle size={14} />
                ADD
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 text-[13px] font-medium text-neutral-400 hover:bg-neutral-800 transition-colors appearance-none bg-transparent pr-8 cursor-pointer outline-none min-w-[120px]"
              >
                <option value="all" className="bg-neutral-900">
                  All Status
                </option>
                <option value="success" className="bg-neutral-900">
                  Successful
                </option>
                <option value="failed" className="bg-neutral-900">
                  Failed
                </option>
              </select>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 text-[13px] font-medium text-neutral-400 hover:bg-neutral-800 disabled:opacity-50 transition-colors"
              >
                <FiRefreshCw
                  className={isFetching ? 'animate-spin' : ''}
                  size={14}
                />
                Refresh
              </button>
              <span className="text-[12px] text-neutral-400 font-medium border border-neutral-700 px-3 py-1.5">
                Total executions {stats?.executions?.total ?? 0}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 border border-neutral-700 bg-neutral-900 px-3 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search executions..."
              className="text-[12px] text-white outline-none w-64 transition placeholder:text-neutral-500"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        {!filteredExecs.length ? (
          <div className="border border-dashed border-neutral-700 flex-1 flex flex-col items-center justify-center">
            <FiPause className="text-neutral-600 mb-2" size={24} />
            <p className="text-[16px] tracking-normal text-white">
              No executions yet
            </p>
            <p className="text-[12px] text-neutral-500 mt-1">
              Create a cron job and trigger it to see results here
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-900/50 border-b border-neutral-800 text-[12px] font-medium text-neutral-400 sticky top-0 z-10">
              <div className="col-span-3">Job</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Trigger</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-2">Time</div>
            </div>
            <div className="flex-1 overflow-y-auto slim-scrollbar relative">
              {isFetching && (
                <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {filteredExecs.map((exec) => (
                <div
                  key={exec.id}
                  className="grid grid-cols-12 items-center px-4 py-2.5 border-b border-neutral-800/50 last:border-0 hover:bg-neutral-900/30 transition"
                >
                  <div className="col-span-3">
                    <p className="text-[13px] font-medium text-white truncate">
                      {exec.jobName ?? '—'}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <StatusBadge
                      status={exec.status === 'SUCCESS' ? 'success' : 'failed'}
                    />
                  </div>
                  <div className="col-span-2 text-[12px] text-neutral-400 capitalize">
                    {exec.trigger?.toLowerCase() ?? '—'}
                  </div>
                  <div className="col-span-2 text-[12px] text-neutral-400">
                    {exec.duration}ms
                  </div>
                  <div className="col-span-2 text-[11px] text-neutral-500">
                    {new Date(exec.startedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800 sticky bottom-0 z-10 bg-neutral-950">
              <p className="text-[12px] text-neutral-500">
                Page <span className="text-white font-medium">{page}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-[12px] border border-neutral-700 bg-neutral-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition flex items-center gap-1 cursor-pointer"
                >
                  <FiChevronLeft size={14} />
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={
                    !filteredExecs.length || filteredExecs.length < limit
                  }
                  className="px-3 py-1 text-[12px] border border-neutral-700 bg-neutral-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition flex items-center gap-1 cursor-pointer"
                >
                  Next
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
