import React from 'react';

function Hello() {
  // Array create kiya taaki map kar saken
  const items = [
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
    { label: 'Cron jobs' },
    { label: 'AI Workflow' },
  ];

  return (
    <div className="w-full mt-40 px-4 overflow-hidden">
      {/* Header Section */}
      <div>
        <h1 className="text-9xl text-start font-bold tracking-[-12px]">
          Cronix.
        </h1>
        <p className="px-3 text-[17px] tracking-[-0.75px]">
          Set up your first automated task today and let Cronix handle the heavy
          lifting for you.
        </p>
      </div>

      {/* <div className='relative flex overflow-x-hidden mt-40 w-full'>
 
  <div className='flex animate-marquee whitespace-nowrap gap-20 px-4'>
    {[...items, ...items].map((item, index) => (
      <p key={index} className='text-[25px] tracking-[-2px] font-medium'>
        {item.label}
      </p>
    ))}
  </div>
</div>

 <style>{`
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee 430s linear infinite;
  }
`}</style> */}
    </div>
  );
}

export default Hello;
