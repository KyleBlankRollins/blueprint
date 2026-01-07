/**
 * Blueprint Core Plugin
 * Default Blueprint theme with Wada Sanzo-inspired colors
 *
 * Provides light and dark theme variants with semantic tokens only.
 * Colors are inspired by Wada Sanzo's "A Dictionary of Color Combinations" (1930s):
 * - Sulphur Yellow: Soft, muted yellow for warm backgrounds
 * - Yellow Orange: Warm, earthy orange for warnings
 * - Vanderpoel Blue: Deep, sophisticated blue for primary actions
 *
 * This theme demonstrates the semantic-only token approach where all
 * color values are defined directly as OKLCH strings, not as references
 * to color scales. This ensures complete theme interchangeability.
 *
 * @module blueprint-core
 * @version 1.0.0
 */

import { ThemeBase } from '../../builder/ThemeBase.js';
import type { ThemeBuilderInterface, ThemeConfig } from '../../core/types.js';
// Validation utilities can be imported when needed:
// import { validateTheme } from '../../builder/validation.js';

export class BlueprintCoreTheme extends ThemeBase {
  readonly id = 'blueprint-core';
  readonly version = '1.0.0';
  readonly name = 'Blueprint Core Theme';
  readonly description =
    'Default Blueprint theme with Wada Sanzo-inspired colors';
  readonly author = 'Blueprint Team';
  readonly license = 'MIT';
  readonly tags = ['core', 'theme', 'light', 'dark', 'wada-sanzo'];
  readonly homepage = 'https://github.com/blueprint/blueprint';

  register(builder: ThemeBuilderInterface): void {
    // Light theme variant with Wada Sanzo-inspired colors
    // Colors from "A Dictionary of Color Combinations" (1930s)
    builder.addThemeVariant('light', {
      // Backgrounds - Sulphur Yellow (soft, muted yellow) for warmth
      background: 'oklch(0.89 0.01 91.4)',
      surface: 'oklch(0.94 0.02 91.4)',
      surfaceElevated: 'oklch(0.96 0.03 91.4)',
      surfaceSubdued: 'oklch(0.98 0.04 91.4)',

      // Text - Gray neutral scale
      text: 'oklch(0.25 0.01 240.0)',
      textStrong: 'oklch(0.00 0.00 0.0)',
      textMuted: 'oklch(0.55 0.02 240.0)',
      textInverse: 'oklch(0.89 0.01 91.4)',

      // Primary - Vanderpoel Blue (deep, sophisticated blue)
      primary: 'oklch(0.40 0.08 233.4)',
      primaryHover: 'oklch(0.36 0.10 233.4)',
      primaryActive: 'oklch(0.32 0.12 233.4)',

      // Semantic colors
      success: 'oklch(0.55 0.13 145.0)',
      warning: 'oklch(0.51 0.13 64.5)',
      error: 'oklch(0.55 0.15 25.0)',
      info: 'oklch(0.40 0.08 233.4)',

      // UI Elements
      border: 'oklch(0.75 0.02 91.4)',
      borderStrong: 'oklch(0.65 0.02 91.4)',
      borderWidth: '1px',
      focus: 'oklch(0.40 0.08 233.4)',

      // Typography
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontFamilyMono:
        '"SF Mono", Monaco, "Cascadia Code", "Courier New", monospace',
      fontFamilyHeading:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

      // Border radius
      borderRadius: '4px',
      borderRadiusLarge: '8px',
      borderRadiusFull: '9999px',

      // Shadows
      shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      shadowMd:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      shadowLg:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      shadowXl:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    });

    // Dark theme variant with adjusted colors for dark backgrounds
    builder.addThemeVariant('dark', {
      // Backgrounds - Dark gray neutrals
      background: 'oklch(0.15 0.01 240.0)',
      surface: 'oklch(0.25 0.01 240.0)',
      surfaceElevated: 'oklch(0.35 0.02 240.0)',
      surfaceSubdued: 'oklch(0.00 0.00 0.0)',

      // Text - Sulphur Yellow for warmth on dark backgrounds
      text: 'oklch(0.89 0.01 91.4)',
      textStrong: 'oklch(1.00 0.00 0.0)',
      textMuted: 'oklch(0.75 0.02 91.4)',
      textInverse: 'oklch(0.25 0.01 240.0)',

      // Primary - Lighter Vanderpoel Blue for dark backgrounds
      primary: 'oklch(0.26 0.07 233.4)',
      primaryHover: 'oklch(0.28 0.05 233.4)',
      primaryActive: 'oklch(0.32 0.03 233.4)',

      // Semantic (lighter shades for dark backgrounds)
      success: 'oklch(0.36 0.10 145.0)',
      warning: 'oklch(0.51 0.13 64.5)',
      error: 'oklch(0.36 0.12 25.0)',
      info: 'oklch(0.26 0.07 233.4)',

      // UI Elements
      border: 'oklch(0.35 0.02 240.0)',
      borderStrong: 'oklch(0.45 0.02 240.0)',
      borderWidth: '1px',
      focus: 'oklch(0.26 0.07 233.4)',

      // Typography
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontFamilyMono:
        '"SF Mono", Monaco, "Cascadia Code", "Courier New", monospace',
      fontFamilyHeading:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

      // Border radius
      borderRadius: '4px',
      borderRadiusLarge: '8px',
      borderRadiusFull: '9999px',

      // Shadows (stronger shadows for dark backgrounds)
      shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      shadowMd:
        '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      shadowLg:
        '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      shadowXl:
        '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    });
  }

  // Validation rules for Blueprint core
  validate(config: ThemeConfig) {
    const errors = [];

    // Ensure both theme variants exist
    const requiredThemes = ['light', 'dark'];
    for (const themeName of requiredThemes) {
      if (!config.themes[themeName]) {
        errors.push({
          plugin: 'blueprint-core',
          type: 'missing_color' as const,
          message: `Required theme variant '${themeName}' is missing`,
          context: { themeName },
        });
      }
    }

    // Note: Semantic token validation happens in ThemeValidator
    // No need to validate individual color scales since we define
    // semantic tokens directly with OKLCH values

    return errors;
  }
}

export const blueprintCoreTheme = new BlueprintCoreTheme();
export default blueprintCoreTheme;
