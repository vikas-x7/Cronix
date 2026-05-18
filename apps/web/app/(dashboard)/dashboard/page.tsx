'use client';

import {
  useDashboard,
  StatsCard,
  RecentExecutionsTable,
  UpcomingJobsList,
} from '@/modules/dashboard';
import PageHeader from '@/shared/layout/page-header';

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-xl bg-gray-100 lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
          <p className="text-sm text-gray-500">Failed to load dashboard data</p>
          <button
            onClick={() => refetch()}
            className="mt-3 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Jobs" value={data?.jobs.total ?? 0} />
        <StatsCard label="Active Jobs" value={data?.jobs.active ?? 0} />
        <StatsCard
          label="Success Rate"
          value={`${data?.executions.successRate ?? 0}%`}
        />
        <StatsCard label="Failed Today" value={data?.executions.failed ?? 0} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Recent Executions
          </h2>
          <RecentExecutionsTable executions={data?.recentExecutions ?? []} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Upcoming Jobs
          </h2>
          <UpcomingJobsList jobs={data?.upcomingJobs ?? []} />
        </div>
      </div>
    </div>
  );
}
