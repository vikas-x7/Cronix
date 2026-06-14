import Image from 'next/image';
import Link from 'next/link';
import { TfiArrowTopRight } from 'react-icons/tfi';
import { VscArrowLeft, VscArrowRight } from 'react-icons/vsc';
import MovingHeading from './MovingHeading';
import UseCases from './UseCases';

const Hero = () => {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative  w-full overflow-hidden bg-[#ffffff] px-1 sm:px-6 mt-9 md:px-1"
    >
      <div className="relative z-10 flex  flex-col justify-start px-2 sm:px-5">
        <div className="flex flex-col  md:flex-row items-center md:items-center justify-between pt-20 sm:pt-24 md:mt-[-10px]">
          <div className="text-black max-w-4xl flex flex-col items-start w-full">
            <h1
              id="hero-heading"
              className="text-[13vw] leading-12 text-start font-bold tracking-[-3px] sm:text-3xl md:text-5xl lg:text-[83px] sm:font-semibold t sm:tracking-[-2px] md:tracking-[-3px] lg:tracking-[-7px] sm:leading-17 uppercase"
            >
              SCHEDULE ANY HTTP WORKFLOW
            </h1>
            <p className="tracking-[-0.5px] sm:tracking-[-0.75px] mt-4 text-[13px] sm:text-[18px] text-black/80">
              Automate HTTP requests with cron jobs, webhooks, and real-time
              monitoring.
            </p>

            <div className="flex w-full flex-col  items-start justify-between gap-6 py-6 sm:py-8 md:flex-row md:items-end">
              <div className="flex flex-row gap-8 sm:gap-16">
                <div className="flex items-center   gap-1">
                  <Link
                    href="/login"
                    className="text-[13px]  flex items-center px-4 py-1 gap-1 sm:text-[15px]  sm:tracking-[-0.5px] text-white bg-black rounded-[3px] font-medium"
                  >
                    Get start with cronix
                    <TfiArrowTopRight size={15} className="mt-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-black hidden max-w-4xl sm:flex flex-col items-end w-full mt-20 sm:mt-0">
            <h1
              id="hero-heading"
              className="text-end mb-26 text-3xl sm:text-4xl md:text-5xl lg:text-[83px] font-semibold tracking-[-1px] sm:tracking-[-2px] md:tracking-[-3px] lg:tracking-[-8px] sm:leading-17 uppercase md:-mt-17"
            >
              MOVE FASTER <br /> EVERY DAY
            </h1>
          </div>
        </div>

        <div>
          <div className="flex flex-col md:flex-row justify-between mt-20 sm:mt-34 gap-4 text-black/80 font-medium uppercase tracking-[-0.5px]"></div>

          <UseCases />
        </div>
      </div>
    </section>
  );
};

export default Hero;
