import React from 'react';
import { Diamond } from 'lucide-react';

const linkColumns = [
  {
    links: ['Documentation', 'API Access', 'Security Audits'],
  },
  {
    links: ['Privacy Policy', 'Term of Service', 'Incident Log'],
  },
];

const certifications = [
  'ISO 27001 CERTIFIED',
  'GDPR COMPLIANT',
  'SOC2 TYPE II',
  'SERVER TIME VERIFIED',
];

function Footer() {
  return (
    <footer className="bg-white border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Version */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Diamond className="w-4 h-4 text-primary" strokeWidth={2} />
              <span className="font-[var(--font-heading)] text-sm font-bold tracking-[0.2em] uppercase text-black">
                FAIREXAM
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-[var(--font-mono)] tracking-[0.1em] text-gray-500 uppercase">
                FAIREXAM CORE OS v4.2.0
              </p>
              <p className="text-[9px] font-[var(--font-mono)] tracking-[0.1em] text-gray-500 uppercase">
                EST. 2024 • KERNEL_SYNC_ACTIVE
              </p>
              <p className="text-[9px] font-[var(--font-mono)] tracking-[0.1em] text-gray-500 uppercase">
                ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>

          {/* Link Columns */}
          {linkColumns.map((col, colIdx) => (
            <div key={colIdx} className="space-y-3">
              {col.links.map((link, linkIdx) => (
                <a
                  key={linkIdx}
                  href="#"
                  className="block text-[10px] font-[var(--font-mono)] font-bold tracking-[0.15em] uppercase text-black hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}

          {/* Technical Certifications */}
          <div className="space-y-3">
            <span className="text-[9px] font-[var(--font-mono)] tracking-[0.15em] uppercase text-black font-bold">
              Technical Certifications:
            </span>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, i) => (
                <span
                  key={i}
                  className="text-[8px] font-[var(--font-mono)] tracking-[0.1em] uppercase text-black border border-black px-2.5 py-1.5 hover:border-primary hover:text-primary transition-colors cursor-default"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dashed border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-[8px] font-[var(--font-mono)] tracking-[0.15em] uppercase text-gray-400 text-center">
            FAIREXAM IS A REGISTERED TRADEMARK. UNAUTHORIZED REPLICATION OF SYSTEM INTERNALS IS STRICTLY PROHIBITED.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
