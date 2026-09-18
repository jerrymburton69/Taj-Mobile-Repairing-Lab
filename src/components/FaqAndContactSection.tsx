import React, { useState } from 'react';
import { WebsiteSettings } from '../types';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

interface FaqAndContactSectionProps {
  settings: WebsiteSettings;
}

export const FaqAndContactSection: React.FC<FaqAndContactSectionProps> = ({ settings }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Will my personal data, photos, or apps be affected during repair?',
      a: 'Data privacy is strictly respected. For all hardware component replacements (screens, batteries, charging docks, cameras), your user storage remains untouched. A passcode is only requested if required to test hardware sensors (e.g. microphone, proximity sensor) before reassembly.',
    },
    {
      q: 'What is your policy regarding replacement parts?',
      a: settings.oemStatement || 'Where replacement is required, we prioritize original OEM parts appropriate for the device and repair. We do not position cheap aftermarket parts as equivalent to OEM components.',
    },
    {
      q: 'How long does a diagnostic inspection take?',
      a: 'Intake triage and preliminary multimeter testing are conducted upon arrival. Standard component replacements are scheduled for same-day service, while complex logic board micro-soldering and trace repair are quoted after detailed stereomicroscope analysis.',
    },
    {
      q: 'What is covered under your repair warranty?',
      a: 'All installed components carry a lab warranty against functional and manufacturing defects, including touch responsiveness and charging stability. Damage from subsequent physical drops, pressure fractures, or liquid submersion is excluded.',
    },
    {
      q: 'Where is Taj Mobile Repairing Lab located in Lahore?',
      a: 'Shop # M-11, Fazal Trade Centre, near Hafeez Center, Block E1, Gulberg III, Lahore, 54000, Pakistan.',
    },
  ];

  return (
    <section id="contact" className="relative w-full py-20 bg-[#050608] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-sky-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider font-semibold">Transparency & Location</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions & Lab Location
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Straightforward answers and physical verified laboratory coordinates in Gulberg III, Lahore.
          </p>
        </div>

        {/* 2-Column Grid: Left FAQs, Right Contact / Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: FAQs Accordion */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Common Inquiries</span>
            </h3>

            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-zinc-900/40 border border-white/5 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-medium text-sm sm:text-base hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-sky-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Verified Lab Details & Direct Coordinates */}
          <div className="lg:col-span-5 space-y-5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Laboratory Details</span>
            </h3>

            <div className="p-6 sm:p-7 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-6">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-sky-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Physical Address
                  </div>
                  <div className="text-sm font-semibold text-white leading-snug">
                    {settings.address || 'Shop # M-11, Fazal Trade Centre, near Hafeez Center, Block E1, Gulberg III'}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">Lahore, 54000, Pakistan</div>

                  <a
                    href={settings.googleMapsUrl || 'https://maps.app.goo.gl/qezz1h1sno7cHVAj6'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 mt-2 font-medium"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/5 text-sky-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">Telephone</div>
                    <a
                      href={`tel:${settings.phone || '03214810938'}`}
                      className="text-xs font-bold text-white hover:text-sky-300"
                    >
                      {settings.phone || '03214810938'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">WhatsApp</div>
                    <a
                      href={`https://wa.me/${(settings.whatsapp || '923214810938').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      {settings.whatsapp || '+923214810938'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="pt-4 border-t border-white/10 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 text-zinc-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Operating Hours
                  </div>
                  <div className="text-xs text-zinc-200">
                    {settings.workingHours || 'Mon – Sat: 11:00 AM – 9:30 PM | Sunday Closed'}
                  </div>
                </div>
              </div>

              {/* Official Facebook Link */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Official Page:</span>
                <a
                  href={settings.facebookUrl || 'https://www.facebook.com/tajmobileofficial?mibextid=LQQJ4d'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                >
                  <span>facebook.com/tajmobileofficial</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
