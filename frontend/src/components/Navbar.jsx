import React from 'react';
import { Shield, Menu } from 'lucide-react';

function Navbar() {
  return (
    <nav className="w-full bg-white border-b-2 border-black text-black px-10 py-4 flex items-center justify-between sticky top-0 z-50 relative">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-black" strokeWidth={2} />
        <span className="font-[var(--font-heading)] text-sm font-bold tracking-[0.2em] uppercase">
          FAIREXAM
        </span>
      </div>

      {/* Nav Links - Centered absolute */}
      <div className="hidden lg:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-10">
          <a href="#platform" className="text-[10px] font-[var(--font-mono)] font-bold tracking-[0.15em] text-black uppercase hover:text-primary transition-colors">
            PLATFORM
          </a>
          <a href="#security" className="text-[10px] font-[var(--font-mono)] font-bold tracking-[0.15em] text-black uppercase hover:text-primary transition-colors">
            SECURITY
          </a>
          <a href="#institutions" className="text-[10px] font-[var(--font-mono)] font-bold tracking-[0.15em] text-black uppercase hover:text-primary transition-colors">
            INSTITUTIONS
          </a>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 border-l border-gray-300 pl-12 h-6">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse-dot"></span>
          <span className="text-[9px] font-[var(--font-mono)] font-bold tracking-[0.15em] text-black uppercase mt-px">
            System Status: Nominal
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <button className="hidden md:block bg-black text-white text-[10px] font-bold tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-gray-800 transition-colors">
          Launch Portal
        </button>
        <button className="md:hidden text-black pr-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
