'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getMe, logout as logoutApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useAuth() {
  const { user, isAuthenticated, setUser, clearUser, setLoading } =
    useAuthStore();

  const {
    data,
    isError,
    isLoading: queryLoading,
    isFetching,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
    if (isError) {
      clearUser();
    }
  }, [data, isError, setUser, clearUser]);

  useEffect(() => {
    setLoading(queryLoading);
  }, [queryLoading, setLoading]);

  return {
    user: data || user,
    isAuthenticated: !!data || isAuthenticated,
    isLoading: queryLoading && !isAuthenticated,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearUser = useAuthStore((s) => s.clearUser);

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      router.push('/login');
    },
    onError: () => {
      clearUser();
      queryClient.clear();
      router.push('/login');
    },
  });
}
