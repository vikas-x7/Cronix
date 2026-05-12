'use client';

import React from 'react';
import { HiArrowRight } from 'react-icons/hi';

const CTASection = () => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-3xl text-center">
        {/* Label */}

        {/* Heading */}
        <h2 className="mb-6 text-5xl md:text-6xl font-medium -tracking-[2px] text-black leading-[1.1]">
          Schedule Your First Cron Job in Minutes.
        </h2>

        {/* Subtext */}
        <p className="mb-10 text-lg text-gray-600 max-w-md">
          Set up your first automated task today and let Cronix handle the heavy
          lifting for you.
        </p>

        {/* Input/CTA Group */}
        <div className="flex w-full max-w-md bg-gray-50 border border-gray-200 p-1 rounded-md">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
          />
          <button className="flex items-center gap-2 bg-black text-white px-5 py-2 text-sm rounded transition-transform hover:opacity-80">
            Subscribe
            <HiArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
