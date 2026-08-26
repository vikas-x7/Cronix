'use client';

import React from 'react';
import Link from 'next/link';
import { MdArrowForward } from 'react-icons/md';
import { BiSolidSquare } from 'react-icons/bi';
import { FiGithub } from 'react-icons/fi';

const NAV_LINKS = [
  { name: 'Features', id: 'features' },
  {
    name: 'GitHub',
    href: 'https://github.com/vikas-x7/cronix',
    external: true,
  },
  { name: 'Get start', href: '/dashboard' },
  { name: 'FAQ', id: 'faq' },
];

const Navbar = () => {
  const handleSmoothScroll = (id: string) => {
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

      <div className="w-full">
        <div className="flex h-12 items-center justify-between">
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

          <Link
            href="/login"
            className="text-[15px] font-medium px-3 py-1.5 rounded-[3px] bg-[#f7f7f7] hover:bg-[#e5e5e5] transition-colors cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
