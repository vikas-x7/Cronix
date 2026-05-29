'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BiSolidSquare } from 'react-icons/bi';
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
          <BiSolidSquare size={32} className="text-[#DF5BCC] animate-pulse" />
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
      <div className="flex font-geist-sans">
        <div className="w-[210px] shrink-0">
          <Sidebar />
        </div>
        <main className="h-screen w-full overflow-y-auto slim-scrollbar">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
