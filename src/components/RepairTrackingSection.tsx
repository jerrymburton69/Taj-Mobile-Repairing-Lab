import React, { useState } from 'react';
import { Search, ShieldCheck, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

interface RepairTrackingSectionProps {
  initialCode?: string;
  onOpenTrackingModal: (code?: string) => void;
}

export const RepairTrackingSection: React.FC<RepairTrackingSectionProps> = ({
  initialCode = '',
  onOpenTrackingModal,
}) => {
  const [quickCode, setQuickCode] = useState(initialCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenTrackingModal(quickCode.trim() || undefined);
  };

  return (
    <section
      id="track-repair"
      className="relative w-full py-12 sm:py-16 bg-[#07080c] border-t border-b border-white/5 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Content */}
          <div className="max-w-md text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Live Repair Voucher Tracking</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
              Track your device in the laboratory.
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every device checked into our lab receives a unique tracking code. Monitor real-time diagnostic triage, approved parts allocation, and quality checks.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Data Exposure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Real-Time Bench Updates</span>
              </div>
            </div>
          </div>

          {/* Right Input CTA Card */}
          <div className="w-full md:w-auto shrink-0 md:min-w-[320px]">
            <form
              onSubmit={handleSubmit}
              className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 shadow-lg space-y-2.5"
            >
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={quickCode}
                  onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TJ-48291"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-sky-400 uppercase tracking-wider"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <span>Track Repair Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <p className="text-[10px] text-zinc-500 text-center font-mono pt-1">
                Sample code: <button type="button" onClick={() => onOpenTrackingModal('TJ-48291')} className="text-sky-400 underline cursor-pointer">TJ-48291</button> or <button type="button" onClick={() => onOpenTrackingModal('TJ-8F42K')} className="text-sky-400 underline cursor-pointer">TJ-8F42K</button>
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
