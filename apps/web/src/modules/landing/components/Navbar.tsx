'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { TbMenu } from 'react-icons/tb';
import { MdArrowForward, MdOutlineMenu } from 'react-icons/md';
import { FaCircle, FaGripLines } from 'react-icons/fa6';
import { LiaGripLinesSolid } from 'react-icons/lia';
import { BiSolidSquare } from 'react-icons/bi';

const NAV_LINKS = [
  { name: 'Works', id: 'works' },
  { name: 'About', id: 'about' },
  { name: 'Labs', id: 'labs' },
  { name: 'Contact', id: 'contact' },
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
    <nav className="fixed top-0 left-0 right-0 z-50 px-5   ">
      <div className="bg-[#F0F0F0] rounded-[2px] text-black w-full h-8 text-center flex items-center justify-center mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <p className="tracking-[-1px] flex items-center gap-2">
          Cronix version v2 is live now <MdArrowForward />
        </p>
      </div>
      <div className="container mx-auto">
        <div className="flex h-10 mt-2 items-center justify-between">
          <div className="hidden lg:flex items-center gap-5 backdrop-blur-md px-3 py-2 rounded-[3px] transition-colors duration-300 bg-black/3">
            <Link href="/" className="flex items-center ">
              <BiSolidSquare size={25} className="text-[#DF5BCC]" />
              <h1 className="text-[19px] font-bold tracking-[-1px]">Cronix</h1>
            </Link>
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.id}
                {...link}
                className="text-[14px] hover:opacity-70 font-medium mt-1 transition-opacity tracking-[-0.75px]"
              />
            ))}
          </div>

          <div className="relative">
            <button
              className="text-sm flex items-center gap-2  tracking-[-1px] cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              Menu
              {isOpen ? (
                <HiOutlineX size={30} />
              ) : (
                <LiaGripLinesSolid size={30} />
              )}
            </button>

            <div
              className={`absolute right-0 top-10 mt-2 w-94 bg-[#1F1F1F] text-white p-6 shadow-2xl rounded-[1px] border border-black/5 transition-transform duration-500 ease-out ${
                isOpen
                  ? 'translate-x-0 pointer-events-auto'
                  : 'translate-x-[200%] pointer-events-none'
              }`}
            >
              <div className="flex flex-col gap-1 mb-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleSmoothScroll(link.id)}
                    className="text-[25px]   font-light tracking-[-1px] text-left text-white/80 hover:text-gray-400 transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between text-[15px] text-white">
                <div className="flex gap-4 font-light text-white/80">
                  <Link href="#" className="hover:text-gray-400">
                    LinkedIn
                  </Link>
                  <Link href="#" className="hover:text-gray-400">
                    Twitter
                  </Link>
                </div>
                <Link
                  href="#"
                  className="hover:text-gray-400 font-light text-white/80"
                >
                  Privacy policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
