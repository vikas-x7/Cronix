'use client';

import React from 'react';
import { HiArrowRight } from 'react-icons/hi';

const CTASection = () => {
  return (
    <section className="py-24 px-4 bg-white  h-screen flex items-center">
      <div className="container mx-auto max-w-5xl text-center flex flex-col items-center">
        <h2 className="mb-1 text-5xl md:text-6xl font-medium tracking-[-6px] text-black leading-[1.1]">
          Schedule Your First Cron Job in Minutes
        </h2>

        <p className="mb-3 text-lg text-black/80 ">
          Set up your first automated task today and let Cronix handle the heavy
          lifting for you.
        </p>

        <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[17px] mt-6 transition-all duration-400 rounded border cursor-pointer hover:bg-white hover:text-black ">
          Get started
          <HiArrowRight />
        </button>
      </div>
    </section>
  );
};

export default CTASection;
