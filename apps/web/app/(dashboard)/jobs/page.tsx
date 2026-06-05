'use client';

import React, { Suspense, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  FiPause,
  FiPlay,
  FiTrash2,
  FiExternalLink,
  FiMoreVertical,
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useJobs, useDeleteJob, useUpdateJob } from '@/modules/jobs';
import { useWorkspaces } from '@/modules/workspaces';
import { useJobStore } from '@/shared/stores/jobStore';
import { useUIStore } from '@/shared/stores/uiStore';
import StatusBadge from '@/shared/components/status-badge';
import PageLoader from '@/shared/components/page-loader';
import ConfirmationModal from '@/shared/components/confirmation-modal';

function JobsPageContent() {
  const { data: jobs, isLoading, isFetching, error, refetch } = useJobs();
  const { data: workspaces } = useWorkspaces();
  const deleteJob = useDeleteJob();
  const updateJob = useUpdateJob();
  const addToast = useUIStore((s) => s.addToast);
  const { statusFilter, workspaceFilter, searchQuery, setSearchQuery } =
    useJobStore();

  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [workspaceFilterOpen, setWorkspaceFilterOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const workspaceDropdownRef = useRef<HTMLDivElement>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      )
        setStatusFilterOpen(false);
      if (
        workspaceDropdownRef.current &&
        !workspaceDropdownRef.current.contains(e.target as Node)
      )
        setWorkspaceFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    if (workspaceFilter !== 'all' && job.workspace?.id !== workspaceFilter)
      return false;
    if (
      searchQuery &&
      !job.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const selectedWorkspaceName =
    workspaceFilter === 'all'
      ? 'All Workspaces'
      : (workspaces?.find((w) => w.id === workspaceFilter)?.name ??
        'All Workspaces');

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
      <div className="w-full h-screen bg-[#0D0D0D]">
        <div className="py-3 bg-[#0D0D0D]">
          <h1 className="text-[20px] tracking-[-1px] text-white">Cron Jobs</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-[13px] text-neutral-500">Failed to load jobs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[#0D0D0D] overflow-hidden">
      <div className="py-3 px-0 bg-[#0D0D0D] shrink-0">
        <h1 className="text-[20px] tracking-[-1px] text-white">Cron Jobs</h1>
      </div>

      <div className="bg-[#1F1F1F] rounded-[10px] flex flex-col flex-1 min-h-0">
        <div className="p-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative" ref={statusDropdownRef}>
              <button
                onClick={() => setStatusFilterOpen(!statusFilterOpen)}
                className="flex items-center gap-2 px-2 p-0.75 border border-[#393939] text-[13px] rounded-[3px] font-light text-white/90 hover:bg-neutral-800 transition-colors cursor-pointer outline-none min-w-[120px]"
              >
                {statusFilter === 'all'
                  ? 'All Status'
                  : statusFilter === 'ACTIVE'
                    ? 'Active'
                    : statusFilter === 'PAUSED'
                      ? 'Paused'
                      : 'Failed'}
                <FiChevronDown
                  size={14}
                  className={`ml-auto transition-transform ${statusFilterOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {statusFilterOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-neutral-900 border border-[#393939] rounded-[3px] z-50 overflow-hidden">
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'ACTIVE', label: 'Active' },
                    { value: 'PAUSED', label: 'Paused' },
                    { value: 'FAILED', label: 'Failed' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        useJobStore.setState({ statusFilter: opt.value });
                        setStatusFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] font-light transition-colors cursor-pointer ${statusFilter === opt.value ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-neutral-800 hover:text-white'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" ref={workspaceDropdownRef}>
              <button
                onClick={() => setWorkspaceFilterOpen(!workspaceFilterOpen)}
                className="flex items-center gap-2 px-2 p-0.75 border border-[#393939] text-[13px] rounded-[3px] font-light text-white/90 hover:bg-neutral-800 transition-colors cursor-pointer outline-none min-w-[140px]"
              >
                {selectedWorkspaceName}
                <FiChevronDown
                  size={14}
                  className={`ml-auto transition-transform ${workspaceFilterOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {workspaceFilterOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-neutral-900 border border-[#393939] rounded-[3px] z-50 overflow-hidden max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      useJobStore.setState({ workspaceFilter: 'all' });
                      setWorkspaceFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[13px] font-light transition-colors cursor-pointer ${workspaceFilter === 'all' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-neutral-800 hover:text-white'}`}
                  >
                    All Workspaces
                  </button>
                  {workspaces?.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        useJobStore.setState({ workspaceFilter: ws.id });
                        setWorkspaceFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[13px] font-light transition-colors cursor-pointer ${workspaceFilter === ws.id ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-neutral-800 hover:text-white'}`}
                    >
                      {ws.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-3 p-0.75 border border-[#393939] text-[13px] rounded-[3px] font-light text-white/90 hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <FiRefreshCw
                className={isFetching ? 'animate-spin' : ''}
                size={14}
              />
              Refresh
            </button>
            <Link href="/jobs/new">
              <button className="flex items-center gap-2 px-3 p-0.75 border border-[#393939] text-[13px] rounded-[3px] font-light text-white/90 hover:bg-neutral-800 transition-colors cursor-pointer">
                + New Job
              </button>
            </Link>
            <div className="flex items-center gap-2 border border-[#393939] rounded-[3px] px-2 p-0.75 ml-auto">
              <FiSearch size={14} className="text-white/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="text-[13px] font-light text-white/90 outline-none w-60 transition placeholder:text-neutral-500"
              />
            </div>
          </div>
        </div>

        {!filteredJobs?.length ? (
          <div className="border border-dashed border-neutral-700 flex-1 py-20 flex flex-col items-center justify-center">
            <FiClock className="text-neutral-500 mb-2" size={24} />
            <p className="text-[16px] tracking-normal text-white">
              No cron jobs found
            </p>
            <p className="text-[12px] text-neutral-500 mt-1">
              Create a new job to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="px-5 bg-neutral-900/50 border-b border-neutral-800">
              <div className="grid grid-cols-12 py-2.5 text-[12px] text-white/90 shrink-0">
                <div className="col-span-2">Title</div>
                <div className="col-span-2">Workspace</div>
                <div className="col-span-2">URL</div>
                <div className="col-span-1">Method</div>
                <div className="col-span-2">Schedule</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
            </div>
            <div
              className="flex-1 overflow-y-auto slim-scrollbar min-h-0 relative"
              onMouseLeave={() => setHoveredRow(null)}
            >
              {isFetching
                ? Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="grid grid-cols-12 items-center py-3 border-b border-neutral-800/50 px-4"
                    >
                      <div className="col-span-2">
                        <div className="h-3 w-24 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                      <div className="col-span-2">
                        <div className="h-3 w-16 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                      <div className="col-span-2">
                        <div className="h-3 w-32 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                      <div className="col-span-1">
                        <div className="h-5 w-12 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                      <div className="col-span-2">
                        <div className="h-3 w-16 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                      <div className="col-span-1">
                        <div className="h-5 w-14 rounded-[3px] bg-neutral-800 animate-pulse" />
                      </div>
                      <div className="col-span-2">
                        <div className="h-5 w-16 rounded-[3px] bg-neutral-800 animate-pulse ml-auto" />
                      </div>
                    </div>
                  ))
                : filteredJobs.map((job, idx) => (
                    <div
                      key={job.id}
                      onMouseEnter={() => setHoveredRow(idx)}
                      className="grid grid-cols-12 items-center px-5 py-3 border-b border-neutral-800/50 last:border-0 cursor-pointer relative z-10"
                    >
                      {hoveredRow === idx && (
                        <motion.div
                          layoutId="job-hover"
                          className="absolute inset-0 bg-white/5 rounded-[3px] z-0"
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 35,
                            mass: 0.8,
                          }}
                        />
                      )}
                      <div className="col-span-2 relative z-10">
                        <Link href={`/jobs/${job.id}`}>
                          <p className="text-[13px] text-white/90 truncate hover:underline">
                            {job.name}
                          </p>
                        </Link>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {job.type}
                        </p>
                      </div>
                      <div className="col-span-2 relative z-10">
                        <span className="text-[12px] text-neutral-400 truncate block">
                          {job.workspace?.name ?? '—'}
                        </span>
                      </div>
                      <div className="col-span-2 relative z-10">
                        <a
                          href={job.endpoint}
                          className="text-[11px] text-blue-400 truncate flex items-center gap-1"
                        >
                          {job.endpoint}
                          <FiExternalLink size={10} className="shrink-0" />
                        </a>
                      </div>
                      <div className="col-span-1 relative z-10">
                        <span className="text-[11px] font-mono font-medium text-neutral-400 bg-neutral-800 px-1.5 py-0.5">
                          {job.method}
                        </span>
                      </div>
                      <div className="col-span-2 relative z-10">
                        <p className="text-[11px] font-mono text-neutral-400">
                          {job.schedule || '—'}
                        </p>
                      </div>
                      <div className="col-span-1 relative z-10">
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
                      <div className="col-span-2 flex justify-end gap-1 relative z-10">
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
        <div className="w-full h-screen flex items-center justify-center bg-[#0D0D0D]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
