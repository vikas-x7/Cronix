'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IoAddSharp } from 'react-icons/io5';
import { sections } from '../data/sections';
import TocSidebar from './toc-sidebar';

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('updates');

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0D0D0D] pr-2">
      <div className="py-3 bg-[#0D0D0D] flex justify-between items-center">
        <h1 className="text-[20px] -tracking-[1px] text-white">
          Documentation
        </h1>
        <Link href="/schedule">
          <button className="bg-white/90 text-black px-3 py-1.5 rounded-[3px] text-[12px] font-medium flex items-center gap-1.5 hover:bg-neutral-200 transition cursor-pointer">
            <IoAddSharp size={14} />
            Schedule New Job
          </button>
        </Link>
      </div>

      <div className="bg-[#1F1F1F] rounded-[10px] h-[92vh] flex">
        <div className="flex-1 overflow-y-auto slim-scrollbar px-10 py-8">
          {sections.map((section) =>
            section.id === activeSection ? (
              <div key={section.id} className="max-w-3xl">
                <div className="mb-6">
                  <h2 className="text-[22px] font-semibold text-white tracking-[-0.5px]">
                    {section.title}
                  </h2>
                </div>
                <div className="text-[15px] text-neutral-300 leading-relaxed">
                  {section.content}
                </div>
              </div>
            ) : null,
          )}
        </div>

        <TocSidebar
          sections={sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </div>
    </div>
  );
}
