import React from "react";
import { LuBrainCircuit } from "react-icons/lu";
import { FiDollarSign } from "react-icons/fi";
import { RiBankLine } from "react-icons/ri";

const UseCases = () => {
  const cases = [
    {
      title: "For Business Coaches & Consultants",
      description:
        "Turn your coaching methods and frameworks into a 24/7 business coaching AI assistant. Share expert advice, answer client questions instantly, and offer scalable access to your consulting services.",
      icon: <FiDollarSign className="text-2xl" />,
    },
    {
      title: "For Mental Health Coaches",
      description:
        "Build a supportive AI companion trained on your coaching methods and wellness practices. Provide users with mindfulness exercises, stress management strategies, and motivational guidance anytime — while keeping the human touch for deeper sessions.",
      icon: <LuBrainCircuit className="text-2xl" />,
    },
    {
      title: "For Lawyers & Legal Professionals",
      description:
        "Train your AI with your own legal expertise — from your specific area of practice to the laws of your country or region. Create a branded legal assistant that can answer FAQs and provide clients with clear, reliable guidance based on your knowledge.",
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
            <h2 className="text-[20px] font-[400] -tracking-[3px]  text-black md:text-[42px] leading-11">
              Imagine the AI you can <br /> build for your business
            </h2>
            <p className="mt-6 ">
              From creative tools to customer support, your AI chat can be
              trained, branded, and monetized for countless scenarios.
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
