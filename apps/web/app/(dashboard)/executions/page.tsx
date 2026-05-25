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

  if (isLoading && !stats) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="w-full h-screen">
        <div className="border-b px-4 py-3 bg-[#FAFAFA] border-[#DDDDDD] flex justify-between items-center">
          <h1 className="text-[20px] -tracking-[1px]">Executions</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-[13px] text-neutral-400">
            Failed to load executions
          </p>
        </div>
      </div>
    );
  }

  const recentExecs = stats?.recentExecutions ?? [];
  const filteredExecs = recentExecs.filter((exec) => {
    if (statusFilter !== 'all') {
      const execStatus = exec.status === 'SUCCESS' ? 'success' : 'failed';
      if (execStatus !== statusFilter) return false;
    }
    if (
      searchQuery &&
      !exec.jobName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <div className="border-b px-4 py-3 bg-[#FAFAFA] border-[#DDDDDD] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px]">Executions</h1>
      </div>

      <div className="p-2 border-b border-[#E5E5E5] bg-white">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] border border-[#E4E4E7] text-[13px] font-medium text-[#111827]">
                <FiLayout className="text-[#52525b]" />
                Overview
              </button>

              <div className="w-px h-4 bg-[#E4E4E7] mx-1" />

              <Link href="/jobs/new">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E4E4E7] text-[13px] font-medium text-[#52525b] hover:bg-[#F4F4F5] transition-colors">
                  <FiPlusCircle className="text-[#52525b]" size={14} />
                  ADD
                </button>
              </Link>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-[#E4E4E7] text-[13px] font-medium text-[#52525b] hover:bg-[#F4F4F5] transition-colors appearance-none bg-transparent pr-8 cursor-pointer outline-none min-w-[120px]"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Successful</option>
                    <option value="failed">Failed</option>
                  </select>
                  <FiFilter
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] pointer-events-none"
                    size={14}
                  />
                </div>
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="flex items-center gap-2 px-3 py-1.5 border border-[#E4E4E7] text-[13px] font-medium text-[#52525b] hover:bg-[#F4F4F5] disabled:opacity-50 transition-colors"
                >
                  <FiRefreshCw
                    className={`text-[#52525b] ${isFetching ? 'animate-spin' : ''}`}
                    size={14}
                  />
                  Refresh
                </button>

                <span className="text-[12px] text-[#52525b] font-medium border border-[#E4E4E7] px-3 py-1.5">
                  Total executions {stats?.executions?.total ?? 0}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border border-[#E5E5E5] bg-white px-3 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search executions..."
              className="text-[12px] text-[#171717] outline-none w-64 transition placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {!filteredExecs.length ? (
          <div className="border border-dashed border-[#D9D9D9] flex-1 flex flex-col items-center justify-center">
            <FiPause className="text-black/70 mb-2" size={24} />
            <p className="text-[16px] tracking-normal text-black">
              No executions yet
            </p>
            <p className="text-[12px] text-[#383838] mt-1">
              Create a cron job and trigger it to see results here
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E5E5E5] text-[12px] font-medium text-black sticky top-0 z-10">
              <div className="col-span-3">Job</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Trigger</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-2">Time</div>
            </div>

            <div className="flex-1 overflow-y-auto slim-scrollbar relative bg-white">
              {isFetching && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
                  <div className="w-5 h-5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {filteredExecs.map((exec) => (
                <div
                  key={exec.id}
                  className="grid grid-cols-12 items-center px-4 py-2.5 border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition"
                >
                  <div className="col-span-3">
                    <p className="text-[13px] font-medium text-[#171717] truncate">
                      {exec.jobName ?? '—'}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <StatusBadge
                      status={exec.status === 'SUCCESS' ? 'success' : 'failed'}
                    />
                  </div>
                  <div className="col-span-2 text-[12px] text-neutral-500 capitalize">
                    {exec.trigger?.toLowerCase() ?? '—'}
                  </div>
                  <div className="col-span-2 text-[12px] text-neutral-500">
                    {exec.duration}ms
                  </div>
                  <div className="col-span-2 text-[11px] text-neutral-400">
                    {new Date(exec.startedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5E5] sticky bottom-0 z-10 bg-white">
              <p className="text-[12px] text-neutral-500">
                Page <span className="text-black font-medium">{page}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-[12px] border border-[#E5E5E5] bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition flex items-center gap-1 cursor-pointer"
                >
                  <FiChevronLeft size={14} />
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={
                    !filteredExecs.length || filteredExecs.length < limit
                  }
                  className="px-3 py-1 text-[12px] border border-[#E5E5E5] bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition flex items-center gap-1 cursor-pointer"
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
