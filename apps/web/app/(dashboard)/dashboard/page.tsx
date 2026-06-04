'use client';

import Link from 'next/link';
import { IoAdd } from 'react-icons/io5';
import {
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiRefreshCw,
} from 'react-icons/fi';
import { useDashboard } from '@/modules/dashboard';
import StatCard from '@/shared/components/stat-card';
import PageLoader from '@/shared/components/page-loader';
import OverviewCharts from './overview-charts';

export default function DashboardHome() {
  const { data: stats, isLoading, isFetching, error, refetch } = useDashboard();

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

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0D0D0D] pr-2">
      <div className="py-3 bg-[#0D0D0D] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px] text-white"> Overview</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-[#252525] border border-white/5 rounded-[2px] text-white/90 px-2 py-1.5 text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw
              size={14}
              className={isFetching ? 'animate-spin' : ''}
            />
            Refresh
          </button>
          <Link href="/jobs/new">
            <button className="bg-[#252525] border border-white/5 rounded-[2px] text-white/90 px-2 py-1.5 text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-neutral-700 transition">
              <IoAdd size={18} />
              Schedule New Job
            </button>
          </Link>
        </div>
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

        {/* Activity Charts */}
        <div className="px-6 pb-6">
          {stats && <OverviewCharts stats={stats} />}
        </div>
      </div>
    </div>
  );
}
