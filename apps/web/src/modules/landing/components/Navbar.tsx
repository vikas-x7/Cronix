'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HiOutlineX } from 'react-icons/hi';
import { MdArrowForward } from 'react-icons/md';
import { LiaGripLinesSolid } from 'react-icons/lia';
import { BiSolidSquare } from 'react-icons/bi';
import { FiGithub } from 'react-icons/fi';

const NAV_LINKS = [
  { name: 'Features', id: 'features' },

  { name: 'Docs', href: '/dashboard' },
  {
    name: 'GitHub',
    href: 'https://github.com/vikas-x7/cronix',
    external: true,
  },

  { name: 'Get start', href: '/dashboard' },
  { name: 'FAQ', id: 'faq' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSmoothScroll = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-5 ">
      <Link href="/dashboard" className="block">
        <div className="bg-[#F0F0F0] rounded-[2px] text-black w-full h-8 text-center flex items-center justify-center overflow-hidden px-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] cursor-pointer hover:bg-[#e5e5e5] transition-colors">
          <p className="tracking-[-0.5px] sm:tracking-[-1px] flex items-center gap-2 font-medium text-xs sm:text-sm whitespace-nowrap">
            <span className="text-[#DF5BCC]">Cronix.</span>version v2 is live
            now <MdArrowForward />
          </p>
        </div>
      </Link>

      <div className="container mx-auto">
        <div className="flex h-12  items-center justify-between">
          <div className="flex items-center gap-5 px-3 py-2 rounded-[3px] transition-colors duration-300 bg-[#f7f7f7]">
            <Link href="/" className="flex items-center">
              <BiSolidSquare size={25} className="text-[#DF5BCC]" />
              <h1 className="text-[19px] font-bold tracking-[-1px]">Cronix.</h1>
            </Link>
            {NAV_LINKS.map((link) =>
              link.href ? (
                <Link
                  key={link.name}
                  href={link.href}
                  {...('external' in link && link.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="text-[14px] hover:opacity-70 font-medium mt-1 transition-opacity tracking-[-0.75px] flex items-center gap-1"
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleSmoothScroll(link.id!)}
                  className="text-[14px] hover:opacity-70 font-medium mt-1 transition-opacity tracking-[-0.75px] cursor-pointer"
                >
                  {link.name}
                </button>
              ),
            )}
          </div>

          <div className="flex lg:hidden items-center gap-2  px-3 py-1.5 rounded-[3px] bg-[#f7f7f7]">
            <Link href="/" className="flex items-center gap-2">
              <BiSolidSquare size={20} className="text-[#DF5BCC]" />
              <h1 className="text-[16px] font-bold tracking-[-1px]">Cronix.</h1>
            </Link>
          </div>

          <div className="relative">
            <button
              className="text-sm flex items-center gap-2 tracking-[-0.5px] sm:tracking-[-1px] cursor-pointer  px-3 py-1.5 rounded-[3px] bg-[#f7f7f7]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <span>Menu</span>
              {isOpen ? (
                <HiOutlineX size={24} />
              ) : (
                <LiaGripLinesSolid size={24} />
              )}
            </button>

            <div
              className={`absolute right-0 top-12 mt-2 w-[calc(100vw-2.5rem)] sm:w-94 max-w-sm bg-[#1F1F1F] text-white p-6 shadow-2xl rounded-[4px] border border-black/5 transition-transform duration-500 ease-out z-50 ${
                isOpen
                  ? 'translate-x-0 pointer-events-auto'
                  : 'translate-x-[200%] pointer-events-none'
              }`}
            >
              <div className="flex flex-col gap-2 mb-6">
                {NAV_LINKS.map((link) =>
                  link.href ? (
                    <Link
                      key={link.name}
                      href={link.href}
                      {...('external' in link && link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      onClick={() => setIsOpen(false)}
                      className="text-[22px] sm:text-[25px] font-light tracking-[-1px] text-left text-white/80 hover:text-white transition-colors flex items-center gap-2"
                    >
                      {'external' in link && link.external ? (
                        <FiGithub size={20} />
                      ) : null}
                      {link.name}
                    </Link>
                  ) : (
                    <button
                      key={link.name}
                      onClick={() => handleSmoothScroll(link.id!)}
                      className="text-[22px] sm:text-[25px] font-light tracking-[-1px] text-left text-white/80 hover:text-white transition-colors"
                    >
                      {link.name}
                    </button>
                  ),
                )}
              </div>

              <div className="border-t border-white/10 pt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
