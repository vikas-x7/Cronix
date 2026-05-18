import { cn } from '@/shared/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export default function StatsCard({ label, value, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
        className,
      )}
    >
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
