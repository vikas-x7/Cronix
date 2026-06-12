import React from 'react';
import Image from 'next/image';

const Fearless = () => {
  return (
    <div className=" relative text-[#EBEBEB] font-sans antialiased flex h-screen mb-40 px-5">
      <div className="bg-[#ffffff] text-black  flex-1">
        <div className="text-[12px] uppercase leading-tight flex-none mt-10">
          ISSUE: 83 <br /> VINTAGE <br /> POSTER SERIES
        </div>

        <div className="mt-auto ">
          <div className="text-[18px] leading-normal tracking-[-1px]   text-[#000000] space-y-[2.5vh] mt-[370px] ml-1 ">
            <p>
              A state of mind marked by the refusal to hesitate even when the
              unknown is staring back.
            </p>
            <p>
              The quiet courage to move forward when staying still <br /> feels
              safer. Often found in those who jump first and
              <br /> figure it out mid-air.
            </p>
          </div>
          <h1 className=" absolute text-[12rem] ml-[-10px] font-black text-black leading-[0.8] tracking-[-20px] top-60 z-20">
            Know cronix.
          </h1>
          <button className="mt-[128px] bg-[#040404] px-4 py-2 text-white rounded-[3px] tracking-[-0.75px] font-medium">
            Getstart now{' '}
          </button>
        </div>
      </div>

      <div className="relative w-1/2 h-full flex-shrink-0">
        <img
          className="w-full h-full object-cover"
          src="https://i.pinimg.com/736x/81/af/17/81af17b2a0fa6d169d42ee2f914d0f04.jpg"
          alt="Fearless poster scene"
        />
      </div>
    </div>
  );
};

export default Fearless;
