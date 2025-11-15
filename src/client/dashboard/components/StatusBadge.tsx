"use client";

import React from "react";

interface StatusBadgeProps {
    status: string;
    size?: "sm" | "md";
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    active: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        label: "Active",
    },
    paused: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-500",
        label: "Paused",
    },
    success: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        label: "Success",
    },
    failed: {
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "bg-red-500",
        label: "Failed",
    },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
    const config = statusConfig[status.toLowerCase()] ?? {
        bg: "bg-neutral-100",
        text: "text-neutral-600",
        dot: "bg-neutral-400",
        label: status,
    };

    const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-[12px] px-2.5 py-1";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-sm font-medium ${config.bg} ${config.text} ${sizeClasses}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}
