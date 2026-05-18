'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa6';
import { useAuthStore } from '../store/auth.store';

export default function LoginCard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const errorParam = searchParams.get('error');

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const handleOAuth = (provider: 'google' | 'github') => {
    setIsRedirecting(true);
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const path = provider === 'google' ? '/auth/google' : '/auth/github';
    window.location.href = `${baseUrl}${path}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-lg font-bold text-white">
            C
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to Cronix</p>
        </div>

        {errorParam && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Authentication failed. Please try again.
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleOAuth('google')}
            disabled={isRedirecting}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRedirecting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <FaGoogle className="h-5 w-5" />
            )}
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuth('github')}
            disabled={isRedirecting}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRedirecting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <FaGithub className="h-5 w-5" />
            )}
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
