'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiPlay,
  FiPause,
  FiTrash2,
  FiExternalLink,
} from 'react-icons/fi';
import { useJob, useUpdateJob, useDeleteJob } from '@/modules/jobs';
import { useExecutions } from '@/modules/executions';
import { useUIStore } from '@/shared/stores/uiStore';
import StatusBadge from '@/shared/components/status-badge';
import PageLoader from '@/shared/components/page-loader';
import ConfirmationModal from '@/shared/components/confirmation-modal';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: job, isLoading: jobLoading } = useJob(id);
  const { data: executions, isLoading: execLoading } = useExecutions({
    jobId: id,
  });
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
      confirmButtonClass: 'bg-black hover:bg-[#222222]',
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
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Cron Job',
      message:
        'Are you sure you want to delete this cron job? This action cannot be undone.',
      confirmText: 'Delete',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      action: async () => {
        try {
          await deleteJob.mutateAsync(id);
          addToast({ type: 'success', message: 'Job deleted' });
          router.push('/jobs');
        } catch {
          addToast({ type: 'error', message: 'Failed to delete' });
        }
      },
    });
  }

  if (jobLoading) {
    return <PageLoader />;
  }

  if (!job) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-[13px] text-neutral-400">Job not found</p>
      </div>
    );
  }

  const jobExecutions = executions ?? [];

  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="border-b px-4 py-4 border-[#E5E5E5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[20px] -tracking-[1px]">{job.name}</h1>
            <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
              {job.endpoint} <FiExternalLink size={10} />
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-1 border border-[#E5E5E5] px-3 py-1.5 text-[11px] font-medium transition ${job.status === 'ACTIVE' ? 'text-neutral-500 hover:border-amber-300 hover:text-amber-600' : 'text-neutral-500 hover:border-emerald-300 hover:text-emerald-600'}`}
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
            className="flex items-center gap-1 border border-[#E5E5E5] px-3 py-1.5 text-[11px] font-medium text-neutral-500 hover:border-red-300 hover:text-red-600 transition"
          >
            <FiTrash2 size={12} /> Delete
          </button>
        </div>
      </div>

      <div className="px-6 py-5 border-b border-[#E5E5E5]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Status
            </p>
            <div className="mt-1">
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
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Method
            </p>
            <p className="mt-1 text-[13px] font-mono font-medium text-[#171717]">
              {job.method}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Schedule
            </p>
            <p className="mt-1 text-[13px] font-mono text-[#171717]">
              {job.schedule || '—'}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Type
            </p>
            <p className="mt-1 text-[13px] text-[#171717]">{job.type}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        <h2 className="text-[14px] font-medium text-[#171717] mb-4">
          Execution History
          <span className="ml-2 text-[11px] text-neutral-400 font-normal">
            ({jobExecutions.length} total)
          </span>
        </h2>

        {execLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !jobExecutions.length ? (
          <div className="border border-dashed border-[#E5E5E5] py-12 flex flex-col items-center">
            <p className="text-[13px] text-neutral-400">No executions yet</p>
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

            {jobExecutions.map((exec) => (
              <div
                key={exec.id}
                className="grid grid-cols-12 items-center px-4 py-3 border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition"
              >
                <div className="col-span-2">
                  <StatusBadge
                    status={exec.status === 'SUCCESS' ? 'success' : 'failed'}
                  />
                </div>
                <div className="col-span-2 text-[13px] font-mono text-neutral-600">
                  {exec.httpStatus ?? '—'}
                </div>
                <div className="col-span-2 text-[12px] text-neutral-500">
                  {exec.duration}ms
                </div>
                <div className="col-span-3 text-[11px] text-neutral-400">
                  {new Date(exec.startedAt).toLocaleString()}
                </div>
                <div className="col-span-3 text-[11px] text-red-400 truncate">
                  {exec.error ?? '—'}
                </div>
              </div>
            ))}
          </div>
        )}
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
