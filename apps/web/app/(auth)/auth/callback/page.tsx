'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/modules/auth';
import { getMe } from '@/modules/auth/api/auth.api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const error = searchParams.get('error');
  const hasRun = useRef(false);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (error || status !== 'success') {
      clearUser();
      router.replace('/login?error=auth_failed');
      return;
    }

    async function handleCallback() {
      try {
        const user = await getMe();
        setUser(user);
        router.replace('/dashboard');
      } catch {
        clearUser();
        router.replace('/login?error=auth_failed');
      }
    }

    handleCallback();
  }, [status, error, router, setUser, clearUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        <p className="text-sm font-medium text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
