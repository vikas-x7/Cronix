"use client";

import React from "react";

interface Logo {
  name: string;
  src: string;
}

const IntegrationSection = () => {
  const leftLogos = [
    { name: "Index Exchange", src: "/sdf" },
    {
      name: "MediaMath",
      src: "https://img.boltops.com/images/blog/vendor-logos/render.svg",
    },
    { name: "Magnite", src: "d" },
    {
      name: "OpenX",
      src: "https://upload.wikimedia.org/wikipedia/commons/9/97/Netlify_logo_%282%29.svg",
    },
    { name: "PubMatic", src: "d" },
    {
      name: "Yahoo",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSvcI1hazt1ZIsbfEByA82O1GE1aBZTt1lDg&s",
    },
  ];

  const rightLogos = [
    { name: "Google", src: "d" },
    { name: "Xandr", src: "https://miro.medium.com/0*8cIwlw9H6gXJNaj9" },
    { name: "The Trade Desk", src: "d" },
    {
      name: "Criteo",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs67hAn2a56_5X9hv1rmyEv8WHVXcX0MdZDQ&s",
    },
    { name: "AdColony", src: "d" },
    {
      name: "Unity",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Heroku_logo.svg/960px-Heroku_logo.svg.png",
    },
  ];

  const shouldShow = (index: number, src: string) => {
    const pos = index % 6;
    return (pos === 1 || pos === 3 || pos === 5) && src !== "d";
  };

  const Box = ({ logo, index }: { logo: Logo; index: number }) => (
    <div className="flex h-24 w-24 items-center justify-center border border-white/30 bg-white p-6 shadow-sm md:h-32 md:w-32 lg:h-20 lg:w-40 hover:z-20 hover:shadow-md transition">
      {shouldShow(index, logo.src) && (
        <img
          src={logo.src}
          alt={logo.name}
          className="w-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
        />
      )}
    </div>
  );

  return (
    <section className="bg-white py-20 px-4">
      <div className="container mx-auto max-w-7xl text-center">
        <h2 className="mt-4 md:text-[44px] -tracking-[3px]">
          Seamlessly Connect Your Workflows
        </h2>

        <p className="mx-auto mt-1 text-sm text-[#737373]">
          Connect Cronix to your favorite tools. Trigger workflows, send alerts
          to Slack or Discord,  <br /> and integrate with any system via Webhooks
          for automated cron jobs.
        </p>

        <div className="mt-20 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0">

          {/* Left */}
          <div className="grid grid-cols-3">
            {leftLogos.map((logo, index) => (
              <Box key={index} logo={logo} index={index} />
            ))}
          </div>

          {/* Center */}
          <div className="z-10 flex h-24 w-24 items-center justify-center bg-black text-white shadow-xl md:-mx-4 md:h-40 md:w-40 lg:h-15 lg:w-35">
            <h3 className="text-2xl tracking-tighter">Cronix</h3>
          </div>

          {/* Right */}
          <div className="grid grid-cols-3">
            {rightLogos.map((logo, index) => (
              <Box key={index} logo={logo} index={index} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;