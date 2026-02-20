import React from 'react';
import { Eye, Brain, Clock, ArchiveRestore } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'SECURE PROCTORING',
    description: 'Multi-layered AI observation with human-in-the-loop fallback systems for absolute exam integrity.',
    code: 'MODULE_SEC_01',
  },
  {
    icon: Brain,
    title: 'AI INTEGRITY',
    description: 'Neural networks trained on over 10M test sessions to identify abnormal behavioral patterns in real-time.',
    code: 'MODULE_AI_09',
  },
  {
    icon: Clock,
    title: 'REAL-TIME SYNC',
    description: 'Proprietary NTP synchronization ensures sub-millisecond clock alignment across all global candidates.',
    code: 'MODULE_CLK_SYNC',
  },
  {
    icon: ArchiveRestore,
    title: 'SEAMLESS RECOVERY',
    description: 'Atomic state saving ensures no progress is lost even in catastrophic local network or hardware failure.',
    code: 'MODULE_REC_BACK',
  },
];

function SystemInfrastructure() {
  return (
    <section className="bg-white py-20 px-6" id="platform">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-0.5 bg-black"></div>
            <h2 className="font-[var(--font-heading)] text-3xl md:text-4xl font-black tracking-tight text-black uppercase">
              System Infrastructure
            </h2>
          </div>
          <p className="text-[10px] font-[var(--font-mono)] font-bold tracking-[0.2em] uppercase text-gray-500 ml-14">
            Architected for zero compromise environments
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComp = feature.icon;
            return (
               <div
                key={index}
                className="group border border-black p-6 bg-white transition-all flex flex-col h-full"
              >
                <div className="flex-1">
                  {/* Icon */}
                  <div className="w-12 h-12 border border-black flex items-center justify-center mb-6">
                    <IconComp className="w-5 h-5 text-black" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="font-[var(--font-heading)] text-sm font-bold tracking-[0.1em] text-black mb-4 uppercase">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-gray-600 mb-8 font-medium">
                    {feature.description}
                  </p>
                </div>

                {/* Code link */}
                <div className="pt-4 border-t border-gray-200 mt-auto">
                  <span className="text-[9px] font-[var(--font-mono)] tracking-[0.15em] text-primary font-bold uppercase cursor-pointer hover:underline">
                    {feature.code}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SystemInfrastructure;
