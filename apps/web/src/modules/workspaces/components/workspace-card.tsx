'use client';

import { useRouter } from 'next/navigation';
import { FiTrash2, FiClock, FiRefreshCw, FiPlus } from 'react-icons/fi';
import type { Workspace } from '../types/workspace.types';
import { formatDate } from '@/shared/lib/utils';

interface WorkspaceCardProps {
  workspace: Workspace;
  onDelete: (id: string, name: string) => void;
  onOpen: (workspace: Workspace) => void;
}

export default function WorkspaceCard({
  workspace,
  onDelete,
  onOpen,
}: WorkspaceCardProps) {
  const router = useRouter();

  const handleNewJob = () => {
    router.push(`/schedule?workspaceId=${workspace.id}`);
  };

  return (
    <div className="rounded-[5px] border border-white/7 bg-[#2c2c2c] p-3 transition-colors hover:border-neutral-700">
      <div className="flex items-start justify-between">
        <h3
          className="cursor-pointer text-[18px]  text-white hover:text-white transition-colors"
          onClick={() => onOpen(workspace)}
        >
          {workspace.name}
        </h3>
        <span className="text-[11px] text-white/70 bg-neutral-800 px-2 py-0.5 rounded-[3px]">
          {workspace.jobsCount} {workspace.jobsCount === 1 ? 'job' : 'jobs'}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-white/80">
          <FiClock size={11} />
          <span>Created {formatDate(workspace.createdAt)}</span>
        </div>
        {workspace.updatedAt && workspace.updatedAt !== workspace.createdAt && (
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <FiRefreshCw size={11} />
            <span>Updated {formatDate(workspace.updatedAt)}</span>
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center gap-2">
        <button
          onClick={() => onOpen(workspace)}
          className="cursor-pointer border border-[#393939] px-3 py-1.5 text-[12px] font-light text-white/90 rounded-[3px] transition-colors hover:bg-neutral-800"
        >
          Open
        </button>
        <button
          onClick={handleNewJob}
          className="cursor-pointer border border-[#393939] px-3 py-1.5 text-[12px] font-light text-white/90 rounded-[3px] transition-colors hover:bg-neutral-800 flex items-center gap-1"
        >
          <FiPlus size={12} />
          New Job
        </button>
        <button
          onClick={() => onDelete(workspace.id, workspace.name)}
          className="cursor-pointer border border-[#393939] px-3 py-2 text-[12px] font-light text-neutral-400 rounded-[3px] transition-colors hover:bg-neutral-800 hover:text-red-400 hover:border-red-500/50"
        >
          <FiTrash2 size={12} />
        </button>
      </div>
    </div>
  );
}
