/**
 * Default theme configuration values
 * These defaults are used when building themes that don't override these values
 */

import type { ThemeConfig } from '../core/types.js';

export const DEFAULT_SPACING = {
  base: 4,
  scale: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
  semantic: { '2xs': 1, xs: 2, sm: 3, md: 4, lg: 6, xl: 8, '2xl': 10 },
};

export const DEFAULT_RADIUS = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

export const DEFAULT_MOTION = {
  durations: { instant: 0, fast: 150, normal: 300, slow: 500 },
  easings: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

export const DEFAULT_TYPOGRAPHY = {
  fontFamilies: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Courier New", monospace',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
    // Heading-specific line heights (tighter for larger sizes)
    'heading-sm': 1.3,
    'heading-md': 1.25,
    'heading-lg': 1.2,
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const DEFAULT_FOCUS = { width: 2, offset: 2, style: 'solid' } as const;

export const DEFAULT_Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  overlay: 1030,
  modal: 1040,
  popover: 1060,
  tooltip: 1080,
};

export const DEFAULT_OPACITY = {
  disabled: 0.5,
  hover: 0.8,
  overlay: 0.6,
  subtle: 0.4,
};

export const DEFAULT_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const DEFAULT_ACCESSIBILITY = {
  enforceWCAG: false,
  minimumContrast: {
    text: 4.5,
    textLarge: 3.0,
    ui: 3.0,
    interactive: 3.0,
    focus: 3.0,
  },
  colorBlindSafe: true,
  minHueDifference: 60,
  highContrast: true,
};

/**
 * Create a partial theme config with all default values
 * These can be overridden by plugins or merged with custom values
 */
export function createDefaultThemeConfig(): Omit<
  ThemeConfig,
  'colors' | 'themes'
> {
  return {
    spacing: DEFAULT_SPACING,
    radius: DEFAULT_RADIUS,
    motion: DEFAULT_MOTION,
    typography: DEFAULT_TYPOGRAPHY,
    focus: DEFAULT_FOCUS,
    zIndex: DEFAULT_Z_INDEX,
    opacity: DEFAULT_OPACITY,
    breakpoints: DEFAULT_BREAKPOINTS,
    accessibility: DEFAULT_ACCESSIBILITY,
  };
}
