'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white pt-20 overflow-hidden border-t border-black/5">
      <div className="container mx-auto px-4 md:px-8 w-7xl">
        <div className="flex justify-between">
          <div className="relative mt-10 select-none">
            <h1 className="text-[5vw] font-bold leading-none tracking-tighter text-black text-start md:text-[40vw] lg:text-[5vw]">Cronix</h1>

            <div className="absolute inset-0 bg-linear-to-t from-white/30 to-transparent pointer-events-none" />
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 py-8 border-t border-gray-100">
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Use cases
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Blog
            </Link>

            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              About
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Help center
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-10 gap-4 ">
          <p className="text-xs text-black/80">© {currentYear} Cronix. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs ">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
