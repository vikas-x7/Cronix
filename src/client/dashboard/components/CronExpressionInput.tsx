'use client';

import React from 'react';
import { CRON_PRESETS } from '@/client/dashboard/validation/cronjob.schema';

interface CronExpressionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function CronExpressionInput({ value, onChange, error }: CronExpressionInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[12px] font-medium text-neutral-400">Cron Expression</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="* * * * *"
        className={`w-full border bg-transparent px-3 py-2 text-[13px] font-mono text-white outline-none transition placeholder:text-neutral-500 rounded-md ${
          error ? 'border-red-300' : 'border-[#3E3E3E] focus:border-[#5E5E5E]'
        }`}
      />
      {error && <p className="text-[11px] text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-1.5 pt-1">
        {CRON_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className={`border px-2 py-1 text-[10px] rounded transition ${
              value === preset.value ? 'border-[#007BFF] bg-[#007BFF] text-white' : 'border-[#3E3E3E] bg-transparent text-neutral-400 hover:border-[#5E5E5E] hover:text-white'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-neutral-500 mt-2">
        Format: minute hour day month weekday — e.g. <span className="font-mono text-neutral-400">*/5 * * * *</span> = every 5 minutes
      </p>
    </div>
  );
}
