'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa6';
import { useAuthStore } from '../store/auth.store';

const authErrors: Record<string, string> = {
  AccessDenied: 'Sign in was cancelled or access was denied.',
  Callback: 'OAuth callback could not be completed. Check provider settings.',
  OAuthAccountNotLinked:
    'This email is linked with another sign-in method. Try that method instead.',
  OAuthCallback:
    'Provider callback failed. Check client ID, client secret, and callback URL.',
  OAuthCreateAccount: 'Could not create account. Please try again later.',
  Configuration:
    'Auth providers are not configured. Add environment variables.',
  Default: 'Sign in failed. Please try again.',
};

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

  const errorMessage = errorParam
    ? (authErrors[errorParam] ?? authErrors.Default)
    : null;

  return (
    <div className="min-h-screen flex bg-white text-black tracking-[-0.25px]">
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="absolute top-0 left-0 flex items-center mt-3 ml-3">
          {/* <h1 className="text-[20px] font-semibold">cronix</h1> */}
        </div>
        <div className="w-full max-w-md px-6 text-center">
          <div className="mb-8 flex flex-col items-center justify-center">
            <h1 className="text-[30px] flex items-center text-center gap-2 font-semibold tracking-[-1.5px] text-black/80 ">
              Welcome to cronix
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Sign in to manage your cron jobs and automation workflows.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-left text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={isRedirecting}
              className="w-full py-2 border border-neutral-300 text-[13px] text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                {isRedirecting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                ) : (
                  <FaGoogle className="h-5 w-5" />
                )}
                Continue with Google
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('github')}
              disabled={isRedirecting}
              className="w-full py-2 border border-neutral-300 text-[13px] text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                {isRedirecting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                ) : (
                  <FaGithub className="h-5 w-5" />
                )}
                Continue with GitHub
              </span>
            </button>
          </div>

          <p className="text-[11px] text-neutral-600 text-center mt-6">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2">
        <img
          src="https://i.pinimg.com/736x/f0/0e/54/f00e544446c28b629a1defa290d7928f.jpg"
          alt="Login visual"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
}
