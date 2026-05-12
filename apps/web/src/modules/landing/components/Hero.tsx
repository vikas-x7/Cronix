import Image from 'next/image';

const Hero = () => {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative  w-full overflow-hidden bg-[#ffffff] px-4 sm:px-6 md:px-1 font-inter"
    >
      <div className="relative z-10 flex  flex-col justify-start px-2 sm:px-5">
        <div className="flex items-center justify-between  pt-20 sm:pt-24 md:mt-2">
          <div className="text-black max-w-4xl flex flex-col items-center md:items-start">
            <h1
              id="hero-heading"
              className="font-inter text-center  md:text-start text-3xl sm:text-4xl md:text-5xl lg:text-[87px] font-semibold tracking-[-1px] sm:tracking-[-2px] md:tracking-[-3px] lg:tracking-[-7px] leading-20 uppercase"
            >
              Better way <br /> schedule
            </h1>
          </div>
          <div className="text-black max-w-4xl flex flex-col items-center md:items-start">
            <h1
              id="hero-heading"
              className="font-inter text-center  md:text-end text-3xl sm:text-4xl md:text-5xl lg:text-[87px] font-semibold tracking-[-1px] sm:tracking-[-2px] md:tracking-[-3px] lg:tracking-[-7px] leading-20 uppercase"
            >
              Better way <br /> schedule
            </h1>
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-between gap-6 py-6 sm:py-8 md:flex-row md:items-end">
          <div className="flex flex-row gap-8 sm:gap-16">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[-0.05px] text-black/80">
                Rows processed
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[-0.05px] text-black/80">
                Automation
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mt-34">
            <h1>357% average client value growth</h1>
            <h1>7 unicorns and counting</h1>
            <h1>$10B+ raised by TinyWins portfolio companies</h1>
          </div>

          <div className="relative">
            <img
              className="h-full w-full object-cover object-[25%_center]"
              src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1782243146/bgimageforcronixc_jsovlx.avif"
              alt="Erica AI data automation background"
            />

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-2 mb-5">
                <div className="bg-[#DF71D0] w-4 h-4"></div>
                Cronix
              </div>

              <h2 className="max-w-5xl text-xl sm:text-2xl md:text-3xl lg:text-4xl md:-tracking-[2px] font-medium">
                Enterprise-grade data AI for your business.
              </h2>

              <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl md:-tracking-[2px] font-medium">
                Clean records, smart routing, and deep integrations.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
