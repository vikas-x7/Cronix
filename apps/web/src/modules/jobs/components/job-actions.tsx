'use client';

import { HiOutlinePlay, HiOutlinePause, HiOutlineTrash } from 'react-icons/hi2';
import type { JobStatus } from '../types/job.types';

interface JobActionsProps {
  status: JobStatus;
  onPause: () => void;
  onResume: () => void;
  onRun: () => void;
  onDelete: () => void;
  isPending: boolean;
}

export default function JobActions({
  status,
  onPause,
  onResume,
  onRun,
  onDelete,
  isPending,
}: JobActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {status === 'ACTIVE' ? (
        <button
          onClick={onPause}
          disabled={isPending}
          title="Pause"
          className="cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
        >
          <HiOutlinePause className="h-4 w-4" />
        </button>
      ) : (
        <button
          onClick={onResume}
          disabled={isPending}
          title="Resume"
          className="cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
        >
          <HiOutlinePlay className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={onRun}
        disabled={isPending}
        title="Run Now"
        className="cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
      >
        <HiOutlinePlay className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        title="Delete"
        className="cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600"
      >
        <HiOutlineTrash className="h-4 w-4" />
      </button>
    </div>
  );
}
