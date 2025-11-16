"use client";

import React from "react";
import Link from "next/link";
import { IoAdd } from "react-icons/io5";
import { FiActivity, FiCheckCircle, FiXCircle, FiClock, FiPause } from "react-icons/fi";
import { useDashboardStats } from "@/client/dashboard/hooks/useDashboardStats";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

export default function DashboardHome() {
    const { data: stats, isLoading, error } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="w-full h-screen">
                <div className="border-b px-4 py-4 border-[#E5E5E5] flex justify-between">
                    <h1 className="text-[20px] -tracking-[1px]">Overview</h1>
                </div>
                <div className="px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-28 animate-pulse border border-[#E5E5E5] bg-[#FAFAFA]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-screen">
                <div className="border-b px-4 py-4 border-[#E5E5E5]">
                    <h1 className="text-[20px] -tracking-[1px]">Overview</h1>
                </div>
                <div className="flex items-center justify-center h-64">
                    <p className="text-[13px] text-neutral-400">Failed to load dashboard data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen overflow-y-auto">
            {/* Header */}
            <div className="border-b px-4 py-4 border-[#E5E5E5] flex justify-between items-center">
                <h1 className="text-[20px] -tracking-[1px]">Overview</h1>
                <Link href="/dashboard/create">
                    <button className="bg-[#171717] text-[#fafafa] px-6 py-2 text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-[#333] transition">
                        <IoAdd size={18} />
                        Schedule New Job
                    </button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-6">
                <StatCard
                    title="Total Jobs"
                    value={stats?.jobs.total ?? 0}
                    subtitle={`${stats?.jobs.active ?? 0} active · ${stats?.jobs.paused ?? 0} paused`}
                    icon={<FiClock size={18} />}
                />
                <StatCard
                    title="Active Jobs"
                    value={stats?.jobs.active ?? 0}
                    icon={<FiActivity size={18} />}
                    trend="up"
                    trendValue="Running"
                />
                <StatCard
                    title="Total Executions"
                    value={stats?.executions.totalExecutions ?? 0}
                    subtitle={`${stats?.executions.failedExecutions ?? 0} failed`}
                    icon={<FiCheckCircle size={18} />}
                />
                <StatCard
                    title="Success Rate"
                    value={`${stats?.executions.successRate ?? 0}%`}
                    subtitle={`${stats?.executions.successfulExecutions ?? 0} / ${stats?.executions.totalExecutions ?? 0}`}
                    icon={<FiXCircle size={18} />}
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
                                : "Needs attention"
                    }
                />
            </div>

            {/* Quick Actions */}
            <div className="px-6 pb-2">
                <div className="flex gap-3">
                    <Link href="/dashboard/create">
                        <button className="border border-dashed border-[#D9D9D9] px-4 py-2 text-[12px] text-neutral-500 hover:border-[#171717] hover:text-[#171717] transition flex items-center gap-1">
                            <IoAdd size={16} />
                            New Cron Job
                        </button>
                    </Link>
                    <Link href="/dashboard/cronjobs">
                        <button className="border border-[#E5E5E5] px-4 py-2 text-[12px] text-neutral-500 hover:border-[#171717] hover:text-[#171717] transition flex items-center gap-1">
                            <FiClock size={14} />
                            View All Jobs
                        </button>
                    </Link>
                </div>
            </div>

            {/* Recent Executions */}
            <div className="px-6 py-4">
                <h2 className="text-[14px] font-medium text-[#171717] mb-4">
                    Recent Executions
                </h2>

                {!stats?.recentExecutions?.length ? (
                    <div className="border border-dashed border-[#E5E5E5] py-12 flex flex-col items-center justify-center">
                        <FiPause className="text-neutral-300 mb-2" size={24} />
                        <p className="text-[13px] text-neutral-400">No executions yet</p>
                        <p className="text-[11px] text-neutral-300 mt-1">
                            Create a cron job and trigger it to see results here
                        </p>
                    </div>
                ) : (
                    <div className="border border-[#E5E5E5]">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E5E5E5] text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                            <div className="col-span-3">Job</div>
                            <div className="col-span-3">URL</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Duration</div>
                            <div className="col-span-2">Time</div>
                        </div>

                        {/* Table Body */}
                        {stats.recentExecutions.map((exec) => (
                            <div
                                key={exec.id}
                                className="grid grid-cols-12 items-center px-4 py-3 border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition"
                            >
                                <div className="col-span-3">
                                    <p className="text-[13px] font-medium text-[#171717] truncate">
                                        {exec.cronJob?.title ?? "—"}
                                    </p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-[11px] text-blue-500 truncate">
                                        {exec.cronJob?.url ?? "—"}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <StatusBadge status={exec.success ? "success" : "failed"} />
                                    {exec.statusCode && (
                                        <span className="ml-2 text-[10px] text-neutral-400">
                                            {exec.statusCode}
                                        </span>
                                    )}
                                </div>
                                <div className="col-span-2 text-[12px] text-neutral-500">
                                    {exec.duration}ms
                                </div>
                                <div className="col-span-2 text-[11px] text-neutral-400">
                                    {new Date(exec.executedAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
