/**
 * Validation utilities for theme configuration
 *
 * These utilities help ensure theme quality by checking for:
 * - WCAG contrast ratios for accessibility
 * - Missing or invalid design tokens
 * - Proper semantic color definitions
 *
 * ⚠️ **Important**: Accessibility validation requires serialized color values.
 * These validators should be called AFTER build() completes, not during plugin
 * registration, because theme variant colors are ColorRef objects that haven't
 * been serialized yet during the validate() lifecycle hook.
 *
 * @example
 * ```typescript
 * // ✅ Correct - validate after build
 * const config = builder.build();
 * const errors = validateTheme(config);
 * if (errors.length > 0) {
 *   console.error('Validation errors:', errors);
 * }
 *
 * // ❌ Wrong - validate during registration (ColorRefs not serialized yet)
 * class MyTheme extends ThemeBase {
 *   validate(config: ThemeConfig) {
 *     // This will fail because variant colors are ColorRef objects, not OKLCH
 *     return validateTheme(config);
 *   }
 * }
 * ```
 *
 * @module validation
 */

import type { ThemeConfig, ValidationError } from '../core/types.js';
import { getContrastRatio } from '../color/colorUtils.js';

// WCAG contrast ratio requirements
const DEFAULT_TEXT_CONTRAST = 4.5; // WCAG AA normal text
const DEFAULT_UI_CONTRAST = 3.0; // WCAG AA UI elements
const DEFAULT_FOCUS_CONTRAST = 3.0; // WCAG AA focus indicators

