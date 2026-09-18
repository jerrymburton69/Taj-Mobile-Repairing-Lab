import React from 'react';
import { Smartphone, BatteryCharging, Zap, Camera, Cpu, Droplets, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectCategory: (categoryName: string, problemSuggestion: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'screen',
      title: 'Screen & Display',
      icon: Smartphone,
      accent: 'text-sky-400',
      tag: 'OLED / Glass',
      description: 'Precision OLED panel lamination, scratch-resistant glass, and TrueTone color calibration.',
      suggestion: 'My screen has cracked glass / flickering lines / touch issues.',
    },
    {
      id: 'battery',
      title: 'Battery & Power',
      icon: BatteryCharging,
      accent: 'text-emerald-400',
      tag: 'Power Health',
      description: 'Zero-cycle original grade battery replacement with micro-controller health curve programming.',
      suggestion: 'My battery drains quickly / health is degraded / phone shuts off unexpectedly.',
    },
    {
      id: 'charging',
      title: 'Charging & Port',
      icon: Zap,
      accent: 'text-pink-400',
      tag: 'USB-C / Dock',
      description: 'De-oxidation ultrasonic port cleaning, ribbon replacement, and fast-charge protocol restoration.',
      suggestion: 'My phone is not charging properly / cable feels loose / moisture warning won\'t clear.',
    },
    {
      id: 'camera',
      title: 'Camera & Optics',
      icon: Camera,
      accent: 'text-purple-400',
      tag: 'Optics / OIS',
      description: 'Sensor-shift optical image stabilization repair, prism alignment, and cracked sapphire glass service.',
      suggestion: 'My camera is blurry / vibrating violently / exterior camera glass is shattered.',
    },
    {
      id: 'board',
      title: 'Logic Board',
      icon: Cpu,
      accent: 'text-amber-400',
      tag: 'Microsoldering',
      description: 'Stereomicroscope diagnostics, short-circuit clearing, PMIC power IC reballing, and critical data recovery.',
      suggestion: 'My phone is completely dead / stuck on boot loop / suffered a logic board short circuit.',
    },
    {
      id: 'water',
      title: 'Water Damage',
      icon: Droplets,
      accent: 'text-blue-400',
      tag: 'Ultrasonic Wash',
      description: 'Full teardown, 40kHz ultrasonic solvent cleaning, corrosion neutralization, and power rail diagnostics.',
      suggestion: 'My phone was exposed to liquid / water contact and needs urgent ultrasonic decontamination.',
    },
  ];

  return (
    <section id="services" className="w-full py-20 bg-[#07080b] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold mb-2 block">
            Focused Diagnostic Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Repair Specializations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Select the issue affecting your device to start your diagnostic request.
          </p>
        </div>

        {/* 6 High-Level Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.title, cat.suggestion)}
                className="p-6 sm:p-7 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-sky-500/30 hover:bg-zinc-900/80 transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-white group-hover:scale-105 transition-transform">
                      <Icon className={`w-6 h-6 ${cat.accent}`} />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
                  <span>Request diagnostic</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
