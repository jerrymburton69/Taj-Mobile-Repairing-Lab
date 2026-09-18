import React from 'react';
import { ShieldCheck, Eye, Cpu, Database, Award, CheckCircle2, XCircle } from 'lucide-react';

export const WhyTajSection: React.FC = () => {
  const standards = [
    {
      icon: <Eye className="w-5 h-5 text-sky-400" />,
      title: 'FLIR Thermal Imaging Diagnostics',
      description: 'We don’t randomly swap entire motherboards. High-definition thermal cameras locate micro-short circuits in milliseconds.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      title: 'Optical Stereomicroscope Workstations',
      description: 'Precision microsoldering down to 0.01mm copper jumpers under 45x magnification with calibrated solder stations.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      title: 'Class 100 ESD Antistatic Environment',
      description: 'Continuous grounded mats, ionized blowers, and antistatic packaging prevent invisible electrostatic chip damage.',
    },
    {
      icon: <Database className="w-5 h-5 text-purple-400" />,
      title: 'Zero Data Wiping Guarantee',
      description: 'Your photos, chats, and apps are never wiped or accessed. Component-level repair preserves original device storage.',
    },
  ];

  return (
    <section id="standards" className="w-full py-20 lg:py-28 bg-[#0b0c10] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-emerald-400 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>LABORATORY VS ROADSIDE BENCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Engineered for Precision. <br />
            <span className="text-zinc-500">Not Speed-and-Guesswork.</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Compare the difference between uncertified roadside repair stalls and the controlled environment of Taj Mobile Repairing Lab in Gulberg III, Lahore.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Taj Mobile Repairing Lab Standard */}
          <div className="bg-[#12141a] rounded-3xl border border-sky-500/30 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-sky-500 text-white text-xs font-mono font-bold px-4 py-1.5 rounded-bl-2xl">
              TAJ LAB STANDARD
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Taj Mobile Repairing Lab</h3>
                <p className="text-xs text-zinc-400 font-mono">Controlled Diagnostic Facility</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Scientific Isolation:</strong> Exact faulty SMD capacitor or IC identified via thermal imaging and DC power curve analysis.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Data Preservation:</strong> Strict zero-wipe policy. Passcode not required for pure hardware component replacements.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">180-Day Written Warranty:</strong> Validated digitally with QR code tracking ticket and printed receipt.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Live Online Tracking:</strong> Real-time progress updates through every phase of diagnostic and repair.</span>
              </li>
            </ul>
          </div>

          {/* Roadside Stalls */}
          <div className="bg-[#0f1013] rounded-3xl border border-white/5 p-8 opacity-80">
            <div className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider mb-6">
              TYPICAL ROADSIDE STALL
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-300">Generic Repair Shops</h3>
                <p className="text-xs text-zinc-500 font-mono">Trial-and-Error Swapping</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                <span>Guesswork part swapping; claims "motherboard is dead" when only a 50-rupee diode is shorted.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                <span>Forces factory resets or compromises sensitive personal photos and customer data.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                <span>No written warranty; "Check it right now, no guarantee after you leave the shop."</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                <span>Zero status tracking; customer forced to make repeated phone calls or shop visits.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((st, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {st.icon}
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">{st.title}</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{st.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
