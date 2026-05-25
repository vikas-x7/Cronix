'use client';

import { useState } from 'react';

interface CronExpressionInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

const CRON_FIELDS = [
  { label: 'Minute', placeholder: '*', max: 59 },
  { label: 'Hour', placeholder: '*', max: 23 },
  { label: 'Day', placeholder: '*', max: 31 },
  { label: 'Month', placeholder: '*', max: 12 },
  { label: 'Weekday', placeholder: '*', max: 6 },
];

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 min', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily midnight', value: '0 0 * * *' },
  { label: 'Weekly Monday', value: '0 0 * * 1' },
  { label: 'Monthly 1st', value: '0 0 1 * *' },
];

export default function CronExpressionInput({
  value,
  onChange,
  error,
}: CronExpressionInputProps) {
  const parts = (value || '').split(' ');
  const [fields, setFields] = useState<string[]>(() => {
    if (parts.length === 5) return parts;
    return ['', '', '', '', ''];
  });

  function updateField(index: number, val: string) {
    const next = [...fields];
    next[index] = val;
    setFields(next);
    onChange(next.join(' '));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {CRON_FIELDS.map((field, i) => (
          <div key={field.label}>
            <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={fields[i]}
              onChange={(e) => updateField(i, e.target.value)}
              placeholder={field.placeholder}
              className="w-full border border-[#E5E5E5] px-2 py-1.5 text-[12px] font-mono text-[#171717] outline-none focus:border-[#171717] transition placeholder:text-neutral-300"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-[12px] text-red-500">{error}</p>}

      <div>
        <p className="text-[11px] text-neutral-400 mb-2">Quick presets</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => {
                const p = preset.value.split(' ');
                setFields(p);
                onChange(preset.value);
              }}
              className="border border-[#E5E5E5] px-2.5 py-1 text-[11px] text-neutral-600 hover:border-[#171717] hover:text-[#171717] transition cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {value && (
        <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-3">
          <p className="text-[10px] uppercase text-neutral-400 mb-1">Preview</p>
          <p className="text-[12px] font-mono text-[#171717]">{value}</p>
        </div>
      )}
    </div>
  );
}
