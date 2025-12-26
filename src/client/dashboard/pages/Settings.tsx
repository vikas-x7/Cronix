'use client';

import { FcGoogle } from 'react-icons/fc';
import { MdVerified } from 'react-icons/md';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { IoIosLogOut } from 'react-icons/io';

export default function Settings({ user }: { user: any }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const jobsCreatedCount = user?.cronJobs?.length || 0;
  const displayMemberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date';

  return (
    <div className="h-full w-full">
      <div className="">
        <div className="bg-white  text-sm   overflow-hidden shadow-sm">
          <div className="h-32 bg-[#FAFAFA] border-b border-[#DDDDDD] w-full" />
          <div className="px-6 pb-6 relative">
            <div className="relative -mt-12 h-24 w-24">
              {user.image ? (
                <img src={user.image} alt={user.name || 'User'} className="h-24 w-24 rounded object-cover  shadow-sm " />
              ) : (
                <div className="h-24 w-24 rounded-2xl bg-gray-200 border-4 border-white shadow-sm flex items-center justify-center text-4xl font-semibold text-gray-500">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="mt-4 pb-2">
              <h1 className="text-[20px]  text-[#111111]">{user.name || 'Vikas Pal'}</h1>
              <p className="text-[11px] text-gray-500 mt-0.5">{user.email}</p>
              <div className="mt-4 flex items-center space-x-3">
                <span className="inline-flex items-center space-x-1.5  bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  <MdVerified className="text-green-600" size={14} />
                  <span>Verified</span>
                </span>
                <span className="inline-flex items-center space-x-1.5  bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-700 ring-1 ring-inset ring-gray-500/20">
                  <FcGoogle size={14} />
                  <span>Google</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="  bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-[14px] font-semibold text-[#111111]">Account Details</h3>
          </div>
          <div className="px-6 py-2">
            <ul className="text-[13px] divide-y divide-gray-100">
              <li className="flex justify-between py-4">
                <span className="text-gray-500">Full name</span>
                <span className="text-[#111111] ">{user.name || 'Vikas Pal'}</span>
              </li>
              <li className="flex justify-between py-4">
                <span className="text-gray-500">Email address</span>
                <span className="text-[#111111] ">{user.email}</span>
              </li>
              <li className="flex justify-between py-4">
                <span className="text-gray-500">Member since</span>
                <span className="text-[#111111] ">{displayMemberSince}</span>
              </li>
              <li className="flex justify-between py-4">
                <span className="text-gray-500">Jobs created</span>
                <span className="text-[#111111] ">{jobsCreatedCount}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className=" bg-white shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-[14px] font-semibold text-[#111111]">Account Actions</h3>
          </div>
          <div>
            <ul className="text-[13px] divide-y divide-gray-100">
              <li className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="font-medium text-[#111111]">Export Data</p>
                  <p className="text-[12px] text-gray-500 mt-1">Download all your cron jobs and execution logs</p>
                </div>
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-400 ring-1 ring-inset ring-gray-200">Coming Soon</span>
              </li>
              <li className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="font-medium text-[#111111]">Log Out</p>
                  <p className="text-[12px] text-gray-500 mt-1">Sign out of your account on this device</p>
                </div>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="bg-white border border-[#DDDDDD] text-[#111111] hover:bg-[#F5F5F5] transition px-4 py-1.5 rounded-[3px] text-[12px] font-medium cursor-pointer flex items-center gap-2"
                >
                  <IoIosLogOut size={16} />
                  Log Out
                </button>
              </li>
              <li className="flex items-center justify-between px-6 py-5 bg-[#fff8f8]">
                <div>
                  <p className="font-medium text-[#dc2626]">Delete Account</p>
                  <p className="text-[12px] text-red-500 mt-1">Permanently delete your account and all data</p>
                </div>
                <span className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-[11px] font-medium text-gray-400 ring-1 ring-inset ring-gray-200 shadow-sm">Coming Soon</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-[3px] shadow-xl w-full max-w-sm border border-[#DDDDDD] animate-in zoom-in-95 duration-200">
            <h2 className="text-lg  text-[#171717] font-medium mb-2">Confirm Logout</h2>
            <p className="text-[12px] text-[#444444] mb-6">Are you sure you want to sign out? You will need to log in again to access your dashboard.</p>
            <div className="flex justify-end gap-3 ">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-4 py-2 text-[12px] text-[#171717] bg-[#F5F5F5] hover:bg-[#E5E5E5] rounded-[3px] transition  cursor-pointer">
                Cancel
              </button>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 text-[12px] text-white bg-black hover:bg-[#222222] rounded-[3px] transition cursor-pointer ">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
