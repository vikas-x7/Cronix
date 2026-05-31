import React from 'react';

const UseCases = () => {
  return (
    <section id="use-cases" className="relative ">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/c5/e9/80/c5e980929de782f76017591ca2d0126a.jpg')",
        }}
      />

      <div className="relative z-10 p-6 py-9 mx-auto">
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
