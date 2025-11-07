import { GoArrowRight } from "react-icons/go";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-whtie text-black pt-20 pb-10 md:pt-32">
      <div className="container mx-auto px-4 text-center ">
        <div className="mb-8 inline-block rounded-full border border-[#ECECEC] px-4 py-1.5 ">
          <p className="text-[12px] font-normal text-[#525252] md:text-[12px]">
            Trusted by 5,000+ sales and RevOps teams
          </p>
        </div>

        <h1 className="mx-auto mb-6 max-w-4xl text-4xl -tracking-[5px]  md:text-[58px] leading-15">
          Better Way to Run Cron Jobs <br /> for Modern Applications
        </h1>

        <p className="mx-auto mb-7 max-w-xl font-normal text-lg md:text-[16px] text-[#737373]">
          Manage scheduled jobs, automate workflows, trigger APIs, and monitor
          job runs, logs, and execution history from one powerful dashboard.
        </p>

        <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row ">
          <button className="flex w-full items-center justify-center gap-2  border border-gray-300  px-3 py-2   transition-all hover:bg-gray-50 sm:w-auto text-[12px] font-medium">
            Book a demo <GoArrowRight />
          </button>
          <button className="flex w-full items-center justify-center gap-2  bg-black px-3 py-2  text-white transition-all  sm:w-auto text-[12px] font-medium">
            Get started - it&apos;s free <GoArrowRight />
          </button>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="w-6xl">
            <video
              src="https://www.orangeslice.ai/hero-product.mp4"
              loop
              autoPlay
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
