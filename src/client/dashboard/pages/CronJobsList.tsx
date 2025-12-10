'use client';

import React from 'react';
import Link from 'next/link';
import { IoAdd } from 'react-icons/io5';
import {
  FiPlay,
  FiPause,
  FiTrash2,
  FiExternalLink,
  FiMoreVertical,
  FiClock,
  FiLayout,
  FiSearch,
  FiList,
  FiCheckSquare,
  FiInfo,
  FiChevronDown,
  FiFilter,
  FiRefreshCw,
  FiPlusCircle,
} from 'react-icons/fi';
import { useCronJobs, useDeleteCronJob, useUpdateCronJob, useTriggerCronJob } from '@/client/dashboard/hooks/useCronJobs';
import { useJobStore } from '@/client/dashboard/stores/jobStore';
import { useUIStore } from '@/client/dashboard/stores/uiStore';
import StatusBadge from '../components/StatusBadge';
import PageLoader from '../components/PageLoader';

export default function CronJobsList() {
  const { data: jobs, isLoading, error } = useCronJobs();
  const deleteJob = useDeleteCronJob();
  const updateJob = useUpdateCronJob();
  const triggerJob = useTriggerCronJob();
  const addToast = useUIStore((s) => s.addToast);
  const { statusFilter, setStatusFilter, searchQuery, setSearchQuery } = useJobStore();

  const filteredJobs = jobs?.filter((job) => {
    if (statusFilter !== 'all' && job.status !== statusFilter) return false;
    if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  async function handleToggle(id: string, currentStatus: string) {
    try {
      await updateJob.mutateAsync({
        id,
        status: currentStatus === 'active' ? 'paused' : 'active',
      });
      addToast({
        type: 'success',
        message: `Job ${currentStatus === 'active' ? 'paused' : 'activated'}`,
      });
    } catch {
      addToast({ type: 'error', message: 'Failed to update job status' });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this cron job?')) return;
    try {
      await deleteJob.mutateAsync(id);
      addToast({ type: 'success', message: 'Job deleted' });
    } catch {
      addToast({ type: 'error', message: 'Failed to delete job' });
    }
  }

  async function handleTrigger(id: string) {
    try {
      addToast({ type: 'info', message: 'Triggering job...' });
      await triggerJob.mutateAsync(id);
      addToast({ type: 'success', message: 'Job triggered successfully!' });
    } catch {
      addToast({ type: 'error', message: 'Failed to trigger job' });
    }
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="w-full h-screen">
        <div className="border-b px-4 py-4 border-[#E5E5E5]">
          <h1 className="text-[20px] -tracking-[1px]">Cron Jobs</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-[13px] text-neutral-400">Failed to load jobs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="border-b px-4 py-3 mt-1 bg-[#FAFAFA] border-[#DDDDDD] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px]">Cron jobs</h1>
      
      </div>
      {/* Header */}
      <div className="px-6 py-6 pb-4 border-b border-[#E5E5E5] bg-white">
        <div className="flex items-start justify-between">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Buttons Row */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[1px] text-[13px] font-medium text-[#111827]">
                <FiLayout className="text-[#52525b]" />
                Overview
              </button>

              <div className="w-[1px] h-4 bg-[#E4E4E7] mx-1"></div>

              <Link href="/dashboard/create">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E4E4E7] rounded-[1px] text-[13px] font-medium text-[#52525b] hover:bg-[#F4F4F5] transition-colors">
                  <FiPlusCircle className="text-[#52525b]" size={14} />
                  ADD
                </button>
              </Link>

              <div className="flex flex-col items-end gap-4">
                {/* Date Dropdown */}
                <button className="flex items-center gap-3 px-3 py-1.5 border border-[#E4E4E7]  rounded-[1px] text-[13px] font-medium text-[#111827] hover:bg-[#E4E4E7] transition-colors">
                  <span className="bg-[#E4E4E7] text-[#52525b] px-1 rounded-sm text-[11px]">90d</span>
                  Past 90 days
                  <FiChevronDown className="text-[#52525b]" />
                </button>

                {/* Right Buttons Row */}
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E4E4E7] rounded-[1px] text-[13px] font-medium text-[#52525b] hover:bg-[#F4F4F5] transition-colors">
                  <FiFilter className="text-[#52525b]" size={14} />
                  Filters
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E4E4E7] rounded-[1px] text-[13px] font-medium text-[#52525b] hover:bg-[#F4F4F5] transition-colors">
                  <FiRefreshCw className="text-[#52525b]" size={14} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
        </div>
      </div>

      {/* Filters (Existing functionality, slightly restyled to fit below) */}
      <div className="border-b border-[#E5E5E5] px-6 py-3 flex items-center justify-between ">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs..."
            className="border border-[#E5E5E5] bg-white px-3 py-1.5 text-[12px] text-[#171717] rounded-[1px] outline-none w-124  transition placeholder:text-neutral-400"
          />
        </div>
        <span className="text-[12px] text-neutral-400 font-medium">
          {filteredJobs?.length ?? 0} job{(filteredJobs?.length ?? 0) !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Jobs List */}
      <div className="px-4 py-4">
        {!filteredJobs?.length ? (
          <div className="border border-dashed border-[#E5E5E5] py-16 flex flex-col items-center justify-center">
            <FiClock className="text-neutral-300 mb-3" size={28} />
            <p className="text-[14px] text-neutral-400">No cron jobs found</p>
            <p className="text-[12px] text-neutral-300 mt-1">Create your first job to get started</p>
            <Link href="/dashboard/create">
              <button className="mt-4 border border-[#171717] px-4 py-2 text-[12px] text-[#171717] hover:bg-[#171717] hover:text-white transition flex items-center gap-1">
                <IoAdd size={16} />
                Create job
              </button>
            </Link>
          </div>
        ) : (
          <div className="border border-[#E5E5E5]">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E5E5E5] text-[10px] font-medium uppercase text-black/90">
              <div className="col-span-3">Title</div>
              <div className="col-span-3">URL</div>
              <div className="col-span-1">Method</div>
              <div className="col-span-2">Schedule</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filteredJobs.map((job) => (
              <div className="grid grid-cols-12 items-center  px-4 py-3.5 border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition">
                <div className="col-span-3 ">
                  <Link href={`/dashboard/cronjobs/${job.id}`}>
                    <p className="text-[13px] font-medium text-[#171717] truncate hover:underline">{job.title}</p>
                  </Link>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{job._count.executions} executions</p>
                </div>
                <div className="col-span-3">
                  <a href={job.url} className="text-[11px] text-blue-500 truncate flex items-center gap-1">
                    {job.url}
                    <FiExternalLink size={10} className="shrink-0" />
                  </a>
                </div>
                <div className="col-span-1">
                  <span className="text-[11px] font-mono font-medium text-neutral-500 bg-[#F5F5F5] px-1.5 py-0.5">{job.method}</span>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-mono text-neutral-500">{job.cronExpression}</p>
                  <p className="text-[9px] text-neutral-300">{job.timezone}</p>
                </div>
                <div className="col-span-1">
                  <StatusBadge status={job.status} />
                </div>
                <div className="col-span-2 flex justify-end gap-1">
                  <button
                    onClick={() => handleTrigger(job.id)}
                    disabled={triggerJob.isPending}
                    title="Trigger now"
                    className="p-1.5 border border-[#E5E5E5] text-black/80 hover:text-[#171717] hover:border-[#171717] transition disabled:opacity-50"
                  >
                    <FiPlay size={12} />
                  </button>
                  <button
                    onClick={() => handleToggle(job.id, job.status)}
                    title={job.status === 'active' ? 'Pause' : 'Resume'}
                    className="p-1.5 border border-[#E5E5E5] text-black/80 hover:text-amber-500 hover:border-amber-300 transition"
                  >
                    <FiPause size={12} />
                  </button>
                  <button onClick={() => handleDelete(job.id)} title="Delete" className="p-1.5 border border-[#E5E5E5] text-black/80 hover:text-red-500 hover:border-red-300 transition">
                    <FiTrash2 size={12} />
                  </button>
                  <Link href={`/dashboard/cronjobs/${job.id}`}>
                    <button title="Details" className="p-1.5 border border-[#E5E5E5] text-black/80 hover:text-[#171717] hover:border-[#171717] transition">
                      <FiMoreVertical size={12} />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
