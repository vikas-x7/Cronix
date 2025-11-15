"use client";

import React from "react";
import { CRON_PRESETS } from "@/client/validation/cronjob.schema";

interface CronExpressionInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function CronExpressionInput({
    value,
    onChange,
    error,
}: CronExpressionInputProps) {
    return (
        <div className="space-y-2">
            <label className="block text-[12px] font-medium text-neutral-600">
                Cron Expression
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="* * * * *"
                className={`w-full border bg-white px-3 py-2 text-[13px] font-mono text-[#171717] outline-none transition placeholder:text-neutral-300 ${error ? "border-red-300" : "border-[#E5E5E5] focus:border-[#171717]"
                    }`}
            />
            {error && <p className="text-[11px] text-red-500">{error}</p>}

            <div className="flex flex-wrap gap-1.5 pt-1">
                {CRON_PRESETS.map((preset) => (
                    <button
                        key={preset.value}
                        type="button"
                        onClick={() => onChange(preset.value)}
                        className={`border px-2 py-1 text-[10px] transition ${value === preset.value
                                ? "border-[#171717] bg-[#171717] text-white"
                                : "border-[#E5E5E5] bg-white text-neutral-500 hover:border-[#C5C5C5]"
                            }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <p className="text-[10px] text-neutral-400">
                Format: minute hour day month weekday — e.g.{" "}
                <span className="font-mono">*/5 * * * *</span> = every 5 minutes
            </p>
        </div>
    );
}
