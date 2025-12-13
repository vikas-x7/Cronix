'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { HiMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { FaSlack } from 'react-icons/fa';
import MarqueeSection from '@/client/marketing/components/MarqueeSection';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleSmoothScroll = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <MarqueeSection />
      <div className="container mx-auto px-4 md:px-20">
        <div className="flex h-10 py-7 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center justify-center gap-1.5">
              <img src="https://i.pinimg.com/736x/e4/0e/00/e40e00f5f4b301901581046001bfbd61.jpg" alt="" className="w-8 h-8" />
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-[18px] font-normal tracking-tight text-black">Cronix</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden items-center gap-5 lg:flex">
              <button onClick={() => handleSmoothScroll('hero-image')} className="text-[13px] font-medium text-gray-600 hover:text-black transition-colors cursor-pointer">
                See Demo
              </button>
              <button onClick={() => handleSmoothScroll('use-cases')} className="text-[13px] font-medium text-gray-600 hover:text-black transition-colors cursor-pointer">
                Use Cases
              </button>
              <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black">
                Pricing
              </Link>
              <Link href="#" className="text-[13px] font-medium text-gray-600 hover:text-black">
                About
              </Link>
            </div>
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            <button onClick={handleGetStarted} className="bg-[#171717] px-5 py-1.5 text-sm font-medium text-white hover:bg-black/80 transition-colors cursor-pointer">
              Get started
            </button>
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-gray-700">
              {isOpen ? <HiOutlineX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="absolute inset-x-0 top-16 border-b border-gray-100 bg-white p-6 shadow-xl lg:hidden animate-in fade-in slide-in-from-top-5">
          <div className="flex flex-col gap-5">
            <Link href="#" className="text-lg font-medium text-gray-800">
              Product
            </Link>
            <button onClick={() => handleSmoothScroll('hero-image')} className="text-left text-lg font-medium text-gray-800">
              Book a Demo
            </button>
            <button onClick={() => handleSmoothScroll('use-cases')} className="text-left text-lg font-medium text-gray-800">
              Use Cases
            </button>
            <Link href="#" className="text-lg font-medium text-gray-800">
              Pricing
            </Link>
            <Link href="#" className="text-lg font-medium text-gray-800">
              Blog
            </Link>
            <hr />
            <Link href="#" className="flex items-center gap-3 text-lg font-medium text-gray-800">
              <FaSlack className="text-[#4A154B]" /> Slack Community
            </Link>
            <button onClick={handleGetStarted} className="w-full rounded-lg bg-black py-4 text-center text-base text-white">
              Get started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
