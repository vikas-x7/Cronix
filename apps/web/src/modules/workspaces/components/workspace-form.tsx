'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createWorkspaceSchema,
  type CreateWorkspaceFormData,
} from '../schemas/workspace.schema';

interface WorkspaceFormProps {
  onSubmit: (data: CreateWorkspaceFormData) => void;
  isPending: boolean;
}

export default function WorkspaceForm({
  onSubmit,
  isPending,
}: WorkspaceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#A1A1A1]">
          Workspace Name
        </label>
        <input
          {...register('name')}
          placeholder="Enter workspace name"
          className="mt-1 block w-full rounded-lg border border-white/10 px-3 py-2 text-sm shadow-sm placeholder:text-white/30 focus:border-gray-400 focus:outline-none"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
    </form>
  );
}
