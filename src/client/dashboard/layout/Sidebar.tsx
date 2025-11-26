'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FiHome, FiPlusSquare, FiClock, FiActivity, FiSettings } from 'react-icons/fi';
import { IoIosLogOut } from 'react-icons/io';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
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
      name: 'Cronjobs',
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
        <div className="flex items-center px-1 py-1 mt-3 ">
          <Image src="/image/cronixlog.png" alt="" className="w-8 h-8 rounded-sm" width={200} height={200} />
          <Link href="/">
            <span className="text-[18px] tracking-tight">Cronix</span>
          </Link>
        </div>

        <nav>
          <p className="text-[13px] px-2 pt-3 py-2">Product</p>
          <ul className="flex flex-col px-2 ">
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
        <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className=" px-3 py-2 text-sm bg-[#FAFAFA] text-black transition hover:bg-[#E5E5E5] rounded-[3px] cursor-pointer">
          <IoIosLogOut />
        </button>
      </div>
    </aside>
  );
}
