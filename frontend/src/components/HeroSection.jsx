import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

function HeroSection() {
  const [seconds, setSeconds] = useState(5045); // 01:24:05

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSecs) => {
    const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <section className="relative bg-white border-b-2 border-black overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black px-4 py-1.5">
              <span className="text-[10px] font-[var(--font-mono)] font-bold tracking-[0.2em] uppercase text-white">
                Authorized Access Only
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="font-[var(--font-heading)] text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight text-black">
                MERIT.<br />
                INTEGRITY.<br />
                CERTAINTY.
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm font-medium leading-relaxed text-gray-700 max-w-md border-l-[3px] border-primary pl-5">
              The institutional standard for high-stakes digital assessments. Synchronized timing, AI-driven proctoring, and absolute data integrity.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-6 pt-2">
              <button className="bg-primary text-black text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2">
                Get Started
              </button>
              <button className="bg-white text-black text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-4 border-2 border-black hover:bg-gray-50 transition-colors">
                View Technical Specs
              </button>
            </div>
          </div>

          {/* Right: Exam Interface Mock */}
          <div className="relative pl-6 lg:pl-12">
            {/* Decorative Orange Square */}
            <div className="absolute top-[-16px] left-[32px] w-8 h-8 bg-primary z-20"></div>

            <div className="relative bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-10">
              {/* Top Bar */}
              <div className="bg-white px-5 py-3 flex items-center justify-between border-b-[3px] border-black">
                <span className="text-[10px] font-[var(--font-mono)] font-bold text-black tracking-wider uppercase">
                  SESSION_ID: FK-93302
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse-dot"></span>
                  <span className="text-[9px] font-[var(--font-mono)] font-bold text-primary tracking-wider uppercase">
                    LINK PROCTORING ACTIVE
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Timer */}
                <div className="bg-gray-50 border-[2px] border-black py-8 text-center">
                  <span className="font-[var(--font-mono)] text-4xl md:text-5xl font-bold text-black tracking-[0.2em] ml-[0.2em]">
                    {formatTime(seconds)}
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-[var(--font-mono)] font-bold text-black tracking-wider uppercase">
                      Progress: 24/50
                    </span>
                    <span className="text-[10px] font-[var(--font-mono)] font-bold text-black tracking-wider uppercase">
                      72% Complete
                    </span>
                  </div>
                  <div className="w-full bg-white border-2 border-black h-4">
                    <div className="bg-primary h-full border-r-2 border-black" style={{ width: '72%' }}></div>
                  </div>
                </div>

                {/* Answer Blocks */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary border-2 border-black h-12"></div>
                  <div className="bg-white border-2 border-black h-12"></div>
                </div>
              </div>
            </div>

            {/* Decorative White Square Bottom Right */}
            <div className="absolute bottom-[-16px] right-[-16px] w-16 h-16 bg-white border-[2px] border-black z-20"></div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
