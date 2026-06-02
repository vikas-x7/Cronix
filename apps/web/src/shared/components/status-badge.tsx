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
  active: 'bg-emerald-500/10 text-white/80  ring-emerald-500/20',
  success: 'bg-emerald-500/10 text-white/80 ring-emerald-500/20',
  paused: 'bg-amber-500/10 text-white/70 ring-amber-500/20',
  failed: 'bg-red-500/10 text-white/70 ring-red-500/20',
  error: 'bg-red-500/10 text-white/70 ring-red-500/20',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const normalized = status?.toLowerCase() ?? 'unknown';
  const style =
    STYLES[normalized] || 'bg-neutral-800 text-neutral-400 ring-neutral-700';

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium capitalize ring-1 ring-inset rounded-[2px]',
        style,
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-[12px] px-2.5 py-1',
      )}
    >
      {normalized}
    </span>
  );
}
