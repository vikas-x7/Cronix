'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDashboardStats } from '@/client/dashboard/hooks/useDashboardStats';
import StatusBadge from '../components/StatusBadge';
import PageLoader from '../components/PageLoader';
import { FiChevronLeft, FiChevronRight, FiPause, FiLayout, FiPlusCircle, FiFilter, FiRefreshCw } from 'react-icons/fi';

export default function ExecutionsList() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedSearch]);

  const limit = 20;
  const { data: stats, isLoading, isFetching, error, refetch } = useDashboardStats(page, limit, statusFilter, debouncedSearch);

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
          <p className="text-[13px] text-neutral-400">Failed to load executions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <div className="border-b px-4 py-3 mt-1 bg-[#FAFAFA] border-[#DDDDDD] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px]">Executions</h1>
      </div>

      <div className="p-2 border-b border-[#E5E5E5] bg-white">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[1px] text-[13px] font-medium text-[#111827]">
                <FiLayout className="text-[#52525b]" />
                Overview
              </button>

              <div className="w-px h-4 bg-[#E4E4E7] mx-1"></div>

              <Link href="/dashboard/create">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E4E4E7] rounded-[1px] text-[13px] font-medium text-[#52525b] hover:bg-[#F4F4F5] transition-colors">
                  <FiPlusCircle className="text-[#52525b]" size={14} />
                  ADD
                </button>
              </Link>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-[#E4E4E7] rounded-[1px] text-[13px] font-medium text-[#52525b] hover:bg-[#F4F4F5] transition-colors appearance-none bg-transparent pr-8 cursor-pointer outline-none min-w-[120px]"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Successful</option>
                    <option value="failed">Failed</option>
                  </select>
                  <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] pointer-events-none" size={14} />
                </div>
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="flex items-center gap-2 px-3 py-1.5 border border-[#E4E4E7] rounded-[1px] text-[13px] font-medium text-[#52525b] hover:bg-[#F4F4F5] disabled:opacity-50 transition-colors"
                >
                  <FiRefreshCw className={`text-[#52525b] ${isFetching ? 'animate-spin' : ''}`} size={14} />
                  Refresh
                </button>

                <span className="text-[12px] text-[#52525b] font-medium border border-[#E4E4E7] px-3 py-1.5">Total executions {stats?.executions?.totalExecutions ?? 0}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border border-[#E5E5E5] bg-white px-3 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search executions..."
              className="text-[12px] text-[#171717] rounded-[1px] outline-none w-124 transition placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {!stats?.recentExecutions?.length ? (
          <div className="border border-dashed border-[#D9D9D9] flex-1 flex flex-col items-center justify-center">
            <FiPause className="text-black/70 mb-2" size={24} />
            <p className="text-[16px] tracking-normal text-black">No executions yet</p>
            <p className="text-[12px] text-[#383838] mt-1">Create a cron job and trigger it to see results here</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E5E5E5] text-[12px] font-medium text-black sticky top-0 z-10">
              <div className="col-span-3">Job</div>
              <div className="col-span-3">URL</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-2">Time</div>
            </div>

            <div className="flex-1 overflow-y-auto slim-scrollbar relative bg-white">
              {isFetching && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
                  <div className="w-5 h-5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {stats.recentExecutions.map((exec) => (
                <div key={exec.id} className="grid grid-cols-12 items-center px-4 py-2.5 border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition">
                  <div className="col-span-3">
                    <p className="text-[13px] font-medium text-[#171717] truncate">{exec.cronJob?.title ?? '—'}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-[11px] text-blue-500 truncate">{exec.cronJob?.url ?? '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <StatusBadge status={exec.success ? 'success' : 'failed'} />
                    {exec.statusCode && <span className="ml-2 text-[10px] text-neutral-400">{exec.statusCode}</span>}
                  </div>
                  <div className="col-span-2 text-[12px] text-neutral-500">{exec.duration}ms</div>
                  <div className="col-span-2 text-[11px] text-neutral-400">{new Date(exec.executedAt).toLocaleString()}</div>
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
                  className="px-3 py-1 text-[12px] border border-[#E5E5E5] bg-white text-black rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition flex items-center gap-1 cursor-pointer"
                >
                  <FiChevronLeft size={14} />
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!stats?.recentExecutions?.length || stats.recentExecutions.length < limit}
                  className="px-3 py-1 text-[12px] border border-[#E5E5E5] bg-white text-black rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition flex items-center gap-1 cursor-pointer"
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
