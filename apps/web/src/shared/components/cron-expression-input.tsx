'use client';

import { useState } from 'react';

interface CronExpressionInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

const CRON_FIELDS = [
  { label: 'Minute', placeholder: '*' },
  { label: 'Hour', placeholder: '*' },
  { label: 'Day', placeholder: '*' },
  { label: 'Month', placeholder: '*' },
  { label: 'Weekday', placeholder: '*' },
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
  const [fields, setFields] = useState<string[]>(() =>
    parts.length === 5 ? parts : ['', '', '', '', ''],
  );

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
            <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={fields[i]}
              onChange={(e) => updateField(i, e.target.value)}
              placeholder={field.placeholder}
              className="w-full border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-[12px] font-mono text-white outline-none focus:border-neutral-500 transition placeholder:text-neutral-600"
            />
          </div>
        ))}
      </div>
      {error && <p className="text-[12px] text-red-400">{error}</p>}
      <div>
        <p className="text-[11px] text-neutral-500 mb-2">Quick presets</p>
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
              className="border border-neutral-700 px-2.5 py-1 text-[11px] text-neutral-400 hover:border-white hover:text-white transition cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      {value && (
        <div className="bg-neutral-800/50 border border-neutral-700 p-3">
          <p className="text-[10px] uppercase text-neutral-500 mb-1">Preview</p>
          <p className="text-[12px] font-mono text-white">{value}</p>
        </div>
      )}
    </div>
  );
}
