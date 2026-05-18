'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useJob,
  useUpdateJob,
  usePauseJob,
  useResumeJob,
  useRunJob,
  useDeleteJob,
  JobStatusBadge,
  JobForm,
} from '@/modules/jobs';
import { useWorkspaces } from '@/modules/workspaces';
import PageHeader from '@/shared/layout/page-header';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: job, isLoading, isError } = useJob(id);
  const { data: workspaces } = useWorkspaces();
  const updateMutation = useUpdateJob();
  const pauseMutation = usePauseJob();
  const resumeMutation = useResumeJob();
  const runMutation = useRunJob();
  const deleteMutation = useDeleteJob();
  const [editMode, setEditMode] = useState(false);

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-100" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
        <p className="text-sm text-gray-500">Job not found</p>
        <button
          onClick={() => router.push('/jobs')}
          className="mt-3 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  if (editMode) {
    return (
      <div>
        <PageHeader title={`Edit: ${job.name}`} />
        <JobForm
          workspaces={(workspaces ?? []).map((ws) => ({
            id: ws.id,
            name: ws.name,
          }))}
          onSubmit={(data, headers) => {
            const headerObj: Record<string, string> = {};
            headers.forEach((h) => {
              if (h.key) headerObj[h.key] = h.value;
            });
            let bodyObj: Record<string, unknown> | undefined;
            try {
              bodyObj = data.body ? JSON.parse(data.body) : undefined;
            } catch {
              bodyObj = undefined;
            }
            updateMutation.mutate(
              { id, data: { ...data, headers: headerObj, body: bodyObj } },
              { onSuccess: () => setEditMode(false) },
            );
          }}
          isPending={updateMutation.isPending}
          initialData={job}
        />
        <div className="mt-4 text-center">
          <button
            onClick={() => setEditMode(false)}
            className="cursor-pointer rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const infoCards = [
    { label: 'Endpoint', value: job.endpoint },
    { label: 'Method', value: job.method },
    {
      label: 'Schedule',
      value: job.type === 'CRON' ? job.schedule || '—' : '—',
    },
    {
      label: 'Retry Policy',
      value: `${job.retryCount} attempts, ${job.retryDelay}s delay`,
    },
    { label: 'Timeout', value: `${job.timeout}s` },
    {
      label: 'Failure Email',
      value: job.failureEmail ? 'Enabled' : 'Disabled',
    },
  ];

  return (
    <div>
      <PageHeader title={job.name}>
        <div className="flex items-center gap-2">
          <JobStatusBadge status={job.status} />
          {job.status === 'ACTIVE' ? (
            <button
              onClick={() => pauseMutation.mutate(id)}
              disabled={pauseMutation.isPending}
              className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={() => resumeMutation.mutate(id)}
              disabled={resumeMutation.isPending}
              className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Resume
            </button>
          )}
          <button
            onClick={() => runMutation.mutate(id)}
            disabled={runMutation.isPending}
            className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Run Now
          </button>
          <button
            onClick={() => setEditMode(true)}
            className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => {
              deleteMutation.mutate(id);
              router.push('/jobs');
            }}
            disabled={deleteMutation.isPending}
            className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </PageHeader>

      {job.type === 'EVENT' && job.webhookUrl && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="mb-2 text-sm font-medium text-gray-700">Webhook URL</p>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
            <code className="flex-1 break-all text-sm text-gray-700">
              {job.webhookUrl}
            </code>
            <button
              onClick={() =>
                navigator.clipboard.writeText(job.webhookUrl || '')
              }
              className="shrink-0 cursor-pointer rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {infoCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {card.label}
            </p>
            <p className="mt-1 break-all text-sm font-medium text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Executions
          </h2>
          <Link
            href={`/jobs/${id}/executions`}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            View All
          </Link>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400 shadow-sm">
          <Link
            href={`/jobs/${id}/executions`}
            className="text-gray-500 hover:text-gray-700"
          >
            View execution history
          </Link>
        </div>
      </div>
    </div>
  );
}
