import React from 'react';
import { ShieldCheck, CheckCircle2, Cpu, Wrench, Microscope, Sparkles } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface OemTrustSectionProps {
  settings: WebsiteSettings;
}

export const OemTrustSection: React.FC<OemTrustSectionProps> = ({ settings }) => {
  const oemText =
    settings.oemStatement ||
    'Where replacement is required, we prioritize original OEM parts appropriate for the device and repair. We do not position cheap aftermarket parts as equivalent to OEM components.';

  const trustText =
    settings.trustStatement ||
    'Every device is treated as mission-critical equipment. We use calibrated ESD-safe workstations, stereomicroscopes, and thermal diagnostic imaging.';

  return (
    <section className="relative w-full py-20 bg-[#07080b] border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-sky-400 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider font-semibold">Laboratory Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Original OEM Parts & Diagnostic Transparency
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
            {trustText}
          </p>
        </div>

        {/* Primary OEM Guarantee Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 p-8 sm:p-10 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Our Component Integrity Policy</h3>
                  <span className="text-xs text-zinc-400 font-mono">Precision Grade Standards</span>
                </div>
              </div>

              <blockquote className="text-lg sm:text-xl text-zinc-200 font-normal leading-relaxed border-l-2 border-sky-400 pl-4 my-6">
                “{oemText}”
              </blockquote>

              <p className="text-sm text-zinc-400 leading-relaxed">
                Cheap aftermarket copy displays, substandard battery cells, and pirated flex ribbons suffer from touch jitter, thermal throttling, and early failure. When you bring your flagship to Taj Mobile Repairing Lab, we provide upfront clarity on the origin, grade, and specifications of every replacement component.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 text-xs text-zinc-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Compromise on Cells</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>True Tone Calibration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ESD Protected Lab Bench</span>
              </div>
            </div>
          </div>

          {/* Right Lab Bench Features Card */}
          <div className="lg:col-span-4 p-8 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Microscope className="w-4 h-4 text-sky-400" />
                <span>Why Component Choice Matters</span>
              </h4>

              <div className="space-y-4 text-xs text-zinc-400 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-zinc-200 font-semibold mb-1">Color Accuracy & Touch Refresh</div>
                  <div>OEM panels retain original 120Hz ProMotion/Dynamic AMOLED refresh and authentic brightness levels.</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-zinc-200 font-semibold mb-1">Power Stability & Battery Safety</div>
                  <div>Grade-A original battery cells prevent rapid decay, frame expansion, and sudden power cuts under load.</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-zinc-200 font-semibold mb-1">Clean Gasket Water Resistance</div>
                  <div>We re-install laser-cut perimeter adhesive seals to maintain factory-grade dust and splash protection.</div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 text-[11px] text-zinc-400">
              * Independent repair laboratory. All trademark names referenced for diagnostic compatibility only.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
