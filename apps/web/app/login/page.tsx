import { Suspense } from 'react';
import { LoginContent } from '@/modules/auth';

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
