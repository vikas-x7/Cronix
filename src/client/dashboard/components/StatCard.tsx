'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function StatCard({ title, value, subtitle, icon, trend, trendValue }: StatCardProps) {
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-neutral-400';

  return (
    <div className="border border-[#E5E5E5] bg-[#FAFAFA] p-3 rounded-[1px] transition-all hover:border-[#C5C5C5]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-4 w-4 items-center justify-center  text-black">{icon}</div>
            <p className="text-[13px] font-medium   text-black">{title}</p>
          </div>
          <p className="mt-1 text-[25px]  -tracking-[1.5px] text-[#171717]">{value}</p>

          <div className="flex justify-between  items-center  gap-4">
            {trend && trendValue && (
              <div className={`mt-2 text-[11px] font-medium ${trendColor}`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </div>
            )}

            {subtitle && <p className="mt-1 text-[12px] ">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
