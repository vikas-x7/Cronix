/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { IoAdd } from "react-icons/io5";
import {
  FiHome,
  FiPlusSquare,
  FiClock,
  FiActivity,
  FiSettings,
} from "react-icons/fi";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const userName = user?.name ?? "Signed in user";
  const userEmail = user?.email ?? "No email available";

  const menu = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: FiHome,
    },
    {
      name: "Create new",
      href: "/dashboard/create",
      icon: FiPlusSquare,
    },
    {
      name: "Cronjobs",
      href: "/dashboard/cronjobs",
      icon: FiClock,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: FiActivity,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: FiSettings,
    },
  ];

  return (
    <aside className="h-screen bg-[#FAFAFA] border-r border-[#E5E5E5] flex flex-col justify-between">
      <div>
        <div className="flex items-center px-3 h-15 gap-2">
          <img
            src="https://i.pinimg.com/736x/e4/0e/00/e40e00f5f4b301901581046001bfbd61.jpg"
            alt=""
            className="w-8 h-8 rounded-sm"
          />
          <Link href="/">
            <span className="text-[21px] tracking-tight">Cronix</span>
          </Link>
        </div>

        <nav>
          <div className="flex justify-center items-center px-2">
            <Link href="/dashboard/create" className="w-full">
              <button
                className="w-full h-8.25 bg-white border border-[#D9D9D9] border-dashed text-[13px]
              text-[#5a5959] font-medium flex items-center justify-center gap-1 hover:border-[#171717] hover:text-[#171717] transition"
              >
                <IoAdd size={18} />
                New cronjob
              </button>
            </Link>
          </div>
          <ul className="flex flex-col px-2 py-4">
            {menu.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 text-[12px] rounded-[3px] transition
                    ${active
                        ? "bg-[#E5E5E5] text-[#171717]"
                        : "text-[#171717] hover:bg-[#F5F5F5] hover:text-[#171717]"
                      }`}
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

      <div className="border-t border-[#E5E5E5] p-3">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <img
              src={user.image}
              className="w-8 h-8 rounded-sm object-cover"
              alt={userName}
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-black text-xs text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[14px] text-black">{userName}</p>
            <p className="truncate text-xs text-[#8a8a8a]">{userEmail}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-3 w-full border border-[#d8d8d8] px-3 py-2 text-sm text-black transition hover:bg-black hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
