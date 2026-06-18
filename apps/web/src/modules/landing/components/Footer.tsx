'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="w-full bg-white pt-10 lg:pt-20 overflow-hidden border-t border-black/5 px-5">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 lg:gap-0">
            <div className="relative mt-0 lg:mt-10 select-none">
              <h1 className="text-[25vw] leading-none font-semibold tracking-tighter text-black text-start md:text-[20vw] lg:text-[5vw]">
                Cronix
              </h1>
              <div className="absolute inset-0 bg-linear-to-t from-white/30 to-transparent pointer-events-none" />
            </div>
            <div className="space-y-6 w-full lg:w-auto">
              <div className="flex flex-wrap tracking-[-0.75px] items-center gap-x-6 gap-y-3 py-6 lg:py-8 border-t border-gray-100">
                <Link
                  href="#"
                  className="text-xs sm:text-sm font-medium hover:text-black transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="text-xs sm:text-sm font-medium hover:text-black transition-colors"
                >
                  Documentation
                </Link>
                <Link
                  href="#"
                  className="text-xs sm:text-sm font-medium hover:text-black transition-colors"
                >
                  API Reference
                </Link>
                <Link
                  href="#"
                  className="text-xs sm:text-sm font-medium hover:text-black transition-colors"
                >
                  Changelog
                </Link>
                <Link
                  href="#"
                  className="text-xs sm:text-sm font-medium hover:text-black transition-colors"
                >
                  Status
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-8 lg:py-10 gap-3 lg:gap-4">
            <p className="text-[10px] sm:text-xs text-black/60">
              © {currentYear} Cronix. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6">
              <Link
                href="#"
                className="text-[10px] sm:text-xs text-black/60 hover:text-black transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-[10px] sm:text-xs text-black/60 hover:text-black transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <div className="relative flex justify-center items-center w-full">
        {/* Top to bottom white gradient overlay */}
        <div className="absolute z-222 inset-0 bg-gradient-to-b from-white via-white/5 to-transparent pointer-events-none w-full h-full"></div>
        <img
          src="https://i.pinimg.com/originals/73/e9/91/73e991010ec134fbd0ab475172bd13f6.gif"
          alt=""
          className="w-full h-[70vh] object-cover  object-top grayscale"
        />
      </div>
    </>
  );
};

export default Footer;
