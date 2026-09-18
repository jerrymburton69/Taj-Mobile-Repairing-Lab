import React, { useState, useEffect } from 'react';
import { store } from './lib/store';
import { WebsiteSettings } from './types';
import { applyThemeToDOM } from './lib/theme';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ScrollStorySection } from './components/ScrollStorySection';
import { OemTrustSection } from './components/OemTrustSection';
import { CustomerInquirySection } from './components/CustomerInquirySection';
import { ServicesSection } from './components/ServicesSection';
import { RepairTrackingSection } from './components/RepairTrackingSection';
import { HomeServiceSection } from './components/HomeServiceSection';
import { FaqAndContactSection } from './components/FaqAndContactSection';
import { Footer } from './components/Footer';
import { AdminConsole } from './components/AdminConsole';
import { TrackingModal } from './components/TrackingModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<WebsiteSettings>(store.getSettings());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingModalCode, setTrackingModalCode] = useState<string>('TJ-48291');
  const [inquiryProblem, setInquiryProblem] = useState<string>('');

  // Synchronize settings from store and apply theme to DOM
  useEffect(() => {
    const current = store.getSettings();
    setSettings(current);
    if (current.theme) {
      applyThemeToDOM(current.theme);
    }
  }, [isAdminOpen]);

  // Initial mount: theme application & URL parameter detection
  useEffect(() => {
    const current = store.getSettings();
    if (current.theme) {
      applyThemeToDOM(current.theme);
    }

    const params = new URLSearchParams(window.location.search);
    const trackCode = params.get('track') || params.get('code');
    const adminParam = params.get('admin');

    if (trackCode) {
      setTrackingModalCode(trackCode.toUpperCase());
      setIsTrackingModalOpen(true);
    }

    if (adminParam === 'true') {
      setIsAdminOpen(true);
    }
  }, []);

  const handleOpenTrackingModal = (code?: string) => {
    if (code) {
      setTrackingModalCode(code);
    }
    setIsTrackingModalOpen(true);
  };

  const handleOpenInquiry = (suggestion?: string) => {
    if (suggestion) {
      setInquiryProblem(suggestion);
    }
    const inquiryEl = document.getElementById('tell-us');
    if (inquiryEl) {
      inquiryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceCategory = (categoryTitle: string, suggestion: string) => {
    setInquiryProblem(`[${categoryTitle}] ${suggestion}`);
    handleOpenInquiry();
  };

  // Section component renderer respecting section ordering and visibility
  const renderSection = (key: string) => {
    const isVisible = settings.visibility ? (settings.visibility as any)[key] !== false : true;
    if (!isVisible) return null;

    switch (key) {
      case 'hero':
        return (
          <HeroSection
            key="hero"
            settings={settings}
            onOpenTracking={() => handleOpenTrackingModal()}
            onOpenInquiry={() => handleOpenInquiry()}
          />
        );

      case 'services':
        return (
          <ServicesSection
            key="services"
            onSelectCategory={handleSelectServiceCategory}
          />
        );

      case 'laboratory':
        if (settings.laboratory?.enabled === false) return null;
        return (
          <ScrollStorySection
            key="laboratory"
            onSelectService={(service) => handleOpenInquiry(`Service inquiry: ${service}`)}
          />
        );

      case 'trackingCta':
        return (
          <RepairTrackingSection
            key="trackingCta"
            initialCode={trackingModalCode}
            onOpenTrackingModal={handleOpenTrackingModal}
          />
        );

      case 'oemTrust':
        return <OemTrustSection key="oemTrust" settings={settings} />;

      case 'inquiry':
        return <CustomerInquirySection key="inquiry" prefilledProblem={inquiryProblem} />;

      case 'homeService':
        return <HomeServiceSection key="homeService" />;

      case 'faqContact':
        return <FaqAndContactSection key="faqContact" settings={settings} />;

      default:
        return null;
    }
  };

  // Default section ordering if not configured
  const sectionList = settings.sectionOrder && settings.sectionOrder.length > 0
    ? settings.sectionOrder
    : [
        { key: 'hero', label: 'Hero Section', enabled: true },
        { key: 'services', label: 'Services & Diagnostics', enabled: true },
        { key: 'laboratory', label: 'Inside The Laboratory', enabled: true },
        { key: 'trackingCta', label: 'Track Repair CTA', enabled: true },
        { key: 'oemTrust', label: 'OEM & Trust Positioning', enabled: true },
        { key: 'inquiry', label: 'Repair Booking & Inquiry', enabled: true },
        { key: 'homeService', label: 'Home & Office Service', enabled: true },
        { key: 'faqContact', label: 'FAQ & Lab Location', enabled: true },
      ];

  const showFooter = settings.visibility ? settings.visibility.footer !== false : true;
  const showWhatsApp = settings.visibility ? settings.visibility.whatsappCta !== false : true;

  return (
    <div className="min-h-screen bg-[#050608] text-white flex flex-col selection:bg-sky-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Precision Apple-inspired frosted navigation */}
      <Navbar
        settings={settings}
        onOpenTracking={() => handleOpenTrackingModal()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenInquiry={() => handleOpenInquiry()}
      />

      {/* Main Single-Page Experience Flow in Ordered Sequence */}
      <main className="flex-1 flex flex-col">
        {sectionList.map((item) => (
          <ErrorBoundary key={item.key} name={item.label || item.key}>
            {item.enabled !== false && renderSection(item.key)}
          </ErrorBoundary>
        ))}
      </main>

      {/* Footer */}
      {showFooter && (
        <Footer
          settings={settings}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenTracking={() => handleOpenTrackingModal()}
        />
      )}

      {/* Floating WhatsApp Action Pill */}
      {showWhatsApp && (
        <a
          href={`https://wa.me/${(settings.whatsapp || '+923214810938').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Taj Mobile Lab, I need assistance with a phone repair.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-40 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-emerald-400/40 cursor-pointer"
          title="Chat with Master Technician on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span className="hidden sm:inline">WhatsApp Lab</span>
        </a>
      )}

      {/* Track Your Repair Modal (Apple-Inspired Pop-up per requirement 21) */}
      <TrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        initialCode={trackingModalCode}
        whatsappNumber={settings.whatsapp || '+923214810938'}
      />

      {/* Laboratory Management Console Modal */}
      {isAdminOpen && (
        <AdminConsole
          onClose={() => setIsAdminOpen(false)}
          onOpenPublicTracking={(code) => {
            setIsAdminOpen(false);
            handleOpenTrackingModal(code);
          }}
        />
      )}
    </div>
  );
}
