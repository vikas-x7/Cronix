'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useJobs,
  useDeleteJob,
  usePauseJob,
  useResumeJob,
  useRunJob,
  JobTable,
} from '@/modules/jobs';
import { useWorkspaces } from '@/modules/workspaces';
import PageHeader from '@/shared/layout/page-header';

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workspaceFilter, setWorkspaceFilter] = useState(
    searchParams.get('workspaceId') || '',
  );
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: workspaces } = useWorkspaces();
  const {
    data: jobs,
    isLoading,
    isError,
    refetch,
  } = useJobs({
    workspaceId: workspaceFilter || undefined,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  });

  const deleteMutation = useDeleteJob();
  const pauseMutation = usePauseJob();
  const resumeMutation = useResumeJob();
  const runMutation = useRunJob();

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Jobs">
          <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
        </PageHeader>
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageHeader title="Jobs" />
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
          <p className="text-sm text-gray-500">Failed to load jobs</p>
          <button
            onClick={() => refetch()}
            className="mt-3 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Jobs">
        <button
          onClick={() => router.push('/jobs/new')}
          className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          New Job
        </button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={workspaceFilter}
          onChange={(e) => setWorkspaceFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
        >
          <option value="">All Workspaces</option>
          {workspaces?.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="FAILED">Failed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="CRON">CRON</option>
          <option value="EVENT">EVENT</option>
        </select>
      </div>

      <JobTable
        jobs={jobs ?? []}
        onPause={(id) => pauseMutation.mutate(id)}
        onResume={(id) => resumeMutation.mutate(id)}
        onRun={(id) => runMutation.mutate(id)}
        onDelete={(id) => setConfirmDelete(id)}
        isPending={
          pauseMutation.isPending ||
          resumeMutation.isPending ||
          runMutation.isPending
        }
      />

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmDelete(null);
          }}
        >
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">Delete Job?</h2>
            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(confirmDelete);
                  setConfirmDelete(null);
                }}
                disabled={deleteMutation.isPending}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
