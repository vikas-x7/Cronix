'use client';

import {
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from 'react-icons/fi';
import { useDashboard } from '@/modules/dashboard';
import { useJobs } from '@/modules/jobs';
import StatCard from '@/shared/components/stat-card';
import PageLoader from '@/shared/components/page-loader';

export default function Analytics() {
  const { data: stats, isLoading: statsLoading } = useDashboard();
  const { data: jobs, isLoading: jobsLoading } = useJobs();

  if (statsLoading || jobsLoading) return <PageLoader />;

  const jobsWithExecutions =
    jobs?.filter((j: any) => (j._count?.executions ?? 0) > 0) ?? [];

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0D0D0D] pr-2">
      <div className="py-3 bg-[#0D0D0D] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px] text-white">Analytics</h1>
      </div>
      <div className="bg-[#1F1F1F] rounded-[10px] h-[92vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-6">
          <StatCard
            title="Total Executions"
            value={stats?.executions.total ?? 0}
            icon={<FiTrendingUp size={18} />}
          />
          <StatCard
            title="Successful"
            value={stats?.executions.success ?? 0}
            icon={<FiCheckCircle size={18} />}
            trend="up"
            trendValue={`${stats?.executions.successRate ?? 0}% rate`}
          />
          <StatCard
            title="Failed"
            value={stats?.executions.failed ?? 0}
            icon={<FiXCircle size={18} />}
            trend={(stats?.executions.failed ?? 0) > 0 ? 'down' : 'neutral'}
            trendValue={
              (stats?.executions.failed ?? 0) > 0
                ? 'Needs attention'
                : 'All good'
            }
          />
          <StatCard
            title="Success Rate"
            value={`${stats?.executions.successRate ?? 0}%`}
            icon={<FiClock size={18} />}
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
                  : 'Critical'
            }
          />
        </div>
        <div className="px-6 py-4">
          <h2 className="text-[14px] font-medium text-white mb-4">
            Jobs Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-neutral-800 bg-neutral-900/30 p-5 h-90">
              <p className="text-[11px] font-medium uppercase text-neutral-400 mb-4">
                Job Status Distribution
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-neutral-400">Active</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 bg-emerald-500"
                      style={{
                        width: `${Math.max(8, ((stats?.jobs.active ?? 0) / Math.max(stats?.jobs.total ?? 1, 1)) * 120)}px`,
                      }}
                    />
                    <span className="text-[13px] font-medium text-white">
                      {stats?.jobs.active ?? 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-neutral-400">Paused</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 bg-amber-400"
                      style={{
                        width: `${Math.max(8, ((stats?.jobs.paused ?? 0) / Math.max(stats?.jobs.total ?? 1, 1)) * 120)}px`,
                      }}
                    />
                    <span className="text-[13px] font-medium text-white">
                      {stats?.jobs.paused ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-neutral-800 bg-neutral-900/30 p-5">
              <p className="text-[11px] font-medium uppercase text-neutral-400 mb-4">
                Execution Results
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-neutral-400">
                    Successful
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 bg-emerald-500"
                      style={{
                        width: `${Math.max(8, ((stats?.executions.success ?? 0) / Math.max(stats?.executions.total ?? 1, 1)) * 120)}px`,
                      }}
                    />
                    <span className="text-[13px] font-medium text-emerald-400">
                      {stats?.executions.success ?? 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-neutral-400">Failed</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 bg-red-400"
                      style={{
                        width: `${Math.max(8, ((stats?.executions.failed ?? 0) / Math.max(stats?.executions.total ?? 1, 1)) * 120)}px`,
                      }}
                    />
                    <span className="text-[13px] font-medium text-red-400">
                      {stats?.executions.failed ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-neutral-800 bg-neutral-900/30 p-5">
              <p className="text-[11px] font-medium uppercase text-neutral-400 mb-4">
                Most Executed Jobs
              </p>
              {jobsWithExecutions.length === 0 ? (
                <p className="text-[12px] text-neutral-600">No data yet</p>
              ) : (
                <div className="space-y-2">
                  {jobsWithExecutions
                    .sort(
                      (a: any, b: any) =>
                        (b._count?.executions ?? 0) -
                        (a._count?.executions ?? 0),
                    )
                    .slice(0, 5)
                    .map((job: any) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[12px] text-neutral-400 truncate max-w-[140px]">
                          {job.name}
                        </span>
                        <span className="text-[12px] font-mono text-neutral-500">
                          {job._count?.executions ?? 0}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
