"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiPlusSquare,
  FiClock,
  FiActivity,
  FiSettings,
  FiBookOpen,
} from "react-icons/fi";

export default function Sidebar() {
  const pathname = usePathname();

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
      name: "Status",
      href: "/dashboard/status",
      icon: FiActivity,
    },
    {
      name: "Setting",
      href: "/dashboard/settings",
      icon: FiSettings,
    },
    {
      name: "Documentation",
      href: "/dashboard/docs",
      icon: FiBookOpen,
    },
  ];

  return (
    <aside className="h-screen w-[240px] bg-[#FAFAFA] border-r border-[#cfcfcf] flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center py-3 px-3  gap-2">
          <img
            src="https://i.pinimg.com/736x/e4/0e/00/e40e00f5f4b301901581046001bfbd61.jpg"
            alt=""
            className="w-6 h-6 rounded-[4px]"
          />
          <Link href="/">
            <span className="text-[18px] tracking-tight">Cronix</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex flex-col px-2 py-4">
            <p className="text-[#797979] text-[13px] px-2 mb-2">
              Product
            </p>

            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-[14px]  transition
                    ${
                      active
                        ? "bg-[#1f1f1f] text-white"
                        : "text-[#bdbdbd] hover:bg-[#1a1a1a] hover:text-white"
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

      {/* Bottom Profile */}
      <div className="border-t border-[#2b2b2b] p-3">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-[4px]"
            alt=""
          />
          <div>
            <p className="text-sm">Vikas Pal</p>
            <p className="text-xs text-[#8a8a8a]">
              vikas@email.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}