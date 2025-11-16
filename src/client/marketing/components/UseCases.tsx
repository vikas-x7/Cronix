"use client";

import React from "react";
import { LuBrainCircuit } from "react-icons/lu";
import { FiDollarSign } from "react-icons/fi";
import { RiBankLine } from "react-icons/ri";

const UseCases = () => {
  const cases = [
    {
      title: "Automated Database Backups",
      description:
        "Ensure your data is safe with scheduled, reliable backups to your preferred storage provider. Never worry about data loss again.",
      icon: <FiDollarSign className="text-2xl" />,
    },
    {
      title: "System Maintenance & Cleanup",
      description:
        "Automate routine tasks like clearing caches, deleting temporary files, and optimizing your database to keep your systems running at peak performance.",
      icon: <LuBrainCircuit className="text-2xl" />,
    },
    {
      title: "Scheduled Notifications & Webhooks",
      description:
        "Trigger Slack messages, Discord alerts, or custom webhooks exactly when your business needs them. Keep your team and systems in sync effortlessly.",
      icon: <RiBankLine className="text-2xl" />,
    },
  ];

  return (
    <section className="bg-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-block  bg-gray-100 px-4 py-1 text-xs  text-black mb-4">
              Use cases
            </span>
            <h2 className="text-[20px] font-normal -tracking-[2px]  text-black md:text-[42px] leading-11">
              Powerful Cron Job Solutions <br /> for Every Need
            </h2>
            <p className="mt-6 text-[#737373] ">
              From automated backups to system maintenance, Cronix handles
              your scheduled tasks with precision and reliability.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cases.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col  bg-[#F6F6F6] p-8 transition-all hover:bg-[#efefef]"
            >
              <div className="mb-12 flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-gray-900">
                {item.icon}
              </div>
              <h3 className="mb-4 text-xl  text-black">{item.title}</h3>
              <p className="text-sm  text-black">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
