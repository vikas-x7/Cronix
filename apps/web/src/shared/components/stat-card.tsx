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
  up: 'text-emerald-400',
  down: 'text-red-400',
  neutral: 'text-neutral-400',
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
    <div className="rounded-[5px] bg-[#2A2A2A] p-5 border border-white/7">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[12px] font-medium uppercase text-white">
            {title}
          </p>
          <p className="text-[22px] font-semibold text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-[11px] text-white/50 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-neutral-500">{icon}</div>
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
