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
import type {
  ThemeBuilderInterface,
  ThemeConfig,
  PluginAssetDefinition,
} from '../../core/types.js';

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

  /**
   * Bundle Figtree variable font for self-hosted typography.
   * Figtree is a friendly geometric sans-serif by Erik Kennedy.
   */
  getAssets(): PluginAssetDefinition[] {
    return [
      {
        type: 'font',
        path: 'fonts/Figtree-VariableFont_wght.ttf',
        family: 'Figtree',
        weight: '300 900', // Variable font weight range
        style: 'normal',
        display: 'swap',
      },
      {
        type: 'font',
        path: 'fonts/Figtree-Italic-VariableFont_wght.ttf',
        family: 'Figtree-Italic',
        weight: '300 900', // Variable font weight range
        style: 'normal',
        display: 'swap',
      },
      {
        type: 'other',
        path: 'fonts/Figtree-LICENSE.txt',
      },
    ];
  }

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
      textMuted: 'oklch(0.50 0.02 240.0)', // Darkened from 0.55 for WCAG AA 4.5:1 contrast
      textInverse: 'oklch(0.89 0.01 91.4)',

      // Primary - Vanderpoel Blue (deep, sophisticated blue)
      primary: 'oklch(0.40 0.08 233.4)',
      primaryHover: 'oklch(0.36 0.10 233.4)',
      primaryActive: 'oklch(0.32 0.12 233.4)',

      // Secondary - Neutral gray for secondary actions
      secondary: 'oklch(0.55 0.02 240.0)',
      secondaryHover: 'oklch(0.50 0.02 240.0)',

      // Link colors
      link: 'oklch(0.40 0.08 233.4)', // Same as primary
      linkHover: 'oklch(0.36 0.10 233.4)',
      linkVisited: 'oklch(0.45 0.08 280.0)', // Purple tint

      // Semantic colors with hover and background variants
      success: 'oklch(0.55 0.13 145.0)',
      successHover: 'oklch(0.50 0.15 145.0)',
      successBg: 'oklch(0.95 0.05 145.0)',
      warning: 'oklch(0.51 0.13 64.5)',
      warningHover: 'oklch(0.46 0.15 64.5)',
      warningBg: 'oklch(0.95 0.05 64.5)',
      error: 'oklch(0.55 0.15 25.0)',
      errorHover: 'oklch(0.50 0.17 25.0)',
      errorBg: 'oklch(0.95 0.05 25.0)',
      info: 'oklch(0.40 0.08 233.4)',
      infoHover: 'oklch(0.36 0.10 233.4)',
      infoBg: 'oklch(0.95 0.03 233.4)',

      // Interactive state overlays
      hoverOverlay: 'oklch(0 0 0 / 0.05)',
      activeOverlay: 'oklch(0 0 0 / 0.1)',
      selectedBg: 'oklch(0.95 0.03 233.4)', // Light primary tint

      // Input-specific tokens
      placeholder: 'oklch(0.50 0.02 240.0)', // Same as textMuted
      inputBg: 'oklch(0.89 0.01 91.4)', // Same as background
      inputBorder: 'oklch(0.75 0.02 91.4)', // Same as border

      // UI Elements
      border: 'oklch(0.75 0.02 91.4)',
      borderStrong: 'oklch(0.65 0.02 91.4)',
      borderWidth: '1px',
      focus: 'oklch(0.40 0.08 233.4)',
      backdrop: 'oklch(0 0 0 / 0.6)',

      // Typography - Figtree as primary with system fallbacks
      fontFamily:
        'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontFamilyMono:
        '"SF Mono", Monaco, "Cascadia Code", "Courier New", monospace',
      fontFamilyHeading:
        'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

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

      // Primary - Brighter Vanderpoel Blue for visibility on dark backgrounds
      // Updated from L=26% to L=48% per UI audit (was nearly invisible)
      primary: 'oklch(0.48 0.12 233.4)',
      primaryHover: 'oklch(0.44 0.10 233.4)',
      primaryActive: 'oklch(0.40 0.08 233.4)',

      // Secondary - Neutral gray for secondary actions
      secondary: 'oklch(0.65 0.02 240.0)',
      secondaryHover: 'oklch(0.70 0.02 240.0)',

      // Link colors
      link: 'oklch(0.48 0.12 233.4)', // Same as primary
      linkHover: 'oklch(0.44 0.10 233.4)',
      linkVisited: 'oklch(0.55 0.10 280.0)', // Purple tint (lighter for dark bg)

      // Semantic (lighter shades for dark backgrounds)
      success: 'oklch(0.36 0.10 145.0)',
      successHover: 'oklch(0.40 0.12 145.0)',
      successBg: 'oklch(0.20 0.04 145.0)',
      warning: 'oklch(0.45 0.11 64.5)', // Slightly darker for dark theme
      warningHover: 'oklch(0.50 0.13 64.5)',
      warningBg: 'oklch(0.20 0.04 64.5)',
      error: 'oklch(0.36 0.12 25.0)',
      errorHover: 'oklch(0.40 0.14 25.0)',
      errorBg: 'oklch(0.20 0.04 25.0)',
      info: 'oklch(0.48 0.12 233.4)', // Match primary
      infoHover: 'oklch(0.44 0.10 233.4)',
      infoBg: 'oklch(0.20 0.03 233.4)',

      // Interactive state overlays
      hoverOverlay: 'oklch(1 0 0 / 0.05)', // White overlay for dark theme
      activeOverlay: 'oklch(1 0 0 / 0.1)',
      selectedBg: 'oklch(0.25 0.04 233.4)', // Dark primary tint

      // Input-specific tokens
      placeholder: 'oklch(0.75 0.02 91.4)', // Same as textMuted
      inputBg: 'oklch(0.15 0.01 240.0)', // Same as background
      inputBorder: 'oklch(0.35 0.02 240.0)', // Same as border

      // UI Elements
      border: 'oklch(0.35 0.02 240.0)',
      borderStrong: 'oklch(0.45 0.02 240.0)',
      borderWidth: '1px',
      focus: 'oklch(0.55 0.15 233.4)', // Brighter for visibility
      backdrop: 'oklch(0 0 0 / 0.6)',

      // Typography - Figtree as primary with system fallbacks
      fontFamily:
        'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontFamilyMono:
        '"SF Mono", Monaco, "Cascadia Code", "Courier New", monospace',
      fontFamilyHeading:
        'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

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
