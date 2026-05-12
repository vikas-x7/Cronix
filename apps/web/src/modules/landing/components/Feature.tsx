'use client';
import { useEffect, useRef, useState } from 'react';

export default function Feature() {
  const cards = [
    {
      image:
        'https://i.pinimg.com/originals/af/7d/5c/af7d5c0f37153e44a27a34879b2d98db.gif',
      title: 'Self-healing pipelines.',
      description:
        'Erica detects anomalies, fixes broken flows, and keeps data moving ',
    },
    {
      image:
        'https://i.pinimg.com/originals/03/16/7b/03167b386a144c804490935b3906cbbb.gif',
      title: 'Real-time data analytics.',
      description:
        'Monitor live jobs, track quality scores, and review pipeline events instantly from your dashboard.',
    },
    {
      image:
        'https://i.pinimg.com/originals/80/72/20/8072208f034d8042ef4aa5065d46928b.gif',
      title: 'Seamless stack integration.',
      description:
        'Automatically clean records, update field status, and sync business data with your existing apps and tools.',
    },
  ];

  const text =
    'Intelligent Data Agents for Every Business. Automate data operations instantly without hiring ops teams or building complex pipeline systems.';
  const words = text.split(' ');
  const [progress, setProgress] = useState(0);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return;
      const rect = textRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let p = (windowHeight - rect.top) / (windowHeight / 2);
      p = Math.max(0, Math.min(1, p));
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="bg-transparent ">
      <div className="px-4 sm:px-6 md:px-10 lg:px-15 mt-30">
        <div className="mt-10 sm:mt-14 md:mt-20 grid grid-cols-1 border border-zinc-200 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex min-h-[400px] md:min-h-[620px] flex-col border-b md:border-b-0 md:border-r border-zinc-200 last:border-b-0 last:border-r-0"
            >
              <div className="relative flex-1 border-b border-zinc-200 flex items-center justify-center p-6">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-40 sm:w-52 md:w-70 object-contain"
                />
              </div>
              <div className="p-5 sm:p-6 md:p-8">
                <h3 className="text-lg md:text-xl text-black -tracking-[1px]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm md:text-lg leading-relaxed text-black/70 -tracking-[1px]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full min-h-[60vh] md:h-screen flex items-center px-4 sm:px-6 md:px-10 lg:px-15">
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          <div className="text-center py-16 sm:py-20 md:my-30 flex items-center justify-center">
            <div>
              <h2
                ref={textRef}
                className="text-2xl sm:text-3xl md:text-5xl lg:text-[64px]  text-black -tracking-[2px] md:-tracking-[5px] leading-tight sm:leading-snug md:leading-16"
              >
                {words.map((word, i) => {
                  const startOpacity = i / words.length;
                  const endOpacity = (i + 1) / words.length;
                  let opacity = 0.2;
                  if (progress >= endOpacity) {
                    opacity = 1;
                  } else if (progress > startOpacity) {
                    opacity =
                      0.2 +
                      (0.8 * (progress - startOpacity)) /
                        (endOpacity - startOpacity);
                  }
                  return (
                    <span
                      key={i}
                      style={{ opacity, transition: 'opacity 0.1s' }}
                    >
                      {word}{' '}
                    </span>
                  );
                })}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
