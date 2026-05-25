import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const TREND_COLORS = {
  up: 'text-emerald-600',
  down: 'text-red-500',
  neutral: 'text-neutral-500',
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <div className="border border-[#E5E5E5] bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-medium uppercase text-neutral-500">
            {title}
          </p>
          <p className="text-[22px] font-semibold text-[#171717] mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] text-neutral-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-neutral-400">{icon}</div>
      </div>
      {trend && trendValue && (
        <div className="mt-3">
          <span className={`text-[11px] font-medium ${TREND_COLORS[trend]}`}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
