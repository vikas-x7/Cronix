'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';
import {
  FiLayout,
  FiClock,
  FiGrid,
  FiSettings,
  FiLink,
  FiActivity,
  FiTrendingUp,
} from 'react-icons/fi';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/modules/auth';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: FiLayout },
  { label: 'Cron Jobs', href: '/jobs', icon: FiClock },
  { label: 'Executions', href: '/executions', icon: FiActivity },
  { label: 'Analytics', href: '/analytics', icon: FiTrendingUp },
  { label: 'Workspaces', href: '/workspaces', icon: FiGrid },
  { label: 'Webhooks', href: '/webhooks', icon: FiLink },
  { label: 'Settings', href: '/settings', icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 block cursor-pointer border border-neutral-700 bg-neutral-900 p-2 lg:hidden"
      >
        {mobileOpen ? (
          <HiOutlineXMark className="h-5 w-5 text-white" />
        ) : (
          <HiBars3 className="h-5 w-5 text-white" />
        )}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-neutral-800 bg-[#0a0a0a] transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-neutral-800 px-2">
          <div className="flex h-8 w-8 items-center justify-center bg-white text-[13px] font-bold text-black"></div>
          <span className="text-[15px] font-semibold text-white">cronix</span>
          <span className="text-[10px] text-neutral-500 ml-auto">v0.1.0</span>
        </div>

        <nav className="flex-1 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-colors rounded-[3px]',

                  isActive
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white',
                )}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 space-y-2 border-t border-neutral-800">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-2 py-2 hover:bg-neutral-800/50 transition-colors rounded-md"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center text-[12px] font-medium text-white shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">
                {user?.email || ''}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
