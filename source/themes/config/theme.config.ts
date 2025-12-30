/**
 * Blueprint Theme Configuration
 * Source of truth for all design tokens
 */

import { defineTheme } from '../builder/defineTheme.js';
import { createColorRefs } from '../builder/colorRefs.js';

const themeColors = {
  sulphurYellow: { l: 0.941, c: 0.0554, h: 91.42 },
  yellowOrange: { l: 0.7777, c: 0.1684, h: 64.45 },
  vandarPoelBlue: { l: 0.4025, c: 0.0836, h: 233.38 },
};

// Typed color references for IDE autocomplete
const colors = createColorRefs([
  'gray',
  'blue',
  'green',
  'red',
  'yellow',
  'accent',
  'secondaryAccent',
] as const);

export const blueprintTheme = defineTheme({
  // Color definitions with OKLCH source colors
  colors: {
    // Neutral scale (gray)
    gray: {
      source: { l: 0.55, c: 0.02, h: 240 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    // Brand colors
    blue: {
      source: themeColors.vandarPoelBlue,
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    // Semantic colors
    green: {
      source: { l: 0.55, c: 0.13, h: 145 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    red: {
      source: { l: 0.55, c: 0.15, h: 25 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    yellow: {
      source: { l: 0.65, c: 0.13, h: 85 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    // Accent colors
    accent: {
      source: themeColors.yellowOrange,
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },

    secondaryAccent: {
      source: themeColors.sulphurYellow,
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
  },

  // Dark mode adjustments
  darkMode: {
    chromaMultiplier: 0.85, // Reduce saturation by 15% for dark backgrounds
    contrastBoost: 1.1, // Slightly increase contrast for better readability
  },

  // Spacing scale
  spacing: {
    base: 4, // Base unit in px
    scale: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
    semantic: {
      xs: 1,
      sm: 2,
      md: 4,
      lg: 6,
      xl: 8,
    },
  },

  // Border radius scale
  radius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
  },

  // Motion/animation tokens
  motion: {
    durations: {
      instant: 0,
      fast: 150, // Hover states, tooltips
      normal: 300, // Modals, dropdowns
      slow: 500, // Page transitions, complex animations
    },
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
  },

  // Typography
  typography: {
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
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Focus indicators
  focus: {
    width: 2,
    offset: 2,
    style: 'solid',
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    overlay: 1030,
    modal: 1040,
    popover: 1060,
    tooltip: 1080,
  },

  // Opacity scale
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    overlay: 0.6,
    subtle: 0.4,
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Theme variants
  themes: {
    light: {
      // Backgrounds
      background: colors.secondaryAccent50,
      surface: colors.secondaryAccent100,
      surfaceElevated: colors.secondaryAccent200,
      surfaceSubdued: colors.secondaryAccent300,

      // Text
      text: colors.gray900,
      textMuted: colors.gray600,
      textInverse: colors.secondaryAccent50,

      // Primary
      primary: colors.blue500,
      primaryHover: colors.blue600,
      primaryActive: colors.blue700,

      // Semantic
      success: colors.green500,
      warning: colors.yellow600, // Darker for better contrast
      error: colors.red500,
      info: colors.accent500,

      // UI Elements
      border: colors.gray200,
      borderStrong: colors.gray300,
      focus: colors.blue500,
    },
    dark: {
      // Backgrounds
      background: colors.gray950,
      surface: colors.gray900,
      surfaceElevated: colors.gray800,
      surfaceSubdued: colors.black,

      // Text
      text: colors.secondaryAccent50,
      textMuted: colors.secondaryAccent200,
      textInverse: colors.gray900,

      // Primary (uses dark mode chroma adjustments)
      primary: colors.blue500,
      primaryHover: colors.blue300,
      primaryActive: colors.blue200,

      // Semantic
      success: colors.green300,
      warning: colors.yellow200,
      error: colors.red300,
      info: colors.accent300,

      // UI Elements
      border: colors.gray800,
      borderStrong: colors.gray700,
      focus: colors.blue400,
    },
  },

  // Accessibility validation rules
  accessibility: {
    enforceWCAG: false, // Temporarily disabled for Phase 1
    minimumContrast: {
      text: 4.5, // WCAG AA for normal text
      textLarge: 3.0, // WCAG AA for large text (18px+)
      ui: 3.0, // WCAG AA for UI components
      interactive: 3.0, // For hover/active states
      focus: 3.0, // Focus indicators
    },
    colorBlindSafe: true,
    minHueDifference: 60, // Minimum degrees between semantic colors
    highContrast: true, // Support prefers-contrast: more
  },
});
