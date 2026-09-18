import React, { useState } from 'react';
import { LogoSettings } from '../types';

interface TajLogoProps {
  size?: 'sm' | 'md' | 'lg' | number;
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
  logoSettings?: LogoSettings;
  brandName?: string;
  shortBrandName?: string;
  isDark?: boolean;
  isMobile?: boolean;
}

export const TajLogo: React.FC<TajLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
  logoSettings,
  brandName = 'TAJ MOBILE REPAIRING LAB',
  shortBrandName,
  isDark = true,
  isMobile = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const isCustomNumber = typeof size === 'number';

  const iconSizes: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'text-sm font-semibold tracking-tight',
    md: 'text-base font-bold tracking-tight',
    lg: 'text-xl font-bold tracking-tight',
  };

  const subtitleSizes: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[10px] tracking-widest',
    lg: 'text-xs tracking-widest',
  };

  const sizeKey = isCustomNumber ? (size > 40 ? 'lg' : size > 30 ? 'md' : 'sm') : size;

  // Resolve custom image URL based on screen size and theme
  let customLogoUrl: string | undefined;
  if (logoSettings?.useCustomLogo) {
    if (isMobile && logoSettings.mobileLogoUrl) {
      customLogoUrl = logoSettings.mobileLogoUrl;
    } else if (!isMobile && logoSettings.desktopLogoUrl) {
      customLogoUrl = logoSettings.desktopLogoUrl;
    } else if (!isDark && logoSettings.lightLogoUrl) {
      customLogoUrl = logoSettings.lightLogoUrl;
    } else if (isDark && logoSettings.darkLogoUrl) {
      customLogoUrl = logoSettings.darkLogoUrl;
    } else {
      customLogoUrl = logoSettings.darkLogoUrl || logoSettings.lightLogoUrl;
    }
  }

  // If a valid custom logo is provided and hasn't errored
  if (logoSettings?.useCustomLogo && customLogoUrl && !imageError) {
    const maxWidth = isMobile ? logoSettings.maxWidthMobile || 140 : logoSettings.maxWidthDesktop || 190;
    const maxHeight = isMobile ? logoSettings.maxHeightMobile || 36 : logoSettings.maxHeightDesktop || 48;
    const scale = isMobile ? logoSettings.mobileScale || 1 : logoSettings.desktopScale || 1;
    const verticalOffset = logoSettings.verticalOffset || 0;
    const padding = logoSettings.padding || 0;

    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{
          transform: `scale(${scale}) translateY(${verticalOffset}px)`,
          transformOrigin: 'left center',
          padding: `${padding}px`,
        }}
      >
        <img
          src={customLogoUrl}
          alt={brandName}
          onError={() => setImageError(true)}
          style={{
            maxWidth: `${maxWidth}px`,
            maxHeight: `${maxHeight}px`,
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
          className="transition-transform duration-200 block"
        />
      </div>
    );
  }

  // Split brand name for typography display
  const displayBrand = shortBrandName || 'TAJ LAB';
  const parts = displayBrand.split(' ');
  const mainWord = parts[0] || 'TAJ';
  const restWords = parts.slice(1).join(' ') || 'LAB';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Precision Geometric Emblem */}
      <div
        style={isCustomNumber ? { width: `${size}px`, height: `${size}px` } : undefined}
        className={`relative ${!isCustomNumber ? iconSizes[sizeKey] : ''} flex items-center justify-center rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/10 shadow-lg shadow-black/40 group overflow-hidden shrink-0`}
      >
        {/* Subtle dynamic backdrop highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 via-transparent to-white/5 opacity-80" />
        
        {/* Optical Precision Sensor + Chip SVG */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 relative z-10 text-white"
        >
          {/* Outer Precision Hex Calibration Ring */}
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />
          
          {/* Inner Titanium Frame Box */}
          <rect
            x="11"
            y="7"
            width="18"
            height="26"
            rx="3"
            stroke="var(--theme-primary, #38bdf8)"
            strokeWidth="1.8"
            className="transition-colors group-hover:brightness-125"
          />
          
          {/* Micro Logic Core Center */}
          <rect
            x="16"
            y="15"
            width="8"
            height="10"
            rx="1.5"
            fill="currentColor"
            className="opacity-90"
          />
          
          {/* Micro Alignment Ticks */}
          <line x1="20" y1="3" x2="20" y2="7" stroke="var(--theme-primary, #38bdf8)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="33" x2="20" y2="37" stroke="var(--theme-primary, #38bdf8)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="20" x2="9" y2="20" stroke="var(--theme-primary, #38bdf8)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="31" y1="20" x2="35" y2="20" stroke="var(--theme-primary, #38bdf8)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`font-bold tracking-tight ${titleSizes[sizeKey]}`} style={{ color: 'var(--theme-text-primary, #ffffff)' }}>
            {mainWord}
          </span>
          <span
            className={`font-light tracking-tight ${titleSizes[sizeKey]}`}
            style={{ color: 'var(--theme-primary, #38bdf8)' }}
          >
            {restWords}
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`uppercase font-mono ${subtitleSizes[sizeKey]}`}
            style={{ color: 'var(--theme-text-muted, #94a3b8)' }}
          >
            Mobile Repairing
          </span>
        )}
      </div>
    </div>
  );
};
