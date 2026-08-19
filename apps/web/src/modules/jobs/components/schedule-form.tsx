'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreateJob } from '@/modules/jobs';
import { storeExecution } from '@/modules/executions/api/executions.api';
import { useWorkspaces } from '@/modules/workspaces';
import { useUIStore } from '@/store/uiStore';
import CronExpressionInput from '@/modules/jobs/components/cron-expression-input';
import { FiChevronDown } from 'react-icons/fi';

type Tab = 'Headers' | 'Body' | 'Schedule' | 'Response';

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

function NotifyToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onChange}
        className={`h-5 w-9 rounded-full transition cursor-pointer shrink-0 relative ${checked ? 'bg-white' : 'bg-neutral-700'}`}
      >
        <span
          className={`block h-4 w-4 rounded-full transition absolute top-0.5 ${checked ? 'left-[18px] bg-black' : 'left-0.5 bg-neutral-400'}`}
        />
      </button>
      <p className="text-[13px] text-white">{label}</p>
    </div>
  );
}

export default function ScheduleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createJob = useCreateJob();
  const addToast = useUIStore((s) => s.addToast);
  const { data: workspaces } = useWorkspaces();

  const preselectedWorkspaceId = searchParams.get('workspaceId') || '';

  const [activeTab, setActiveTab] = useState<Tab>('Schedule');
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    duration: number;
    body: string;
    headers: Record<string, string>;
  } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    endpoint: '',
    method: 'GET',
    headers: '',
    body: '',
    schedule: '',
    timezone: 'UTC',
    type: 'CRON' as 'CRON' | 'EVENT',
    workspaceId: preselectedWorkspaceId,
    retryCount: 0,
    retryDelay: 10,
    timeout: 30,
    failureEmail: false,
    notifyOnRecovery: false,
    disableAfterFailures: true,
    notifyTlsExpiry: false,
    failureThreshold: 1,
    tlsExpiryDays: 7,
  });

  useEffect(() => {
    if (preselectedWorkspaceId) {
      setFormData((prev) => ({ ...prev, workspaceId: preselectedWorkspaceId }));
    }
  }, [preselectedWorkspaceId]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateField(field: string, value: string | number | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleRunNow() {
    if (!formData.workspaceId) {
      setErrors({ workspaceId: 'Please select a workspace' });
      addToast({ type: 'error', message: 'Please select a workspace' });
      return;
    }
    if (!formData.endpoint) {
      setErrors({ endpoint: 'URL is required' });
      addToast({ type: 'error', message: 'Please enter an endpoint URL' });
      return;
    }

    setIsExecuting(true);
    setResponse(null);

    let headerObj: Record<string, string> = {};
    if (formData.headers) {
      try {
        headerObj = JSON.parse(formData.headers);
      } catch {
        setErrors({ headers: 'Invalid JSON' });
        addToast({ type: 'error', message: 'Invalid headers JSON' });
        setIsExecuting(false);
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
        setIsExecuting(false);
        return;
      }
    }

    const startTime = Date.now();
    let res: Response;
    try {
      res = await fetch(formData.endpoint, {
        method: formData.method,
        headers: { ...headerObj },
        body: ['GET', 'DELETE'].includes(formData.method)
          ? undefined
          : bodyObj
            ? JSON.stringify(bodyObj)
            : undefined,
      });
    } catch (err) {
      const duration = Date.now() - startTime;
      setResponse({
        status: 0,
        statusText: 'Network Error',
        duration,
        body: err instanceof Error ? err.message : 'Request failed',
        headers: {},
      });
      setIsExecuting(false);
      return;
    }

    const duration = Date.now() - startTime;
    const resBody = await res.text();
    const resHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      resHeaders[k] = v;
    });

    setResponse({
      status: res.status,
      statusText: res.statusText,
      duration,
      body: resBody,
      headers: resHeaders,
    });
    setIsExecuting(false);

    try {
      const job = await createJob.mutateAsync({
        name: formData.name || 'Manual run',
        type: 'EVENT',
        workspaceId: formData.workspaceId,
        endpoint: formData.endpoint,
        method: formData.method,
        headers: headerObj,
        body: bodyObj,
        retryCount: 0,
        retryDelay: 10,
        timeout: formData.timeout,
        failureEmail: false,
      } as any);
      const jobId = (job as any)?.id;
      if (jobId) {
        await storeExecution({
          jobId,
          httpStatus: res.status,
          status: res.ok ? 'SUCCESS' : 'FAILED',
          duration,
          response: resBody,
          error: res.ok ? undefined : `HTTP ${res.status}: ${res.statusText}`,
        });
      }
    } catch {
      // Background storage failed, response already shown
    }
  }

  async function handleSubmit() {
    if (!formData.workspaceId) {
      setErrors({ workspaceId: 'Please select a workspace' });
      addToast({ type: 'error', message: 'Please select a workspace' });
      return;
    }
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
        type: formData.type,
        workspaceId: formData.workspaceId,
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
        return 'text-green-400';
      case 'POST':
        return 'text-blue-400';
      case 'PUT':
        return 'text-yellow-400';
      case 'PATCH':
        return 'text-orange-400';
      case 'DELETE':
        return 'text-red-400';
      default:
        return 'text-neutral-400';
    }
  };

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0D0D0D] pr-2">
      <style>{`
        select {
          color-scheme: dark;
        }
        select option,
        select optgroup {
          background-color: #1A1A1A;
          color: #E5E5E5;
          padding: 8px 12px;
        }
        select option:hover,
        select option:checked {
          background-color: #2A2A2A;
        }
      `}</style>
      <div className="py-3 bg-[#0D0D0D] shrink-0">
        <h1 className="text-[20px] tracking-[-1px] text-white">
          Schedule New Job
        </h1>
      </div>
      <div className="bg-[#1F1F1F] rounded-[5px] h-[92vh] flex flex-col ">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Untitled job"
            className="text-[14px] font-medium text-white outline-none placeholder:text-neutral-500 flex-1 border border-[#393939] rounded-[3px] px-3 py-1.5 focus:border-neutral-500 transition"
          />
          <div className="relative">
            <select
              value={formData.workspaceId}
              onChange={(e) => updateField('workspaceId', e.target.value)}
              className={`appearance-none text-[13px] outline-none cursor-pointer border rounded-[3px] px-3 py-1.5 pr-8  transition min-w-[160px] ${
                formData.workspaceId
                  ? 'border-[#393939] text-white'
                  : errors.workspaceId
                    ? 'border-red-500/50 text-neutral-500'
                    : 'border-[#393939] text-neutral-500'
              }`}
            >
              <option value="" className=" text-neutral-500">
                Select workspace
              </option>
              {workspaces?.map((ws) => (
                <option key={ws.id} value={ws.id} className=" text-white">
                  {ws.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-neutral-500" />
          </div>
          {errors.workspaceId && (
            <span className="text-[11px] text-red-400 whitespace-nowrap">
              {errors.workspaceId}
            </span>
          )}
        </div>

        <div className="px-4 py-3 flex gap-2">
          <div className="flex  border border-[#393939] rounded-[3px] overflow-hidden flex-1">
            <div className="relative">
              <select
                value={formData.method}
                onChange={(e) => updateField('method', e.target.value)}
                className={`appearance-none bg-transparent pl-3 pr-8 py-2 text-[13px] font-semibold outline-none cursor-pointer border-r border-[#393939] ${getMethodColor(formData.method)}`}
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m} className=" text-white">
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
              placeholder="Enter endpoint URL"
              className="flex-1 bg-transparent px-3 py-2 text-[13px] text-white outline-none placeholder:text-neutral-500"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={createJob.isPending}
            className="bg-white/90 text-black px-5 rounded-[3px] text-[13px] tracking-[-0.75px] font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 cursor-pointer"
          >
            {createJob.isPending ? 'Creating...' : 'Create'}
          </button>
          <button
            onClick={handleRunNow}
            disabled={createJob.isPending || isExecuting}
            className="bg-[#DF5BCC]/90 text-white px-5 rounded-[3px] text-[13px] tracking-[-0.75px] font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#DF5BCC] cursor-pointer"
          >
            {isExecuting ? 'Running...' : 'Run Now'}
          </button>
        </div>
        {errors.endpoint && (
          <div className="px-4 -mt-1 mb-2">
            <span className="text-[11px] text-red-400">{errors.endpoint}</span>
          </div>
        )}

        <div className="flex px-4 border-b border-neutral-800 gap-6 text-[13px] font-medium">
          {(['Schedule', 'Headers', 'Body', 'Response'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 relative transition cursor-pointer flex items-center gap-1.5 ${activeTab === tab ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
            >
              {tab}
              {tab === 'Response' && response && activeTab !== 'Response' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#DF5BCC]" />
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 overflow-y-auto slim-scrollbar">
          {activeTab === 'Schedule' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[13px] font-medium text-white/80 mb-2">
                  Cron Schedule
                </h3>
                <div className=" border border-[#393939] rounded-[3px] p-4">
                  <CronExpressionInput
                    value={formData.schedule}
                    onChange={(val) => updateField('schedule', val)}
                    error={errors.schedule}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[13px] font-medium text-white/80 mb-2">
                  Notifications
                </h3>
                <div className="border border-[#393939] rounded-[3px] p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateField('failureEmail', !formData.failureEmail)
                      }
                      className={`h-5 w-9 rounded-full transition cursor-pointer shrink-0 relative ${formData.failureEmail ? 'bg-white' : 'bg-neutral-700'}`}
                    >
                      <span
                        className={`block h-4 w-4 rounded-full transition absolute top-0.5 ${formData.failureEmail ? 'left-[18px] bg-black' : 'left-0.5 bg-neutral-400'}`}
                      />
                    </button>
                    <p className="text-[13px] text-white">Execution fails</p>
                    {formData.failureEmail && (
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-[12px] text-neutral-400">
                          Notify after
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={formData.failureThreshold}
                          onChange={(e) =>
                            updateField(
                              'failureThreshold',
                              Number(e.target.value),
                            )
                          }
                          className="w-16 bg-neutral-800 border border-[#393939] rounded-[3px] px-2  text-[13px] text-white outline-none focus:border-neutral-500"
                        />
                        <span className="text-[12px] text-neutral-400">
                          failure(s)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-[#393939] my-3" />

                  <NotifyToggle
                    checked={formData.notifyOnRecovery}
                    onChange={() =>
                      updateField(
                        'notifyOnRecovery',
                        !formData.notifyOnRecovery,
                      )
                    }
                    label="Execution succeeds after previous failure"
                  />

                  <div className="h-px bg-[#393939] my-3" />

                  <NotifyToggle
                    checked={formData.disableAfterFailures}
                    onChange={() =>
                      updateField(
                        'disableAfterFailures',
                        !formData.disableAfterFailures,
                      )
                    }
                    label="Disable after too many failures"
                  />

                  <div className="h-px bg-[#393939] my-3" />

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          'notifyTlsExpiry',
                          !formData.notifyTlsExpiry,
                        )
                      }
                      className={`h-5 w-9 rounded-full transition cursor-pointer shrink-0 relative ${formData.notifyTlsExpiry ? 'bg-white' : 'bg-neutral-700'}`}
                    >
                      <span
                        className={`block h-4 w-4 rounded-full transition absolute top-0.5 ${formData.notifyTlsExpiry ? 'left-[18px] bg-black' : 'left-0.5 bg-neutral-400'}`}
                      />
                    </button>
                    <p className="text-[13px] text-white">
                      TLS certificate expiring
                    </p>
                    {formData.notifyTlsExpiry && (
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-[12px] text-neutral-400">
                          Notify before
                        </span>
                        <input
                          type="number"
                          min={1}
                          value={formData.tlsExpiryDays}
                          onChange={(e) =>
                            updateField('tlsExpiryDays', Number(e.target.value))
                          }
                          className="w-16 bg-neutral-800 border border-[#393939] rounded-[3px] px-2 text-[13px] text-white outline-none focus:border-neutral-500"
                        />
                        <span className="text-[12px] text-neutral-400">
                          days
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[13px] font-medium text-white/80 mb-2">
                  Advance Settings
                </h3>
                <div className="border border-[#393939] rounded-[3px] p-4">
                  <div className="max-w-sm">
                    <label className="block text-[12px] text-neutral-400 mb-1.5">
                      Timezone
                    </label>
                    <div className="relative">
                      <select
                        value={formData.timezone}
                        onChange={(e) =>
                          updateField('timezone', e.target.value)
                        }
                        className="w-full appearance-none bg-neutral-900 border border-[#393939] rounded-[3px] px-3 py-2 text-[13px] text-white outline-none focus:border-neutral-500 transition"
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
            </div>
          )}
          {activeTab === 'Headers' && (
            <div className="flex flex-col h-full">
              <h3 className="text-[13px] font-medium text-white/80 mb-2">
                Request Headers (JSON)
              </h3>
              <textarea
                value={formData.headers}
                onChange={(e) => updateField('headers', e.target.value)}
                placeholder='{\n  "Content-Type": "application/json"\n}'
                className="flex-1 min-h-[200px] w-full bg-neutral-900 border border-[#393939] rounded-[3px] p-4 font-mono text-[13px] text-white outline-none resize-none focus:border-neutral-500 transition placeholder:text-neutral-600"
              />
              {errors.headers && (
                <p className="mt-1 text-[12px] text-red-400">
                  {errors.headers}
                </p>
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
                    className="accent-white"
                  />
                  <label
                    htmlFor="raw"
                    className="text-[13px] text-white/80 cursor-pointer"
                  >
                    raw
                  </label>
                </div>
                <div className="text-[13px] text-neutral-500 px-2 py-0.5">
                  JSON
                </div>
              </div>
              <textarea
                value={formData.body}
                onChange={(e) => updateField('body', e.target.value)}
                placeholder='{\n  "key": "value"\n}'
                disabled={['GET', 'DELETE'].includes(formData.method)}
                className="flex-1 min-h-[200px] w-full bg-neutral-900 border border-[#393939] rounded-[3px] p-4 font-mono text-[13px] text-white outline-none resize-none focus:border-neutral-500 transition disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-neutral-600"
              />
              {['GET', 'DELETE'].includes(formData.method) && (
                <p className="mt-2 text-[12px] text-neutral-500">
                  Body is typically not sent with {formData.method} requests.
                </p>
              )}
              {errors.body && (
                <p className="mt-1 text-[12px] text-red-400">{errors.body}</p>
              )}
            </div>
          )}
          {activeTab === 'Response' && (
            <div className="flex flex-col h-full">
              {!response && !isExecuting && (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[13px] text-neutral-500">
                    Click{' '}
                    <span className="text-[#DF5BCC] font-medium">Run Now</span>{' '}
                    to see the response here
                  </p>
                </div>
              )}
              {isExecuting && !response && (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[13px] text-[#DF5BCC] animate-pulse">
                    Sending request...
                  </p>
                </div>
              )}
              {response && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-[13px] font-semibold ${
                        response.status >= 200 && response.status < 300
                          ? 'text-green-400'
                          : response.status >= 400
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {response.status} {response.statusText}
                    </span>
                    <span className="text-[12px] text-neutral-500">
                      {response.duration}ms
                    </span>
                  </div>

                  <div className="flex gap-4 flex-1 min-h-0">
                    <div className="flex-1 flex flex-col min-w-0">
                      <h4 className="text-[12px] font-medium text-white/80 mb-2">
                        Body
                      </h4>
                      <div className="flex-1 border border-[#393939] rounded-[3px] p-4 overflow-y-auto slim-scrollbar bg-neutral-900">
                        <pre className="font-mono text-[12px] text-neutral-300 whitespace-pre-wrap break-all leading-relaxed">
                          {(() => {
                            try {
                              return JSON.stringify(
                                JSON.parse(response.body),
                                null,
                                2,
                              );
                            } catch {
                              return response.body || '(empty)';
                            }
                          })()}
                        </pre>
                      </div>
                    </div>

                    <div className="w-[300px] flex flex-col shrink-0">
                      <h4 className="text-[12px] font-medium text-white/80 mb-2">
                        Headers
                      </h4>
                      <div className="flex-1 border border-[#393939] rounded-[3px] p-4 overflow-y-auto slim-scrollbar bg-neutral-900 space-y-1">
                        {Object.entries(response.headers).map(
                          ([key, value]) => (
                            <div key={key} className="flex gap-2 text-[11px]">
                              <span className="text-[#DF5BCC] font-mono font-medium shrink-0">
                                {key}:
                              </span>
                              <span className="text-neutral-300 font-mono break-all">
                                {value}
                              </span>
                            </div>
                          ),
                        )}
                        {Object.keys(response.headers).length === 0 && (
                          <span className="text-[12px] text-neutral-500">
                            No headers
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
