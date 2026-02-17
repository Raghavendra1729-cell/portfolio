"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'CP Stats', href: '/cp' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    // CHANGED: Removed scroll logic. Always white background with blur.
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo - Made slightly larger */}
        <Link href="/" className="font-bold text-2xl tracking-tight hover:opacity-80 transition">
          Raghavendra<span className="text-blue-600">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-black relative",
                  isActive ? "text-blue-600 font-bold" : "text-gray-600"
                )}
              >
                {item.label}
                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute -bottom-[21px] left-0 w-full h-[2px] bg-blue-600 rounded-t-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg p-4 flex flex-col gap-2 animate-in slide-in-from-top-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-lg text-base font-medium transition",
                pathname === item.href 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}