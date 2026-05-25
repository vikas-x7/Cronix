'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  HiOutlineHome,
  HiOutlineCog6Tooth,
  HiOutlinePlayCircle,
  HiOutlineXMark,
  HiBars3,
} from 'react-icons/hi2';
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

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 block cursor-pointer border border-[#E5E5E5] bg-white p-2 lg:hidden"
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
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#E5E5E5] bg-white transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-[#E5E5E5] px-5">
          <div className="flex h-8 w-8 items-center justify-center bg-[#171717] text-[13px] font-bold text-white">
            C
          </div>
          <span className="text-[15px] font-semibold text-[#171717]">
            cronix
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
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
                  'flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-[#F4F4F5] text-[#171717]'
                    : 'text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#171717]',
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#E5E5E5] p-4">
          <p className="text-[11px] text-neutral-400">cronix v0.1.0</p>
        </div>
      </aside>
    </>
  );
}
