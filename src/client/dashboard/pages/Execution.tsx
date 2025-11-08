"use client";

import React from "react";
import { HiDotsVertical } from "react-icons/hi";

export const Execution = () => {
  const events = [
    {
      id: 1,
      status: "Successful (200 OK)",
      url: "https://aly-six.vercel.app/",
      time: "Today at 3:14:10 AM",
    },
    {
      id: 2,
      status: "Successful (200 OK)",
      url: "https://aly-six.vercel.app/",
      time: "Today at 3:13:07 AM",
    },
    {
      id: 3,
      status: "Successful (200 OK)",
      url: "https://aly-six.vercel.app/",
      time: "Today at 3:12:11 AM",
    },
    {
      id: 4,
      status: "Successful (200 OK)",
      url: "https://aly-six.vercel.app/",
      time: "Today at 3:11:07 AM",
    },
    {
      id: 5,
      status: "Successful (200 OK)",
      url: "https://aly-six.vercel.app/",
      time: "Today at 3:10:21 AM",
    },
  ];

  return (
    <div className="w-full  mt-10">
      <div className="">
        {/* Header Title */}
        <h2 className="my-10 text-[20px]  text-[#e7e7e7]">latest execution</h2>

        {/* Table Header */}
        <div className="grid grid-cols-12  pb-3 text-xs  uppercase tracking-wider ">
          <div className="col-span-6 md:col-span-5">Event</div>
          <div className="hidden md:col-span-5 md:block">Date</div>
          <div className="col-span-6 text-right md:col-span-2">Actions</div>
        </div>

        {/* Event List */}
        <div className="divide-y divide-gray-600/50">
          {events.map((event) => (
            <div
              key={event.id}
              className="grid grid-cols-12 items-center py-4 transition-colors border-[#2b2b2b]"
            >
              {/* Event Info */}
              <div className="col-span-11 flex items-start gap-4 md:col-span-5">
                <div>
                  <h4 className="text-[10px] font-medium text-white md:text-[14px]">
                    Cronjob execution:{" "}
                    <span className="font-normal ">{event.status}</span>
                  </h4>
                  <p className="mt-0.5 text-xs text-blue-400 underline underline-offset-2 opacity-80 cursor-pointer">
                    {event.url}
                  </p>
                  {/* Mobile Date - only visible on small screens */}
                  <p className="mt-1 block text-[10px] text-gray-400 md:hidden">
                    {event.time}
                  </p>
                </div>
              </div>

              {/* Desktop Date */}
              <div className="hidden text-[13px] text-gray-300 md:col-span-5 md:block">
                {event.time}
              </div>

              {/* Action Button */}
              <div className="col-span-1 flex justify-end md:col-span-2">
                <button className="flex items-center gap-1 rounded border border-[#2b2b2b] px-2 py-1 text-[10px] font-bold uppercase tracking-tighter text-gray-200 hover:bg-gray-600 md:px-3 md:py-1.5 md:text-xs">
                  <HiDotsVertical className="text-xs" />
                  DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
