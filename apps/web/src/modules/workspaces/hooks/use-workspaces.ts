'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
} from '../api/workspaces.api';
import { useToast } from '@/shared/lib/toast';
import { getErrorMessage } from '@/shared/lib/utils';
import type { CreateWorkspaceInput } from '../types/workspace.types';

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) => createWorkspace(data),
    onSuccess: () => {
      toast.success('Workspace created successfully');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteWorkspace(id),
    onSuccess: () => {
      toast.success('Workspace deleted');
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
