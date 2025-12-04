'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCronJob } from '@/client/dashboard/hooks/useCronJobs';
import { useSession } from 'next-auth/react';
import PageLoader from '../components/PageLoader';
import { cronJobFormSchema, HTTP_METHODS, TIMEZONES } from '@/client/dashboard/validation/cronjob.schema';
import CronExpressionInput from '../components/CronExpressionInput';
import { useUIStore } from '@/client/dashboard/stores/uiStore';
import { FiSave, FiShare2, FiChevronDown } from 'react-icons/fi';

type Tab = 'Headers' | 'Body' | 'Schedule' | 'Settings';

export default function CreateJobs() {
  const router = useRouter();
  const { status } = useSession();
  const createJob = useCreateCronJob();
  const addToast = useUIStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<Tab>('Schedule');

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

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

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
      addToast({ type: 'error', message: 'Please fix the errors in the form.' });
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

  if (status === 'loading') {
    return <PageLoader />;
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-green-500';
      case 'POST':
        return 'text-yellow-500';
      case 'PUT':
        return 'text-blue-500';
      case 'PATCH':
        return 'text-purple-500';
      case 'DELETE':
        return 'text-red-500';
      default:
        return 'text-neutral-400';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1E1E1E] text-neutral-300 font-sans">
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-[#3E3E3E]">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-[#3E3E3E] text-white text-[10px] font-bold">CR</div>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Untitled Request"
            className="bg-transparent text-[14px] font-medium text-white outline-none placeholder:text-neutral-500 w-full max-w-sm"
          />
          {errors.title && <span className="text-[11px] text-red-500">{errors.title}</span>}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-neutral-300 hover:bg-[#3E3E3E] rounded transition">
            <FiSave className="w-4 h-4" /> Save
          </button>
          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-neutral-300 hover:bg-[#3E3E3E] rounded transition">
            <FiShare2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>

      {/* Main Request Bar */}
      <div className="p-4 flex gap-2">
        <div className="flex bg-[#2D2D2D] border border-[#3E3E3E] rounded-md overflow-hidden flex-1 group focus-within:border-[#5E5E5E] transition">
          <div className="relative">
            <select
              value={formData.method}
              onChange={(e) => updateField('method', e.target.value)}
              className={`appearance-none bg-transparent pl-4 pr-8 py-2.5 text-[13px] font-semibold outline-none cursor-pointer border-r border-[#3E3E3E] ${getMethodColor(formData.method)}`}
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m} className="bg-[#2D2D2D] text-white">
                  {m}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-neutral-500" />
          </div>

          <input
            type="url"
            value={formData.url}
            onChange={(e) => updateField('url', e.target.value)}
            placeholder="Enter URL or paste text"
            className="flex-1 bg-transparent px-4 py-2.5 text-[13px] text-white outline-none placeholder:text-neutral-500"
          />
        </div>

        <button
          onClick={() => handleSubmit()}
          disabled={createJob.isPending}
          className="bg-[#007BFF] hover:bg-[#0069D9] text-white px-6 py-2.5 rounded-md text-[13px] font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createJob.isPending ? 'Sending...' : 'Send'}
          <span className="border-l border-white/20 pl-2 ml-1">
            <FiChevronDown className="w-4 h-4" />
          </span>
        </button>
      </div>
      {errors.url && (
        <div className="px-4 -mt-2 mb-2">
          <span className="text-[11px] text-red-500">{errors.url}</span>
        </div>
      )}

      {/* Configuration Tabs */}
      <div className="flex px-4 border-b border-[#3E3E3E] gap-6 text-[13px] font-medium">
        {(['Schedule', 'Headers', 'Body', 'Settings'] as Tab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 relative transition ${activeTab === tab ? 'text-white' : 'text-neutral-400 hover:text-neutral-300'}`}>
            {tab}
            {tab === 'Headers' && formData.headers.length > 5 && <span className="ml-1.5 text-[10px] text-green-500">•</span>}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007BFF]" />}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* SCHEDULE TAB */}
        {activeTab === 'Schedule' && (
          <div className="max-w-2xl space-y-4">
            <h3 className="text-[13px] font-medium text-white mb-2">Cron Schedule</h3>
            <div className="bg-[#2D2D2D] border border-[#3E3E3E] rounded-md p-4">
              <CronExpressionInput value={formData.cronExpression} onChange={(val) => updateField('cronExpression', val)} error={errors.cronExpression} />
            </div>
            {errors.cronExpression && <p className="mt-1 text-[12px] text-red-500">{errors.cronExpression}</p>}
          </div>
        )}

        {/* HEADERS TAB */}
        {activeTab === 'Headers' && (
          <div className="flex flex-col h-full max-w-3xl">
            <h3 className="text-[13px] font-medium text-white mb-2">Request Headers (JSON)</h3>
            <textarea
              value={formData.headers}
              onChange={(e) => updateField('headers', e.target.value)}
              placeholder='{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer ..."\n}'
              className="flex-1 min-h-[200px] w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md p-4 font-mono text-[13px] text-white outline-none resize-none focus:border-[#5E5E5E] transition placeholder:text-neutral-600"
            />
            {errors.headers && <p className="mt-1 text-[12px] text-red-500">{errors.headers}</p>}
          </div>
        )}

        {/* BODY TAB */}
        {activeTab === 'Body' && (
          <div className="flex flex-col h-full max-w-3xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <input type="radio" id="raw" name="bodyType" checked readOnly className="accent-[#007BFF]" />
                <label htmlFor="raw" className="text-[13px] cursor-pointer">
                  raw
                </label>
              </div>
              <div className="text-[13px] text-[#007BFF] cursor-pointer px-2 py-0.5 rounded hover:bg-[#3E3E3E] transition">JSON</div>
            </div>

            <textarea
              value={formData.body}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder='{\n  "key": "value"\n}'
              disabled={['GET', 'DELETE'].includes(formData.method)}
              className="flex-1 min-h-[200px] w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md p-4 font-mono text-[13px] text-white outline-none resize-none focus:border-[#5E5E5E] transition disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-neutral-600"
            />
            {['GET', 'DELETE'].includes(formData.method) && <p className="mt-2 text-[12px] text-neutral-500">Body is typically not sent with {formData.method} requests.</p>}
            {errors.body && <p className="mt-1 text-[12px] text-red-500">{errors.body}</p>}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'Settings' && (
          <div className="max-w-md">
            <h3 className="text-[13px] font-medium text-white mb-3">Execution Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[12px] text-neutral-400 mb-1.5">Timezone</label>
                <div className="relative">
                  <select
                    value={formData.timezone}
                    onChange={(e) => updateField('timezone', e.target.value)}
                    className="w-full appearance-none bg-[#2D2D2D] border border-[#3E3E3E] rounded-md px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#5E5E5E] transition"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-neutral-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
