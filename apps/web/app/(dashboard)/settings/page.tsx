'use client';

import { FcGoogle } from 'react-icons/fc';
import { MdVerified } from 'react-icons/md';
import { useState } from 'react';
import { IoIosLogOut } from 'react-icons/io';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useAuthStore, useLogout } from '@/modules/auth';
import { useJobs } from '@/modules/jobs';
import { useThemeStore } from '@/shared/stores/themeStore';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { data: jobs } = useJobs();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const jobsCreatedCount = jobs?.length || 0;

  return (
    <div className="w-full h-screen overflow-y-auto bg-neutral-950">
      <div className="border-b px-4 py-3 bg-neutral-900/50 border-neutral-800 flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px] text-white">Settings</h1>
      </div>
      <div className="p-6">
        <div className="bg-neutral-900/50 border border-neutral-800 overflow-hidden">
          <div className="h-32 bg-neutral-900 border-b border-neutral-800 w-full" />
          <div className="px-6 pb-6 relative">
            <div className="relative -mt-12 h-24 w-24">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="h-24 w-24 rounded object-cover border-4 border-neutral-900"
                />
              ) : (
                <div className="h-24 w-24 rounded-2xl bg-neutral-800 border-4 border-neutral-900 flex items-center justify-center text-4xl font-semibold text-neutral-400">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="mt-4 pb-2">
              <h1 className="text-[20px] text-white">{user?.name || 'User'}</h1>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {user?.email}
              </p>
              <div className="mt-4 flex items-center space-x-3">
                <span className="inline-flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ring-emerald-500/20">
                  <MdVerified size={14} />
                  <span>Verified</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 bg-neutral-800 text-neutral-400 px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ring-neutral-700">
                  <FcGoogle size={14} />
                  <span>Google</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 overflow-hidden mt-4">
          <div className="px-6 py-5 border-b border-neutral-800">
            <h3 className="text-[14px] font-semibold text-white">
              Account Details
            </h3>
          </div>
          <div className="px-6 py-2">
            <ul className="text-[13px] divide-y divide-neutral-800">
              <li className="flex justify-between py-4">
                <span className="text-neutral-400">Full name</span>
                <span className="text-white">{user?.name || 'User'}</span>
              </li>
              <li className="flex justify-between py-4">
                <span className="text-neutral-400">Email address</span>
                <span className="text-white">{user?.email}</span>
              </li>
              <li className="flex justify-between py-4">
                <span className="text-neutral-400">Jobs created</span>
                <span className="text-white">{jobsCreatedCount}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 overflow-hidden mb-8 mt-4">
          <div className="px-6 py-5 border-b border-neutral-800">
            <h3 className="text-[14px] font-semibold text-white">
              Preferences
            </h3>
          </div>
          <div>
            <ul className="text-[13px] divide-y divide-neutral-800">
              <li className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="font-medium text-white">Appearance</p>
                  <p className="text-[12px] text-neutral-500 mt-1">
                    Switch between dark and light mode
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 transition px-4 py-1.5 text-[12px] font-medium cursor-pointer flex items-center gap-2"
                >
                  {theme === 'dark' ? (
                    <FiSun size={14} />
                  ) : (
                    <FiMoon size={14} />
                  )}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-neutral-800">
            <h3 className="text-[14px] font-semibold text-white">
              Account Actions
            </h3>
          </div>
          <div>
            <ul className="text-[13px] divide-y divide-neutral-800">
              <li className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="font-medium text-white">Export Data</p>
                  <p className="text-[12px] text-neutral-500 mt-1">
                    Download all your cron jobs and execution logs
                  </p>
                </div>
                <span className="inline-flex items-center bg-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-500 ring-1 ring-inset ring-neutral-700">
                  Coming Soon
                </span>
              </li>
              <li className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="font-medium text-white">Log Out</p>
                  <p className="text-[12px] text-neutral-500 mt-1">
                    Sign out of your account on this device
                  </p>
                </div>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 transition px-4 py-1.5 text-[12px] font-medium cursor-pointer flex items-center gap-2"
                >
                  <IoIosLogOut size={16} />
                  Log Out
                </button>
              </li>
              <li className="flex items-center justify-between px-6 py-5 bg-red-500/5">
                <div>
                  <p className="font-medium text-red-400">Delete Account</p>
                  <p className="text-[12px] text-red-400/70 mt-1">
                    Permanently delete your account and all data
                  </p>
                </div>
                <span className="inline-flex items-center bg-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-500 ring-1 ring-inset ring-neutral-700">
                  Coming Soon
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-700 p-6 w-full max-w-sm">
            <h2 className="text-lg text-white font-medium mb-2">
              Confirm Logout
            </h2>
            <p className="text-[12px] text-neutral-400 mb-6">
              Are you sure you want to sign out? You will need to log in again
              to access your dashboard.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-[12px] text-white bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="px-4 py-2 text-[12px] text-black bg-white hover:bg-neutral-200 transition cursor-pointer disabled:opacity-50"
              >
                {logout.isPending ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
