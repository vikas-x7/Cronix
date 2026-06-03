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
  active: 'bg-emerald-500/10 text-emerald-500/60 ',
  success: 'bg-emerald-500/5 text-emerald-500/60  ',
  paused: 'bg-amber-500/10 text-amber-500 ',
  failed: 'bg-red-500/10 text-red-500 ring-red-500/20',
  error: 'bg-red-500/10 text-red-500 ring-red-500/20',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const normalized = status?.toLowerCase() ?? 'unknown';
  const style = STYLES[normalized] || 'bg-neutral-800 text-neutral-400 ';

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium capitalize  rounded-[3px]',
        style,
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-[12px] px-2.5 py-1',
      )}
    >
      {normalized}
    </span>
  );
}
