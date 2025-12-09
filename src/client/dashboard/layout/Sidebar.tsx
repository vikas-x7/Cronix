'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FiHome, FiPlusSquare, FiClock, FiActivity, FiSettings } from 'react-icons/fi';
import { IoIosLogOut } from 'react-icons/io';
import Image from 'next/image';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const user = session?.user;
  const userName = user?.name ?? 'Signed in user';
  const userEmail = user?.email ?? 'No email available';

  const menu = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: FiHome,
    },
    {
      name: 'Create new',
      href: '/dashboard/create',
      icon: FiPlusSquare,
    },
    {
      name: 'Cron Jobs',
      href: '/dashboard/cronjobs',
      icon: FiClock,
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: FiActivity,
    },

    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: FiSettings,
    },
  ];

  return (
    <aside className="h-screen bg-[#FAFAFA] border-r border-[#DDDDDD] flex flex-col justify-between">
      <div>
        <div className="flex items-center px-1 py-1 mt-3 border-b  border-[#DDDDDD]">
          <Image src="/image/cronixlog.png" alt="" className="w-8 h-8 rounded-sm" width={200} height={200} />
          <Link href="/">
            <span className="text-[18px] tracking-tight">Cronix</span>
          </Link>
        </div>

        <nav>
          <p className="text-[14px] px-2 pt-5 py-2 uppercase font-mono">Product</p>
          <ul className="flex flex-col px-2 gap-y-1 ">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 text-[12px] rounded-[1px] transition
                    ${active ? 'bg-[#E5E5E5] text-[#171717]' : 'text-[#171717] hover:bg-[#F5F5F5] hover:text-[#171717]'}`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="border-t border-[#DDDDDD] p-3 flex justify-between ">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <img src={user.image} className="w-8 h-8 rounded-sm object-cover" alt={userName} />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-black text-xs text-white">{userName.charAt(0).toUpperCase()}</div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[11px] text-black">{userName}</p>
            <p className="truncate text-[9px] text-[#8a8a8a]">{userEmail}</p>
          </div>
        </div>
        <button type="button" onClick={() => setIsLogoutModalOpen(true)} className=" px-3 py-2 text-sm bg-[#FAFAFA] text-black transition hover:bg-[#E5E5E5] rounded-[3px] cursor-pointer">
          <IoIosLogOut />
        </button>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-[3px] shadow-xl w-full max-w-sm border border-[#DDDDDD] animate-in zoom-in-95 duration-200">
            <h2 className="text-lg  text-[#171717] font-medium mb-2">Confirm Logout</h2>
            <p className="text-[12px] text-[#444444] mb-6">Are you sure you want to sign out? You will need to log in again to access your dashboard.</p>
            <div className="flex justify-end gap-3 ">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-[12px] text-[#171717] bg-[#F5F5F5] hover:bg-[#E5E5E5] rounded-[3px] transition  cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 text-[12px] text-white bg-black hover:bg-[#222222] rounded-[3px] transition cursor-pointer "
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}


    </aside>
  );
}
