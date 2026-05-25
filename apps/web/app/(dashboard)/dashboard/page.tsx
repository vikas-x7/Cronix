'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import {
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiPause,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from 'react-icons/fi';
import { useDashboard } from '@/modules/dashboard';
import { useJobs } from '@/modules/jobs';
import StatCard from '@/shared/components/stat-card';
import StatusBadge from '@/shared/components/status-badge';
import PageLoader from '@/shared/components/page-loader';

export default function DashboardHome() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: stats, isLoading, isFetching, error, refetch } = useDashboard();
  const { data: jobs } = useJobs();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="w-full h-screen">
        <div className="border-b px-4 py-3 border-[#737373]">
          <h1 className="text-[20px] -tracking-[1px]">Overview</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-[13px] text-neutral-400">
            Failed to load dashboard data
          </p>
        </div>
      </div>
    );
  }

  const recentExecs = stats?.recentExecutions ?? [];

  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="border-b px-4 py-3 bg-[#FAFAFA] border-[#DDDDDD] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px]">Overview</h1>
        <Link href="/jobs/new">
          <button className="bg-[#171717] text-[#fafafa] px-3 py-2 text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-[#333] transition">
            <IoAdd size={18} />
            Schedule New Job
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-6">
        <StatCard
          title="Jobs Registered"
          value={stats?.jobs.total ?? 0}
          subtitle={`${stats?.jobs.active ?? 0} active · ${stats?.jobs.paused ?? 0} paused`}
          icon={<FiClock size={18} />}
        />
        <StatCard
          title="Currently Running"
          value={stats?.jobs.active ?? 0}
          icon={<FiActivity size={18} />}
          trend="up"
          trendValue="Running"
        />
        <StatCard
          title="Total Executions"
          value={stats?.executions.total ?? 0}
          subtitle={`${stats?.executions.failed ?? 0} failed`}
          icon={<FiCheckCircle size={18} />}
        />
        <StatCard
          title="Performance Score"
          value={`${stats?.executions.successRate ?? 0}%`}
          subtitle={`${stats?.executions.success ?? 0} / ${stats?.executions.total ?? 0}`}
          icon={<FiXCircle size={18} />}
          trend={
            (stats?.executions.successRate ?? 0) >= 90
              ? 'up'
              : (stats?.executions.successRate ?? 0) >= 50
                ? 'neutral'
                : 'down'
          }
          trendValue={
            (stats?.executions.successRate ?? 0) >= 90
              ? 'Healthy'
              : (stats?.executions.successRate ?? 0) >= 50
                ? 'Moderate'
                : 'Needs attention'
          }
        />
      </div>

      <div className="px-6 pb-2">
        <div className="flex gap-3">
          <Link href="/jobs/new">
            <button className="border border-dashed border-[#D9D9D9] px-4 py-2 text-[12px] text-black/90 hover:border-[#171717] hover:text-[#171717] transition flex items-center gap-1">
              <IoAdd size={16} />
              New Cron Job
            </button>
          </Link>
          <Link href="/jobs">
            <button className="border border-[#E5E5E5] px-4 py-2 text-[12px] text-black/90 hover:border-[#171717] hover:text-[#171717] transition flex items-center gap-1">
              <FiClock size={14} />
              View All Jobs
            </button>
          </Link>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="border border-[#E5E5E5] px-4 py-2 text-[12px] text-black/90 hover:border-[#171717] hover:text-[#171717] transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw
              size={14}
              className={isFetching ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="px-6 py-4 flex flex-col h-[calc(100vh-400px)] min-h-[400px]">
        <h2 className="text-[14px] font-medium text-[#171717] mb-4">
          Recent Executions
        </h2>

        {!recentExecs.length ? (
          <div className="border border-dashed border-[#D9D9D9] flex-1 py-20 flex flex-col items-center justify-center">
            <FiPause className="text-black/70 mb-2" size={24} />
            <p className="text-[16px] tracking-normal text-black">
              No executions yet
            </p>
            <p className="text-[12px] text-[#383838] mt-1">
              Create a cron job and trigger it to see results here
            </p>
          </div>
        ) : (
          <div className="border border-[#E5E5E5] flex flex-col flex-1 overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E5E5E5] text-[12px] font-medium text-black sticky top-0 z-10">
              <div className="col-span-3">Job</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Trigger</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-2">Time</div>
            </div>

            <div className="flex-1 overflow-y-auto slim-scrollbar relative">
              {isFetching && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <div className="w-5 h-5 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {recentExecs.map((exec) => (
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

            <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5E5] sticky bottom-0 z-10">
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
                  disabled={!recentExecs.length || recentExecs.length < limit}
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
