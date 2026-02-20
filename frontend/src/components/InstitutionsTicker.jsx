import React from 'react';

const institutions = [
  'OXFORD UNIVERSITY PREP',
  'STANFORD TECHNICAL',
  'MIT QUANT LABS',
  'SINGAPORE MINISTRY OF ED',
  'GLOBAL TECH CERTIFI',
  'CAMBRIDGE ASSESSMENT',
  'ETH ZURICH DIGITAL',
  'TOKYO INSTITUTE ADV',
];

function InstitutionsTicker() {
  return (
    <div className="bg-[#0a0a0a] border-y border-black py-3.5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Duplicate the items for seamless scroll */}
        {[1, 2].map((setIndex) => (
          <div key={setIndex} className="flex items-center shrink-0">
            {setIndex === 1 && (
              <span className="text-[10px] font-[var(--font-mono)] font-bold tracking-[0.2em] uppercase text-gray-400 mx-4">
                INSTITUTIONS:
              </span>
            )}
            {setIndex === 2 && (
              <span className="text-[10px] font-[var(--font-mono)] font-bold tracking-[0.2em] uppercase text-gray-400 mx-4">
                •
              </span>
            )}
            {institutions.map((name, i) => (
              <div key={i} className="flex items-center shrink-0">
                <span className="text-[10px] font-[var(--font-mono)] font-bold tracking-[0.2em] uppercase text-gray-400">
                  {name}
                </span>
                {/* Don't add bullet at the very end of the second set, or do, it doesn't matter much for marquee */}
                <span className="text-[10px] font-[var(--font-mono)] font-bold tracking-[0.2em] uppercase text-gray-400 mx-4">
                  •
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstitutionsTicker;
