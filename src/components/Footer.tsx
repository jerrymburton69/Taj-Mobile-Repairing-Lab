import React from 'react';
import { TajLogo } from './TajLogo';
import { WebsiteSettings } from '../types';
import { Phone, MapPin, MessageSquare, Lock, ArrowUp, ExternalLink } from 'lucide-react';

interface FooterProps {
  settings: WebsiteSettings;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin, onOpenTracking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#040507] border-t border-white/10 text-zinc-400 py-14 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/5">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center">
              <TajLogo
                size="md"
                logoSettings={settings.logo}
                brandName={settings.brandName}
                shortBrandName={settings.shortBrandName}
                isDark={true}
              />
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Professional mobile phone diagnostics and laboratory repair. Screen, battery, charging assembly, camera optics, and logic board microsoldering in Gulberg III, Lahore.
            </p>

            <div className="text-[11px] text-zinc-400">
              * Independent repair facility. Manufacturer brand names referenced for compatibility identification only.
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-mono uppercase text-[11px] font-bold tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#repair-story" className="hover:text-white transition-colors">3D Teardown Story</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Repair Categories</a></li>
              <li><a href="#tell-us" className="hover:text-white transition-colors">Tell Us What's Wrong</a></li>
              <li><a href="#tracking" className="hover:text-white transition-colors">Track Repair</a></li>
              <li><a href="#home-service" className="hover:text-white transition-colors">Doorstep Service</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact & Location</a></li>
            </ul>
          </div>

          {/* Direct Coordinates */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-white font-mono uppercase text-[11px] font-bold tracking-wider">
              Laboratory Location
            </div>
            <p className="text-zinc-300 leading-relaxed text-xs">
              Shop # M-11, Fazal Trade Centre, near Hafeez Center, Block E1, Gulberg III, Lahore, 54000, Pakistan
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <a
                href={settings.googleMapsUrl || 'https://maps.app.goo.gl/qezz1h1sno7cHVAj6'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={`tel:${settings.phone || '03214810938'}`}
                className="text-zinc-300 hover:text-white flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>03214810938</span>
              </a>

              <a
                href={`https://wa.me/${(settings.whatsapp || '923214810938').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: +923214810938</span>
              </a>

              <a
                href={settings.facebookUrl || 'https://www.facebook.com/tajmobileofficial?mibextid=LQQJ4d'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white flex items-center gap-1.5"
              >
                <span>facebook.com/tajmobileofficial</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            © {new Date().getFullYear()} TAJ MOBILE REPAIRING LAB. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenAdmin}
              className="text-zinc-400 hover:text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Laboratory Console</span>
            </button>

            <button
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
