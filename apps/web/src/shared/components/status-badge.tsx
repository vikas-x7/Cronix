import { cn } from '@/shared/lib/utils';

type BadgeStatus =
  | 'active'
  | 'paused'
  | 'success'
  | 'failed'
  | 'error'
  | string;

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md';
}

const STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  success: 'bg-emerald-50 text-emerald-700',
  paused: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-700',
  error: 'bg-red-50 text-red-700',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const normalized = status?.toLowerCase() ?? 'unknown';
  const style = STYLES[normalized] || 'bg-neutral-100 text-neutral-600';

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium capitalize',
        style,
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-[12px] px-2.5 py-1',
      )}
    >
      {normalized}
    </span>
  );
}
