/**
 * Blueprint Theme Configuration
 * Source of truth for all design tokens
 *
 * PHASE 2: Now using plugin-based architecture!
 * - Themes are defined as modular plugins
 * - Colors and variants are composed via ThemeBuilder
 * - Type-safe color references throughout
 */

import { ThemeBuilder } from '../builder/ThemeBuilder.js';
import { primitivesPlugin } from '../plugins/primitives/index.js';
import { blueprintCorePlugin } from '../plugins/blueprint-core/index.js';
import { wadaSanzoPlugin } from '../plugins/wada-sanzo/index.js';
import forestPlugin from '../plugins/forest/index.js';
import benzolPlugin from '../plugins/benzol/index.js';

// Build theme from plugins
const builder = new ThemeBuilder()
  .use(primitivesPlugin) // Load primitives first (white, black)
  .use(blueprintCorePlugin) // Load core theme (gray, blue, green, red, yellow + light/dark)
  .use(wadaSanzoPlugin)
  .use(forestPlugin)
  .use(benzolPlugin); // Load Wada Sanzo accents + wada-light/wada-dark

/**
 * Get a fresh ThemeBuilder instance with all plugins loaded
 * Used by CLI commands for type generation
 */
export function getThemeBuilder(): ThemeBuilder {
  return new ThemeBuilder()
    .use(primitivesPlugin)
    .use(blueprintCorePlugin)
    .use(wadaSanzoPlugin)
    .use(forestPlugin)
    .use(benzolPlugin);
}

// Validate before building
const validation = builder.validate();
if (!validation.valid) {
  console.error('❌ Theme validation failed:');
  validation.errors.forEach((error) => {
    console.error(`  - [${error.plugin}] ${error.message}`);
  });
  throw new Error('Theme validation failed');
}

if (validation.warnings.length > 0) {
  console.warn('⚠️ Theme validation warnings:');
  validation.warnings.forEach((warning) => {
    console.warn(`  - [${warning.plugin}] ${warning.message}`);
  });
}

// Build the final theme configuration
const themeConfig = builder.build();

// Add non-color tokens to the theme configuration
export const blueprintTheme = {
  ...themeConfig,

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
    style: 'solid' as const,
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
};
