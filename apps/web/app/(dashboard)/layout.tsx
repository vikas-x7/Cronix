'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/shared/layout/sidebar';
import { useAuth } from '@/modules/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />
          <p className="text-[13px] text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex bg-neutral-950 font-inter">
        <div className="w-64 shrink-0">
          <Sidebar />
        </div>
        <main className="h-screen w-full overflow-y-auto slim-scrollbar">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
