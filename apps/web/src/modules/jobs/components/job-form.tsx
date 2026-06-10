'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createJobSchema, type CreateJobFormData } from '../schemas/job.schema';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';
import { FiChevronDown } from 'react-icons/fi';
import type { Job } from '../types/job.types';

function DarkSelect({
  value,
  onChange,
  options,
  error,
}: {
  value: string | number;
  onChange: (val: string) => void;
  options: { label: string; value: string | number }[];
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full appearance-none text-[13px] cursor-pointer border rounded-[3px] px-3 py-2 pr-8 text-left transition ${
          error
            ? 'border-red-500/50 text-neutral-500'
            : 'border-[#393939] text-white hover:border-neutral-500'
        }`}
      >
        {selected?.label || 'Select...'}
      </button>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-neutral-500" />
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 w-full bg-[#1A1A1A] border border-[#393939] rounded-[3px] py-1 shadow-xl max-h-60 overflow-y-auto slim-scrollbar">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(String(opt.value));
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-[13px] transition cursor-pointer hover:bg-[#2A2A2A] ${
                opt.value === value
                  ? 'text-white bg-[#2A2A2A]'
                  : 'text-neutral-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
      <div className="mx-auto max-w-lg rounded-[5px] border border-[#393939] bg-[#1F1F1F] p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-lg font-bold text-green-400">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-white">Job Created</h2>
        <p className="mt-2 text-sm text-neutral-400">Your webhook URL is:</p>
        <div className="mt-4 flex items-center gap-2 rounded-[3px] border border-[#393939] bg-neutral-900 px-4 py-3">
          <code className="flex-1 break-all text-sm text-neutral-300">
            {createdJob.webhookUrl}
          </code>
          <button
            onClick={() =>
              navigator.clipboard.writeText(createdJob.webhookUrl || '')
            }
            className="shrink-0 cursor-pointer rounded-[3px] border border-[#393939] px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-[#2A2A2A]"
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
                    ? 'bg-white text-black'
                    : 'bg-neutral-800 text-neutral-500'
                }`}
              >
                {s}
              </div>
              <span
                className={`text-sm ${s <= step ? 'text-white' : 'text-neutral-500'}`}
              >
                {s === 1 ? 'Basic Info' : s === 2 ? 'HTTP Config' : 'Settings'}
              </span>
              {s < 3 && <div className="mx-2 h-px w-8 bg-[#393939]" />}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {(step === 1 || editMode) && (
          <div className={step !== 1 ? 'block' : ''}>
            {step === 1 && (
              <h3 className="mb-4 text-lg font-medium text-white">
                Basic Info
              </h3>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400">
                  Job Name
                </label>
                <input
                  {...register('name')}
                  placeholder="My Cron Job"
                  className="mt-1 block w-full rounded-[3px] border border-[#393939] bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {!editMode && (
                <div>
                  <label className="block text-sm font-medium text-neutral-400">
                    Type
                  </label>
                  <div className="mt-1 flex gap-3">
                    {(['CRON', 'EVENT'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setValue('type', t)}
                        className={`flex-1 cursor-pointer rounded-[3px] border px-4 py-2 text-sm font-medium transition-colors ${
                          jobType === t
                            ? 'border-white bg-white text-black'
                            : 'border-[#393939] text-neutral-300 hover:border-neutral-500'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-400">
                  Workspace
                </label>
                <DarkSelect
                  value={watch('workspaceId')}
                  onChange={(val) => setValue('workspaceId', val)}
                  options={[
                    { label: 'Select workspace', value: '' },
                    ...workspaces.map((ws) => ({
                      label: ws.name,
                      value: ws.id,
                    })),
                  ]}
                  error={!!errors.workspaceId}
                />
                {errors.workspaceId && (
                  <p className="mt-1 text-xs text-red-400">
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
              <h3 className="mb-4 text-lg font-medium text-white">
                HTTP Config
              </h3>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400">
                  Endpoint URL
                </label>
                <input
                  {...register('endpoint')}
                  placeholder="https://api.example.com/webhook"
                  className="mt-1 block w-full rounded-[3px] border border-[#393939] bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
                />
                {errors.endpoint && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.endpoint.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400">
                  Method
                </label>
                <DarkSelect
                  value={watch('method')}
                  onChange={(val) => setValue('method', val as any)}
                  options={['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(
                    (m) => ({
                      label: m,
                      value: m,
                    }),
                  )}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-neutral-400">
                    Headers
                  </label>
                  <button
                    type="button"
                    onClick={addHeader}
                    className="flex cursor-pointer items-center gap-1 text-sm text-neutral-500 hover:text-white transition"
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
                        className="block flex-1 rounded-[3px] border border-[#393939] bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
                      />
                      <input
                        value={h.value}
                        onChange={(e) =>
                          updateHeader(i, 'value', e.target.value)
                        }
                        placeholder="Value"
                        className="block flex-1 rounded-[3px] border border-[#393939] bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeader(i)}
                        className="cursor-pointer text-neutral-500 hover:text-red-400 transition"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {['POST', 'PUT', 'PATCH'].includes(method) && (
                <div>
                  <label className="block text-sm font-medium text-neutral-400">
                    Body (JSON)
                  </label>
                  <textarea
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    rows={5}
                    placeholder='{"key": "value"}'
                    className="mt-1 block w-full rounded-[3px] border border-[#393939] bg-neutral-900 px-3 py-2 font-mono text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {(step === 3 || editMode) && (
          <div className={step !== 3 ? 'mt-6' : ''}>
            {step === 3 && (
              <h3 className="mb-4 text-lg font-medium text-white">Settings</h3>
            )}

            <div className="space-y-4">
              {(jobType === 'CRON' ||
                (editMode && initialData?.type === 'CRON')) && (
                <div>
                  <label className="block text-sm font-medium text-neutral-400">
                    Schedule (Cron Expression)
                  </label>
                  <input
                    {...register('schedule')}
                    placeholder="*/5 * * * *"
                    className="mt-1 block w-full rounded-[3px] border border-[#393939] bg-neutral-900 px-3 py-2 font-mono text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
                  />
                  {errors.schedule && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.schedule.message}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CRON_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setValue('schedule', preset.value)}
                        className="cursor-pointer rounded-[3px] border border-[#393939] px-3 py-1 text-xs text-neutral-400 transition-colors hover:bg-[#2A2A2A] hover:text-white"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400">
                    Retry Count
                  </label>
                  <DarkSelect
                    value={watch('retryCount')}
                    onChange={(val) => setValue('retryCount', Number(val))}
                    options={[0, 1, 3, 5, 10].map((n) => ({
                      label: String(n),
                      value: n,
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400">
                    Retry Delay
                  </label>
                  <DarkSelect
                    value={watch('retryDelay')}
                    onChange={(val) => setValue('retryDelay', Number(val))}
                    options={[
                      { label: '10s', value: 10 },
                      { label: '30s', value: 30 },
                      { label: '1min', value: 60 },
                      { label: '5min', value: 300 },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  {...register('timeout')}
                  min={5}
                  max={300}
                  className="mt-1 block w-full rounded-[3px] border border-[#393939] bg-neutral-900 px-3 py-2 text-sm text-white focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="failureEmail"
                  {...register('failureEmail')}
                  className="h-4 w-4 rounded border-[#393939] bg-neutral-900 accent-[#DF5BCC]"
                />
                <label
                  htmlFor="failureEmail"
                  className="text-sm text-neutral-300"
                >
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
              className="cursor-pointer rounded-[3px] border border-[#393939] px-6 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-[#2A2A2A]"
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
              className="cursor-pointer rounded-[3px] bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-[3px] bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : editMode ? 'Update Job' : 'Create Job'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
