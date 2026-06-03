'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiPause,
  FiRefreshCw,
} from 'react-icons/fi';
import { useExecutions } from '@/modules/executions';
import StatusBadge from '@/shared/components/status-badge';
import PageLoader from '@/shared/components/page-loader';

export default function ExecutionsList() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'SUCCESS' | 'FAILED'
  >('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const limit = 20;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      )
        setStatusDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const apiStatus = statusFilter === 'all' ? undefined : statusFilter;

  const { data, isLoading, isFetching, error, refetch } = useExecutions({
    status: apiStatus,
    page,
    limit,
  });

  if (isLoading && !data) return <PageLoader />;

  if (error)
    return (
      <div className="w-full h-screen bg-[#0D0D0D]">
        <div className="py-3 bg-[#0D0D0D]">
          <h1 className="text-[20px] -tracking-[1px] text-white">Executions</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-[13px] text-neutral-500">
            Failed to load executions
          </p>
        </div>
      </div>
    );

  const allExecs = data?.items ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;

  return (
    <div className="w-full h-screen flex flex-col bg-[#0D0D0D] overflow-hidden">
      <div className="py-3 px-0 bg-[#0D0D0D] shrink-0">
        <h1 className="text-[20px] tracking-[-1px] text-white"> Executions</h1>
      </div>

      <div className="bg-[#1F1F1F] rounded-[10px] flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative" ref={statusDropdownRef}>
              <button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="flex items-center gap-2 px-2 p-0.75 border border-[#393939] text-[13px] rounded-[3px] font-light text-white/90 hover:bg-neutral-800 transition-colors cursor-pointer outline-none min-w-[120px]"
              >
                {statusFilter === 'all'
                  ? 'All Status'
                  : statusFilter === 'SUCCESS'
                    ? 'Successful'
                    : 'Failed'}
                <FiChevronDown
                  size={14}
                  className={`ml-auto transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {statusDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-neutral-900 border border-[#393939] rounded-[3px] z-50 overflow-hidden">
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'SUCCESS', label: 'Successful' },
                    { value: 'FAILED', label: 'Failed' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setStatusFilter(opt.value as any);
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] font-light transition-colors cursor-pointer ${statusFilter === opt.value ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-neutral-800 hover:text-white'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-3 p-0.75 border border-[#393939] text-[13px] rounded-[3px] font-light text-white/90 hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FiRefreshCw
                className={isFetching ? 'animate-spin' : ''}
                size={14}
              />
              Refresh
            </button>
          </div>
        </div>
        {!allExecs.length ? (
          <div className="border border-dashed border-neutral-700 flex-1 py-20 flex flex-col items-center justify-center">
            <FiPause className="text-neutral-500 mb-2" size={24} />
            <p className="text-[16px] tracking-normal text-white">
              No executions yet
            </p>
            <p className="text-[12px] text-neutral-500 mt-1">
              Create a cron job and trigger it to see results here
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="px-5 bg-neutral-900/50 border-b border-neutral-800">
              <div className="grid grid-cols-12 py-2.5 text-[12px] text-white/90 shrink-0">
                <div className="col-span-3">Job </div>
                <div className="col-span-3">Status</div>
                <div className="col-span-2">Trigger</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-2">Time</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto slim-scrollbar min-h-0">
              {isFetching
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="grid grid-cols-12 items-center py-2.5 border-b border-neutral-800/50 px-4"
                    >
                      <div className="col-span-3">
                        <div className="h-3 w-24 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                      <div className="col-span-3">
                        <div className="h-5 w-16 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                      <div className="col-span-2">
                        <div className="h-3 w-14 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                      <div className="col-span-2">
                        <div className="h-3 w-12 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                      <div className="col-span-2">
                        <div className="h-3 w-28 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                    </div>
                  ))
                : allExecs.map((exec) => (
                    <div
                      key={exec.id}
                      className="grid grid-cols-12 items-center px-5 py-2.5 border-b border-neutral-800/50 last:border-0 cursor-pointer"
                    >
                      <div className="col-span-3">
                        <p className="text-[13px] font-medium text-white/90 truncate">
                          {exec.job?.name ?? '—'}
                        </p>
                      </div>
                      <div className="col-span-3">
                        <StatusBadge
                          status={
                            exec.status === 'SUCCESS' ? 'success' : 'failed'
                          }
                        />
                      </div>
                      <div className="col-span-2 text-[12px] text-neutral-400 capitalize px-2">
                        {exec.trigger?.toLowerCase() ?? '—'}
                      </div>
                      <div className="col-span-2 text-[12px] text-neutral-400 px-2">
                        {exec.duration}ms
                      </div>
                      <div className="col-span-2 text-[11px] text-neutral-500 pl-2">
                        {new Date(exec.startedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
            </div>

            <div className="flex items-center justify-center px-4 py-3 border-t border-neutral-800 shrink-0 gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <FiChevronLeft size={13} /> Previous
              </button>
              {(() => {
                const pages: (number | '...')[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (page > 3) pages.push('...');
                  const start = Math.max(2, page - 1);
                  const end = Math.min(totalPages - 1, page + 1);
                  for (let i = start; i <= end; i++) pages.push(i);
                  if (page < totalPages - 2) pages.push('...');
                  pages.push(totalPages);
                }
                return pages.map((p, i) =>
                  p === '...' ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-2 py-1.5 text-[12px] text-neutral-500"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-7 h-7 text-[12px] rounded-[4px] transition-colors cursor-pointer ${page === p ? 'bg-neutral-700 text-white font-medium border border-neutral-600' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                    >
                      {p}
                    </button>
                  ),
                );
              })()}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next <FiChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
