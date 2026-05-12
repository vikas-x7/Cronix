import React from 'react';

const UseCases = () => {
  return (
    <section id="use-cases" className="px-4 sm:px-6 md:px-10 lg:px-15">
      <div className="mx-auto mb-12 md:mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-12 md:mt-20 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-[44px] leading-tight md:leading-10  font-medium -tracking-[1px] md:-tracking-[2px]">
              Built for every <br /> workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="border-l border-black/30 pl-4">
              <p className="font-medium">Data intake</p>
              <p className="text-sm text-black/50 mt-2">
                Validate incoming records instantly
              </p>
            </div>

            <div className="border-l border-black/30 pl-4">
              <p className="font-medium">Data enrichment</p>
              <p className="text-sm text-black/50 mt-2">
                Clean fields and enrich profiles
              </p>
            </div>

            <div className="border-l border-black/30 pl-4">
              <p className="font-medium">Live analytics</p>
              <p className="text-sm text-black/50 mt-2">
                Track quality and job outcomes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-10 bg-[#84d2e5] rounded-lg">
        <img
          src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1776047742/Screenshot_from_2026-04-13_08-04-05_pxglzw.png"
          alt="Erica AI data automation dashboard"
          className="rounded-[5px] w-full"
        />
      </div>
    </section>
  );
};

export default UseCases;
