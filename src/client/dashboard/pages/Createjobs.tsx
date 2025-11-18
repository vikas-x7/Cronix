"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCreateCronJob } from "@/client/dashboard/hooks/useCronJobs";
import { cronJobFormSchema, HTTP_METHODS, TIMEZONES } from "@/client/dashboard/validation/cronjob.schema";
import CronExpressionInput from "../components/CronExpressionInput";
import { useUIStore } from "@/client/dashboard/stores/uiStore";

export default function CreateJobs() {
  const router = useRouter();
  const createJob = useCreateCronJob();
  const addToast = useUIStore((s) => s.addToast);

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    method: "GET" as string,
    headers: "",
    body: "",
    cronExpression: "",
    timezone: "UTC",
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
        headers: result.data.headers
          ? JSON.parse(result.data.headers)
          : undefined,
        body: result.data.body || undefined,
      };

      await createJob.mutateAsync(payload);
      addToast({ type: "success", message: "Cron job created successfully!" });
      router.push("/dashboard/cronjobs");
    } catch (err) {
      addToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to create job",
      });
    }
  }

  return (
    <div className="w-full h-screen overflow-y-auto">
      {/* Header */}
      <div className="border-b px-4 py-4 border-[#E5E5E5] flex items-center gap-3">
      
        <h1 className="text-[20px] -tracking-[1px]">Schedule New Job</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl px-6 py-6">
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">
              Job Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Ping Health Check"
              className={`w-full border bg-white px-3 py-2 text-[13px] text-[#171717] outline-none transition placeholder:text-neutral-300 ${errors.title ? "border-red-300" : "border-[#E5E5E5] focus:border-[#171717]"
                }`}
            />
            {errors.title && <p className="mt-1 text-[11px] text-red-500">{errors.title}</p>}
          </div>

          {/* URL + Method */}
          <div className="flex gap-3">
            <div className="w-32">
              <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">
                Method
              </label>
              <select
                value={formData.method}
                onChange={(e) => updateField("method", e.target.value)}
                className="w-full border border-[#E5E5E5] bg-white px-3 py-2 text-[13px] text-[#171717] outline-none focus:border-[#171717] transition"
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">
                Target URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://example.com/api/endpoint"
                className={`w-full border bg-white px-3 py-2 text-[13px] text-[#171717] outline-none transition placeholder:text-neutral-300 ${errors.url ? "border-red-300" : "border-[#E5E5E5] focus:border-[#171717]"
                  }`}
              />
              {errors.url && <p className="mt-1 text-[11px] text-red-500">{errors.url}</p>}
            </div>
          </div>

          {/* Headers */}
          {["POST", "PUT", "PATCH", "DELETE"].includes(formData.method) && (
            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">
                Headers <span className="text-neutral-300">(JSON, optional)</span>
              </label>
              <textarea
                value={formData.headers}
                onChange={(e) => updateField("headers", e.target.value)}
                placeholder='{"Content-Type": "application/json", "Authorization": "Bearer ..."}'
                rows={3}
                className={`w-full border bg-white px-3 py-2 font-mono text-[12px] text-[#171717] outline-none transition placeholder:text-neutral-300 resize-none ${errors.headers ? "border-red-300" : "border-[#E5E5E5] focus:border-[#171717]"
                  }`}
              />
              {errors.headers && (
                <p className="mt-1 text-[11px] text-red-500">{errors.headers}</p>
              )}
            </div>
          )}

          {/* Body */}
          {["POST", "PUT", "PATCH"].includes(formData.method) && (
            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">
                Request Body <span className="text-neutral-300">(optional)</span>
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => updateField("body", e.target.value)}
                placeholder='{"key": "value"}'
                rows={4}
                className="w-full border border-[#E5E5E5] bg-white px-3 py-2 font-mono text-[12px] text-[#171717] outline-none transition placeholder:text-neutral-300 resize-none focus:border-[#171717]"
              />
            </div>
          )}

          {/* Cron Expression */}
          <CronExpressionInput
            value={formData.cronExpression}
            onChange={(val) => updateField("cronExpression", val)}
            error={errors.cronExpression}
          />

          {/* Timezone */}
          <div>
            <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => updateField("timezone", e.target.value)}
              className="w-full border border-[#E5E5E5] bg-white px-3 py-2 text-[13px] text-[#171717] outline-none focus:border-[#171717] transition"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createJob.isPending}
              className="bg-[#171717] text-white px-8 py-2.5 text-[13px] font-medium hover:bg-[#333] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createJob.isPending ? "Creating..." : "Create Cron Job"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-[#E5E5E5] px-6 py-2.5 text-[13px] text-neutral-500 hover:border-[#171717] hover:text-[#171717] transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
