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
      <div className="w-full h-screen bg-neutral-950">
        <div className="border-b px-4 py-3 border-neutral-800">
          <h1 className="text-[20px] tracking-[-1px] text-white"> Overview</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-[13px] text-neutral-500">
            Failed to load dashboard data
          </p>
        </div>
      </div>
    );
  }

  const recentExecs = stats?.recentExecutions ?? [];

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0D0D0D] pr-2">
      <div className="py-3 bg-[#0D0D0D] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px] text-white"> Overview</h1>
        <Link href="/jobs/new">
          <button className="bg-[#252525] border border-white/5 rounded-[2px] text-white/90 px-2 py-1.5 text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-neutral-200 transition">
            <IoAdd size={18} />
            Schedule New job
          </button>
        </Link>
      </div>

      <div className="bg-[#1F1F1F] rounded-[10px] h-[92vh] overflow-y-auto">
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
              <button className="border border-dashed border-neutral-700 px-4 py-2 text-[12px] text-neutral-300 hover:border-white hover:text-white transition flex items-center gap-1">
                <IoAdd size={16} />
                New Cron Job
              </button>
            </Link>
            <Link href="/jobs">
              <button className="border border-neutral-700 px-4 py-2 text-[12px] text-neutral-300 hover:border-white hover:text-white transition flex items-center gap-1">
                <FiClock size={14} />
                View All Jobs
              </button>
            </Link>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="border border-neutral-700 px-4 py-2 text-[12px] text-neutral-300 hover:border-white hover:text-white transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw
                size={14}
                className={isFetching ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-col h-[calc(100vh-400px)] min-h-[445px]">
          <h2 className="text-[14px] font-medium text-white mb-4">
            Recent Executions
          </h2>

          {!recentExecs.length ? (
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
            <div className="border border-neutral-800 flex flex-col flex-1 overflow-hidden rounded-[5px]">
              <div className="grid grid-cols-12 px-4 py-2.5 bg-[#2A2A2A] border-b border-neutral-800 text-[12px] font-medium text-white/90 sticky top-0 z-10">
                <div className="col-span-3">Job</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-2">Trigger</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-2">Time</div>
              </div>

              <div className="flex-1 overflow-y-auto slim-scrollbar relative">
                {recentExecs.map((exec) => (
                  <div
                    key={exec.id}
                    className="grid grid-cols-12 items-center px-4 py-2.5 border-b border-neutral-800/50 last:border-0 hover:bg-neutral-900/30 transition"
                  >
                    <div className="col-span-3">
                      <p className="text-[13px] font-light   text-white/80 truncate">
                        {exec.jobName ?? '—'}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <StatusBadge
                        status={
                          exec.status === 'SUCCESS' ? 'success' : 'failed'
                        }
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

              <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800 sticky bottom-0 z-10">
                <p className="text-[12px] text-neutral-500">
                  Page <span className="text-white font-medium">{page}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-[12px] rounded-[3px]  text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition flex items-center gap-1 cursor-pointer"
                  >
                    <FiChevronLeft size={14} />
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!recentExecs.length || recentExecs.length < limit}
                    className="px-3 py-1 text-[12px] rounded-[3px]  text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition flex items-center gap-1 cursor-pointer"
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
    </div>
  );
}
