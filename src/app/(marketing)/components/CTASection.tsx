"use client";

import React from "react";
import { HiArrowRight } from "react-icons/hi"; // react-icons use kiya hai

const CTASection = () => {
  return (
    <section className="bg-white py-24 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-4xl font-medium -tracking-[1px] md:text-5xl lg:text-[30px]">
          Schedule Your First Cron Job <br className="hidden md:block" />
          in Minutes.
        </h2>

        <p className="mb-10 text-lg text-gray-500 md:text-[14px] ">
          Set up your first automated task today and let Cronix handle the
          heavy lifting for you.
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="group flex w-full items-center justify-center gap-2  bg-black px-4 py-2 text-sm text-white transition-all hover:bg-gray-800 sm:w-auto">
            Get started
            <HiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
          </button>

          <button className="w-full rounded-md border border-gray-200 bg-white px-8 py-4 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-50 sm:w-auto">
            Book a demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
