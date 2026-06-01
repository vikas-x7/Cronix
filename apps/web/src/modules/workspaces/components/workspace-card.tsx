'use client';

import { useRouter } from 'next/navigation';
import { FiTrash2, FiClock, FiRefreshCw, FiPlus } from 'react-icons/fi';
import type { Workspace } from '../types/workspace.types';
import { formatDate } from '@/shared/lib/utils';
import { useJobStore } from '@/shared/stores/jobStore';

interface WorkspaceCardProps {
  workspace: Workspace;
  onDelete: (id: string) => void;
}

export default function WorkspaceCard({
  workspace,
  onDelete,
}: WorkspaceCardProps) {
  const router = useRouter();

  const handleOpen = () => {
    useJobStore.setState({ workspaceFilter: workspace.id });
    router.push('/jobs');
  };

  const handleNewJob = () => {
    useJobStore.setState({ workspaceFilter: workspace.id });
    router.push('/jobs/new');
  };

  return (
    <div className="rounded-[5px] border border-neutral-800 bg-[#2A2A2A] p-5 transition-colors hover:border-neutral-700">
      <div className="flex items-start justify-between">
        <h3
          className="cursor-pointer text-[15px] font-medium text-white/90 hover:text-white transition-colors"
          onClick={handleOpen}
        >
          {workspace.name}
        </h3>
        <span className="text-[11px] text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-[3px]">
          {workspace.jobsCount} {workspace.jobsCount === 1 ? 'job' : 'jobs'}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
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

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={handleOpen}
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
          onClick={() => onDelete(workspace.id)}
          className="cursor-pointer border border-[#393939] px-3 py-1.5 text-[12px] font-light text-neutral-400 rounded-[3px] transition-colors hover:bg-neutral-800 hover:text-red-400 hover:border-red-500/50"
        >
          <FiTrash2 size={12} />
        </button>
      </div>
    </div>
  );
}
