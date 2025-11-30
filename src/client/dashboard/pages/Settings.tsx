'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { FiUser, FiMail, FiClock } from 'react-icons/fi';
import PageLoader from '../components/PageLoader';

export default function Settings() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === 'loading') {
    return <PageLoader />;
  }

  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="border-b px-4 py-4 border-[#E5E5E5]">
        <h1 className="text-[20px] -tracking-[1px]">Settings</h1>
      </div>

      <div className="max-w-2xl px-6 py-6">
        {/* Profile */}
        <div className="border border-[#E5E5E5] p-5 mb-6">
          <h2 className="text-[14px] font-medium text-[#171717] mb-4">Profile</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FiUser size={14} className="text-neutral-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Name</p>
                <p className="text-[13px] text-[#171717]">{user?.name ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMail size={14} className="text-neutral-400" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Email</p>
                <p className="text-[13px] text-[#171717]">{user?.email ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="border border-[#E5E5E5] p-5">
          <h2 className="text-[14px] font-medium text-[#171717] mb-4">Preferences</h2>
          <div className="flex items-center gap-3">
            <FiClock size={14} className="text-neutral-400" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400">Default Timezone</p>
              <p className="text-[13px] text-[#171717]">UTC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
