import { ThemeSettings, ThemePresetKey } from '../types';

export const THEME_PRESETS: Record<ThemePresetKey, { name: string; description: string; dark: Partial<ThemeSettings>; light: Partial<ThemeSettings> }> = {
  'taj-default': {
    name: 'TAJ Precision',
    description: 'Apple-inspired technical dark canvas with aerospace cyan telemetry accents',
    dark: {
      primaryColor: '#38bdf8',
      secondaryColor: '#818cf8',
      accentColor: '#38bdf8',
      backgroundColor: '#050608',
      surfaceColor: '#0d1017',
      elevatedSurfaceColor: '#151a24',
      primaryTextColor: '#f8fafc',
      secondaryTextColor: '#94a3b8',
      mutedTextColor: '#64748b',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      buttonBgColor: '#ffffff',
      buttonTextColor: '#050608',
      linkColor: '#38bdf8',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      borderRadius: 'rounded',
      buttonStyle: 'filled',
      cardStyle: 'subtle',
      spacingScale: 'balanced',
      headingScale: 'balanced',
      bodyScale: 'standard',
      headingWeight: 'bold',
      animationIntensity: 'balanced',
    },
    light: {
      primaryColor: '#0284c7',
      secondaryColor: '#4f46e5',
      accentColor: '#0284c7',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      elevatedSurfaceColor: '#f1f5f9',
      primaryTextColor: '#0f172a',
      secondaryTextColor: '#475569',
      mutedTextColor: '#94a3b8',
      borderColor: 'rgba(15, 23, 42, 0.1)',
      buttonBgColor: '#0f172a',
      buttonTextColor: '#ffffff',
      linkColor: '#0284c7',
      successColor: '#059669',
      warningColor: '#d97706',
      errorColor: '#dc2626',
      borderRadius: 'rounded',
      buttonStyle: 'filled',
      cardStyle: 'subtle',
      spacingScale: 'balanced',
      headingScale: 'balanced',
      bodyScale: 'standard',
      headingWeight: 'bold',
      animationIntensity: 'balanced',
    },
  },
  midnight: {
    name: 'Midnight Sapphire',
    description: 'Deep obsidian and deep ocean navy with vivid electric sapphire highlights',
    dark: {
      primaryColor: '#60a5fa',
      secondaryColor: '#a78bfa',
      accentColor: '#3b82f6',
      backgroundColor: '#030712',
      surfaceColor: '#0b1329',
      elevatedSurfaceColor: '#131e3d',
      primaryTextColor: '#f9fafb',
      secondaryTextColor: '#93c5fd',
      mutedTextColor: '#6b7280',
      borderColor: 'rgba(96, 165, 250, 0.12)',
      buttonBgColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      linkColor: '#60a5fa',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      borderRadius: 'rounded',
      buttonStyle: 'filled',
      cardStyle: 'subtle',
      spacingScale: 'balanced',
      headingScale: 'balanced',
      bodyScale: 'standard',
      headingWeight: 'bold',
      animationIntensity: 'balanced',
    },
    light: {
      primaryColor: '#2563eb',
      secondaryColor: '#7c3aed',
      accentColor: '#1d4ed8',
      backgroundColor: '#f0f7ff',
      surfaceColor: '#ffffff',
      elevatedSurfaceColor: '#e0f2fe',
      primaryTextColor: '#030712',
      secondaryTextColor: '#1e3a8a',
      mutedTextColor: '#64748b',
      borderColor: 'rgba(37, 99, 235, 0.15)',
      buttonBgColor: '#1d4ed8',
      buttonTextColor: '#ffffff',
      linkColor: '#2563eb',
      successColor: '#059669',
      warningColor: '#d97706',
      errorColor: '#dc2626',
      borderRadius: 'rounded',
      buttonStyle: 'filled',
      cardStyle: 'subtle',
      spacingScale: 'balanced',
      headingScale: 'balanced',
      bodyScale: 'standard',
      headingWeight: 'bold',
      animationIntensity: 'balanced',
    },
  },
  minimal: {
    name: 'Architectural Minimal',
    description: 'High-contrast monochrome editorial layout focusing on typography and pure negative space',
    dark: {
      primaryColor: '#e2e8f0',
      secondaryColor: '#94a3b8',
      accentColor: '#ffffff',
      backgroundColor: '#0a0a0c',
      surfaceColor: '#141418',
      elevatedSurfaceColor: '#1e1e24',
      primaryTextColor: '#ffffff',
      secondaryTextColor: '#cbd5e1',
      mutedTextColor: '#71717a',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      buttonBgColor: '#ffffff',
      buttonTextColor: '#000000',
      linkColor: '#e2e8f0',
      successColor: '#22c55e',
      warningColor: '#eab308',
      errorColor: '#f43f5e',
      borderRadius: 'subtle',
      buttonStyle: 'filled',
      cardStyle: 'flat',
      spacingScale: 'spacious',
      headingScale: 'prominent',
      bodyScale: 'standard',
      headingWeight: 'bold',
      animationIntensity: 'subtle',
    },
    light: {
      primaryColor: '#18181b',
      secondaryColor: '#52525b',
      accentColor: '#09090b',
      backgroundColor: '#fafafa',
      surfaceColor: '#ffffff',
      elevatedSurfaceColor: '#f4f4f5',
      primaryTextColor: '#09090b',
      secondaryTextColor: '#3f3f46',
      mutedTextColor: '#a1a1aa',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      buttonBgColor: '#09090b',
      buttonTextColor: '#ffffff',
      linkColor: '#18181b',
      successColor: '#16a34a',
      warningColor: '#ca8a04',
      errorColor: '#e11d48',
      borderRadius: 'subtle',
      buttonStyle: 'filled',
      cardStyle: 'flat',
      spacingScale: 'spacious',
      headingScale: 'prominent',
      bodyScale: 'standard',
      headingWeight: 'bold',
      animationIntensity: 'subtle',
    },
  },
  titanium: {
    name: 'Titanium & Amber',
    description: 'Natural Grade 5 titanium chassis tones paired with warm amber diagnostic status lighting',
    dark: {
      primaryColor: '#38bdf8',
      secondaryColor: '#f59e0b',
      accentColor: '#fbbf24',
      backgroundColor: '#0c0e12',
      surfaceColor: '#151921',
      elevatedSurfaceColor: '#1e2430',
      primaryTextColor: '#f1f5f9',
      secondaryTextColor: '#cbd5e1',
      mutedTextColor: '#64748b',
      borderColor: 'rgba(255, 255, 255, 0.09)',
      buttonBgColor: '#f8fafc',
      buttonTextColor: '#0c0e12',
      linkColor: '#38bdf8',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      borderRadius: 'rounded',
      buttonStyle: 'filled',
      cardStyle: 'subtle',
      spacingScale: 'balanced',
      headingScale: 'balanced',
      bodyScale: 'standard',
      headingWeight: 'bold',
      animationIntensity: 'balanced',
    },
    light: {
      primaryColor: '#0284c7',
      secondaryColor: '#d97706',
      accentColor: '#b45309',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      elevatedSurfaceColor: '#f1f5f9',
      primaryTextColor: '#0f172a',
      secondaryTextColor: '#334155',
      mutedTextColor: '#94a3b8',
      borderColor: 'rgba(15, 23, 42, 0.1)',
      buttonBgColor: '#0f172a',
      buttonTextColor: '#ffffff',
      linkColor: '#0284c7',
      successColor: '#059669',
      warningColor: '#d97706',
      errorColor: '#dc2626',
      borderRadius: 'rounded',
      buttonStyle: 'filled',
      cardStyle: 'subtle',
      spacingScale: 'balanced',
      headingScale: 'balanced',
      bodyScale: 'standard',
      headingWeight: 'bold',
      animationIntensity: 'balanced',
    },
  },
  warm: {
    name: 'Warm Tungsten',
    description: 'Earthy charcoal and warm tungsten illumination for calm, eye-safe viewing',
    dark: {
      primaryColor: '#fb923c',
      secondaryColor: '#f43f5e',
      accentColor: '#ea580c',
      backgroundColor: '#0c0a09',
      surfaceColor: '#1c1917',
      elevatedSurfaceColor: '#292524',
      primaryTextColor: '#fafaf9',
      secondaryTextColor: '#d6d3d1',
      mutedTextColor: '#78716c',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      buttonBgColor: '#fb923c',
      buttonTextColor: '#0c0a09',
      linkColor: '#fb923c',
      successColor: '#22c55e',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      borderRadius: 'rounded',
      buttonStyle: 'filled',
      cardStyle: 'subtle',
      spacingScale: 'balanced',
      headingScale: 'balanced',
      bodyScale: 'standard',
      headingWeight: 'bold',
      animationIntensity: 'balanced',
    },
    light: {
      primaryColor: '#c2410c',
      secondaryColor: '#be123c',
      accentColor: '#9a3412',
      backgroundColor: '#fafaf9',
      surfaceColor: '#ffffff',
      elevatedSurfaceColor: '#f5f5f4',
      primaryTextColor: '#1c1917',
      secondaryTextColor: '#44403c',
      mutedTextColor: '#a8a29e',
      borderColor: 'rgba(28, 25, 23, 0.1)',
      buttonBgColor: '#1c1917',
      buttonTextColor: '#ffffff',
      linkColor: '#c2410c',
      successColor: '#15803d',
      warningColor: '#b45309',
      errorColor: '#b91c1c',
      borderRadius: 'rounded',
      buttonStyle: 'filled',
      cardStyle: 'subtle',
      spacingScale: 'balanced',
      headingScale: 'balanced',
      bodyScale: 'standard',
      headingWeight: 'bold',
      animationIntensity: 'balanced',
    },
  },
  custom: {
    name: 'Custom Palette',
    description: 'Full manual control over all HEX color values and typography',
    dark: {},
    light: {},
  },
};

