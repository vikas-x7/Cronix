'use client';

import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import type { DocSection } from '../data/sections';

export default function TocSidebar({
  sections,
  activeSection,
  setActiveSection,
}: {
  sections: DocSection[];
  activeSection: string;
  setActiveSection: (id: string) => void;
}) {
  function handleSubClick(subId: string) {
    const el = document.getElementById(subId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div
      className="w-[260px] shrink-0 border-l border-neutral-800 overflow-y-auto slim-scrollbar p-4"
      onMouseLeave={() => {}}
    >
      <p className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider mb-4 px-2">
        On This Page
      </p>
      <nav className="relative flex flex-col gap-0.5 overflow-hidden">
        {(() => {
          const activeIndex = sections.findIndex((s) => s.id === activeSection);

          const getSliderY = (index: number) => {
            let y = 0;
            for (let i = 0; i < index; i++) {
              y += 34;
              const s = sections[i];
              if (i === activeIndex && s && s.subSections.length > 0) {
                y += s.subSections.length * 30 + 6;
              }
            }
            return y;
          };

          return (
            <>
              {activeIndex !== -1 && (
                <motion.div
                  className="absolute inset-x-0 h-[32px] bg-white/[0.07] rounded-[4px] z-0"
                  initial={false}
                  animate={{ y: getSliderY(activeIndex) }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                />
              )}
              {sections.map((section) => {
                const isActive = activeSection === section.id;

                return (
                  <div key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'relative z-10 flex items-center h-[32px] w-full px-3 text-[13px] text-left rounded-[4px] transition cursor-pointer',
                        isActive
                          ? 'bg-[#202020] text-white'
                          : 'text-neutral-400 hover:text-white',
                      )}
                    >
                      {section.title}
                    </button>

                    {isActive && section.subSections.length > 0 && (
                      <div className="relative ml-4 flex flex-col gap-[2px] mt-0.5 mb-1">
                        {section.subSections.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleSubClick(sub.id)}
                            className="relative z-10 flex items-center h-[28px] px-3 text-[12px] transition cursor-pointer text-left rounded-[3px] text-neutral-500 hover:text-white"
                          >
                            {sub.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          );
        })()}
      </nav>
    </div>
  );
}
