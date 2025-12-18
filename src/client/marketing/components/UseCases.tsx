'use client';

import React from 'react';
import { LuBrainCircuit } from 'react-icons/lu';
import { FiDollarSign, FiLink } from 'react-icons/fi';
import { RiBankLine } from 'react-icons/ri';
import { MdOutlineWebhook } from 'react-icons/md';

const UseCases = () => {
  const cases = [
    {
      title: 'Scheduled API Triggers',
      points: ['Trigger internal API endpoints', 'Support for Webhook integration', 'Custom HTTP methods ', 'Rich authentication support', 'Automatic retry on failure'],
      id: '/01',
      icon: <FiLink className="text-xl" />,
    },
    {
      title: 'Database Automation',
      points: ['Automate routine table cleanup', 'Schedule daily data backups', 'Optimize slow query indexes', 'Sync data across environments', 'Direct connection support'],
      id: '/02',
      icon: <LuBrainCircuit className="text-xl" />,
    },
    {
      title: 'Webhooks & Notifications',
      points: ['Instant Slack & Discord alerts', 'Custom webhook payloads', 'Reliable delivery tracking', 'Automatic retry on failure', 'Secure header verification'],
      id: '/03',
      icon: <MdOutlineWebhook className="text-xl" />,
    },
  ];

  return (
    <section id="use-cases" className="bg-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-block bg-gray-100 px-4 py-1 text-xs text-black mb-4 font-mono">Use cases</span>
            <h2 className="text-[20px] font-medium -tracking-[3px] text-black md:text-[42px] leading-10">
              Powerful Cron Job Solutions <br /> for Every Need
            </h2>
            <p className="mt-6 text-[#737373]">From automated backups to system maintenance, Cronix handles your scheduled tasks with precision and reliability.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-1 mt-6 mb-24 w-full max-w-6xl">
          <div className="w-full sm:w-64 md:w-72 h-72 sm:h-80  overflow-hidden relative shrink-0">
            <img src="https://i.pinimg.com/736x/c3/a8/b1/c3a8b16172eb27440e0ca5f2f60223b3.jpg" alt="visual" className="w-full h-full object-cover  " />
            <h1 className="absolute bottom-6 left-6 text-white text-[16px]">Platform Features</h1>
          </div>

          {cases.map((item, index) => (
            <div
              key={index}
            
              className={`w-full sm:w-64 md:w-72  bg-black text-[#EDECEC] text-sm text-start  border border-[#303030]/30 p-6 flex flex-col justify-between transition-all hover:border-[#404040]`}
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-sm flex items-center justify-center text-[#E6ECEC]/90">{item.icon}</div>
                <span className="text-xs text-[#E6ECEC]/30">{item.id}</span>
              </div>
              <h3 className="text-base text-white">{item.title}</h3>
              <ul className="space-y-2 text-xs text-[#E6ECEC]/80">
                {item.points.map((point, idx) => (
                  <li key={idx}>✓ {point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
