'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateJob } from '@/modules/jobs';
import { useUIStore } from '@/shared/stores/uiStore';
import PageLoader from '@/shared/components/page-loader';
import CronExpressionInput from '@/shared/components/cron-expression-input';
import {
  createJobSchema,
  type CreateJobFormData,
} from '@/modules/jobs/schemas/job.schema';
import { FiSave, FiChevronDown } from 'react-icons/fi';

type Tab = 'Headers' | 'Body' | 'Schedule' | 'Settings';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

export default function CreateJobs() {
  const router = useRouter();
  const createJob = useCreateJob();
  const addToast = useUIStore((s) => s.addToast);

  const [activeTab, setActiveTab] = useState<Tab>('Schedule');
  const [formData, setFormData] = useState({
    name: '',
    endpoint: '',
    method: 'GET' as string,
    headers: '',
    body: '',
    schedule: '',
    timezone: 'UTC',
    type: 'CRON' as 'CRON' | 'EVENT',
    retryCount: 0,
    retryDelay: 10,
    timeout: 30,
    failureEmail: false,
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

    try {
      const headerObj: Record<string, string> = {};
      if (formData.headers) {
        try {
          Object.assign(headerObj, JSON.parse(formData.headers));
        } catch {
          setErrors({ headers: 'Invalid JSON' });
          addToast({ type: 'error', message: 'Invalid headers JSON' });
          return;
        }
      }

      let bodyObj: Record<string, unknown> | undefined;
      if (formData.body) {
        try {
          bodyObj = JSON.parse(formData.body);
        } catch {
          setErrors({ body: 'Invalid JSON' });
          addToast({ type: 'error', message: 'Invalid body JSON' });
          return;
        }
      }

      const payload = {
        name: formData.name || 'Untitled job',
        type: formData.type as 'CRON' | 'EVENT',
        workspaceId: 'default',
        endpoint: formData.endpoint,
        method: formData.method,
        headers: headerObj,
        body: bodyObj,
        schedule: formData.schedule || undefined,
        retryCount: formData.retryCount,
        retryDelay: formData.retryDelay,
        timeout: formData.timeout,
        failureEmail: formData.failureEmail,
      };

      await createJob.mutateAsync(payload as any);
      addToast({ type: 'success', message: 'Cron job created successfully!' });
      router.push('/jobs');
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create job',
      });
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-green-600';
      case 'POST':
        return 'text-yellow-600';
      case 'PUT':
        return 'text-blue-600';
      case 'PATCH':
        return 'text-purple-600';
      case 'DELETE':
        return 'text-red-600';
      default:
        return 'text-neutral-500';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white text-[#171717]">
      <div className="border-b px-4 py-3 bg-[#FAFAFA] border-[#DDDDDD] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px]">Schedule New Job</h1>
      </div>

      <div className="flex items-center justify-between px-4 py-2 p-3">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Untitled job"
            className="text-[14px] font-medium text-[#171717] outline-none placeholder:text-neutral-400 w-full border px-3 py-2 border-[#E5E5E5]"
          />
          {errors.name && (
            <span className="text-[11px] text-red-500">{errors.name}</span>
          )}
        </div>
      </div>

      <div className="p-4 flex gap-2">
        <div className="flex bg-white border border-[#E5E5E5] overflow-hidden flex-1">
          <div className="relative">
            <select
              value={formData.method}
              onChange={(e) => updateField('method', e.target.value)}
              className={`appearance-none bg-transparent pl-4 pr-8 py-2 text-[13px] font-semibold outline-none cursor-pointer border-r border-[#E5E5E5] ${getMethodColor(formData.method)}`}
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m} className="bg-white text-[#171717]">
                  {m}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-neutral-500" />
          </div>

          <input
            type="url"
            value={formData.endpoint}
            onChange={(e) => updateField('endpoint', e.target.value)}
            placeholder="Enter URL or paste text"
            className="flex-1 bg-transparent px-4 text-[13px] text-[#171717] outline-none placeholder:text-neutral-400"
          />
        </div>

        <button
          onClick={() => handleSubmit()}
          disabled={createJob.isPending}
          className="bg-black text-white px-6 text-[13px] font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createJob.isPending ? 'Creating...' : 'Create'}
        </button>
      </div>

      {errors.endpoint && (
        <div className="px-4 -mt-2 mb-2">
          <span className="text-[11px] text-red-500">{errors.endpoint}</span>
        </div>
      )}

      <div className="flex px-4 border-b border-[#E5E5E5] gap-6 text-[13px] font-medium">
        {(['Schedule', 'Headers', 'Body', 'Settings'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 relative transition ${activeTab === tab ? 'text-[#171717]' : 'text-neutral-500 hover:text-[#171717]'}`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007BFF]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'Schedule' && (
          <div className="space-y-4">
            <h3 className="text-[13px] font-medium text-[#171717] mb-2">
              Cron Schedule
            </h3>
            <div className="bg-white border border-[#E5E5E5] p-4">
              <CronExpressionInput
                value={formData.schedule}
                onChange={(val) => updateField('schedule', val)}
                error={errors.schedule}
              />
            </div>
          </div>
        )}

        {activeTab === 'Headers' && (
          <div className="flex flex-col h-full">
            <h3 className="text-[13px] font-medium text-[#171717] mb-2">
              Request Headers (JSON)
            </h3>
            <textarea
              value={formData.headers}
              onChange={(e) => updateField('headers', e.target.value)}
              placeholder='{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer ..."\n}'
              className="flex-1 min-h-[200px] w-full bg-white border border-[#E5E5E5] p-4 font-mono text-[13px] text-[#171717] outline-none resize-none focus:border-[#171717] transition placeholder:text-neutral-400"
            />
            {errors.headers && (
              <p className="mt-1 text-[12px] text-red-500">{errors.headers}</p>
            )}
          </div>
        )}

        {activeTab === 'Body' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <input
                  type="radio"
                  id="raw"
                  name="bodyType"
                  checked
                  readOnly
                  className="accent-[#007BFF]"
                />
                <label
                  htmlFor="raw"
                  className="text-[13px] cursor-pointer text-[#171717]"
                >
                  raw
                </label>
              </div>
              <div className="text-[13px] text-[#007BFF] cursor-pointer px-2 py-0.5 hover:bg-neutral-100 transition">
                JSON
              </div>
            </div>

            <textarea
              value={formData.body}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder='{\n  "key": "value"\n}'
              disabled={['GET', 'DELETE'].includes(formData.method)}
              className="flex-1 min-h-[200px] w-full bg-white border border-[#E5E5E5] p-4 font-mono text-[13px] text-[#171717] outline-none resize-none focus:border-[#171717] transition disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-neutral-400"
            />
            {['GET', 'DELETE'].includes(formData.method) && (
              <p className="mt-2 text-[12px] text-neutral-500">
                Body is typically not sent with {formData.method} requests.
              </p>
            )}
            {errors.body && (
              <p className="mt-1 text-[12px] text-red-500">{errors.body}</p>
            )}
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="max-w-md">
            <h3 className="text-[13px] font-medium text-[#171717] mb-3">
              Execution Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] text-neutral-600 mb-1.5">
                  Timezone
                </label>
                <div className="relative">
                  <select
                    value={formData.timezone}
                    onChange={(e) => updateField('timezone', e.target.value)}
                    className="w-full appearance-none bg-white border border-[#E5E5E5] px-3 py-2.5 text-[13px] text-[#171717] outline-none focus:border-[#171717] transition"
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
