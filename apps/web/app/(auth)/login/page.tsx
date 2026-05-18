import { Suspense } from 'react';
import { LoginCard } from '@/modules/auth';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 mx-auto" />
              <div className="h-6 w-32 bg-gray-200 mx-auto rounded" />
              <div className="h-4 w-48 bg-gray-200 mx-auto rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      }
    >
      <LoginCard />
    </Suspense>
  );
}
