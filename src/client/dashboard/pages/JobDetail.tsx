'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiPlay, FiPause, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { useCronJob, useUpdateCronJob, useDeleteCronJob } from '@/client/dashboard/hooks/useCronJobs';
import { useExecutions } from '@/client/dashboard/hooks/useExecutions';
import { useUIStore } from '@/client/dashboard/stores/uiStore';
import StatusBadge from '../components/StatusBadge';
import PageLoader from '../components/PageLoader';
import ConfirmationModal from '../components/ConfirmationModal';

export default function JobDetail({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { data: job, isLoading: jobLoading } = useCronJob(jobId);
  const { data: executions, isLoading: execLoading } = useExecutions(jobId);
  const updateJob = useUpdateCronJob();
  const deleteJob = useDeleteCronJob();
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

  const closeConfirm = () => setConfirmConfig((prev) => ({ ...prev, isOpen: false }));

  async function handleToggle() {
    if (!job) return;
    const newStatus = job.status === 'active' ? 'paused' : 'active';
    setConfirmConfig({
      isOpen: true,
      title: job.status === 'active' ? 'Pause Cron Job' : 'Resume Cron Job',
      message: `Are you sure you want to ${newStatus} this job?`,
      confirmText: job.status === 'active' ? 'Pause' : 'Resume',
      confirmButtonClass: 'bg-black hover:bg-[#222222]',
      action: async () => {
        try {
          await updateJob.mutateAsync({
            id: job.id,
            status: newStatus,
          });
          addToast({ type: 'success', message: `Job ${newStatus === 'active' ? 'activated' : 'paused'}` });
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
      message: 'Are you sure you want to delete this cron job? This action cannot be undone.',
      confirmText: 'Delete',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700',
      action: async () => {
        try {
          await deleteJob.mutateAsync(jobId);
          addToast({ type: 'success', message: 'Job deleted' });
          router.push('/dashboard/cronjobs');
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
            onClick={handleToggle}
            className={`flex items-center gap-1 border border-[#E5E5E5] px-3 py-1.5 text-[11px] font-medium transition ${job.status === 'active' ? 'text-neutral-500 hover:border-amber-300 hover:text-amber-600' : 'text-neutral-500 hover:border-emerald-300 hover:text-emerald-600'}`}
          >
            {job.status === 'active' ? <FiPause size={12} /> : <FiPlay size={12} />}
            {job.status === 'active' ? 'Pause' : 'Resume'}
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
            <div className="mt-1">
              <StatusBadge status={job.status} size="md" />
            </div>
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
          <span className="ml-2 text-[11px] text-neutral-400 font-normal">({job._count.executions} total)</span>
        </h2>

        {execLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#171717] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !executions?.length ? (
          <div className="border border-dashed border-[#E5E5E5] py-12 flex flex-col items-center">
            <p className="text-[13px] text-neutral-400">No executions yet</p>
          </div>
        ) : (
          <div className="border border-[#E5E5E5]">
            <div className="grid grid-cols-12 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E5E5E5] text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              <div className="col-span-2">Status </div>
              <div className="col-span-2">Code</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-3">Time</div>
              <div className="col-span-3">Error</div>
            </div>

            {executions.map((exec) => (
              <div key={exec.id} className="grid grid-cols-12 items-center px-4 py-3 border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition">
                <div className="col-span-2">
                  <StatusBadge status={exec.success ? 'success' : 'failed'} />
                </div>
                <div className="col-span-2 text-[13px] font-mono text-neutral-600">{exec.statusCode ?? '—'}</div>
                <div className="col-span-2 text-[12px] text-neutral-500">{exec.duration}ms</div>
                <div className="col-span-3 text-[11px] text-neutral-400">{new Date(exec.executedAt).toLocaleString()}</div>
                <div className="col-span-3 text-[11px] text-red-400 truncate">{exec.error ?? '—'}</div>
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
