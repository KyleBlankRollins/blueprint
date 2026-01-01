import { describe, it, expect } from 'vitest';
import {
  validateTheme,
  validateThemeAccessibility,
  validateThemeTokens,
} from '../validation.js';
import { createDefaultThemeConfig } from '../defaults.js';
import type { ThemeConfig } from '../../core/types.js';

/**
 * These tests validate the validation utilities themselves.
 * Note: In real usage, these validators would be called in a plugin's validate() method
 * BEFORE builder.build() is called, when colors are still OKLCH objects.
 *
 * After build(), colors are serialized to strings like 'gray.50' which would require
 * a color registry to resolve back to OKLCH values for contrast calculation.
 */

describe('validateThemeAccessibility', () => {
  it('should pass for themes with good contrast ratios', () => {
    const config: ThemeConfig = {
      ...createDefaultThemeConfig(),
      colors: {},
      themes: {
        light: {
          background: { l: 1, c: 0, h: 0 }, // White
          surface: { l: 0.98, c: 0, h: 0 },
          surfaceElevated: { l: 1, c: 0, h: 0 },
          surfaceSubdued: { l: 0.96, c: 0, h: 0 },
          text: { l: 0.1, c: 0, h: 0 }, // Near black - good contrast
          textMuted: { l: 0.4, c: 0, h: 0 },
          textInverse: { l: 1, c: 0, h: 0 },
          primary: { l: 0.55, c: 0.2, h: 250 },
          primaryHover: { l: 0.5, c: 0.22, h: 250 },
          primaryActive: { l: 0.45, c: 0.24, h: 250 },
          success: { l: 0.55, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 80 },
          error: { l: 0.55, c: 0.22, h: 25 },
          info: { l: 0.55, c: 0.2, h: 250 },
          border: { l: 0.6, c: 0, h: 0 }, // Dark enough for 3:1 contrast
          borderStrong: { l: 0.5, c: 0, h: 0 },
          focus: { l: 0.55, c: 0.2, h: 250 },
        },
        dark: {
          background: { l: 0.1, c: 0, h: 0 },
          surface: { l: 0.15, c: 0, h: 0 },
          surfaceElevated: { l: 0.2, c: 0, h: 0 },
          surfaceSubdued: { l: 0.05, c: 0, h: 0 },
          text: { l: 0.95, c: 0, h: 0 }, // Light text - good contrast on dark bg
          textMuted: { l: 0.7, c: 0, h: 0 },
          textInverse: { l: 0.1, c: 0, h: 0 },
          primary: { l: 0.6, c: 0.2, h: 250 },
          primaryHover: { l: 0.65, c: 0.22, h: 250 },
          primaryActive: { l: 0.7, c: 0.24, h: 250 },
          success: { l: 0.6, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 80 },
          error: { l: 0.65, c: 0.22, h: 25 },
          info: { l: 0.6, c: 0.2, h: 250 },
          border: { l: 0.5, c: 0, h: 0 },
          borderStrong: { l: 0.5, c: 0, h: 0 },
          focus: { l: 0.6, c: 0.2, h: 250 },
        },
      },
    };

    const errors = validateThemeAccessibility(config);
    if (errors.length > 0) {
      console.log('Accessibility errors:', JSON.stringify(errors, null, 2));
    }
    expect(errors).toHaveLength(0);
  });

  it('should detect low text/background contrast', () => {
    const config: ThemeConfig = {
      ...createDefaultThemeConfig(),
      colors: {},
      themes: {
        light: {
          background: { l: 1, c: 0, h: 0 },
          surface: { l: 0.98, c: 0, h: 0 },
          surfaceElevated: { l: 1, c: 0, h: 0 },
          surfaceSubdued: { l: 0.96, c: 0, h: 0 },
          text: { l: 0.8, c: 0, h: 0 }, // Too light - low contrast!
          textMuted: { l: 0.4, c: 0, h: 0 },
          textInverse: { l: 1, c: 0, h: 0 },
          primary: { l: 0.55, c: 0.2, h: 250 },
          primaryHover: { l: 0.5, c: 0.22, h: 250 },
          primaryActive: { l: 0.45, c: 0.24, h: 250 },
          success: { l: 0.55, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 80 },
          error: { l: 0.55, c: 0.22, h: 25 },
          info: { l: 0.55, c: 0.2, h: 250 },
          border: { l: 0.6, c: 0, h: 0 },
          borderStrong: { l: 0.5, c: 0, h: 0 },
          focus: { l: 0.55, c: 0.2, h: 250 },
        },
        dark: {
          background: { l: 0.1, c: 0, h: 0 },
          surface: { l: 0.15, c: 0, h: 0 },
          surfaceElevated: { l: 0.2, c: 0, h: 0 },
          surfaceSubdued: { l: 0.05, c: 0, h: 0 },
          text: { l: 0.95, c: 0, h: 0 },
          textMuted: { l: 0.7, c: 0, h: 0 },
          textInverse: { l: 0.1, c: 0, h: 0 },
          primary: { l: 0.6, c: 0.2, h: 250 },
          primaryHover: { l: 0.65, c: 0.22, h: 250 },
          primaryActive: { l: 0.7, c: 0.24, h: 250 },
          success: { l: 0.6, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 80 },
          error: { l: 0.65, c: 0.22, h: 25 },
          info: { l: 0.6, c: 0.2, h: 250 },
          border: { l: 0.5, c: 0, h: 0 },
          borderStrong: { l: 0.5, c: 0, h: 0 },
          focus: { l: 0.6, c: 0.2, h: 250 },
        },
      },
    };

    const errors = validateThemeAccessibility(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('accessibility');
    expect(errors[0].message).toContain('Text/background contrast');
  });

  it('should detect low border/background contrast', () => {
    const config: ThemeConfig = {
      ...createDefaultThemeConfig(),
      colors: {},
      themes: {
        light: {
          background: { l: 1, c: 0, h: 0 },
          surface: { l: 0.98, c: 0, h: 0 },
          surfaceElevated: { l: 1, c: 0, h: 0 },
          surfaceSubdued: { l: 0.96, c: 0, h: 0 },
          text: { l: 0.1, c: 0, h: 0 },
          textMuted: { l: 0.4, c: 0, h: 0 },
          textInverse: { l: 1, c: 0, h: 0 },
          primary: { l: 0.55, c: 0.2, h: 250 },
          primaryHover: { l: 0.5, c: 0.22, h: 250 },
          primaryActive: { l: 0.45, c: 0.24, h: 250 },
          success: { l: 0.55, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 80 },
          error: { l: 0.55, c: 0.22, h: 25 },
          info: { l: 0.55, c: 0.2, h: 250 },
          border: { l: 0.99, c: 0, h: 0 }, // Too close to white background!
          borderStrong: { l: 0.5, c: 0, h: 0 },
          focus: { l: 0.55, c: 0.2, h: 250 },
        },
        dark: {
          background: { l: 0.1, c: 0, h: 0 },
          surface: { l: 0.15, c: 0, h: 0 },
          surfaceElevated: { l: 0.2, c: 0, h: 0 },
          surfaceSubdued: { l: 0.05, c: 0, h: 0 },
          text: { l: 0.95, c: 0, h: 0 },
          textMuted: { l: 0.7, c: 0, h: 0 },
          textInverse: { l: 0.1, c: 0, h: 0 },
          primary: { l: 0.6, c: 0.2, h: 250 },
          primaryHover: { l: 0.65, c: 0.22, h: 250 },
          primaryActive: { l: 0.7, c: 0.24, h: 250 },
          success: { l: 0.6, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 80 },
          error: { l: 0.65, c: 0.22, h: 25 },
          info: { l: 0.6, c: 0.2, h: 250 },
          border: { l: 0.5, c: 0, h: 0 },
          borderStrong: { l: 0.5, c: 0, h: 0 },
          focus: { l: 0.6, c: 0.2, h: 250 },
        },
      },
    };

    const errors = validateThemeAccessibility(config);
    const borderError = errors.find((e) =>
      e.message.includes('Border/background')
    );
    expect(borderError).toBeDefined();
    expect(borderError?.type).toBe('accessibility');
  });
});

describe('validateThemeTokens', () => {
  function createBaseConfig(): ThemeConfig {
    const defaults = createDefaultThemeConfig();
    // Deep clone to avoid test pollution
    return JSON.parse(
      JSON.stringify({
        ...defaults,
        colors: {},
        themes: { light: {}, dark: {} },
      })
    );
  }

  it('should pass for config with all required tokens', () => {
    const config = createBaseConfig();

    const errors = validateThemeTokens(config);
    expect(errors).toHaveLength(0);
  });

  it('should detect missing spacing.base', () => {
    const config = createBaseConfig();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (config.spacing as any).base;

    const errors = validateThemeTokens(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('spacing.base');
    expect(errors[0].type).toBe('missing_token');
  });

  it('should detect missing spacing.semantic sizes', () => {
    const config = createBaseConfig();
    delete config.spacing.semantic?.md;

    const errors = validateThemeTokens(config);
    const spacingError = errors.find((e) =>
      e.message.includes('spacing.semantic.md')
    );
    expect(spacingError).toBeDefined();
    expect(spacingError?.type).toBe('missing_token');
  });

  it('should detect missing required radius sizes', () => {
    const config = createBaseConfig();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config as any).radius = { none: 0 };

    const errors = validateThemeTokens(config);
    const radiusErrors = errors.filter((e) => e.message.includes('radius'));
    expect(radiusErrors.length).toBeGreaterThan(0);
  });
});

describe('validateTheme', () => {
  it('should return empty array for fully valid theme', () => {
    const config: ThemeConfig = {
      ...createDefaultThemeConfig(),
      colors: {},
      themes: {
        light: {
          background: { l: 1, c: 0, h: 0 },
          surface: { l: 0.98, c: 0, h: 0 },
          surfaceElevated: { l: 1, c: 0, h: 0 },
          surfaceSubdued: { l: 0.96, c: 0, h: 0 },
          text: { l: 0.1, c: 0, h: 0 },
          textMuted: { l: 0.4, c: 0, h: 0 },
          textInverse: { l: 1, c: 0, h: 0 },
          primary: { l: 0.55, c: 0.2, h: 250 },
          primaryHover: { l: 0.5, c: 0.22, h: 250 },
          primaryActive: { l: 0.45, c: 0.24, h: 250 },
          success: { l: 0.55, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 80 },
          error: { l: 0.55, c: 0.22, h: 25 },
          info: { l: 0.55, c: 0.2, h: 250 },
          border: { l: 0.6, c: 0, h: 0 },
          borderStrong: { l: 0.5, c: 0, h: 0 },
          focus: { l: 0.55, c: 0.2, h: 250 },
        },
        dark: {
          background: { l: 0.1, c: 0, h: 0 },
          surface: { l: 0.15, c: 0, h: 0 },
          surfaceElevated: { l: 0.2, c: 0, h: 0 },
          surfaceSubdued: { l: 0.05, c: 0, h: 0 },
          text: { l: 0.95, c: 0, h: 0 },
          textMuted: { l: 0.7, c: 0, h: 0 },
          textInverse: { l: 0.1, c: 0, h: 0 },
          primary: { l: 0.6, c: 0.2, h: 250 },
          primaryHover: { l: 0.65, c: 0.22, h: 250 },
          primaryActive: { l: 0.7, c: 0.24, h: 250 },
          success: { l: 0.6, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 80 },
          error: { l: 0.65, c: 0.22, h: 25 },
          info: { l: 0.6, c: 0.2, h: 250 },
          border: { l: 0.5, c: 0, h: 0 },
          borderStrong: { l: 0.5, c: 0, h: 0 },
          focus: { l: 0.6, c: 0.2, h: 250 },
        },
      },
    };

    const errors = validateTheme(config);
    if (errors.length > 0) {
      console.log('validateTheme errors:', JSON.stringify(errors, null, 2));
    }
    expect(errors).toHaveLength(0);
  });

  it('should return all errors from both validators', () => {
    const config: ThemeConfig = {
      ...createDefaultThemeConfig(),
      colors: {},
      themes: {
        light: {
          background: { l: 1, c: 0, h: 0 },
          surface: { l: 0.98, c: 0, h: 0 },
          surfaceElevated: { l: 1, c: 0, h: 0 },
          surfaceSubdued: { l: 0.96, c: 0, h: 0 },
          text: { l: 0.9, c: 0, h: 0 }, // Low contrast
          textMuted: { l: 0.4, c: 0, h: 0 },
          textInverse: { l: 1, c: 0, h: 0 },
          primary: { l: 0.55, c: 0.2, h: 250 },
          primaryHover: { l: 0.5, c: 0.22, h: 250 },
          primaryActive: { l: 0.45, c: 0.24, h: 250 },
          success: { l: 0.55, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 80 },
          error: { l: 0.55, c: 0.22, h: 25 },
          info: { l: 0.55, c: 0.2, h: 250 },
          border: { l: 0.6, c: 0, h: 0 },
          borderStrong: { l: 0.5, c: 0, h: 0 },
          focus: { l: 0.55, c: 0.2, h: 250 },
        },
        dark: {
          background: { l: 0.1, c: 0, h: 0 },
          surface: { l: 0.15, c: 0, h: 0 },
          surfaceElevated: { l: 0.2, c: 0, h: 0 },
          surfaceSubdued: { l: 0.05, c: 0, h: 0 },
          text: { l: 0.95, c: 0, h: 0 },
          textMuted: { l: 0.7, c: 0, h: 0 },
          textInverse: { l: 0.1, c: 0, h: 0 },
          primary: { l: 0.6, c: 0.2, h: 250 },
          primaryHover: { l: 0.65, c: 0.22, h: 250 },
          primaryActive: { l: 0.7, c: 0.24, h: 250 },
          success: { l: 0.6, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 80 },
          error: { l: 0.65, c: 0.22, h: 25 },
          info: { l: 0.6, c: 0.2, h: 250 },
          border: { l: 0.5, c: 0, h: 0 },
          borderStrong: { l: 0.5, c: 0, h: 0 },
          focus: { l: 0.6, c: 0.2, h: 250 },
        },
      },
    };

    // Add token errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (config.spacing as any).base;
    delete config.spacing.semantic?.md;

    const errors = validateTheme(config);

    // Should have both accessibility and token errors
    const accessibilityErrors = errors.filter(
      (e) => e.type === 'accessibility'
    );
    const tokenErrors = errors.filter((e) => e.type === 'missing_token');

    expect(accessibilityErrors.length).toBeGreaterThan(0);
    expect(tokenErrors.length).toBeGreaterThan(0);
    expect(errors.length).toBe(accessibilityErrors.length + tokenErrors.length);
  });
});
