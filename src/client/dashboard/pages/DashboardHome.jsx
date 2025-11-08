import React from "react";
import { IoAdd } from "react-icons/io5";
import { Code2, BookOpen, Box, ArrowRight } from "lucide-react";

const cards = [
  {
    title: "Import API",
    description: "Host your OpenAPI Documents",
    icon: <Code2 className="text-green-500" size={24} />,
    link: "#",
  },
  {
    title: "Create Documentation",
    description: "User Guides and API References",
    icon: <BookOpen className="text-blue-400" size={24} />,
    link: "#",
  },
  {
    title: "Create SDKs",
    description: "Typescript, Java, Go, etc...",
    icon: <Box className="text-purple-400" size={24} />,
    link: "#",
  },
  {
    title: "Create SDKs",
    description: "Typescript, Java, Go, etc...",
    icon: <Box className="text-purple-400" size={24} />,
    link: "#",
  },
];

const OverviewSection = () => {
  return (
    <div className="w-full  h-screen">
      <div className="border-b px-4 py-4 border-[#E5E5E5] flex justify-between">
        <h1 className="text-[20px] -tracking-[1px]">Over view</h1>
        <button className="bg-[#171717] text-[#fafafa] px-6 text-[12px] font-medium flex items-center justify-center gap-1">
          <IoAdd size={18} />
          Schedule New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group relative bg-[#c5c5c5] rounded-[4px] p-6 hover:border-[#333] transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-1">{card.icon}</div>
              <ArrowRight
                className="text-[#444] group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                size={20}
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-white font-semibold text-[17px] tracking-tight">
                {card.title}
              </h3>
              <p className="text-[#888] text-[15px] font-normal leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewSection;