// Required token sizes for validation
const REQUIRED_SPACING_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const REQUIRED_FONT_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const;
const REQUIRED_MOTION_DURATIONS = [
  'instant',
  'fast',
  'normal',
  'slow',
] as const;
const REQUIRED_RADIUS_SIZES = ['none', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Helper function to validate required numeric tokens
 * Reduces duplication across spacing, typography, motion, and radius validation
 */
function validateRequiredNumericTokens<T extends Record<string, unknown>>(
  obj: T | undefined,
  requiredKeys: readonly string[],
  tokenPath: string,
  errors: ValidationError[]
): void {
  if (!obj) {
    errors.push({
      plugin: 'validation',
      type: 'missing_token',
      message: `Missing ${tokenPath} tokens`,
      context: { token: tokenPath },
    });
    return;
  }

  for (const key of requiredKeys) {
    if (typeof obj[key] !== 'number') {
      errors.push({
        plugin: 'validation',
        type: 'missing_token',
        message: `Missing or invalid ${tokenPath}.${key} token`,
        context: { token: `${tokenPath}.${key}`, value: obj[key] },
      });
    }
  }
}

/**
 * Validate WCAG contrast ratios for all theme variants
 *
 * Checks that:
 * - Text on backgrounds meets WCAG AA (4.5:1 minimum)
 * - UI elements meet WCAG AA (3:1 minimum)
 * - Focus indicators are visible (3:1 minimum)
 *
 * @param config - Theme configuration to validate
 * @returns Array of validation errors (empty if all checks pass)
 *
 * @example
 * ```typescript
 * class MyTheme extends ThemeBase {
 *   validate(config: ThemeConfig) {
 *     const errors = validateThemeAccessibility(config);
 *     if (errors.length > 0) {
 *       console.warn('Accessibility issues found:', errors);
 *     }
 *     return errors;
 *   }
 * }
 * ```
 */
export function validateThemeAccessibility(
  config: ThemeConfig
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Get minimum contrast requirements from accessibility tokens
  const minTextContrast =
    config.accessibility?.minimumContrast?.text ?? DEFAULT_TEXT_CONTRAST;
  const minUIContrast =
    config.accessibility?.minimumContrast?.ui ?? DEFAULT_UI_CONTRAST;
  const minFocusContrast =
    config.accessibility?.minimumContrast?.focus ?? DEFAULT_FOCUS_CONTRAST;

  // Validate each theme variant
  for (const [variantName, variant] of Object.entries(config.themes)) {
    // Text on background
    const textBgContrast = getContrastRatio(variant.text, variant.background);
    if (textBgContrast < minTextContrast) {
      errors.push({
        plugin: 'validation',
        type: 'accessibility',
        message: `Theme '${variantName}': Text/background contrast ${textBgContrast.toFixed(2)}:1 is below minimum ${minTextContrast}:1`,
        context: {
          variant: variantName,
          contrast: textBgContrast,
          minimum: minTextContrast,
          colors: { text: variant.text, background: variant.background },
        },
      });
    }

    // Text on surface
    const textSurfaceContrast = getContrastRatio(variant.text, variant.surface);
    if (textSurfaceContrast < minTextContrast) {
      errors.push({
        plugin: 'validation',
        type: 'accessibility',
        message: `Theme '${variantName}': Text/surface contrast ${textSurfaceContrast.toFixed(2)}:1 is below minimum ${minTextContrast}:1`,
        context: {
          variant: variantName,
          contrast: textSurfaceContrast,
          minimum: minTextContrast,
          colors: { text: variant.text, surface: variant.surface },
        },
      });
    }

    // Primary button contrast
    const primaryTextContrast = getContrastRatio(
      variant.textInverse,
      variant.primary
    );
    if (primaryTextContrast < minUIContrast) {
      errors.push({
        plugin: 'validation',
        type: 'accessibility',
        message: `Theme '${variantName}': Primary button text contrast ${primaryTextContrast.toFixed(2)}:1 is below minimum ${minUIContrast}:1`,
        context: {
          variant: variantName,
          contrast: primaryTextContrast,
          minimum: minUIContrast,
          colors: { text: variant.textInverse, primary: variant.primary },
        },
      });
    }

    // Border on background
    const borderBgContrast = getContrastRatio(
      variant.border,
      variant.background
    );
    if (borderBgContrast < minUIContrast) {
      errors.push({
        plugin: 'validation',
        type: 'accessibility',
        message: `Theme '${variantName}': Border/background contrast ${borderBgContrast.toFixed(2)}:1 is below minimum ${minUIContrast}:1`,
        context: {
          variant: variantName,
          contrast: borderBgContrast,
          minimum: minUIContrast,
          colors: { border: variant.border, background: variant.background },
        },
      });
    }

    // Focus indicator
    const focusBgContrast = getContrastRatio(variant.focus, variant.background);
    if (focusBgContrast < minFocusContrast) {
      errors.push({
        plugin: 'validation',
        type: 'accessibility',
        message: `Theme '${variantName}': Focus/background contrast ${focusBgContrast.toFixed(2)}:1 is below minimum ${minFocusContrast}:1`,
        context: {
          variant: variantName,
          contrast: focusBgContrast,
          minimum: minFocusContrast,
          colors: { focus: variant.focus, background: variant.background },
        },
      });
    }
  }

  return errors;
}

/**
 * Validate that all required design tokens are present and valid
 *
 * Checks for:
 * - Required spacing values
 * - Required typography values
 * - Required motion values
 * - Required radius values
 *
 * @param config - Theme configuration to validate
 * @returns Array of validation errors (empty if all checks pass)
 *
 * @example
 * ```typescript
 * class MyTheme extends ThemeBase {
 *   validate(config: ThemeConfig) {
 *     const errors = validateThemeTokens(config);
 *     if (errors.length > 0) {
 *       throw new Error(`Invalid theme configuration: ${errors.map(e => e.message).join(', ')}`);
 *     }
 *     return [];
 *   }
 * }
 * ```
 */
export function validateThemeTokens(config: ThemeConfig): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate spacing
  if (!config.spacing || typeof config.spacing.base !== 'number') {
    errors.push({
      plugin: 'validation',
      type: 'missing_token',
      message: 'Missing or invalid spacing.base token',
      context: { token: 'spacing.base', value: config.spacing?.base },
    });
  }

  validateRequiredNumericTokens(
    config.spacing?.semantic,
    REQUIRED_SPACING_SIZES,
    'spacing.semantic',
    errors
  );

  // Validate typography
  if (!config.typography?.fontFamilies?.sans) {
    errors.push({
      plugin: 'validation',
      type: 'missing_token',
      message: 'Missing typography.fontFamilies.sans token',
      context: { token: 'typography.fontFamilies.sans' },
    });
  }

  validateRequiredNumericTokens(
    config.typography?.fontSizes,
    REQUIRED_FONT_SIZES,
    'typography.fontSizes',
    errors
  );

  // Validate motion
  validateRequiredNumericTokens(
    config.motion?.durations,
    REQUIRED_MOTION_DURATIONS,
    'motion.durations',
    errors
  );

  // Validate radius
  validateRequiredNumericTokens(
    config.radius,
    REQUIRED_RADIUS_SIZES,
    'radius',
    errors
  );

  return errors;
}

/**
 * Run all validation checks on a theme configuration
 *
 * Convenience function that runs both accessibility and token validation.
 *
 * @param config - Theme configuration to validate
 * @returns Array of all validation errors
 *
 * @example
 * ```typescript
 * import { validateTheme } from './validation.js';
 *
 * class MyTheme extends ThemeBase {
 *   validate(config: ThemeConfig) {
 *     return validateTheme(config);
 *   }
 * }
 * ```
 */
export function validateTheme(config: ThemeConfig): ValidationError[] {
  return [
    ...validateThemeAccessibility(config),
    ...validateThemeTokens(config),
  ];
}
