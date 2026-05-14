'use client';

import React from 'react';
import Link from 'next/link';
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1C1A16] text-white pt-20 pb-10 ">
      <div className="container mx-auto">
        <div className="mb-20">
          <div className="px-8">
            <p className="text-sm text-white mb-2 tracking-[-0.75px] leading-0">
              As Vanilla Ice Once Said,
            </p>
            <h2 className="text-xl md:text-2xl font-medium mb-10 tracking-[-1px]">
              Anything less than the best is a felony.
            </h2>
          </div>
          <h1 className="text-[20vw] text-[#FAFAFA] font-extrabold overflow-hidden tracking-[-30px]  ml-[-10px] leading-[300px]">
            Cronixforyou
          </h1>
        </div>

        <div className=" px-7 mx-auto">
          <div className="flex flex-wrap items-center gap-6 mb-12">
            <Link
              href="mailto:hey@cronix.com"
              className="flex items-center gap-2 bg-[#FAFAFA] text-black px-4 py-1 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              hey@cronix.com <FiArrowUpRight size={18} />
            </Link>

            <div className="flex gap-4 text-white/30">
              <Link href="#" className="hover:text-white transition-colors">
                <FaXTwitter size={20} />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FaLinkedinIn size={20} />
              </Link>
            </div>
          </div>

          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                alt=""
                className="w-10"
              />
              <div className="text-xs text-white/30">
                <p>Based In The Beautiful</p>
                <p>India & Online Worldwide</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 text-sm text-white/30">
              <Link href="#" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Set Cron now
              </Link>
            </div>
          </div>

          <div className="text-xs text-white/30 border-t border-white/10 pt-8">
            <p>Cronix © {currentYear} All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
