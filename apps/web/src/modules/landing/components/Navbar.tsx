'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { DiYii } from 'react-icons/di';

const NAV_LINKS = [
  { name: 'See Demo', id: 'features' },
  { name: 'Use Cases', id: 'use-cases' },
  { name: 'Pricing', id: 'pricing' },
  { name: 'Observe', id: 'observe' },
  { name: 'FAQ', id: 'faq' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight - 50);
      const footer = document.getElementById('footer');
      if (!footer) return setIsOverFooter(false);

      const footerBounds = footer.getBoundingClientRect();
      setIsOverFooter(footerBounds.top <= 72 && footerBounds.bottom > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isOnDarkBackground = !isScrolled || isOverFooter;

  // Reusable Link Component
  const NavItem = ({
    name,
    id,
    className,
  }: {
    name: string;
    id: string;
    className?: string;
  }) => (
    <button onClick={() => handleSmoothScroll(id)} className={className}>
      {name}
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-2 [font-family:var(--font-inter)]">
      <div className="container mx-auto">
        <div className="flex h-10 py-7 items-center justify-between">
          <div className="hidden lg:flex items-center gap-5 backdrop-blur-md px-5 py-4 rounded-[7px] transition-colors duration-300 bg-[#F0F0F0]">
            <Link href="/">
              <DiYii className="text-[20px] text-[#DF71D0]" />
            </Link>
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.id}
                {...link}
                className="text-[14px] hover:opacity-70 font-semibold transition-opacity"
              />
            ))}
          </div>

          <button
            className={`hidden lg:block rounded-[7px] px-5 py-3 text-sm transition-colors ${isOnDarkBackground ? 'bg-[#F0F0F0] text-black' : 'bg-black text-white'}`}
          >
            Get started
          </button>

          <button
            className="lg:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiOutlineX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute inset-x-0 top-16 bg-white p-6 shadow-xl lg:hidden flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <NavItem
              key={link.id}
              {...link}
              className="text-left text-lg font-medium text-gray-800"
            />
          ))}
          <button className="w-full rounded-lg bg-black py-4 text-white">
            Get started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
