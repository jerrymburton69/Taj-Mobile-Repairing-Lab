import React, { useState } from 'react';
import { PhoneComponentInfo, PHONE_COMPONENTS, Phone3DCanvas } from './Phone3DCanvas';
import { Cpu, AlertCircle, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';

interface WhatsInsideSectionProps {
  onRequestService: (serviceName: string) => void;
}

export const WhatsInsideSection: React.FC<WhatsInsideSectionProps> = ({ onRequestService }) => {
  const [selectedComp, setSelectedComp] = useState<PhoneComponentInfo>(PHONE_COMPONENTS[1]); // Default to Battery

  return (
    <section id="inside" className="w-full py-20 lg:py-28 bg-[#0b0c10] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-sky-400 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>HARDWARE EXPLORER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            What's Inside Your Phone?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Select any sub-assembly below to inspect its operational role, failure symptoms, and how our lab certifies and restores it.
          </p>
        </div>

        {/* Component Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-10">
          {PHONE_COMPONENTS.map((comp) => {
            const isSelected = selectedComp.id === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedComp(comp)}
                className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-sky-500/60 shadow-lg shadow-sky-500/10 scale-102'
                    : 'bg-zinc-950/60 border-white/5 hover:border-white/15 hover:bg-zinc-900/40 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: comp.color }}
                  />
                  {isSelected && (
                    <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold">Active</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white tracking-tight leading-snug">
                  {comp.name.split(' ')[0]} {comp.name.split(' ')[1]}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1 truncate">
                  {comp.category}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Card + 3D Highlighting */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#101117] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
          {/* 3D Visualizer with targeted component pulse */}
          <div className="lg:col-span-6 h-[340px] sm:h-[420px] relative flex items-center justify-center">
            <Phone3DCanvas
              progress={0.65}
              highlightedComponentId={selectedComp.id}
              interactive={true}
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300">
              Isolating: <span className="text-sky-400 font-semibold">{selectedComp.name}</span>
            </div>
          </div>

          {/* Diagnostic Dossier */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedComp.color }} />
                <span>{selectedComp.category}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                {selectedComp.name}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {selectedComp.functionDesc}
              </p>
            </div>

            {/* Common Symptoms */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-2.5">
              <div className="text-xs font-mono text-amber-400 flex items-center gap-1.5 uppercase font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Common Failure Symptoms</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                {selectedComp.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lab Solution & CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-zinc-500 uppercase">Recommended Lab Service</div>
                <div className="text-sm font-semibold text-white">{selectedComp.recommendedService}</div>
              </div>

              <button
                onClick={() => onRequestService(selectedComp.recommendedService)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Request {selectedComp.name.split(' ')[0]} Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
