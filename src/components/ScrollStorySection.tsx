import React, { useState, useEffect, useRef } from 'react';
import { Phone3DCanvas, PHONE_COMPONENTS, PhoneComponentInfo } from './Phone3DCanvas';
import { LaboratorySettings } from '../types';
import {
  ChevronRight,
  ShieldCheck,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface ScrollStorySectionProps {
  onSelectService?: (serviceName: string) => void;
  settings?: LaboratorySettings;
}

interface StoryPhase {
  id: number;
  label: string;
  headline: string;
  subtext: string;
  badge: string;
  suggestedComponentId?: string;
}

export const ScrollStorySection: React.FC<ScrollStorySectionProps> = ({
  onSelectService,
  settings,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState<PhoneComponentInfo | null>(null);

  const phases: StoryPhase[] = [
    {
      id: 1,
      label: 'Assembled',
      headline: 'Built in layers. Every component has a purpose.',
      subtext: 'A modern smartphone is a hermetically sealed composite system. Intake diagnostics benchmark power draw and perimeter alignment before opening.',
      badge: 'Micron Tolerance',
    },
    {
      id: 2,
      label: 'Reveal',
      headline: 'Precision starts beneath the surface.',
      subtext: 'Controlled thermal release safely loosens factory water-seal gaskets without flexing the sensitive OLED substrate.',
      badge: 'Thermal Release',
    },
    {
      id: 3,
      label: 'Open',
      headline: 'Uncoupling the visual interface.',
      subtext: 'The 120Hz ceramic glass display lifts away, preserving the TrueTone EEPROM micro-controller and proximity sensor array.',
      badge: 'Display Separation',
      suggestedComponentId: 'display',
    },
    {
      id: 4,
      label: 'Disassemble',
      headline: 'Every layer matters.',
      subtext: 'Internal heat spreaders and EMI shields are removed to expose the logic board and dual-cell lithium-ion energy reservoir.',
      badge: 'Core Isolation',
      suggestedComponentId: 'battery',
    },
    {
      id: 5,
      label: 'Inspect',
      headline: 'Isolated diagnostics down to the micron.',
      subtext: 'Stereomicroscopes and thermal FLIR imaging pinpoint failed capacitors, shorted buck regulators, or damaged optic coils.',
      badge: 'Stereomicroscopy',
      suggestedComponentId: 'board',
    },
    {
      id: 6,
      label: 'Exploded View',
      headline: 'An architectural breakdown of your device.',
      subtext: 'Each module hovers in calibrated alignment: display, power pack, logic board, sensor-shift optics, and titanium enclosure.',
      badge: 'Exploded Engineering',
    },
    {
      id: 7,
      label: 'Restoration',
      headline: 'Targeted component restoration.',
      subtext: 'We solder and replace individual failed silicon traces instead of forcing expensive complete motherboard replacements.',
      badge: 'Board-Level Repair',
      suggestedComponentId: 'camera',
    },
    {
      id: 8,
      label: 'Convergence',
      headline: 'Returning to factory tolerances.',
      subtext: 'All internal flex assemblies torque-seated into the titanium perimeter frame with laser alignment guides.',
      badge: 'Component Seating',
    },
    {
      id: 9,
      label: 'Reassemble',
      headline: 'Calibrated and sealed back to factory spec.',
      subtext: 'Fresh die-cut pressure adhesive cures under pneumatic clamp pressure, restoring IP-rated environmental dust and moisture seals.',
      badge: 'Pressure Sealed',
    },
    {
      id: 10,
      label: 'Calibrated',
      headline: 'Tested across 28 diagnostic checkpoints.',
      subtext: 'RF cellular transmission, biometric sensors, fast charging curves, and optical focus certified before handover.',
      badge: 'Handover Ready',
    },
  ];

  // Continuous Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalDistance = rect.height - viewportHeight;

      if (totalDistance <= 0) return;

      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / totalDistance));
      setProgress(p);

      // Derive phase index (0 to 9)
      const phaseIdx = Math.min(phases.length - 1, Math.floor(p * phases.length));
      setActivePhaseIndex(phaseIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [phases.length]);

  const currentPhase = phases[activePhaseIndex] || phases[0];

  const handlePhaseClick = (index: number) => {
    setActivePhaseIndex(index);
    const targetP = (index + 0.5) / phases.length;
    setProgress(targetP);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const totalDistance = containerRef.current.scrollHeight - window.innerHeight;
      const targetScroll = window.scrollY + rect.top + targetP * totalDistance;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const handleComponentSelect = (comp: PhoneComponentInfo) => {
    setSelectedComponent(comp.id === selectedComponent?.id ? null : comp);
  };

  const title = settings?.title || 'Inside the Laboratory';
  const subtitle = settings?.subtitle || 'A continuous engineering teardown of flagship hardware architecture';

  return (
    <section
      id="laboratory"
      ref={containerRef}
      className="relative w-full bg-[#050608] border-t border-b border-white/5 min-h-[220vh] text-white select-none"
    >
      {/* Sticky Cinematic Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-5 sm:py-6">
        
        {/* Top Header & Navigation Strip */}
        <div className="flex flex-col items-center text-center z-20 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Hardware Engineering • Step {activePhaseIndex + 1} of {phases.length}</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1 hidden sm:block">
            {subtitle}
          </p>

          {/* Phase Quick-Jump Scroller */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-3 p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md overflow-x-auto max-w-full scrollbar-none">
            {phases.map((ph, idx) => (
              <button
                key={ph.id}
                onClick={() => handlePhaseClick(idx)}
                className={`px-2.5 py-1 text-[11px] sm:text-xs rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activePhaseIndex === idx
                    ? 'bg-white text-zinc-950 font-semibold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {ph.id}. {ph.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center 3D Model Stage */}
        <div className="flex-1 relative flex items-center justify-center w-full my-auto min-h-[260px] max-h-[56vh] sm:max-h-[62vh]">
          <div className="w-full h-full max-w-2xl relative">
            <Phone3DCanvas
              progress={progress}
              stage={activePhaseIndex + 1}
              highlightedComponentId={selectedComponent?.id || currentPhase.suggestedComponentId || null}
              quality={settings?.quality3D || 'auto'}
              reducedMotion={settings?.reducedMotionBehavior === 'static'}
              interactive={true}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Bottom Story & Inspection Console */}
        <div className="z-20 max-w-2xl mx-auto w-full pb-1 shrink-0">
          <div className="bg-zinc-900/85 border border-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-2xl transition-all duration-300">
            
            {/* Phase Badge & Progress Bar */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-mono font-medium">
                {currentPhase.badge}
              </span>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span>{Math.round(progress * 100)}%</span>
                <div className="w-16 sm:w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-200"
                    style={{ width: `${Math.max(8, progress * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Main Headline & Narrative Copy */}
            <h3 className="text-base sm:text-lg font-bold text-white mb-1 tracking-tight leading-snug">
              {currentPhase.headline}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-2 sm:line-clamp-none">
              {currentPhase.subtext}
            </p>

            {/* Interactive Component Filters */}
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold mr-1">
                Inspect:
              </span>
              {PHONE_COMPONENTS.map((comp) => {
                const isSelected = selectedComponent?.id === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => handleComponentSelect(comp)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-white font-semibold'
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {comp.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Selected Component Quick Details Drawer */}
            {selectedComponent && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-sky-950/20 border border-sky-500/20 text-xs animate-in fade-in slide-in-from-bottom-1">
                <div className="flex items-center justify-between text-sky-300 font-semibold">
                  <span>{selectedComponent.name}</span>
                  <span className="text-[10px] font-mono text-sky-400">{selectedComponent.category}</span>
                </div>
                <p className="text-zinc-300 text-[11px] mt-1 leading-relaxed">
                  {selectedComponent.functionDesc}
                </p>
                {onSelectService && (
                  <button
                    onClick={() => onSelectService(selectedComponent.recommendedService)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
                  >
                    <span>View {selectedComponent.recommendedService}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Handover Verified Finish Callout */}
            {activePhaseIndex === phases.length - 1 && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lab diagnostic reassembly certified</span>
                </div>
                <a
                  href="#tell-us"
                  className="px-3.5 py-1.5 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-all cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <span>Request Repair</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
