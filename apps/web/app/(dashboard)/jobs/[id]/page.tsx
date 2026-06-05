'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiPlay,
  FiPause,
  FiTrash2,
  FiExternalLink,
  FiRefreshCw,
  FiArrowLeft,
} from 'react-icons/fi';
import { useJob, useUpdateJob, useDeleteJob } from '@/modules/jobs';
import { useExecutions } from '@/modules/executions';
import { useUIStore } from '@/shared/stores/uiStore';
import StatusBadge from '@/shared/components/status-badge';
import PageLoader from '@/shared/components/page-loader';
import ConfirmationModal from '@/shared/components/confirmation-modal';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: job, isLoading: jobLoading } = useJob(id);
  const {
    data: executions,
    isLoading: execLoading,
    isFetching: execFetching,
    refetch: refetchExecutions,
  } = useExecutions({ jobId: id });
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();
  const addToast = useUIStore((s) => s.addToast);

  const [confirmConfig, setConfirmConfig] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmButtonClass?: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    action: () => {},
  });

  const closeConfirm = () =>
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));

  async function handleToggle() {
    if (!job) return;
    const newStatus = job.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setConfirmConfig({
      isOpen: true,
      title: job.status === 'ACTIVE' ? 'Pause Cron Job' : 'Resume Cron Job',
      message: `Are you sure you want to ${newStatus === 'ACTIVE' ? 'resume' : 'pause'} this job?`,
      confirmText: job.status === 'ACTIVE' ? 'Pause' : 'Resume',
      confirmButtonClass: 'bg-white text-black hover:bg-neutral-200',
      action: async () => {
        try {
          await updateJob.mutateAsync({
            id: job.id,
            data: { status: newStatus } as any,
          });
          addToast({
            type: 'success',
            message: `Job ${newStatus === 'ACTIVE' ? 'activated' : 'paused'}`,
          });
        } catch {
          addToast({ type: 'error', message: 'Failed to update' });
        }
      },
    });
  }

  async function handleDelete() {
    if (!job) return;
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Cron Job',
      message:
        'Are you sure you want to delete this cron job? This action cannot be undone.',
      confirmText: 'Delete',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      action: async () => {
        try {
          await deleteJob.mutateAsync(job.id);
          addToast({ type: 'success', message: 'Job deleted' });
          router.push('/jobs');
        } catch {
          addToast({ type: 'error', message: 'Failed to delete job' });
        }
      },
    });
  }

  if (jobLoading) return <PageLoader />;

  if (!job)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0D0D0D]">
        <p className="text-[13px] text-neutral-500">Job not found</p>
      </div>
    );

  const jobExecutions = executions?.items ?? [];

  return (
    <div className="w-full h-screen flex flex-col bg-[#0D0D0D] overflow-hidden">
      <div className="py-3 px-0 bg-[#0D0D0D] shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className="flex items-center justify-center p-1 border border-[#393939] rounded-[3px] text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <FiArrowLeft size={14} />
          </Link>
          <h1 className="text-[20px] tracking-[-1px] text-white">{job.name}</h1>
          <a
            href={job.endpoint}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-blue-400 transition-colors"
          >
            {job.endpoint} <FiExternalLink size={10} />
          </a>
        </div>
      </div>

      <div className="bg-[#1F1F1F] rounded-[10px] flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetchExecutions()}
              disabled={execFetching}
              className="flex items-center gap-2 px-3 p-0.75 border border-[#393939] text-[13px] rounded-[3px] font-light text-white/90 hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FiRefreshCw
                className={execFetching ? 'animate-spin' : ''}
                size={14}
              />
              Refresh
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleToggle}
                className={`flex items-center gap-1.5 px-3 p-0.75 border text-[13px] rounded-[3px] font-light transition-colors cursor-pointer ${job.status === 'ACTIVE' ? 'border-[#393939] text-amber-400 hover:bg-neutral-800 hover:border-amber-500/50' : 'border-[#393939] text-emerald-400 hover:bg-neutral-800 hover:border-emerald-500/50'}`}
              >
                {job.status === 'ACTIVE' ? (
                  <FiPause size={12} />
                ) : (
                  <FiPlay size={12} />
                )}
                {job.status === 'ACTIVE' ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 p-0.75 border border-[#393939] text-[13px] rounded-[3px] font-light text-neutral-400 hover:bg-neutral-800 hover:text-red-400 hover:border-red-500/50 transition-colors cursor-pointer"
              >
                <FiTrash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-b border-neutral-800 shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                Status
              </p>
              <div className="mt-1.5">
                <StatusBadge
                  status={
                    job.status === 'ACTIVE'
                      ? 'active'
                      : job.status === 'PAUSED'
                        ? 'paused'
                        : 'failed'
                  }
                  size="md"
                />
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                Method
              </p>
              <p className="mt-1.5 text-[12px] font-mono font-medium text-neutral-400 bg-neutral-800 px-1.5 py-0.5 inline-block">
                {job.method}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                Schedule
              </p>
              <p className="mt-1.5 text-[12px] font-mono text-neutral-400">
                {job.schedule || '—'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                Type
              </p>
              <p className="mt-1.5 text-[12px] text-neutral-400">{job.type}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="px-5 bg-neutral-900/50 border-b border-neutral-800 shrink-0">
            <div className="grid grid-cols-12 py-2.5 text-[12px] text-white/90 shrink-0">
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Code</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-3">Time</div>
              <div className="col-span-3">Error</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto slim-scrollbar min-h-0 relative">
            {execLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="grid grid-cols-12 items-center py-3 border-b border-neutral-800/50 px-4"
                >
                  <div className="col-span-2">
                    <div className="h-5 w-14 rounded-[3px] bg-neutral-800 animate-pulse" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-3 w-10 rounded-[3px] bg-neutral-800 animate-pulse" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-3 w-16 rounded-[3px] bg-neutral-800 animate-pulse" />
                  </div>
                  <div className="col-span-3">
                    <div className="h-3 w-32 rounded-[3px] bg-neutral-800 animate-pulse" />
                  </div>
                  <div className="col-span-3">
                    <div className="h-3 w-20 rounded-[3px] bg-neutral-800 animate-pulse" />
                  </div>
                </div>
              ))
            ) : !jobExecutions.length ? (
              <div className="p-4">
                <div className="border border-dashed border-neutral-700 py-20 flex flex-col items-center justify-center">
                  <p className="text-[16px] tracking-normal text-white">
                    No executions yet
                  </p>
                  <p className="text-[12px] text-neutral-500 mt-1">
                    Executions will appear here once the job runs
                  </p>
                </div>
              </div>
            ) : (
              jobExecutions.map((exec) => (
                <div
                  key={exec.id}
                  className="grid grid-cols-12 items-center px-5 py-3 border-b border-neutral-800/50 last:border-0 hover:bg-white/5 transition-colors duration-150"
                >
                  <div className="col-span-2">
                    <StatusBadge
                      status={exec.status === 'SUCCESS' ? 'success' : 'failed'}
                    />
                  </div>
                  <div className="col-span-2 text-[12px] font-mono text-neutral-400">
                    {exec.httpStatus ?? '—'}
                  </div>
                  <div className="col-span-2 text-[12px] text-neutral-400">
                    {exec.duration}ms
                  </div>
                  <div className="col-span-3 text-[11px] text-neutral-500">
                    {new Date(exec.startedAt).toLocaleString()}
                  </div>
                  <div className="col-span-3 text-[11px] text-red-400 truncate">
                    {exec.error ?? '—'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        confirmButtonClass={confirmConfig.confirmButtonClass}
        onConfirm={confirmConfig.action}
        onCancel={closeConfirm}
      />
    </div>
  );
}
