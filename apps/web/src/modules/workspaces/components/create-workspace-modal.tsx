'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createWorkspaceSchema,
  type CreateWorkspaceFormData,
} from '../schemas/workspace.schema';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
  });

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="bg-neutral-900 p-4 rounded-[5px] w-full max-w-sm">
        <h2 className="text-lg text-white font-medium mb-2">New Workspace</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-[12px] text-neutral-400 mb-1">
              Workspace Name
            </label>
            <input
              {...register('name')}
              placeholder="Enter workspace name"
              className="block w-full rounded-[3px] border border-[#393939] bg-neutral-800 px-3 py-1.5 text-[12px] text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"
            />
            {errors.name && (
              <p className="mt-1 text-[12px] text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 text-[12px] rounded-[3px] text-white bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-1 text-[12px] rounded-[3px] text-black bg-white hover:bg-neutral-200 transition cursor-pointer disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
