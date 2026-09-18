import React, { useState, useMemo, useEffect, useRef } from 'react';
import { WebsiteSettings, ThemeSettings, LogoSettings, SectionKey, SectionOrderItem, ThemePresetKey } from '../types';
import { THEME_PRESETS, applyThemeToDOM, isValidHex } from '../lib/theme';
import { TajLogo } from './TajLogo';
import {
  Search,
  RotateCcw,
  Save,
  Check,
  Upload,
  Trash2,
  Eye,
  Sliders,
  Palette,
  Layout,
  Layers,
  FileText,
  Smartphone,
  ShieldCheck,
  Type,
  Sparkles,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';

interface WebsiteControlCenterProps {
  settings: WebsiteSettings;
  onSave: (newSettings: WebsiteSettings) => void;
  onReset: () => void;
  showFeedback: (msg: string) => void;
}

type SettingsCategory =
  | 'general'
  | 'branding'
  | 'sections'
  | 'ordering'
  | 'customization'
  | 'laboratory'
  | 'theme'
  | 'typography';

export const WebsiteControlCenter: React.FC<WebsiteControlCenterProps> = ({
  settings: initialSettings,
  onSave,
  onReset,
  showFeedback,
}) => {
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>(initialSettings);
  const [savedSettings, setSavedSettings] = useState<WebsiteSettings>(initialSettings);
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [logoPreviewMode, setLogoPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [logoPreviewTheme, setLogoPreviewTheme] = useState<'dark' | 'light'>('dark');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize when parent settings change
  useEffect(() => {
    setLocalSettings(initialSettings);
    setSavedSettings(initialSettings);
  }, [initialSettings]);

  // Dirty checking
  const isDirty = useMemo(() => {
    return JSON.stringify(localSettings) !== JSON.stringify(savedSettings);
  }, [localSettings, savedSettings]);

  // Live apply theme while tweaking in admin
  useEffect(() => {
    if (localSettings.theme) {
      applyThemeToDOM(localSettings.theme);
    }
  }, [localSettings.theme]);

  // Handlers for settings updates
  const updateGeneral = <K extends keyof WebsiteSettings>(key: K, value: WebsiteSettings[K]) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateLogo = <K extends keyof LogoSettings>(key: K, value: LogoSettings[K]) => {
    setLocalSettings((prev) => ({
      ...prev,
      logo: {
        ...(prev.logo || {
          useCustomLogo: false,
          maxWidthDesktop: 190,
          maxHeightDesktop: 48,
          maxWidthMobile: 140,
          maxHeightMobile: 36,
          desktopScale: 1.0,
          mobileScale: 1.0,
          verticalOffset: 0,
          padding: 0,
        }),
        [key]: value,
      },
    }));
  };

  const updateTheme = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setLocalSettings((prev) => {
      const currentTheme = prev.theme || THEME_PRESETS['taj-default'].dark;
      const updated = { ...currentTheme, [key]: value };
      return { ...prev, theme: updated as ThemeSettings };
    });
  };

  const applyPreset = (presetKey: ThemePresetKey) => {
    const isDark = localSettings.theme?.appearance !== 'light';
    const presetObj = THEME_PRESETS[presetKey];
    if (!presetObj) return;
    const palette = isDark ? presetObj.dark : presetObj.light;

    setLocalSettings((prev) => ({
      ...prev,
      theme: {
        ...(prev.theme || {}),
        ...palette,
        preset: presetKey,
      } as ThemeSettings,
    }));
    showFeedback(`Applied "${presetObj.name}" preset`);
  };

  const handleSave = () => {
    onSave(localSettings);
    setSavedSettings(localSettings);
    showFeedback('Website settings published successfully!');
  };

  const handleDiscard = () => {
    setLocalSettings(savedSettings);
    if (savedSettings.theme) {
      applyThemeToDOM(savedSettings.theme);
    }
    showFeedback('Unsaved changes discarded');
  };

  // Reorder sections
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const currentList = [...(localSettings.sectionOrder || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const [moved] = currentList.splice(index, 1);
    currentList.splice(targetIndex, 0, moved);
    setLocalSettings((prev) => ({ ...prev, sectionOrder: currentList }));
  };

  // Handle Logo file upload with safe validation
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'dark' | 'light' | 'mobile' | 'desktop') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Logo file size must be less than 1.5 MB.');
      return;
    }

    // Check safe MIME types
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid PNG, JPG, WebP, or SVG logo file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (target === 'dark') updateLogo('darkLogoUrl', dataUrl);
        else if (target === 'light') updateLogo('lightLogoUrl', dataUrl);
        else if (target === 'mobile') updateLogo('mobileLogoUrl', dataUrl);
        else if (target === 'desktop') updateLogo('desktopLogoUrl', dataUrl);
        updateLogo('useCustomLogo', true);
        showFeedback(`Uploaded ${target} logo successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const categories: { id: SettingsCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'general', label: 'General & Contact', icon: Sliders },
    { id: 'branding', label: 'Logo & Branding', icon: Sparkles },
    { id: 'sections', label: 'Section Visibility', icon: Eye },
    { id: 'ordering', label: 'Section Ordering', icon: Layout },
    { id: 'customization', label: 'Content & Copy', icon: FileText },
    { id: 'laboratory', label: 'Laboratory & 3D', icon: Layers },
    { id: 'theme', label: 'Theme & Palette', icon: Palette },
    { id: 'typography', label: 'Typography & Style', icon: Type },
  ];

  // Search filtering logic
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter((c) => c.label.toLowerCase().includes(q));
  }, [searchQuery]);

  const logoSettings = localSettings.logo || {
    useCustomLogo: false,
    maxWidthDesktop: 190,
    maxHeightDesktop: 48,
    maxWidthMobile: 140,
    maxHeightMobile: 36,
    desktopScale: 1.0,
    mobileScale: 1.0,
    verticalOffset: 0,
    padding: 0,
  };

  const themeSettings = localSettings.theme || THEME_PRESETS['taj-default'].dark;

  return (
    <div className="relative space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Website Control Center</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure public identity, brand logo, sections, laboratory experience, and theme engine.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-sky-400"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
            title="Reset to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Categories Navigation + Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/15 border border-sky-500/30 text-sky-400 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Configuration Body */}
        <div className="lg:col-span-9 bg-zinc-900/60 border border-white/10 rounded-2xl p-5 sm:p-7 space-y-6">
          {/* CATEGORY 1: GENERAL SETTINGS */}
          {activeCategory === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white">General Information & Coordinates</h3>
                <p className="text-xs text-zinc-400">Core business metadata displayed across header and footer</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Official Brand Name</label>
                  <input
                    type="text"
                    value={localSettings.brandName}
                    onChange={(e) => updateGeneral('brandName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Short Header Name</label>
                  <input
                    type="text"
                    value={localSettings.shortBrandName || 'TAJ LAB'}
                    onChange={(e) => updateGeneral('shortBrandName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Tagline</label>
                  <input
                    type="text"
                    value={localSettings.tagline}
                    onChange={(e) => updateGeneral('tagline', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Telephone Call</label>
                  <input
                    type="text"
                    value={localSettings.phone}
                    onChange={(e) => updateGeneral('phone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">WhatsApp Support</label>
                  <input
                    type="text"
                    value={localSettings.whatsapp}
                    onChange={(e) => updateGeneral('whatsapp', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Lab Email</label>
                  <input
                    type="email"
                    value={localSettings.email}
                    onChange={(e) => updateGeneral('email', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Physical Lab Address</label>
                <input
                  type="text"
                  value={localSettings.address}
                  onChange={(e) => updateGeneral('address', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Working Hours</label>
                  <input
                    type="text"
                    value={localSettings.workingHours || localSettings.openingHours}
                    onChange={(e) => updateGeneral('workingHours', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Google Maps URL</label>
                  <input
                    type="text"
                    value={localSettings.googleMapsUrl}
                    onChange={(e) => updateGeneral('googleMapsUrl', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Footer Copyright Text</label>
                <input
                  type="text"
                  value={localSettings.footerCopyright || '© 2026 TAJ MOBILE REPAIRING LAB. All rights reserved.'}
                  onChange={(e) => updateGeneral('footerCopyright', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* CATEGORY 2: LOGO & BRANDING SYSTEM */}
          {activeCategory === 'branding' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Logo Customization System</h3>
                  <p className="text-xs text-zinc-400">Dynamic aspect-ratio container with light/dark and mobile scaling</p>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={logoSettings.useCustomLogo}
                    onChange={(e) => updateLogo('useCustomLogo', e.target.checked)}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-black/40 border-white/20"
                  />
                  <span className="text-xs font-medium text-zinc-200">Use Custom Logo</span>
                </label>
              </div>

              {/* Upload Dropzones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dark Mode / Default Logo */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-sky-400" />
                      <span>Dark Canvas Logo</span>
                    </span>
                    {logoSettings.darkLogoUrl && (
                      <button
                        onClick={() => updateLogo('darkLogoUrl', undefined)}
                        className="text-zinc-500 hover:text-rose-400 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {logoSettings.darkLogoUrl ? (
                    <div className="p-4 rounded-lg bg-[#07080c] border border-white/10 flex items-center justify-center min-h-[70px]">
                      <img
                        src={logoSettings.darkLogoUrl}
                        alt="Dark Logo Preview"
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-dashed border-white/15 text-center text-xs text-zinc-500">
                      No custom dark logo uploaded. Using precision geometric SVG emblem.
                    </div>
                  )}

                  <label className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Dark Logo (PNG, SVG, WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'dark')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Light Mode Logo */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light Canvas Logo</span>
                    </span>
                    {logoSettings.lightLogoUrl && (
                      <button
                        onClick={() => updateLogo('lightLogoUrl', undefined)}
                        className="text-zinc-500 hover:text-rose-400 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {logoSettings.lightLogoUrl ? (
                    <div className="p-4 rounded-lg bg-white border border-black/10 flex items-center justify-center min-h-[70px]">
                      <img
                        src={logoSettings.lightLogoUrl}
                        alt="Light Logo Preview"
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-dashed border-white/15 text-center text-xs text-zinc-500">
                      No custom light logo uploaded. Falls back to dark logo or SVG emblem.
                    </div>
                  )}

                  <label className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Light Logo (PNG, SVG, WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, 'light')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Dynamic Container Controls */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Container Dimensions & Scaling
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Max Width Desktop</span>
                      <span className="font-mono text-sky-400">{logoSettings.maxWidthDesktop}px</span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={320}
                      step={5}
                      value={logoSettings.maxWidthDesktop}
                      onChange={(e) => updateLogo('maxWidthDesktop', Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Max Height Desktop</span>
                      <span className="font-mono text-sky-400">{logoSettings.maxHeightDesktop}px</span>
                    </div>
                    <input
                      type="range"
                      min={24}
                      max={80}
                      step={2}
                      value={logoSettings.maxHeightDesktop}
                      onChange={(e) => updateLogo('maxHeightDesktop', Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Max Width Mobile</span>
                      <span className="font-mono text-sky-400">{logoSettings.maxWidthMobile}px</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={220}
                      step={5}
                      value={logoSettings.maxWidthMobile}
                      onChange={(e) => updateLogo('maxWidthMobile', Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Max Height Mobile</span>
                      <span className="font-mono text-sky-400">{logoSettings.maxHeightMobile}px</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={60}
                      step={2}
                      value={logoSettings.maxHeightMobile}
                      onChange={(e) => updateLogo('maxHeightMobile', Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Desktop Scale Multiplier</span>
                      <span className="font-mono text-sky-400">{logoSettings.desktopScale.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.6}
                      max={1.5}
                      step={0.05}
                      value={logoSettings.desktopScale}
                      onChange={(e) => updateLogo('desktopScale', Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span>Vertical Offset</span>
                      <span className="font-mono text-sky-400">{logoSettings.verticalOffset}px</span>
                    </div>
                    <input
                      type="range"
                      min={-10}
                      max={10}
                      step={1}
                      value={logoSettings.verticalOffset}
                      onChange={(e) => updateLogo('verticalOffset', Number(e.target.value))}
                      className="w-full accent-sky-400"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Live Container Preview */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Live Header Simulation
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setLogoPreviewMode('desktop')}
                      className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                        logoPreviewMode === 'desktop' ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setLogoPreviewMode('mobile')}
                      className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                        logoPreviewMode === 'mobile' ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Mobile
                    </button>
                    <span className="text-zinc-600">|</span>
                    <button
                      onClick={() => setLogoPreviewTheme('dark')}
                      className={`p-1 rounded-lg text-xs cursor-pointer ${
                        logoPreviewTheme === 'dark' ? 'bg-zinc-800 text-sky-400' : 'text-zinc-500'
                      }`}
                      title="Dark Preview"
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setLogoPreviewTheme('light')}
                      className={`p-1 rounded-lg text-xs cursor-pointer ${
                        logoPreviewTheme === 'light' ? 'bg-white text-zinc-950' : 'text-zinc-500'
                      }`}
                      title="Light Preview"
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                    logoPreviewTheme === 'dark'
                      ? 'bg-[#06070a] border-white/10'
                      : 'bg-[#fafafa] border-black/10'
                  }`}
                  style={{ maxWidth: logoPreviewMode === 'mobile' ? '360px' : '100%' }}
                >
                  <TajLogo
                    size={logoPreviewMode === 'mobile' ? 'sm' : 'md'}
                    logoSettings={logoSettings}
                    brandName={localSettings.brandName}
                    shortBrandName={localSettings.shortBrandName}
                    isDark={logoPreviewTheme === 'dark'}
                    isMobile={logoPreviewMode === 'mobile'}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">Nav Item</span>
                    <span className="px-3 py-1 rounded-full bg-sky-500 text-white text-[11px] font-bold">
                      Book
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 3: SECTION VISIBILITY */}
          {activeCategory === 'sections' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white">Section Visibility</h3>
                <p className="text-xs text-zinc-400">Toggle public modules on or off without deleting content</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'hero', label: 'Hero Showcase Section', desc: 'Main headline, device statement, and CTA buttons' },
                  { key: 'services', label: 'Services & Lab Diagnostics', desc: 'Hardware repair categories and turnaround times' },
                  { key: 'laboratory', label: 'Inside The Laboratory (3D)', desc: 'Continuous smartphone teardown and layer inspection' },
                  { key: 'trackingCta', label: 'Track Repair Voucher CTA', desc: 'Direct lookup modal prompt for active customers' },
                  { key: 'oemTrust', label: 'OEM & Trust Statement', desc: 'Genuine parts positioning and ISO lab standards' },
                  { key: 'inquiry', label: 'Tell Us What’s Wrong Intake', desc: 'Interactive lead triage and booking form' },
                  { key: 'homeService', label: 'Home Service in Lahore', desc: 'On-site technician booking and mobile antistatic bench' },
                  { key: 'faqContact', label: 'FAQ & Lab Location Maps', desc: 'Answers to common questions and physical directions' },
                  { key: 'whatsappCta', label: 'Floating WhatsApp Bubble', desc: 'Persistent chat launcher at bottom corner' },
                  { key: 'reviews', label: 'Customer Testimonials', desc: 'Verified customer ratings and service reviews' },
                  { key: 'footer', label: 'Website Footer Coordinates', desc: 'Bottom copyright, legal, and operational hours' },
                ].map((item) => {
                  const isChecked = localSettings.visibility
                    ? (localSettings.visibility as any)[item.key] !== false
                    : true;
                  return (
                    <div
                      key={item.key}
                      className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">{item.label}</span>
                        <span className="text-[11px] text-zinc-400 leading-tight block">{item.desc}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            setLocalSettings((prev) => ({
                              ...prev,
                              visibility: {
                                ...(prev.visibility || ({} as any)),
                                [item.key]: e.target.checked,
                              },
                            }));
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500" />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CATEGORY 4: SECTION ORDERING */}
          {activeCategory === 'ordering' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Section Ordering</h3>
                  <p className="text-xs text-zinc-400">Re-order homepage sections to customize the visual narrative</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLocalSettings((prev) => ({
                      ...prev,
                      sectionOrder: [
                        { key: 'hero', label: 'Hero Section', enabled: true },
                        { key: 'services', label: 'Services & Diagnostics', enabled: true },
                        { key: 'laboratory', label: 'Inside The Laboratory', enabled: true },
                        { key: 'trackingCta', label: 'Track Repair CTA', enabled: true },
                        { key: 'oemTrust', label: 'OEM & Trust Positioning', enabled: true },
                        { key: 'inquiry', label: 'Repair Booking & Inquiry', enabled: true },
                        { key: 'homeService', label: 'Home & Office Service', enabled: true },
                        { key: 'faqContact', label: 'FAQ & Lab Location', enabled: true },
                      ],
                    }));
                    showFeedback('Section order reset to recommended default');
                  }}
                  className="text-xs text-sky-400 hover:text-sky-300 font-mono cursor-pointer"
                >
                  Reset Order
                </button>
              </div>

              <div className="space-y-2">
                {(localSettings.sectionOrder || []).map((sec, idx) => (
                  <div
                    key={sec.key}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-zinc-400 font-semibold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-white">{sec.label}</span>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">({sec.key})</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, 'up')}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (localSettings.sectionOrder?.length || 0) - 1}
                        onClick={() => moveSection(idx, 'down')}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORY 5: CONTENT & COPY */}
          {activeCategory === 'customization' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white">Hero & Statement Copy</h3>
                <p className="text-xs text-zinc-400">Manage hero headlines, primary calls-to-action, and trust pledges</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Hero Headline</label>
                  <input
                    type="text"
                    value={localSettings.heroHeadline}
                    onChange={(e) => updateGeneral('heroHeadline', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Hero Subheadline</label>
                  <textarea
                    rows={2}
                    value={localSettings.heroSubheadline}
                    onChange={(e) => updateGeneral('heroSubheadline', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs leading-relaxed focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Primary CTA Button</label>
                    <input
                      type="text"
                      value={localSettings.heroCtaBookText}
                      onChange={(e) => updateGeneral('heroCtaBookText', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Secondary CTA Button</label>
                    <input
                      type="text"
                      value={localSettings.heroCtaTrackText}
                      onChange={(e) => updateGeneral('heroCtaTrackText', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    Original OEM Parts Positioning Statement
                  </label>
                  <textarea
                    rows={3}
                    value={localSettings.oemStatement}
                    onChange={(e) => updateGeneral('oemStatement', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs leading-relaxed focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    Lab Standards & Equipment Statement
                  </label>
                  <textarea
                    rows={2}
                    value={localSettings.trustStatement}
                    onChange={(e) => updateGeneral('trustStatement', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs leading-relaxed focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 6: LABORATORY / 3D SETTINGS */}
          {activeCategory === 'laboratory' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Laboratory 3D Experience</h3>
                  <p className="text-xs text-zinc-400">Configure WebGL rendering quality and motion behavior</p>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.laboratory?.enabled !== false}
                    onChange={(e) => {
                      setLocalSettings((prev) => ({
                        ...prev,
                        laboratory: {
                          ...(prev.laboratory || ({} as any)),
                          enabled: e.target.checked,
                        },
                      }));
                    }}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-black/40 border-white/20"
                  />
                  <span className="text-xs font-medium text-zinc-200">Enable Experience</span>
                </label>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Section Title</label>
                    <input
                      type="text"
                      value={localSettings.laboratory?.title || 'Inside the Laboratory'}
                      onChange={(e) => {
                        setLocalSettings((prev) => ({
                          ...prev,
                          laboratory: { ...(prev.laboratory || ({} as any)), title: e.target.value },
                        }));
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      value={
                        localSettings.laboratory?.subtitle ||
                        'A continuous engineering teardown of flagship hardware architecture'
                      }
                      onChange={(e) => {
                        setLocalSettings((prev) => ({
                          ...prev,
                          laboratory: { ...(prev.laboratory || ({} as any)), subtitle: e.target.value },
                        }));
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">3D Render Quality</label>
                    <select
                      value={localSettings.laboratory?.quality3D || 'auto'}
                      onChange={(e) => {
                        setLocalSettings((prev) => ({
                          ...prev,
                          laboratory: { ...(prev.laboratory || ({} as any)), quality3D: e.target.value as any },
                        }));
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                    >
                      <option value="auto">Auto (Device Adaptive)</option>
                      <option value="high">High (2x Antialiasing)</option>
                      <option value="medium">Medium (Standard)</option>
                      <option value="low">Low (Battery Saver)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Animation Pace</label>
                    <select
                      value={localSettings.laboratory?.animationIntensity || 'balanced'}
                      onChange={(e) => {
                        setLocalSettings((prev) => ({
                          ...prev,
                          laboratory: { ...(prev.laboratory || ({} as any)), animationIntensity: e.target.value as any },
                        }));
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                    >
                      <option value="subtle">Subtle</option>
                      <option value="balanced">Balanced</option>
                      <option value="full">Full Cinematic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Reduced Motion Fallback</label>
                    <select
                      value={localSettings.laboratory?.reducedMotionBehavior || 'minimal'}
                      onChange={(e) => {
                        setLocalSettings((prev) => ({
                          ...prev,
                          laboratory: { ...(prev.laboratory || ({} as any)), reducedMotionBehavior: e.target.value as any },
                        }));
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                    >
                      <option value="static">Static Orthographic</option>
                      <option value="minimal">Minimal Gentle Tilt</option>
                      <option value="smooth">Smooth Continuous</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 7: THEME & COLOR ENGINE */}
          {activeCategory === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Theme & Color System</h3>
                  <p className="text-xs text-zinc-400">Real design tokens applied dynamically via CSS variables</p>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
                  <button
                    type="button"
                    onClick={() => updateTheme('appearance', 'dark')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 ${
                      themeSettings.appearance === 'dark' ? 'bg-zinc-800 text-sky-400 font-semibold' : 'text-zinc-400'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateTheme('appearance', 'light')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 ${
                      themeSettings.appearance === 'light' ? 'bg-white text-zinc-950 font-semibold' : 'text-zinc-400'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateTheme('appearance', 'system')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 ${
                      themeSettings.appearance === 'system' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Theme Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-zinc-400 uppercase font-semibold">
                  Curated Theme Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(THEME_PRESETS) as ThemePresetKey[]).map((pKey) => {
                    const p = THEME_PRESETS[pKey];
                    const isSelected = themeSettings.preset === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => applyPreset(pKey)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/10 border-sky-500/40 text-white'
                            : 'bg-black/30 border-white/10 text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        <div className="text-xs font-bold">{p.name}</div>
                        <div className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{p.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* HEX Color Token Pickers */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Custom HEX Color Tokens
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: 'Primary Brand Accent', key: 'primaryColor', val: themeSettings.primaryColor },
                    { label: 'Secondary Accent', key: 'secondaryColor', val: themeSettings.secondaryColor },
                    { label: 'Canvas Background', key: 'backgroundColor', val: themeSettings.backgroundColor },
                    { label: 'Surface / Card', key: 'surfaceColor', val: themeSettings.surfaceColor },
                    { label: 'Elevated Surface', key: 'elevatedSurfaceColor', val: themeSettings.elevatedSurfaceColor },
                    { label: 'Primary Text', key: 'primaryTextColor', val: themeSettings.primaryTextColor },
                    { label: 'Secondary Text', key: 'secondaryTextColor', val: themeSettings.secondaryTextColor },
                    { label: 'Muted Text', key: 'mutedTextColor', val: themeSettings.mutedTextColor },
                    { label: 'Border Outline', key: 'borderColor', val: themeSettings.borderColor },
                    { label: 'Primary Button BG', key: 'buttonBgColor', val: themeSettings.buttonBgColor },
                    { label: 'Primary Button Text', key: 'buttonTextColor', val: themeSettings.buttonTextColor },
                    { label: 'Action Link Color', key: 'linkColor', val: themeSettings.linkColor },
                  ].map((field) => (
                    <div key={field.key} className="p-2.5 rounded-lg bg-black/50 border border-white/5 space-y-1.5">
                      <span className="text-[11px] text-zinc-400 font-medium block">{field.label}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={field.val?.startsWith('#') ? field.val.slice(0, 7) : '#38bdf8'}
                          onChange={(e) => updateTheme(field.key as any, e.target.value)}
                          className="w-7 h-7 rounded border border-white/10 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={field.val}
                          onChange={(e) => updateTheme(field.key as any, e.target.value)}
                          className="flex-1 px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 8: TYPOGRAPHY & SPACING */}
          {activeCategory === 'typography' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white">Typography & Spacing Geometry</h3>
                <p className="text-xs text-zinc-400">Calibrate border radii, card elevation, and whitespace scale</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Border Radius Style</label>
                  <select
                    value={themeSettings.borderRadius || 'rounded'}
                    onChange={(e) => updateTheme('borderRadius', e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                  >
                    <option value="sharp">Sharp Precision (2px)</option>
                    <option value="subtle">Subtle Restraint (8px)</option>
                    <option value="rounded">Modern Rounded (16px)</option>
                    <option value="pill">Pill Curves (9999px)</option>
                    <option value="custom">Custom Radius</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Card Depth Style</label>
                  <select
                    value={themeSettings.cardStyle || 'subtle'}
                    onChange={(e) => updateTheme('cardStyle', e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                  >
                    <option value="flat">Flat Architectural (Borders only)</option>
                    <option value="subtle">Subtle Depth (Borders + soft ambient)</option>
                    <option value="elevated">Elevated Premium (Shadow lift)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Spacing Rhythm</label>
                  <select
                    value={themeSettings.spacingScale || 'balanced'}
                    onChange={(e) => updateTheme('spacingScale', e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                  >
                    <option value="compact">Compact Density</option>
                    <option value="balanced">Balanced Apple Proportion</option>
                    <option value="spacious">Spacious Gallery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">Button Architecture</label>
                  <select
                    value={themeSettings.buttonStyle || 'filled'}
                    onChange={(e) => updateTheme('buttonStyle', e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-sky-400 focus:outline-none"
                  >
                    <option value="filled">High-Contrast Solid Fill</option>
                    <option value="outline">Precision Border Outline</option>
                    <option value="minimal">Minimal Understated</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STICKY UNSAVED CHANGES BAR */}
      {isDirty && (
        <div className="sticky bottom-4 z-40 p-4 rounded-2xl bg-[#090b10]/95 border border-sky-500/40 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-white block">You have unsaved website modifications</span>
              <span className="text-[11px] text-zinc-400">Save and publish changes to sync with the public storefront.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDiscard}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Publish Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Reset to Recommended Defaults?</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              This will restore all branding, theme colors, section orders, and laboratory configurations to original factory specs. Any unsaved modifications will be discarded.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setShowResetModal(false);
                  showFeedback('All website settings reset to factory defaults');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
