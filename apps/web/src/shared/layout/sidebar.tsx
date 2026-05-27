'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
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
import { BiSolidSquare, BiUnite } from 'react-icons/bi';

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
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
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
          'fixed inset-y-0 left-0 z-40 flex w-[210px] flex-col bg-[#0D0D0D]  lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center gap-1  px-2">
          <BiSolidSquare size={25} className="text-[#DF5BCC]" />
          <span className="text-[20px] font-semibold tracking-[-1px] text-white">
            Cronix
          </span>
          <span className="text-[10px] text-neutral-500 ml-auto">v1.0.0</span>
        </div>

        <nav
          className="flex-1 px-2 relative flex flex-col gap-1"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {(() => {
            const activeIndex = NAV_ITEMS.findIndex((item) =>
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href),
            );
            const hoveredIndex = hoveredPath
              ? NAV_ITEMS.findIndex((item) => item.href === hoveredPath)
              : -1;

            const targetIndex =
              hoveredIndex !== -1 ? hoveredIndex : activeIndex;

            return (
              <>
                {targetIndex !== -1 && (
                  <motion.div
                    className="absolute left-2 right-2 h-[36px] bg-[#202020] rounded-[3px] z-0"
                    initial={false}
                    animate={{
                      y: targetIndex * 40,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 35,
                      mass: 0.8,
                    }}
                  />
                )}
                {NAV_ITEMS.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = idx === activeIndex;
                  const isHovered = idx === hoveredIndex;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      onMouseEnter={() => setHoveredPath(item.href)}
                      className={cn(
                        'relative flex items-center h-[36px] gap-2 px-2 text-[13px] tracking-[-0.25px] transition-colors rounded-[3px] z-10',
                        isActive
                          ? 'bg-[#202020] text-white'
                          : isHovered
                            ? 'text-white'
                            : 'text-white/80',
                      )}
                    >
                      <Icon
                        size={14}
                        className={cn(
                          'transition-colors',
                          isActive || isHovered
                            ? 'text-white/90'
                            : 'text-white/60',
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </>
            );
          })()}
        </nav>

        <div className=" space-y-1 p-2 ">
          <div className="flex items-center gap-2  p-1 rounded-[3px] transition-colors bg-[#1B1B1B] ">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="h-8 w-8 rounded-[2px] object-cover"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-neutral-700 flex items-center justify-center text-[12px] font-medium text-white shrink-0">
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
          </div>
        </div>
      </aside>
    </>
  );
}
