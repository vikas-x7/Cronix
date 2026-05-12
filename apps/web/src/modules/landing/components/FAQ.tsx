'use client';

import Image from 'next/image';
import { useState } from 'react';

const faqs = [
  {
    question: 'What is Erica AI?',
    answer:
      'Erica AI is an intelligent data automation platform that automates operational workflows - handling intake, cleaning, enrichment, routing, and syncs with reliable AI agents.',
  },
  {
    question: 'How does Erica handle data?',
    answer:
      'Erica uses advanced AI models and workflow rules to understand data context, clean messy fields, flag anomalies, and route exceptions to human teams when needed.',
  },
  {
    question: 'Can Erica integrate with my CRM?',
    answer:
      'Yes! Erica integrates seamlessly with Salesforce, HubSpot, Zoho, and other popular CRMs. Clean data, status changes, and record updates sync automatically after every workflow.',
  },
  {
    question: 'Does Erica support multiple sources?',
    answer:
      'Absolutely. Erica supports multiple apps and data sources, allowing you to unify spreadsheets, CRMs, warehouses, forms, and internal tools across each team.',
  },
  {
    question: 'Is there a free plan to get started?',
    answer:
      'Yes, our starter plan lets you test Erica with a limited number of jobs per month. Check our pricing section for higher volume plans and enterprise features.',
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
            Frequently Asked <br className="hidden sm:block" /> Questions
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
                  <Image
                    src={
                      activeIndex === i
                        ? '/image/SVGs/chevron-up.svg'
                        : '/image/SVGs/chevron-down.svg'
                    }
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={20}
                    className="h-5 w-5 shrink-0 opacity-40 transition-transform duration-300"
                  />
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
