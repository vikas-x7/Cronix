'use client';

import { useEffect, useRef } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import WorkspaceForm from './workspace-form';
import type { CreateWorkspaceFormData } from '../schemas/workspace.schema';

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWorkspaceFormData) => void;
  isPending: boolean;
}

export default function CreateWorkspaceModal({
  open,
  onClose,
  onSubmit,
  isPending,
}: CreateWorkspaceModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">New Workspace</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>
        <WorkspaceForm onSubmit={onSubmit} isPending={isPending} />
      </div>
    </div>
  );
}
