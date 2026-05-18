'use client';

import Image from 'next/image';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const faqs = [
  {
    question: 'What is Cronix?',
    answer:
      'Cronix is a fully managed job scheduler that lets you automate workflows, trigger APIs, and monitor job runs from one powerful dashboard.',
  },
  {
    question: 'How do I schedule a new job?',
    answer:
      'You can schedule a new job directly from the dashboard or by using our flexible API to define cron expressions and dynamic payloads.',
  },
  {
    question: 'Does Cronix support webhooks?',
    answer:
      'Yes! Cronix seamlessly integrates with webhooks so you can trigger HTTP endpoints securely and connect with any system.',
  },
  {
    question: 'Can I monitor execution history?',
    answer:
      'Absolutely. Cronix provides real-time execution logs where you can view console outputs, track uptime, and debug failures instantly.',
  },
  {
    question: 'Is there a limit on jobs?',
    answer:
      'Our platform is built for scale and precision, easily handling over 20k+ jobs executed with 99.9% uptime guaranteed. Check out our pricing for specific tier limits.',
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="w-full py-12 sm:py-16 px-4 md:px-10 lg:px-10 mt-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
        <div className="flex flex-col gap-1 w-full">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] text-black -tracking-[1px] md:-tracking-[3px] mb-8 sm:mb-10">
            Frequently Asked Questions
          </h2>

          <div className="border-t border-gray-200 mt-2 w-full">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="border-b border-gray-200 cursor-pointer"
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between py-4">
                  <span
                    className={`font-normal text-base sm:text-[20px] pr-4 transition-colors duration-200 ${activeIndex === i ? 'text-black' : 'text-black/90'}`}
                  >
                    {f.question}
                  </span>
                  <IoIosArrowDown />
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === i ? 'max-h-60 pb-4' : 'max-h-0'}`}
                >
                  <p className="text-gray-500 text-sm sm:text-[17px] leading-relaxed">
                    {f.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-[5px] overflow-hidden h-64 sm:h-96 lg:h-130 w-full mt-8 lg:mt-0">
          <img
            src="https://cdn.prod.website-files.com/6812d02840d393aa2c663370/68f7be903d5e939249ef4dab_6ad532de28b288f9a07b16c9b42376ce_hyperline-pattern.svg"
            alt="Erica AI data automation preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
