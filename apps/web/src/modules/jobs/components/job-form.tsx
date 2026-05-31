'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createJobSchema, type CreateJobFormData } from '../schemas/job.schema';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';
import type { Job } from '../types/job.types';

interface JobFormProps {
  workspaces: { id: string; name: string }[];
  onSubmit: (
    data: CreateJobFormData,
    headers: { key: string; value: string }[],
  ) => void;
  isPending: boolean;
  createdJob?: Job;
  initialData?: Job;
}

const CRON_PRESETS = [
  { label: 'Every 5 min', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily midnight', value: '0 0 * * *' },
  { label: 'Weekly Monday', value: '0 0 * * 1' },
];

export default function JobForm({
  workspaces,
  onSubmit,
  isPending,
  createdJob,
  initialData,
}: JobFormProps) {
  const [step, setStep] = useState(1);
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>(
    () => {
      if (initialData) {
        return Object.entries(initialData.headers || {}).map(
          ([key, value]) => ({
            key,
            value: String(value),
          }),
        );
      }
      return [];
    },
  );
  const [bodyText, setBodyText] = useState(() => {
    if (initialData?.body && Object.keys(initialData.body).length > 0) {
      return JSON.stringify(initialData.body, null, 2);
    }
    return '';
  });
  const [editMode] = useState(!!initialData);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          type: initialData.type,
          workspaceId: initialData.workspace.id,
          endpoint: initialData.endpoint,
          method: initialData.method as
            | 'GET'
            | 'POST'
            | 'PUT'
            | 'PATCH'
            | 'DELETE',
          schedule: initialData.schedule || undefined,
          retryCount: initialData.retryCount,
          retryDelay: initialData.retryDelay,
          timeout: initialData.timeout,
          body: initialData.body ? JSON.stringify(initialData.body) : '',
          failureEmail: initialData.failureEmail,
        }
      : {
          name: '',
          type: 'CRON',
          workspaceId: '',
          endpoint: '',
          method: 'GET',
          schedule: '',
          body: '',
          retryCount: 0,
          retryDelay: 10,
          timeout: 30,
          failureEmail: false,
        },
  });

  const jobType = watch('type');
  const method = watch('method');

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (i: number) =>
    setHeaders(headers.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: 'key' | 'value', val: string) => {
    setHeaders((prev) =>
      prev.map((h, idx) => (idx === i ? { ...h, [field]: val } : h)),
    );
  };

  const onFormSubmit = (data: CreateJobFormData) => {
    onSubmit(data, headers);
  };

  if (createdJob && createdJob.type === 'EVENT') {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Job Created</h2>
        <p className="mt-2 text-sm text-gray-500">Your webhook URL is:</p>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <code className="flex-1 break-all text-sm text-gray-700">
            {createdJob.webhookUrl}
          </code>
          <button
            onClick={() =>
              navigator.clipboard.writeText(createdJob.webhookUrl || '')
            }
            className="shrink-0 cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Copy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {!editMode && (
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  s <= step
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {s}
              </div>
              <span
                className={`text-sm ${s <= step ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {s === 1 ? 'Basic Info' : s === 2 ? 'HTTP Config' : 'Settings'}
              </span>
              {s < 3 && <div className="mx-2 h-px w-8 bg-gray-200" />}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {(step === 1 || editMode) && (
          <div className={step !== 1 ? 'block' : ''}>
            {step === 1 && (
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Basic Info
              </h3>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Name
                </label>
                <input
                  {...register('name')}
                  placeholder="My Cron Job"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {!editMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <div className="mt-1 flex gap-3">
                    {(['CRON', 'EVENT'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setValue('type', t)}
                        className={`flex-1 cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                          jobType === t
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Workspace
                </label>
                <select
                  {...register('workspaceId')}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none"
                >
                  <option value="">Select workspace</option>
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
                {errors.workspaceId && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.workspaceId.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {(step === 2 || editMode) && (
          <div className={step !== 2 ? 'mt-6' : ''}>
            {step === 2 && (
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                HTTP Config
              </h3>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Endpoint URL
                </label>
                <input
                  {...register('endpoint')}
                  placeholder="https://api.example.com/webhook"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                />
                {errors.endpoint && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.endpoint.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Method
                </label>
                <select
                  {...register('method')}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none"
                >
                  {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Headers
                  </label>
                  <button
                    type="button"
                    onClick={addHeader}
                    className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <HiOutlinePlus className="h-4 w-4" /> Add
                  </button>
                </div>
                <div className="mt-1 space-y-2">
                  {headers.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={h.key}
                        onChange={(e) => updateHeader(i, 'key', e.target.value)}
                        placeholder="Key"
                        className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                      />
                      <input
                        value={h.value}
                        onChange={(e) =>
                          updateHeader(i, 'value', e.target.value)
                        }
                        placeholder="Value"
                        className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeader(i)}
                        className="cursor-pointer text-gray-400 hover:text-red-500"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {['POST', 'PUT', 'PATCH'].includes(method) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Body (JSON)
                  </label>
                  <textarea
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    rows={5}
                    placeholder='{"key": "value"}'
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {(step === 3 || editMode) && (
          <div className={step !== 3 ? 'mt-6' : ''}>
            {step === 3 && (
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Settings
              </h3>
            )}

            <div className="space-y-4">
              {(jobType === 'CRON' ||
                (editMode && initialData?.type === 'CRON')) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Schedule (Cron Expression)
                  </label>
                  <input
                    {...register('schedule')}
                    placeholder="*/5 * * * *"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                  />
                  {errors.schedule && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.schedule.message}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CRON_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setValue('schedule', preset.value)}
                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Retry Count
                  </label>
                  <select
                    {...register('retryCount')}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                  >
                    {[0, 1, 3, 5, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Retry Delay
                  </label>
                  <select
                    {...register('retryDelay')}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                  >
                    <option value={10}>10s</option>
                    <option value={30}>30s</option>
                    <option value={60}>1min</option>
                    <option value={300}>5min</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  {...register('timeout')}
                  min={5}
                  max={300}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="failureEmail"
                  {...register('failureEmail')}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="failureEmail" className="text-sm text-gray-700">
                  Send email on failure
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && !editMode ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="cursor-pointer rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 && !editMode ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="cursor-pointer rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : editMode ? 'Update Job' : 'Create Job'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
