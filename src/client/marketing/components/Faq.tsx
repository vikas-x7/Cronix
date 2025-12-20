'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What is Cronix?',
    answer: 'Cronix is a powerful automation platform that allows you to schedule cron jobs, trigger API endpoints, and automate database tasks with precision and real-time monitoring.',
  },
  {
    question: 'How do I schedule a new job?',
    answer: "Simply click 'Create new' in your dashboard, enter your target URL, choose the HTTP method, and set your schedule using standard cron syntax or our intuitive builder.",
  },
  {
    question: 'Does Cronix support webhooks?',
    answer: 'Yes! You can configure webhooks to notify your systems or Slack/Discord channels instantly whenever a job executes, succeeds, or fails.',
  },
  {
    question: 'Can I monitor execution history?',
    answer: 'Absolutely. Every cron job comes with a detailed execution log, showing status codes, durations, and response data to help you debug and track performance.',
  },
  {
    question: 'Is there a limit on jobs?',
    answer: 'Our core features allow you to get started for free. Check our pricing section for higher execution limits and enterprise-grade features.',
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full py-16 px-4 font-gothic mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* LEFT */}
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl sm:text-5xl lg:text-[44px] text-black font-medium -tracking-[3px]   mb-10">
            Frequently Asked <br /> Questions
          </h2>

          {/* Accordion */}
          <div className="border-t border-gray-200 mt-2">
            {faqs.map((f, i) => (
              <div key={i} className="border-b border-gray-200 cursor-pointer" onClick={() => setActiveIndex(activeIndex === i ? null : i)}>
                <div className="flex items-center justify-between py-4">
                  <span className={`font-normal text-[16px] transition-colors duration-200 ${activeIndex === i ? 'text-black' : 'text-black/90'}`}>{f.question}</span>
                  <span className={`text-gray-400 text-lg transition-transform duration-300 ${activeIndex === i ? 'rotate-45' : 'rotate-0'}`}>+</span>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === i ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - same image */}
        <div className="relative rounded-[5px] overflow-hidden h-130">
          <img
            src="https://cdn.prod.website-files.com/6812d02840d393aa2c663370/68f7be903d5e939249ef4dab_6ad532de28b288f9a07b16c9b42376ce_hyperline-pattern.svg"
            alt="Alyflow canvas preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
