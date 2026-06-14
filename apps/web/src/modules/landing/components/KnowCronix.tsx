'use client';

import React from 'react';
import Image from 'next/image';

const KnowCronix = () => {
  return (
    <div className="relative text-[#EBEBEB] bg-[#1C1A16] font-sans antialiased flex flex-col lg:flex-row min-h-screen lg:h-screen  overflow-hidden mt-40">
      <div className=" text-white flex-1 flex flex-col justify-between py-10 lg:py-0 z-10 px-6">
        <div>
          <div className="text-[12px] uppercase leading-tight font-mono mt-0 lg:mt-10 mb-20">
            BUILD: 01 <br /> CRONIX <br /> SYSTEM RUNNER
          </div>
        </div>
        <div className="my-10 lg:my-auto relative ">
          <h1 className="relative lg:absolute text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[8rem] lg:ml-[-10px] font-black text-white leading-[0.85] lg:leading-[0.8] tracking-[-5px] sm:tracking-[-10px] lg:tracking-[-13px] lg:top-[-120px] z-20 mb-8 lg:mb-0 select-none">
            know cronix.
          </h1>

          <div className="text-[16px] sm:text-[18px] leading-normal tracking-[-0.5px] sm:tracking-[-1px] text-[#ffffff] space-y-[2.5vh] lg:mt-[220px] ml-0 lg:ml-1 relative z-30">
            <p>
              A robust platform driven by the passion to automate even when the
              systems are scaling fast.
            </p>
            <p>
              The smart feature to sync webhooks when running tasks{' '}
              <br className="hidden sm:inline" /> seems harder. Fully built for
              those who host first and
              <br className="hidden sm:inline" /> manage it all locally.
            </p>
          </div>

          <button className="mt-8 sm:mt-10 lg:mt-[60px] bg-[#ffffff] px-5 py-2.5 text-black rounded-[3px] tracking-[-0.75px] font-medium hover:bg-white/90 transition-colors relative z-30">
            Getstart now{' '}
          </button>
        </div>
        <div className="hidden lg:block"></div>
      </div>

      <div className="relative w-full lg:w-1/2 h-[350px] sm:h-[450px] lg:h-full flex-shrink-0 mt-6 lg:mt-0">
        <img
          className="w-full h-full object-cover rounded-[4px] lg:rounded-none"
          src="https://i.pinimg.com/736x/81/af/17/81af17b2a0fa6d169d42ee2f914d0f04.jpg"
          alt="Cronix platform scene"
        />
      </div>
    </div>
  );
};

export default KnowCronix;
