import React from 'react';
import { ArrowRight } from 'lucide-react';

function CTASection() {
  return (
    <section className="bg-primary py-24 px-6 border-y-2 border-black">
      <div className="max-w-4xl mx-auto text-center space-y-8 text-black">
        {/* Heading */}
        <h2 className="font-[var(--font-heading)] text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight">
          Ready for Integration?
        </h2>

        {/* Subtitle */}
        <p className="text-xs md:text-sm font-[var(--font-mono)] font-bold tracking-[0.1em] uppercase max-w-2xl mx-auto leading-relaxed">
          Deploy the most robust assessment engine directly into your existing LMS infrastructure.
        </p>

        {/* CTA Button */}
        <div className="pt-6">
          <button className="bg-black text-white text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-gray-800 transition-colors inline-flex items-center gap-3">
            System Architecture Guide
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
