import React from "react";
import Image from "next/image"; // Next.js use kar rahe ho toh Image tag best hai

const IntegrationSection = () => {
  // Random Tech Logos via API for demonstration
  const leftLogos = [
    {
      name: "Index Exchange",
      src: "https://logo.clearbit.com/indexexchange.com",
    },
    {
      name: "MediaMath",
      src: "https://img.boltops.com/images/blog/vendor-logos/render.svg",
    },
    {
      name: "Magnite",
      src: "https://logo.clearbit.com/openx.com",
    },
    {
      name: "OpenX",
      src: "https://upload.wikimedia.org/wikipedia/commons/9/97/Netlify_logo_%282%29.svg",
    },
    { name: "PubMatic", src: "https://logo.clearbit.com/pubmatic.com" },
    {
      name: "Yahoo",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSvcI1hazt1ZIsbfEByA82O1GE1aBZTt1lDg&s",
    },
  ];

  const rightLogos = [
    { name: "Google", src: "https://logo.clearbit.com/google.com" },
    { name: "Xandr", src: "https://miro.medium.com/0*8cIwlw9H6gXJNaj9" },
    {
      name: "The Trade Desk",
      src: "https://logo.clearbit.com/thetradedesk.com",
    },
    {
      name: "Criteo",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs67hAn2a56_5X9hv1rmyEv8WHVXcX0MdZDQ&s",
    },
    { name: "AdColony", src: "https://logo.clearbit.com/adcolony.com" },
    {
      name: "Unity",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Heroku_logo.svg/960px-Heroku_logo.svg.png",
    },
  ];

  return (
    <section className="bg-white py-20 px-4">
      <div className="container mx-auto max-w-7xl  text-center">
        <h2 className="mt-4 md:text-5xl -tracking-[3px]  ">
          Connected to Premium Demand
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm ">
          Your conversational AI traffic connects directly to top-tier
          advertisers through our integrated SSP network.
        </p>

        <div className="mt-20 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0">
          <div className="grid grid-cols-3">
            {leftLogos.map((logo, index) => (
              <div
                key={index}
                className="flex h-24 w-24 items-center justify-center border border-gray-100 bg-white p-6 shadow-sm md:h-32 md:w-32 lg:h-20 lg:w-40 transition-hover hover:z-20 hover:shadow-md"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>

          {/* Central Logo (Cronix) */}
          <div className="z-10 flex h-32 w-32 flex-col items-center justify-center bg-black p-4 text-white shadow-xl md:-mx-4 md:h-40 md:w-40 lg:h-20 lg:w-48">
            <h3 className="text-2xl  lg:text-3xl tracking-tighter">Cronix</h3>
          </div>

          {/* Right Grid */}
          <div className="grid grid-cols-3">
            {rightLogos.map((logo, index) => (
              <div
                key={index}
                className="flex h-24 w-24 items-center justify-center border border-gray-100 bg-white p-6 shadow-sm md:h-32 md:w-32 lg:h-20 lg:w-40 transition-hover hover:z-20 hover:shadow-md"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;