export const DEFAULT_THEME_CONFIG: ThemeSettings = {
  appearance: 'dark',
  preset: 'taj-default',
  primaryColor: '#38bdf8',
  secondaryColor: '#818cf8',
  accentColor: '#38bdf8',
  backgroundColor: '#050608',
  surfaceColor: '#0d1017',
  elevatedSurfaceColor: '#151a24',
  primaryTextColor: '#f8fafc',
  secondaryTextColor: '#94a3b8',
  mutedTextColor: '#64748b',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  buttonBgColor: '#ffffff',
  buttonTextColor: '#050608',
  linkColor: '#38bdf8',
  successColor: '#10b981',
  warningColor: '#f59e0b',
  errorColor: '#ef4444',
  borderRadius: 'rounded',
  buttonStyle: 'filled',
  cardStyle: 'subtle',
  spacingScale: 'balanced',
  headingScale: 'balanced',
  bodyScale: 'standard',
  headingWeight: 'bold',
  animationIntensity: 'balanced',
};

export function resolveEffectiveTheme(theme: ThemeSettings = DEFAULT_THEME_CONFIG): {
  isDark: boolean;
  resolved: ThemeSettings;
} {
  let isDark = true;
  try {
    if (theme.appearance === 'system') {
      isDark = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? !!window.matchMedia('(prefers-color-scheme: dark)')?.matches
        : true;
    } else if (theme.appearance === 'light') {
      isDark = false;
    } else {
      isDark = true;
    }
  } catch {
    isDark = true;
  }

  // If using a preset (other than custom), pull preset values
  if (theme.preset && theme.preset !== 'custom' && THEME_PRESETS[theme.preset]) {
    const presetObj = THEME_PRESETS[theme.preset];
    const palette = isDark ? presetObj.dark : presetObj.light;
    return {
      isDark,
      resolved: {
        ...DEFAULT_THEME_CONFIG,
        ...theme,
        ...palette,
      },
    };
  }

  return {
    isDark,
    resolved: {
      ...DEFAULT_THEME_CONFIG,
      ...theme,
    },
  };
}

