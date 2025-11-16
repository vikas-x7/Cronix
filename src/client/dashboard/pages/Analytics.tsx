"use client";

import React from "react";
import { FiCheckCircle, FiXCircle, FiTrendingUp, FiClock } from "react-icons/fi";
import { useDashboardStats } from "@/client/dashboard/hooks/useDashboardStats";
import { useCronJobs } from "@/client/dashboard/hooks/useCronJobs";
import StatCard from "../components/StatCard";

export default function Analytics() {
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: jobs, isLoading: jobsLoading } = useCronJobs();

    const isLoading = statsLoading || jobsLoading;

    if (isLoading) {
        return (
            <div className="w-full h-screen">
                <div className="border-b px-4 py-4 border-[#E5E5E5]">
                    <h1 className="text-[20px] -tracking-[1px]">Analytics</h1>
                </div>
                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-28 animate-pulse border border-[#E5E5E5] bg-[#FAFAFA]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Compute top failing jobs
    const jobsWithExecutions = jobs?.filter((j) => j._count.executions > 0) ?? [];

    return (
        <div className="w-full h-screen overflow-y-auto">
            {/* Header */}
            <div className="border-b px-4 py-4 border-[#E5E5E5]">
                <h1 className="text-[20px] -tracking-[1px]">Analytics</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-6">
                <StatCard
                    title="Total Executions"
                    value={stats?.executions.totalExecutions ?? 0}
                    icon={<FiTrendingUp size={18} />}
                />
                <StatCard
                    title="Successful"
                    value={stats?.executions.successfulExecutions ?? 0}
                    icon={<FiCheckCircle size={18} />}
                    trend="up"
                    trendValue={`${stats?.executions.successRate ?? 0}% rate`}
                />
                <StatCard
                    title="Failed"
                    value={stats?.executions.failedExecutions ?? 0}
                    icon={<FiXCircle size={18} />}
                    trend={
                        (stats?.executions.failedExecutions ?? 0) > 0 ? "down" : "neutral"
                    }
                    trendValue={
                        (stats?.executions.failedExecutions ?? 0) > 0
                            ? "Needs attention"
                            : "All good"
                    }
                />
                <StatCard
                    title="Success Rate"
                    value={`${stats?.executions.successRate ?? 0}%`}
                    icon={<FiClock size={18} />}
                    trend={
                        (stats?.executions.successRate ?? 0) >= 90
                            ? "up"
                            : (stats?.executions.successRate ?? 0) >= 50
                                ? "neutral"
                                : "down"
                    }
                    trendValue={
                        (stats?.executions.successRate ?? 0) >= 90
                            ? "Healthy"
                            : (stats?.executions.successRate ?? 0) >= 50
                                ? "Moderate"
                                : "Critical"
                    }
                />
            </div>

            {/* Job Breakdown */}
            <div className="px-6 py-4">
                <h2 className="text-[14px] font-medium text-[#171717] mb-4">
                    Jobs Breakdown
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Active vs Paused */}
                    <div className="border border-[#E5E5E5] p-5">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-4">
                            Job Status Distribution
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-neutral-600">Active</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${Math.max(8, (stats?.jobs.active ?? 0) / Math.max(stats?.jobs.total ?? 1, 1) * 120)}px` }} />
                                    <span className="text-[13px] font-medium text-[#171717]">
                                        {stats?.jobs.active ?? 0}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-neutral-600">Paused</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 bg-amber-400 rounded-full" style={{ width: `${Math.max(8, (stats?.jobs.paused ?? 0) / Math.max(stats?.jobs.total ?? 1, 1) * 120)}px` }} />
                                    <span className="text-[13px] font-medium text-[#171717]">
                                        {stats?.jobs.paused ?? 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Execution Breakdown */}
                    <div className="border border-[#E5E5E5] p-5">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-4">
                            Execution Results
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-neutral-600">Successful</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 bg-emerald-500 rounded-full" style={{ width: `${Math.max(8, (stats?.executions.successfulExecutions ?? 0) / Math.max(stats?.executions.totalExecutions ?? 1, 1) * 120)}px` }} />
                                    <span className="text-[13px] font-medium text-emerald-600">
                                        {stats?.executions.successfulExecutions ?? 0}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-neutral-600">Failed</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 bg-red-400 rounded-full" style={{ width: `${Math.max(8, (stats?.executions.failedExecutions ?? 0) / Math.max(stats?.executions.totalExecutions ?? 1, 1) * 120)}px` }} />
                                    <span className="text-[13px] font-medium text-red-500">
                                        {stats?.executions.failedExecutions ?? 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jobs with executions */}
                    <div className="border border-[#E5E5E5] p-5">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-4">
                            Most Executed Jobs
                        </p>
                        {jobsWithExecutions.length === 0 ? (
                            <p className="text-[12px] text-neutral-300">No data yet</p>
                        ) : (
                            <div className="space-y-2">
                                {jobsWithExecutions
                                    .sort((a, b) => b._count.executions - a._count.executions)
                                    .slice(0, 5)
                                    .map((job) => (
                                        <div key={job.id} className="flex items-center justify-between">
                                            <span className="text-[12px] text-neutral-600 truncate max-w-[140px]">
                                                {job.title}
                                            </span>
                                            <span className="text-[12px] font-mono text-neutral-400">
                                                {job._count.executions}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
