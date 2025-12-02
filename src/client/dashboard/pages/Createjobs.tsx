'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { useCreateCronJob } from '@/client/dashboard/hooks/useCronJobs';
import { useSession } from 'next-auth/react';
import PageLoader from '../components/PageLoader';
import { cronJobFormSchema, HTTP_METHODS, TIMEZONES } from '@/client/dashboard/validation/cronjob.schema';
import CronExpressionInput from '../components/CronExpressionInput';
import { useUIStore } from '@/client/dashboard/stores/uiStore';

type TabType = 'params' | 'headers' | 'body' | 'schedule';

export default function CreateJobs() {
  const router = useRouter();
  const { status } = useSession();
  const createJob = useCreateCronJob();
  const addToast = useUIStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<TabType>('params');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    method: 'GET' as string,
    headers: '',
    body: '',
    cronExpression: '',
    timezone: 'UTC',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (status === 'loading') {
    return <PageLoader />;
  }

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = cronJobFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      const payload = {
        ...result.data,
        headers: result.data.headers ? JSON.parse(result.data.headers) : undefined,
        body: result.data.body || undefined,
      };

      await createJob.mutateAsync(payload);
      addToast({ type: 'success', message: 'Cron job created successfully!' });
      router.push('/dashboard/cronjobs');
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create job',
      });
    }
  }

  return (
    <div className="w-full h-screen overflow-y-auto bg-white">
      {/* Header */}
      <div className="border-b px-6 py-4 border-[#E5E5E5] flex items-center gap-3">
        <h1 className="text-[20px] -tracking-[1px]">Schedule New Job</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-73px)]">
        {/* URL Bar Section */}
        <div className="border-b border-[#E5E5E5] px-6 py-4">
          <div className="flex gap-3 items-start">
            {/* Method Dropdown */}
            <div className="w-32">
              <select
                value={formData.method}
                onChange={(e) => updateField('method', e.target.value)}
                className="w-full border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] text-[#171717] outline-none focus:border-[#171717] transition rounded"
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* URL Input */}
            <div className="flex-1">
              <input
                type="url"
                value={formData.url}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="Enter URL or paste text"
                className={`w-full border bg-white px-3 py-2.5 text-[13px] text-[#171717] outline-none transition placeholder:text-neutral-400 rounded ${
                  errors.url ? 'border-red-300' : 'border-[#E5E5E5] focus:border-[#171717]'
                }`}
              />
              {errors.url && <p className="mt-1 text-[11px] text-red-500">{errors.url}</p>}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={createJob.isPending}
              className="bg-[#FF6C37] text-white px-8 py-2.5 text-[13px] font-medium hover:bg-[#FF5722] transition disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              {createJob.isPending ? 'Creating...' : 'Send'}
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-[#E5E5E5] px-6">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('params')}
              className={`py-3 text-[13px] font-medium border-b-2 transition ${
                activeTab === 'params' ? 'border-[#FF6C37] text-[#171717]' : 'border-transparent text-neutral-500 hover:text-[#171717]'
              }`}
            >
              Params
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('headers')}
              className={`py-3 text-[13px] font-medium border-b-2 transition ${
                activeTab === 'headers' ? 'border-[#FF6C37] text-[#171717]' : 'border-transparent text-neutral-500 hover:text-[#171717]'
              }`}
            >
              Headers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('body')}
              className={`py-3 text-[13px] font-medium border-b-2 transition ${activeTab === 'body' ? 'border-[#FF6C37] text-[#171717]' : 'border-transparent text-neutral-500 hover:text-[#171717]'}`}
            >
              Body
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className={`py-3 text-[13px] font-medium border-b-2 transition ${
                activeTab === 'schedule' ? 'border-[#FF6C37] text-[#171717]' : 'border-transparent text-neutral-500 hover:text-[#171717]'
              }`}
            >
              Schedule
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Params Tab */}
          {activeTab === 'params' && (
            <div className="max-w-4xl">
              <div className="mb-6">
                <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g. Ping Health Check"
                  className={`w-full border bg-white px-3 py-2 text-[13px] text-[#171717] outline-none transition placeholder:text-neutral-300 rounded ${
                    errors.title ? 'border-red-300' : 'border-[#E5E5E5] focus:border-[#171717]'
                  }`}
                />
                {errors.title && <p className="mt-1 text-[11px] text-red-500">{errors.title}</p>}
              </div>

              <div className="bg-neutral-50 rounded p-4">
                <p className="text-[12px] text-neutral-500">Query parameters will be automatically extracted from the URL above.</p>
              </div>
            </div>
          )}

          {/* Headers Tab */}
          {activeTab === 'headers' && (
            <div className="max-w-4xl">
              <div className="mb-2">
                <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">
                  Headers <span className="text-neutral-400">(JSON format)</span>
                </label>
                <textarea
                  value={formData.headers}
                  onChange={(e) => updateField('headers', e.target.value)}
                  placeholder={'{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer ..."\n}'}
                  rows={12}
                  className={`w-full border bg-white px-3 py-2 font-mono text-[12px] text-[#171717] outline-none transition placeholder:text-neutral-300 resize-none rounded ${
                    errors.headers ? 'border-red-300' : 'border-[#E5E5E5] focus:border-[#171717]'
                  }`}
                />
                {errors.headers && <p className="mt-1 text-[11px] text-red-500">{errors.headers}</p>}
              </div>
            </div>
          )}

          {/* Body Tab */}
          {activeTab === 'body' && (
            <div className="max-w-4xl">
              {['POST', 'PUT', 'PATCH'].includes(formData.method) ? (
                <div className="mb-2">
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">
                    Request Body <span className="text-neutral-400">(JSON format)</span>
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => updateField('body', e.target.value)}
                    placeholder={'{\n  "key": "value"\n}'}
                    rows={12}
                    className="w-full border border-[#E5E5E5] bg-white px-3 py-2 font-mono text-[12px] text-[#171717] outline-none transition placeholder:text-neutral-300 resize-none focus:border-[#171717] rounded"
                  />
                </div>
              ) : (
                <div className="bg-neutral-50 rounded p-4">
                  <p className="text-[12px] text-neutral-500">Request body is only available for POST, PUT, and PATCH methods. Current method: {formData.method}</p>
                </div>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="max-w-2xl space-y-6">
              <CronExpressionInput value={formData.cronExpression} onChange={(val) => updateField('cronExpression', val)} error={errors.cronExpression} />

              <div>
                <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => updateField('timezone', e.target.value)}
                  className="w-full border border-[#E5E5E5] bg-white px-3 py-2 text-[13px] text-[#171717] outline-none focus:border-[#171717] transition rounded"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#E5E5E5] px-6 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-[#E5E5E5] px-6 py-2.5 text-[13px] text-neutral-500 hover:border-[#171717] hover:text-[#171717] transition rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
