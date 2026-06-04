'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
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
  FiBook,
  FiCalendar,
} from 'react-icons/fi';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/modules/auth';
import { BiSolidSquare, BiUnite } from 'react-icons/bi';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: FiLayout },
  { label: 'Executions', href: '/executions', icon: FiActivity },
  { label: 'Cron Jobs', href: '/jobs', icon: FiClock },
  { label: 'Schedule', href: '/schedule', icon: FiCalendar },

  { label: 'Analytics', href: '/analytics', icon: FiTrendingUp },
  { label: 'Workspaces', href: '/workspaces', icon: FiGrid },
  { label: 'Webhooks', href: '/webhooks', icon: FiLink },
  { label: 'Documentation', href: '/documentation', icon: FiBook },
  { label: 'Settings', href: '/settings', icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const user = useAuthStore((s) => s.user);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (
        ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'U'
      );
    }
    return name.slice(0, 2).toUpperCase();
  };

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
            <span className="text-[10px] ml-2 text-neutral-500">v2.0.0</span>
          </span>
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

            const getSliderY = (index: number) => {
              let y = index * 40;
              if (index > 1) y += 4;
              if (index > 5) y += 4;
              if (index > 7) y += 4;
              return y;
            };

            return (
              <>
                <motion.div
                  className="absolute left-2 right-2 h-[36px] bg-[#202020] rounded-[3px] z-0"
                  initial={false}
                  animate={{
                    y: getSliderY(activeIndex),
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                />

                {hoveredIndex !== -1 && hoveredIndex !== activeIndex && (
                  <motion.div
                    className="absolute left-2 right-2 h-[36px] bg-white/5 rounded-[3px] z-0"
                    initial={false}
                    animate={{
                      y: getSliderY(hoveredIndex),
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
                    <React.Fragment key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        onMouseEnter={() => setHoveredPath(item.href)}
                        className={cn(
                          'relative flex items-center h-[36px] gap-2 px-2 text-[13px] tracking-[-0.25px] transition-colors rounded-[3px] z-10 ',
                          isActive
                            ? 'text-white'
                            : isHovered
                              ? 'text-white'
                              : 'text-white/90',
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
                      {(idx === 2 || idx === 5 || idx === 7) && (
                        <div className=" border-b  border-white/20 border-dashed  mx-1 z-10" />
                      )}
                    </React.Fragment>
                  );
                })}
              </>
            );
          })()}
        </nav>

        <div className="px-2 pt-1">
          <div className="bg-[#1F1F1F] rounded-[5px] p-2 text-left shadow-sm">
            <h4 className="text-[13px] tracking-[-1px] font-semibold text-white leading-tight">
              Get more on{' '}
              <span className="text-[#DF5BCC] font-bold">Cronix</span>
            </h4>
            <p className="text-[11px] text-white/70 mt-0.5 tracking-[-0.5px]">
              Your trial has expired
            </p>
            <button className="w-full mt-3.5 bg-white/90 hover:bg-white text-black text-[12px] font-medium py-1.5 rounded-[3px] transition-colors duration-200 cursor-pointer">
              Upgrade
            </button>
          </div>
        </div>

        <div className=" space-y-1 p-2 ">
          <div className="flex items-center gap-2  p-1 rounded-[3px] transition-colors bg-[#1B1B1B] ">
            {user?.avatar && !imageError ? (
              <img
                src={user!.avatar}
                alt={user!.name || 'User'}
                className="h-8 w-8 rounded-[2px] object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-8 w-8 rounded-[2px] bg-neutral-700 flex items-center justify-center text-[12px] font-medium text-white shrink-0">
                {getInitials(user?.name)}
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
