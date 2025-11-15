"use client";

import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    trendValue,
}: StatCardProps) {
    const trendColor =
        trend === "up"
            ? "text-emerald-600"
            : trend === "down"
                ? "text-red-500"
                : "text-neutral-400";

    return (
        <div className="border border-[#E5E5E5] bg-white p-5 transition-all hover:border-[#C5C5C5]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                        {title}
                    </p>
                    <p className="mt-2 text-[28px] font-semibold -tracking-[1.5px] text-[#171717]">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="mt-1 text-[12px] text-neutral-400">{subtitle}</p>
                    )}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#F5F5F5] text-neutral-500">
                    {icon}
                </div>
            </div>
            {trend && trendValue && (
                <div className={`mt-3 text-[11px] font-medium ${trendColor}`}>
                    {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                </div>
            )}
        </div>
    );
}
