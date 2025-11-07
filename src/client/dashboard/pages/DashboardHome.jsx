import React from 'react';
import { HiOutlineCode, HiOutlineBookOpen, HiOutlineCube, HiOutlineArrowRight } from "react-icons/hi";
import { FiLock } from "react-icons/fi";
import { Execution } from "./Execution"

const OverviewSection = () => {
  const quickActions = [
    {
      title: "Import API",
      desc: "Host your OpenAPI Documents",
      icon: <HiOutlineCode className="text-green-500/70" />,
      link: "#",
    },
    {
      title: "Create Documentation",
      desc: "User Guides and API References",
      icon: <HiOutlineBookOpen className="text-[#00B6F2]" />,
      link: "#",
    },
    {
      title: "Create SDKs",
      desc: "Typescript, Java, Go, etc...",
      icon: <HiOutlineCube className="text-purple-500" />,
      link: "#",
    },
    {
      title: "Create SDKs",
      desc: "Typescript, Java, Go, etc...",
      icon: <HiOutlineCube className="text-purple-500" />,
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen  px-6 py-4 ">
      <div className="">
        <div className='flex items-center justify-between'>
        <h1 className="mb-8 text-[20px] font-[500] -tracking-[30]  text-[#e7e7e7]">Overview</h1>
        <button className='bg-white text-black px-3 py-1 text-[13px]'>create new cronjob</button>
        </div>

        
        <div className="flex gap-3 justify-between">
          {quickActions.map((action, i) => (
            <div
              key={i}
              className="group relative cursor-pointer  border border-[#2b2b2b] p-3 transition-all  rounded-[4px] hover:bg-[#161616] w-73 "
            >
              <div className="mb-4 text-2xl ">{action.icon}</div>
              <h3 className="text-[14px] font-[500] text-[#e7e7e7]">{action.title}</h3>
              <p className="mt-1 text-[14px] font-[400]">{action.desc}</p>
              <HiOutlineArrowRight className="absolute top-5 right-5  text-[#2b2b2b]" />
            </div>
          ))}
        </div>

      

 
        
 <Execution />
    
      </div>
    </div>
  );
};

export default OverviewSection;