export function applyThemeToDOM(theme: ThemeSettings = DEFAULT_THEME_CONFIG): void {
  if (typeof document === 'undefined') return;

  try {
    const { isDark, resolved } = resolveEffectiveTheme(theme);
    const root = document.documentElement;
    if (!root) return;

    // Toggle dark class
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Safe helper to set CSS property
    const setSafeProp = (prop: string, val: string | undefined | null, fallback: string) => {
      try {
        root.style.setProperty(prop, val || fallback);
      } catch {
        // ignore
      }
    };

    // Inject CSS Variables
    setSafeProp('--theme-primary', resolved.primaryColor, '#38bdf8');
    setSafeProp('--theme-secondary', resolved.secondaryColor, '#818cf8');
    setSafeProp('--theme-accent', resolved.accentColor, '#38bdf8');
    setSafeProp('--theme-bg', resolved.backgroundColor, '#050608');
    setSafeProp('--theme-surface', resolved.surfaceColor, '#0d1017');
    setSafeProp('--theme-surface-elevated', resolved.elevatedSurfaceColor, '#151a24');
    setSafeProp('--theme-text-primary', resolved.primaryTextColor, '#f8fafc');
    setSafeProp('--theme-text-secondary', resolved.secondaryTextColor, '#94a3b8');
    setSafeProp('--theme-text-muted', resolved.mutedTextColor, '#64748b');
    setSafeProp('--theme-border', resolved.borderColor, 'rgba(255, 255, 255, 0.08)');
    setSafeProp('--theme-btn-bg', resolved.buttonBgColor, '#ffffff');
    setSafeProp('--theme-btn-text', resolved.buttonTextColor, '#050608');
    setSafeProp('--theme-link', resolved.linkColor, '#38bdf8');
    setSafeProp('--theme-success', resolved.successColor, '#10b981');
    setSafeProp('--theme-warning', resolved.warningColor, '#f59e0b');
    setSafeProp('--theme-error', resolved.errorColor, '#ef4444');

    // Border radius
    const radiusMap: Record<string, string> = {
      sharp: '2px',
      subtle: '8px',
      rounded: '16px',
      pill: '9999px',
      custom: `${resolved.customRadiusPx || 14}px`,
    };
    setSafeProp('--theme-radius', radiusMap[resolved.borderRadius], '14px');

    // Animation intensity
    const speedMap: Record<string, string> = {
      off: '0ms',
      subtle: '150ms',
      balanced: '300ms',
      full: '500ms',
    };
    setSafeProp('--theme-transition-duration', speedMap[resolved.animationIntensity], '300ms');

    // Body styling updates
    if (document.body) {
      if (resolved.backgroundColor) {
        document.body.style.backgroundColor = resolved.backgroundColor;
      }
      if (resolved.primaryTextColor) {
        document.body.style.color = resolved.primaryTextColor;
      }
    }
  } catch (err) {
    console.warn('Error applying theme to DOM:', err);
  }
}

export function isValidHex(color: string): boolean {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color.trim()) || /^#([0-9A-F]{4}){1,2}$/i.test(color.trim());
}
