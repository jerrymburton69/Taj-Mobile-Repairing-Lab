import React from 'react';
import { Phone3DCanvas } from './Phone3DCanvas';
import { Search, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface HeroSectionProps {
  settings: WebsiteSettings;
  onOpenTracking: () => void;
  onOpenInquiry: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onOpenTracking,
  onOpenInquiry,
}) => {
  return (
    <section id="home" className="relative w-full min-h-[88vh] md:min-h-[90vh] flex flex-col justify-center pt-8 md:pt-12 pb-12 overflow-hidden">
      {/* Background ambient studio lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[380px] h-[380px] bg-blue-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Editorial Typography Column */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Brand Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="tracking-wider uppercase font-semibold text-zinc-200">
              {settings.brandName || 'TAJ MOBILE REPAIRING LAB'}
            </span>
          </div>

          {/* Headline: Exact prompt requirement */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            {settings.heroHeadline || 'Precision repair for the device you depend on.'}
          </h1>

          {/* Supporting copy: Short, restrained, transparent */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-xl font-normal leading-relaxed mb-8">
            {settings.heroSubheadline || 'Professional mobile diagnostics and repair, with transparency at every step.'}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-8">
            <button
              id="hero-cta-tell-us"
              onClick={onOpenInquiry}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 active:scale-95 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{settings.heroCtaBookText || "Tell Us What's Wrong"}</span>
              <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              id="hero-cta-track"
              onClick={onOpenTracking}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-zinc-900/90 text-white font-medium text-sm hover:bg-zinc-800 border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer"
            >
              <Search className="w-4 h-4 text-sky-400" />
              <span>{settings.heroCtaTrackText || 'Track My Repair'}</span>
            </button>

            <a
              id="hero-cta-whatsapp"
              href={`https://wa.me/${(settings.whatsapp || '923214810938').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-sm hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Physical Verification & Location Footprint */}
          <div className="pt-6 border-t border-white/10 w-full flex items-center justify-center lg:justify-start gap-2 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Fazal Trade Centre, near Hafeez Center, Gulberg III, Lahore</span>
          </div>
        </div>

        {/* Right 3D Interactive Smartphone Model */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] md:min-h-[520px] w-full">
          {/* Subtle rotation hint badge */}
          <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-zinc-400 font-mono backdrop-blur-md pointer-events-none flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            <span>Interactive 3D • Drag to inspect</span>
          </div>

          <div className="w-full h-[380px] sm:h-[460px] md:h-[520px] relative">
            <Phone3DCanvas progress={0.05} interactive={true} className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
};
