'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore, useLogout } from '@/modules/auth';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import { cn } from '@/shared/lib/utils';

const TITLE_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/workspaces': 'Workspaces',
  '/jobs': 'Jobs',
  '/jobs/new': 'Create Job',
  '/settings': 'Settings',
};

export default function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const title = TITLE_MAP[pathname] || 'Job Detail';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md lg:px-8">
      <h1 className="ml-10 text-xl font-semibold text-gray-900 lg:ml-0">
        {title}
      </h1>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-gray-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="hidden text-gray-700 sm:block">
            {user?.name || 'User'}
          </span>
          <HiOutlineChevronDown
            className={cn(
              'h-4 w-4 text-gray-400 transition-transform',
              dropdownOpen && 'rotate-180',
            )}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout.mutate();
              }}
              disabled={logout.isPending}
              className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {logout.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
