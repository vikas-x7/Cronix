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
        <img
          src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1784321301/Screenshot_from_2026-07-18_02-15-08_vxrzui.png"
          alt="Erica AI data automation dashboard"
          className="rounded-[5px] w-full shadow-3xl"
        />
      </div>
    </section>
  );
};

export default UseCases;
