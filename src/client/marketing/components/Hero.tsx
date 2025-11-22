"use client";

import { GoArrowRight } from "react-icons/go";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-whtie text-black pt-20 pb-10 md:pt-32">
      <div className="container mx-auto px-4 text-center ">
        <div className="mb-6 inline-block rounded-full border border-[#ECECEC] px-4 py-1 ">
          <p className="text-[12px] font-normal text-[#525252] md:text-[11px]">
            Schedule, automate, and never miss a job
          </p>
        </div>

        <h1 className="mx-auto mb-4 max-w-4xl text-4xl -tracking-[4px]  md:text-[58px] leading-15">
          Better way to schedule cron jobs <br /> for Modern Applications
        </h1>

        <p className="mx-auto mb-7 max-w-xl font-normal text-lg md:text-[16px] text-[#737373]">
          Manage scheduled jobs, automate workflows, trigger APIs, and monitor
          job runs, logs, and execution history from one powerful dashboard.
        </p>

        <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row ">
          <button className="flex w-full items-center justify-center gap-2  border border-gray-300  px-3 py-2   transition-all hover:bg-gray-50 sm:w-auto text-[12px] font-medium">
            Book a demo <GoArrowRight />
          </button>
          <button className="flex w-full items-center justify-center gap-2  bg-[#171717] px-3 py-2  text-white transition-all  sm:w-auto text-[12px] font-medium">
            Get started - it&apos;s free <GoArrowRight />
          </button>
        </div>
        <div className="flex items-center w-full justify-center">
          <div className="relative w-6xl h-150 mt-10 overflow-hidden">
            <img
              src="https://i.pinimg.com/1200x/78/3a/50/783a50a193083ef4156c1d3b979fc5d0.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover rounded-[4px]"
            />

            <div className="absolute inset-0 flex items-center justify-center p-15">
              <img
                src="https://res.cloudinary.com/dyv9kenuj/image/upload/q_auto/f_auto/v1775595036/Screenshot_from_2026-04-08_02-19-31_wsbnty.png"
                alt=""
                className="w-full rounded-[5px] relative z-10 border-12 border-white/30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
