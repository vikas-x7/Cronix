'use client';

import { useRouter } from 'next/navigation';
import type { Workspace } from '../types/workspace.types';
import { formatDate } from '@/shared/lib/utils';

interface WorkspaceCardProps {
  workspace: Workspace;
  onDelete: (id: string) => void;
}

export default function WorkspaceCard({
  workspace,
  onDelete,
}: WorkspaceCardProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3
        className="cursor-pointer text-lg font-semibold text-gray-900 hover:text-gray-600"
        onClick={() => router.push(`/schedule?workspaceId=${workspace.id}`)}
      >
        {workspace.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{workspace.jobsCount} jobs</p>
      <p className="mt-1 text-xs text-gray-400">
        Created {formatDate(workspace.createdAt)}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => router.push(`/schedule?workspaceId=${workspace.id}`)}
          className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Open
        </button>
        <button
          onClick={() => onDelete(workspace.id)}
          className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
