'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="w-full bg-white pt-20 overflow-hidden border-t border-black/5  px-15">
        <div className="container mx-auto ">
          <div className="flex justify-between">
            <div className="relative mt-10 select-none">
              <h1 className="text-[5vw] font-normal leading-none tracking-tighter text-black text-start md:text-[40vw] lg:text-[5vw]">
                Cronix
              </h1>

              <div className="absolute inset-0 bg-linear-to-t from-white/30 to-transparent pointer-events-none" />
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 py-8 border-t border-gray-100">
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Use cases
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Blog
              </Link>

              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Help center
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-10 gap-4 ">
            <p className="text-xs text-black/80">
              © {currentYear} Cronix. All rights reserved.
            </p>
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

      <div className="relative flex justify-center items-center w-full">
        {/* Top to bottom white gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/5 to-transparent pointer-events-none w-full h-full"></div>
        <img
          src="https://i.pinimg.com/1200x/01/fb/fe/01fbfebf98664750ef1fe1cdb478df50.jpg"
          alt=""
          className="w-full h-[60vh] object-cover object-top"
        />
      </div>
    </>
  );
};

export default Footer;
