'use client';

import React from 'react';

interface Logo {
  name: string;
  src: string;
}

const Integration = () => {
  const leftLogos = [
    { name: 'Salesforce', src: '/sdf' },
    {
      name: 'HubSpot',
      src: 'https://img.boltops.com/images/blog/vendor-logos/render.svg',
    },
    { name: 'Snowflake', src: 'd' },
    {
      name: 'Slack',
      src: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Netlify_logo_%282%29.svg',
    },
    { name: 'BigQuery', src: 'd' },
    {
      name: 'Databricks',
      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSvcI1hazt1ZIsbfEByA82O1GE1aBZTt1lDg&s',
    },
  ];

  const rightLogos = [
    { name: 'Zapier', src: 'd' },
    { name: 'Airtable', src: 'https://miro.medium.com/0*8cIwlw9H6gXJNaj9' },
    { name: 'Postgres', src: 'd' },
    {
      name: 'dbt',
      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs67hAn2a56_5X9hv1rmyEv8WHVXcX0MdZDQ&s',
    },
    { name: 'Zoho', src: 'd' },
    {
      name: 'Segment',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Heroku_logo.svg/960px-Heroku_logo.svg.png',
    },
  ];

  const shouldShow = (index: number, src: string) => {
    const pos = index % 6;
    return (pos === 1 || pos === 3 || pos === 5) && src !== 'd';
  };

  const Box = ({ logo, index }: { logo: Logo; index: number }) => (
    <div className="flex h-12 w-30 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-20 lg:w-40 items-center justify-center border border-black/5 bg-transparent p-3 sm:p-4 md:p-6 shadow-sm hover:z-20 hover:shadow-md transition">
      {shouldShow(index, logo.src) && (
        <img
          src={logo.src}
          alt={logo.name}
          className="w-[50px] sm:w-[60px] md:w-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300"
        />
      )}
    </div>
  );

  return (
    <section
      id="integration"
      className="bg-transparent py-12 sm:py-16 md:py-20 px-4 sm:px-6 min-h-[60vh] md:min-h-screen flex items-center"
    >
      <div className="container mx-auto max-w-7xl text-center">
        <h2 className="mt-4 text-xl sm:text-3xl md:text-4xl font-medium lg:text-[59px] -tracking-[0.5px] md:-tracking-[4px]">
          Seamlessly Connect Your Workflows
        </h2>

        <p className="mx-auto mt-2 text-sm sm:text-base md:text-lg text-[#737373] max-w-2xl -tracking-[0.5px]">
          Connect Cronix to your favorite tools. Trigger workflows, send alerts
          to Slack or Discord, and integrate with any system via Webhooks for
          automated cron jobs.
        </p>

        <div className="mt-10 sm:mt-14 md:mt-20 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0">
          <div className="grid grid-cols-3  sm:gap-4">
            {leftLogos.map((logo, index) => (
              <Box key={index} logo={logo} index={index} />
            ))}
          </div>

          <div className="z-10 flex h-16 w-30 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-15 lg:w-35 items-center justify-center bg-black text-white shadow-xl md:-mx-4">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-2xl md:tracking-[-2px] font-medium">
              Cronix
            </h3>
          </div>

          <div className="grid grid-cols-3 sm:gap-4">
            {rightLogos.map((logo, index) => (
              <Box key={index} logo={logo} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
