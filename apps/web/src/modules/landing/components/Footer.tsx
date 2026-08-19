'use client';

import React from 'react';
import Link from 'next/link';
import { FiGithub } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSmoothScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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
                <button
                  onClick={() => handleSmoothScroll('features')}
                  className="text-xs sm:text-sm font-medium hover:text-black transition-colors cursor-pointer"
                >
                  Features
                </button>
                <Link
                  href="/dashboard"
                  className="text-xs sm:text-sm font-medium hover:text-black transition-colors"
                >
                  Documentation
                </Link>
                <button
                  onClick={() => handleSmoothScroll('faq')}
                  className="text-xs sm:text-sm font-medium hover:text-black transition-colors cursor-pointer"
                >
                  FAQ
                </button>
                <Link
                  href="https://github.com/vikas-x7/cronix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-medium hover:text-black transition-colors flex items-center gap-1"
                >
                  <FiGithub size={14} />
                  GitHub
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
        {/* <div className="absolute z-10 inset-0 bg-gradient-to-b from-white via-white/10 to-transparent pointer-events-none w-full h-full"></div> */}
        <img
          src="https://i.pinimg.com/1200x/29/e8/96/29e896a1be149f343c8016c8577ab85a.jpg"
          alt=""
          className="w-full h object-cover object-top grayscale"
        />
      </div>
    </>
  );
};

export default Footer;
