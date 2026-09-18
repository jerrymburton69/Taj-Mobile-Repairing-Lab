import React, { useState, useEffect } from 'react';
import { TajLogo } from './TajLogo';
import { Search, Lock, Menu, X, ArrowRight } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface NavbarProps {
  settings: WebsiteSettings;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  onOpenInquiry: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenTracking,
  onOpenAdmin,
  onOpenInquiry,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Strict minimal navigation per master prompt
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Repair', href: '#services' },
    { label: 'Track', href: '#tracking' },
    { label: 'Home Service', href: '#home-service' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-black/85 backdrop-blur-xl border-b border-white/10 shadow-lg'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center group cursor-pointer"
          >
            <TajLogo
              size="md"
              logoSettings={settings.logo}
              brandName={settings.brandName}
              shortBrandName={settings.shortBrandName}
              isDark={true}
              className="group-hover:scale-105 transition-transform"
            />
          </a>

          {/* Minimal Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenTracking}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span>Track My Repair</span>
            </button>

            <button
              onClick={onOpenInquiry}
              className="px-5 py-2 rounded-full bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Tell Us What's Wrong</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenAdmin}
              title="Management Console (Protected)"
              className="p-2 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors cursor-pointer ml-1"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-black/95 backdrop-blur-2xl px-6 py-6 space-y-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="text-base font-medium text-zinc-200 py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="w-full py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm text-center"
              >
                Tell Us What's Wrong
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="w-full py-3 rounded-xl bg-zinc-900 border border-white/10 text-white font-medium text-sm text-center flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-sky-400" />
                <span>Track My Repair</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 text-xs text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lab Management Console</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
