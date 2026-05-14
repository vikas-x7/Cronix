'use client';
import { useEffect, useRef, useState } from 'react';

export default function AnimatedText() {
  const text =
    'Powerful Cron Job Solutions for Every Developer. Scale your background tasks instantly without managing infrastructure or complex server setups.';
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
    <div className="w-full min-h-[60vh] md:h-screen flex items-center px-4 sm:px-6 md:px-10 lg:px-15">
      <div className="flex flex-col items-center justify-center gap-6 w-full">
        <div className="text-center py-16 sm:py-20 md:my-30 flex items-center justify-center">
          <div>
            <h2
              ref={textRef}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-[64px] text-black md:-tracking-[6px] leading-tight sm:leading-snug md:leading-16"
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
                  <span key={i} style={{ opacity, transition: 'opacity 0.1s' }}>
                    {word}{' '}
                  </span>
                );
              })}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
