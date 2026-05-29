import Image from 'next/image';
import Link from 'next/link';
import { TfiArrowTopRight } from 'react-icons/tfi';
import { VscArrowLeft, VscArrowRight } from 'react-icons/vsc';
import MovingHeading from './MovingHeading';

const Hero = () => {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative  w-full overflow-hidden bg-[#ffffff] px-4 sm:px-6 mt-9 md:px-1"
    >
      <div className="relative z-10 flex  flex-col justify-start px-2 sm:px-5">
        <div className="flex items-center justify-between  pt-20 sm:pt-24 md:mt-[-10px]">
          <div className="text-black max-w-4xl flex flex-col items-center md:items-start">
            <h1
              id="hero-heading"
              className="font-inter text-center  md:text-start text-3xl sm:text-4xl md:text-5xl lg:text-[87px] font-semibold tracking-[-1px] sm:tracking-[-2px] md:tracking-[-3px] lg:tracking-[-7px] leading-17 uppercase"
            >
              THE ONLY ASYNC <br /> FOR MANAGER
            </h1>
            <p className="tracking-[-0.75px] mt-4 text-black/80">
              lorem ipsum dolor sit amet consectetur adipisicing elit.
              Temporelorem ipsum dolor sit amet consectetur adipisicing elit.
              Tempore, voluptatibus!
            </p>
          </div>
          <div className="text-black max-w-4xl flex flex-col items-center md:items-start">
            <h1
              id="hero-heading"
              className="font-inter text-center  md:text-end text-3xl sm:text-4xl md:text-5xl lg:text-[87px] font-semibold tracking-[-1px] sm:tracking-[-2px] md:tracking-[-3px] lg:tracking-[-8px] leading-17 uppercase -mt-17"
            >
              TO LET YOU SHIP CODE FAST
            </h1>
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-between gap-6 py-6 sm:py-8 md:flex-row md:items-end">
          <div className="flex flex-row gap-8 sm:gap-16">
            <div className="bg-black flex items-center px-4 py-1  gap-1">
              <Link
                href="/login"
                className="text-[10px]  sm:text-[15px] uppercase tracking-[-0.05px] text-white bg-black"
              >
                Get start
              </Link>
              <p className="text-white">
                <TfiArrowTopRight />
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col md:flex-row justify-between mt-34 gap-4 text-black/80 font-medium uppercase tracking-[-0.5px]"></div>

          <div className="relative">
            <img
              className="h-full w-full object-cover object-[25%_center] "
              src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1782243146/bgimageforcronixc_jsovlx.avif"
              alt="Erica AI data automation background"
            />

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-1 mb-5">
                <div className="bg-[#DF5BCC] w-4 h-4 "></div>
                <h1 className="text-[20px] font-semibold tracking-[-1.5px]">
                  Cronix
                </h1>
              </div>

              <h2 className="max-w-5xl text-xl sm:text-2xl md:text-3xl lg:text-4xl md:tracking-[-3.25px] font-medium">
                Enterprise grade background jobs for your application
              </h2>

              <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl md:tracking-[-3.25px] font-medium">
                Reliable scheduling, seamless monitoring
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
