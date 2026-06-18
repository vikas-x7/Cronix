import Image from 'next/image';
import React from 'react';

const UseCases = () => {
  return (
    <section id="use-cases" className="relative ">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center rounded-[6px]"
        style={{
          backgroundImage: "url('image/macbg.jpg')",
        }}
      />

      <div className="relative z-10 px-2 py-3 sm:px-9 sm:py-9 mx-auto ">
        <Image
          src="/image/cronixdashboard.png"
          alt="Erica AI data automation dashboard"
          className="rounded-[5px] w-full shadow-3xl"
          width={900}
          height={900}
          preload
        />
      </div>
    </section>
  );
};

export default UseCases;
