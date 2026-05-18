'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineCog6Tooth,
  HiOutlinePlayCircle,
  HiOutlineXMark,
  HiBars3,
} from 'react-icons/hi2';
import { cn } from '@/shared/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: HiOutlineHome },
  { label: 'Workspaces', href: '/workspaces', icon: HiOutlineBriefcase },
  { label: 'Jobs', href: '/jobs', icon: HiOutlinePlayCircle },
  { label: 'Settings', href: '/settings', icon: HiOutlineCog6Tooth },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 block cursor-pointer rounded-lg border border-gray-200 bg-white p-2 shadow-sm lg:hidden"
      >
        {mobileOpen ? (
          <HiOutlineXMark className="h-5 w-5" />
        ) : (
          <HiBars3 className="h-5 w-5" />
        )}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
            C
          </div>
          <span className="text-lg font-semibold text-gray-900">Cronix</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <p className="text-xs text-gray-400">Cronix v0.1.0</p>
        </div>
      </aside>
    </>
  );
}
