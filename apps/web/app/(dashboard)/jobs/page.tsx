'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { IoAdd } from 'react-icons/io5';
import {
  FiPause,
  FiPlay,
  FiTrash2,
  FiExternalLink,
  FiMoreVertical,
  FiClock,
  FiLayout,
  FiFilter,
  FiRefreshCw,
  FiPlusCircle,
} from 'react-icons/fi';
import { useJobs, useDeleteJob, useUpdateJob } from '@/modules/jobs';
import { useJobStore } from '@/shared/stores/jobStore';
import { useUIStore } from '@/shared/stores/uiStore';
import StatusBadge from '@/shared/components/status-badge';
import PageLoader from '@/shared/components/page-loader';
import ConfirmationModal from '@/shared/components/confirmation-modal';

function JobsPageContent() {
  const { data: jobs, isLoading, error, refetch } = useJobs();
  const deleteJob = useDeleteJob();
  const updateJob = useUpdateJob();
  const addToast = useUIStore((s) => s.addToast);
  const { statusFilter, searchQuery, setSearchQuery } = useJobStore();

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

  const filteredJobs = jobs?.filter((job) => {
    if (statusFilter !== 'all' && job.status !== statusFilter) return false;
    if (
      searchQuery &&
      !job.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  async function handleToggle(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setConfirmConfig({
      isOpen: true,
      title: currentStatus === 'ACTIVE' ? 'Pause Cron Job' : 'Resume Cron Job',
      message: `Are you sure you want to ${newStatus === 'ACTIVE' ? 'resume' : 'pause'} this job?`,
      confirmText: currentStatus === 'ACTIVE' ? 'Pause' : 'Resume',
      confirmButtonClass: 'bg-white text-black hover:bg-neutral-200',
      action: async () => {
        try {
          await updateJob.mutateAsync({
            id,
            data: { status: newStatus } as any,
          });
          addToast({
            type: 'success',
            message: `Job ${newStatus === 'ACTIVE' ? 'activated' : 'paused'}`,
          });
        } catch {
          addToast({ type: 'error', message: 'Failed to update job status' });
        }
      },
    });
  }

  async function handleDelete(id: string) {
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
        } catch {
          addToast({ type: 'error', message: 'Failed to delete job' });
        }
      },
    });
  }

  if (isLoading) return <PageLoader />;

  if (error) {
    return (
      <div className="w-full h-screen bg-neutral-950">
        <div className="border-b px-4 py-4 border-neutral-800">
          <h1 className="text-[20px] -tracking-[1px] text-white">Cron Jobs</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-[13px] text-neutral-500">Failed to load jobs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto bg-neutral-950">
      <div className="border-b px-4 py-3 bg-neutral-900/50 border-neutral-800 flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px] text-white">Cron jobs</h1>
      </div>

      <div className="px-6 py-6 pb-4 border-b border-neutral-800">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-[13px] font-medium text-white">
                <FiLayout size={14} />
                Overview
              </button>
              <div className="w-[1px] h-4 bg-neutral-700 mx-1" />
              <Link href="/jobs/new">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 text-[13px] font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                  <FiPlusCircle size={14} />
                  ADD
                </button>
              </Link>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 text-[13px] font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                  <FiFilter size={14} />
                  Filters
                </button>
                <button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 text-[13px] font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <FiRefreshCw size={14} />
                  Refresh
                </button>
                <span className="text-[12px] text-neutral-400 font-medium border border-neutral-700 px-3 py-1.5">
                  Total job {filteredJobs?.length ?? 0}{' '}
                  {(filteredJobs?.length ?? 0) !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 border border-neutral-700 bg-neutral-900 px-3 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="text-[12px] text-white outline-none w-64 transition placeholder:text-neutral-500"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {!filteredJobs?.length ? (
          <div className="border border-dashed border-neutral-700 py-16 flex flex-col items-center justify-center">
            <FiClock className="text-neutral-600 mb-3" size={28} />
            <p className="text-[14px] text-neutral-500">No cron jobs found</p>
            <p className="text-[12px] text-neutral-600 mt-1">
              Create your first job to get started
            </p>
            <Link href="/jobs/new">
              <button className="mt-4 border border-white px-4 py-2 text-[12px] text-white hover:bg-white hover:text-black transition flex items-center gap-1">
                <IoAdd size={16} />
                Create job
              </button>
            </Link>
          </div>
        ) : (
          <div className="border border-neutral-800">
            <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-900/50 border-b border-neutral-800 text-[12px] font-medium text-neutral-400">
              <div className="col-span-3">Title</div>
              <div className="col-span-3">URL</div>
              <div className="col-span-1">Method</div>
              <div className="col-span-2">Schedule</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="grid grid-cols-12 items-center px-4 py-3.5 border-b border-neutral-800/50 last:border-0 hover:bg-neutral-900/30 transition"
              >
                <div className="col-span-3">
                  <Link href={`/jobs/${job.id}`}>
                    <p className="text-[13px] font-medium text-white truncate hover:underline">
                      {job.name}
                    </p>
                  </Link>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    {job.type}
                  </p>
                </div>
                <div className="col-span-3">
                  <a
                    href={job.endpoint}
                    className="text-[11px] text-blue-400 truncate flex items-center gap-1"
                  >
                    {job.endpoint}
                    <FiExternalLink size={10} className="shrink-0" />
                  </a>
                </div>
                <div className="col-span-1">
                  <span className="text-[11px] font-mono font-medium text-neutral-400 bg-neutral-800 px-1.5 py-0.5">
                    {job.method}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-mono text-neutral-400">
                    {job.schedule || '—'}
                  </p>
                </div>
                <div className="col-span-1">
                  <StatusBadge
                    status={
                      job.status === 'ACTIVE'
                        ? 'active'
                        : job.status === 'PAUSED'
                          ? 'paused'
                          : 'failed'
                    }
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-1">
                  <button
                    onClick={() => handleToggle(job.id, job.status)}
                    title={job.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                    className={`p-1.5 border transition ${job.status === 'ACTIVE' ? 'border-neutral-700 text-neutral-400 hover:text-amber-400 hover:border-amber-500/50' : 'border-neutral-700 text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/50'}`}
                  >
                    {job.status === 'ACTIVE' ? (
                      <FiPause size={12} />
                    ) : (
                      <FiPlay size={12} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    title="Delete"
                    className="p-1.5 border border-neutral-700 text-neutral-400 hover:text-red-400 hover:border-red-500/50 transition"
                  >
                    <FiTrash2 size={12} />
                  </button>
                  <Link href={`/jobs/${job.id}`}>
                    <button
                      title="Details"
                      className="p-1.5 border border-neutral-700 text-neutral-400 hover:text-white hover:border-white/50 transition"
                    >
                      <FiMoreVertical size={12} />
                    </button>
                  </Link>
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

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center bg-neutral-950">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
