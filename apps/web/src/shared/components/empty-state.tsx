import { BiSolidSquare } from 'react-icons/bi';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4 text-neutral-700">
        {icon || <BiSolidSquare size={40} />}
      </div>
      <h3 className="text-[15px] font-medium text-white">{title}</h3>
      <p className="mt-1 text-[13px] text-neutral-500 text-center max-w-sm">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
