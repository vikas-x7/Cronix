"use client";

const mindMapNodes = [
  {
    name: "Automation infrastructure for modern developers",
  },
  {
    name: "Run, monitor, and scale cron jobs with full visibility.",
  },
];

export default function MarqueeSection() {
  return (
    <section className="w-full ">
      <div className="flex bg-[#171717]  text-white">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...mindMapNodes, ...mindMapNodes].map((node, i) => (
            <span
              key={i}
              className="  mx-5 sm:mx-8 md:mx-10 opacity-80 hover:opacity-100 transition-opacity duration-200 select-none text-[13px] sm:text-[15px] md:text-[13px]"
            >
              {node.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
