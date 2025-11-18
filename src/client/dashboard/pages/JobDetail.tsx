"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    FiArrowLeft,
    FiPlay,
    FiPause,
    FiTrash2,
    FiExternalLink,
} from "react-icons/fi";
import { useCronJob, useUpdateCronJob, useDeleteCronJob, useTriggerCronJob } from "@/client/dashboard/hooks/useCronJobs";
import { useExecutions } from "@/client/dashboard/hooks/useExecutions";
import { useUIStore } from "@/client/dashboard/stores/uiStore";
import StatusBadge from "../components/StatusBadge";

export default function JobDetail({ jobId }: { jobId: string }) {
    const router = useRouter();
    const { data: job, isLoading: jobLoading } = useCronJob(jobId);
    const { data: executions, isLoading: execLoading } = useExecutions(jobId);
    const updateJob = useUpdateCronJob();
    const deleteJob = useDeleteCronJob();
    const triggerJob = useTriggerCronJob();
    const addToast = useUIStore((s) => s.addToast);

    async function handleToggle() {
        if (!job) return;
        try {
            await updateJob.mutateAsync({
                id: job.id,
                status: job.status === "active" ? "paused" : "active",
            });
            addToast({ type: "success", message: `Job ${job.status === "active" ? "paused" : "activated"}` });
        } catch {
            addToast({ type: "error", message: "Failed to update" });
        }
    }

    async function handleDelete() {
        if (!confirm("Delete this cron job?")) return;
        try {
            await deleteJob.mutateAsync(jobId);
            addToast({ type: "success", message: "Job deleted" });
            router.push("/dashboard/cronjobs");
        } catch {
            addToast({ type: "error", message: "Failed to delete" });
        }
    }

    async function handleTrigger() {
        try {
            addToast({ type: "info", message: "Triggering..." });
            await triggerJob.mutateAsync(jobId);
            addToast({ type: "success", message: "Triggered!" });
        } catch {
            addToast({ type: "error", message: "Failed to trigger" });
        }
    }

    if (jobLoading) {
        return (
            <div className="w-full h-screen">
                <div className="border-b px-4 py-4 border-[#E5E5E5]">
                    <div className="h-6 w-48 bg-[#F5F5F5] animate-pulse" />
                </div>
                <div className="px-6 py-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-[#FAFAFA] animate-pulse border border-[#E5E5E5]" />
                    ))}
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-[13px] text-neutral-400">Job not found</p>
            </div>
        );
    }

    return (
        <div className="w-full h-screen overflow-y-auto">
            {/* Header */}
            <div className="border-b px-4 py-4 border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                
                    <div>
                        <h1 className="text-[20px] -tracking-[1px]">{job.title}</h1>
                        <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                            {job.url} <FiExternalLink size={10} />
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleTrigger}
                        disabled={triggerJob.isPending}
                        className="flex items-center gap-1 border border-[#E5E5E5] px-3 py-1.5 text-[11px] font-medium text-neutral-500 hover:border-emerald-300 hover:text-emerald-600 transition disabled:opacity-50"
                    >
                        <FiPlay size={12} /> Trigger
                    </button>
                    <button
                        onClick={handleToggle}
                        className="flex items-center gap-1 border border-[#E5E5E5] px-3 py-1.5 text-[11px] font-medium text-neutral-500 hover:border-amber-300 hover:text-amber-600 transition"
                    >
                        <FiPause size={12} />
                        {job.status === "active" ? "Pause" : "Resume"}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1 border border-[#E5E5E5] px-3 py-1.5 text-[11px] font-medium text-neutral-500 hover:border-red-300 hover:text-red-600 transition"
                    >
                        <FiTrash2 size={12} /> Delete
                    </button>
                </div>
            </div>

            {/* Job Details */}
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Status</p>
                        <div className="mt-1"><StatusBadge status={job.status} size="md" /></div>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Method</p>
                        <p className="mt-1 text-[13px] font-mono font-medium text-[#171717]">{job.method}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Schedule</p>
                        <p className="mt-1 text-[13px] font-mono text-[#171717]">{job.cronExpression}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Timezone</p>
                        <p className="mt-1 text-[13px] text-[#171717]">{job.timezone}</p>
                    </div>
                </div>
            </div>

            {/* Execution History */}
            <div className="px-6 py-5">
                <h2 className="text-[14px] font-medium text-[#171717] mb-4">
                    Execution History
                    <span className="ml-2 text-[11px] text-neutral-400 font-normal">
                        ({job._count.executions} total)
                    </span>
                </h2>

                {execLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-[#FAFAFA] animate-pulse border border-[#E5E5E5]" />
                        ))}
                    </div>
                ) : !executions?.length ? (
                    <div className="border border-dashed border-[#E5E5E5] py-12 flex flex-col items-center">
                        <p className="text-[13px] text-neutral-400">No executions yet</p>
                        <button
                            onClick={handleTrigger}
                            className="mt-3 border border-[#171717] px-4 py-2 text-[12px] text-[#171717] hover:bg-[#171717] hover:text-white transition flex items-center gap-1"
                        >
                            <FiPlay size={14} /> Trigger first execution
                        </button>
                    </div>
                ) : (
                    <div className="border border-[#E5E5E5]">
                        <div className="grid grid-cols-12 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E5E5E5] text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Code</div>
                            <div className="col-span-2">Duration</div>
                            <div className="col-span-3">Time</div>
                            <div className="col-span-3">Error</div>
                        </div>

                        {executions.map((exec) => (
                            <div
                                key={exec.id}
                                className="grid grid-cols-12 items-center px-4 py-3 border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition"
                            >
                                <div className="col-span-2">
                                    <StatusBadge status={exec.success ? "success" : "failed"} />
                                </div>
                                <div className="col-span-2 text-[13px] font-mono text-neutral-600">
                                    {exec.statusCode ?? "—"}
                                </div>
                                <div className="col-span-2 text-[12px] text-neutral-500">
                                    {exec.duration}ms
                                </div>
                                <div className="col-span-3 text-[11px] text-neutral-400">
                                    {new Date(exec.executedAt).toLocaleString()}
                                </div>
                                <div className="col-span-3 text-[11px] text-red-400 truncate">
                                    {exec.error ?? "—"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
