'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { HiArrowRight } from 'react-icons/hi';

const CTASection = () => {
  return (
    <section className="relative h-[60vh] my-40 px-4 flex items-center ">
      {/* Background Image Wrapper */}
      <div className="absolute inset-0 px-5">
        <div className="relative h-full w-full overflow-hidden ">
          <img
            src="https://cronix-seven.vercel.app/image/bg.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-5xl text-center">
        <h2 className="mb-2 text-4xl font-medium -tracking-[4px] text-white md:text-5xl lg:text-[50px]">
          Schedule Your First Cron Job in Minutes.
        </h2>

        <p className="mb-5 text-lg text-white md:text-[17px]">
          Set up your first automated task today and let Cronix handle the heavy
          lifting for you.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="group flex w-full rounded-[3px] cursor-pointer items-center justify-center gap-2 bg-white px-4 py-2 text-sm text-black transition-all hover:bg-gray-200 sm:w-auto">
            Get started
            <HiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
