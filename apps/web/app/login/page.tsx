'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginCard from '@/modules/auth/components/login-card';
import { useAuthStore } from '@/modules/auth';
import { getMe } from '@/modules/auth/api/auth.api';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const error = searchParams.get('error');
  const hasRun = useRef(false);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    if (!status && !error) return;
    if (hasRun.current) return;
    hasRun.current = true;

    if (error || status !== 'success') {
      clearUser();
      return;
    }

    async function handleCallback() {
      try {
        const user = await getMe();
        setUser(user);
        router.replace('/dashboard');
      } catch {
        clearUser();
      }
    }

    handleCallback();
  }, [status, error, router, setUser, clearUser]);

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
          <p className="text-sm font-medium text-white/90 tracking-[-0.5px]">
            Signing you in...
          </p>
        </div>
      </div>
    );
  }

  return <LoginCard />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
