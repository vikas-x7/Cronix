'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateJob, JobForm } from '@/modules/jobs';
import { useWorkspaces } from '@/modules/workspaces';
import PageHeader from '@/shared/layout/page-header';
import type { CreateJobFormData } from '@/modules/jobs/schemas/job.schema';
import type { Job } from '@/modules/jobs';

export default function NewJobPage() {
  const router = useRouter();
  const createMutation = useCreateJob();
  const { data: workspaces } = useWorkspaces();
  const [createdJob, setCreatedJob] = useState<Job | null>(null);

  const handleSubmit = (
    data: CreateJobFormData,
    headers: { key: string; value: string }[],
  ) => {
    const headerObj: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.key) headerObj[h.key] = h.value;
    });

    let bodyObj: Record<string, unknown> | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(data.method)) {
      try {
        bodyObj = data.body ? JSON.parse(data.body) : {};
      } catch {
        bodyObj = {};
      }
    }

    const payload = {
      ...data,
      headers: headerObj,
      body: bodyObj,
      schedule: data.type === 'CRON' ? data.schedule : undefined,
    };

    createMutation.mutate(payload, {
      onSuccess: (job) => {
        if (job.type === 'EVENT') {
          setCreatedJob(job);
        } else {
          router.push('/jobs');
        }
      },
    });
  };

  return (
    <div>
      <PageHeader title="Create Job" />

      <JobForm
        workspaces={(workspaces ?? []).map((ws) => ({
          id: ws.id,
          name: ws.name,
        }))}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending}
        createdJob={createdJob ?? undefined}
      />

      {createdJob && (
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/jobs')}
            className="cursor-pointer rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to Jobs
          </button>
        </div>
      )}
    </div>
  );
}
