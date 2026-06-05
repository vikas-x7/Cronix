'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  pauseJob,
  resumeJob,
  runJob,
} from '../api/jobs.api';
import { useToast } from '@/shared/lib/toast';
import { getErrorMessage } from '@/shared/lib/utils';
import type { CreateJobInput } from '../types/job.types';

export function useJobs(params?: {
  workspaceId?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => getJobs(params),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CreateJobInput) => createJob(data),
    onSuccess: () => {
      toast.success('Job created successfully');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateJobInput> }) =>
      updateJob(id, data),
    onSuccess: () => {
      toast.success('Job updated successfully');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      toast.success('Job deleted');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function usePauseJob() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => pauseJob(id),
    onSuccess: () => {
      toast.success('Job paused');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useResumeJob() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => resumeJob(id),
    onSuccess: () => {
      toast.success('Job resumed');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRunJob() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => runJob(id),
    onSuccess: () => {
      toast.success('Job triggered');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
