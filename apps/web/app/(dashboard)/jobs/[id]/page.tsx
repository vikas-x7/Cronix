'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiPlay, FiPause, FiTrash2, FiExternalLink } from 'react-icons/fi';
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
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Cron Job',
      message: 'Are you sure? This action cannot be undone.',
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

  if (jobLoading) return <PageLoader />;
  if (!job)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0D0D0D]">
        <p className="text-[13px] text-neutral-500">Job not found</p>
      </div>
    );

  const jobExecutions = executions ?? [];

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0D0D0D] pr-2">
      <div className="py-3 bg-[#0D0D0D] flex items-center justify-between">
        <div>
          <h1 className="text-[20px] -tracking-[1px] text-white">{job.name}</h1>
          <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
            {job.endpoint} <FiExternalLink size={10} />
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-1 border px-3 py-1.5 text-[11px] font-medium transition ${job.status === 'ACTIVE' ? 'border-neutral-700 text-neutral-400 hover:border-amber-500/50 hover:text-amber-400' : 'border-neutral-700 text-neutral-400 hover:border-emerald-500/50 hover:text-emerald-400'}`}
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
            className="flex items-center gap-1 border border-neutral-700 px-3 py-1.5 text-[11px] font-medium text-neutral-400 hover:border-red-500/50 hover:text-red-400 transition"
          >
            <FiTrash2 size={12} /> Delete
          </button>
        </div>
      </div>
      <div className="bg-[#1F1F1F] rounded-[10px] h-[92vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-neutral-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
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
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                Method
              </p>
              <p className="mt-1 text-[13px] font-mono font-medium">
                {job.method}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                Schedule
              </p>
              <p className="mt-1 text-[13px] font-mono">
                {job.schedule || '—'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                Type
              </p>
              <p className="mt-1 text-[13px]">{job.type}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <h2 className="text-[14px] font-medium text-white mb-4">
            Execution History{' '}
            <span className="ml-2 text-[11px] text-neutral-500 font-normal">
              ({jobExecutions.length} total)
            </span>
          </h2>
          {execLoading ? (
            <div className="py-20 flex justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !jobExecutions.length ? (
            <div className="border border-dashed border-neutral-700 py-12 flex flex-col items-center">
              <p className="text-[13px] text-neutral-500">No executions yet</p>
            </div>
          ) : (
            <div className="border border-neutral-800">
              <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-900/50 border-b border-neutral-800 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Code</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-3">Time</div>
                <div className="col-span-3">Error</div>
              </div>
              {jobExecutions.map((exec) => (
                <div
                  key={exec.id}
                  className="grid grid-cols-12 items-center px-4 py-3 border-b border-neutral-800/50 last:border-0 hover:bg-neutral-900/30 transition"
                >
                  <div className="col-span-2">
                    <StatusBadge
                      status={exec.status === 'SUCCESS' ? 'success' : 'failed'}
                    />
                  </div>
                  <div className="col-span-2 text-[13px] font-mono text-neutral-400">
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
              ))}
            </div>
          )}
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
