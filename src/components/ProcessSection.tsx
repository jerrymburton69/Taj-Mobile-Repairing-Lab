import React from 'react';
import { ClipboardList, Search, Wrench, CheckCircle2, PackageCheck } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Intake & Diagnostics',
      desc: 'Tell us your issue. We connect to DC lab power analyzers and run thermal scans to benchmark power draw and baseline health.',
      icon: <Search className="w-5 h-5 text-sky-400" />,
    },
    {
      num: '02',
      title: 'Transparent Approval',
      desc: 'You receive an exact line-item quote with detailed technician findings. Zero billable work proceeds without your consent.',
      icon: <ClipboardList className="w-5 h-5 text-indigo-400" />,
    },
    {
      num: '03',
      title: 'Precision Surgical Repair',
      desc: 'Under stereomicroscopes with antistatic grounding, our master technician executes component-level soldering or replacement.',
      icon: <Wrench className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: '04',
      title: '28-Point Quality Check',
      desc: 'True Tone, biometric sensors, 5G/Wi-Fi antenna load, water-resistant seals, and multi-mic acoustic sweeps are rigorously verified.',
      icon: <CheckCircle2 className="w-5 h-5 text-amber-400" />,
    },
    {
      num: '05',
      title: 'Return & 180-Day Warranty',
      desc: 'Collect at our Fazal Trade Centre counter or receive by courier with a sealed warranty certificate and QR tracking ticket.',
      icon: <PackageCheck className="w-5 h-5 text-blue-400" />,
    },
  ];

  return (
    <section id="process" className="w-full py-20 lg:py-28 bg-[#09090b] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-sky-400 mb-3">
            <span>THE 5-STAGE PROTOCOL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            How Precision Happens
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every device passes through five standardized checkpoints to ensure 100% factory functionality and complete data security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
          {steps.map((st, idx) => (
            <div
              key={st.num}
              className="bg-[#111216] rounded-2xl border border-white/10 p-6 flex flex-col justify-between relative hover:border-sky-500/40 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-extrabold font-mono text-zinc-700 group-hover:text-sky-400 transition-colors">
                    {st.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    {st.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-zinc-700">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
