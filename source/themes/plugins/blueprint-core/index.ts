/**
 * Blueprint Core Plugin
 * Default Blueprint theme with Wada Sanzo-inspired colors
 *
 * Provides:
 * - Core semantic colors (gray, green, red)
 * - Wada Sanzo accent colors (sulphurYellow, yellowOrange, vandarPoelBlue)
 * - Light theme variant with warm backgrounds
 * - Dark theme variant with chroma adjustments
 *
 * Colors from Wada Sanzo's "A Dictionary of Color Combinations" (1930s)
 * provide unique, historically-inspired harmonious combinations.
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
    // Neutral scale (gray)
    builder.addColor('gray', {
      source: { l: 0.55, c: 0.02, h: 240 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Gray',
        description: 'Neutral gray scale for text, borders, and backgrounds',
        tags: ['neutral', 'semantic'],
      },
    });

    // Wada Sanzo Colors - From "A Dictionary of Color Combinations" (1930s)

    // Sulphur Yellow - A soft, muted yellow
    builder.addColor('sulphurYellow', {
      source: { l: 0.941, c: 0.0554, h: 91.42 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Sulphur Yellow',
        description: 'Soft, muted yellow from Wada Sanzo palette',
        tags: ['accent', 'wada-sanzo', 'yellow', 'historical'],
      },
    });

    // Yellow Orange - A warm, earthy orange
    builder.addColor('yellowOrange', {
      source: { l: 0.7777, c: 0.1684, h: 64.45 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Yellow Orange',
        description: 'Warm, earthy orange from Wada Sanzo palette',
        tags: ['accent', 'wada-sanzo', 'orange', 'historical'],
      },
    });

    // Vanderpoel Blue - A deep, sophisticated blue
    builder.addColor('vandarPoelBlue', {
      source: { l: 0.4025, c: 0.0836, h: 233.38 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Vanderpoel Blue',
        description: 'Deep, sophisticated blue from Wada Sanzo palette',
        tags: ['accent', 'wada-sanzo', 'blue', 'historical', 'primary'],
      },
    });

    // Semantic colors - Green (success)
    builder.addColor('green', {
      source: { l: 0.55, c: 0.13, h: 145 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Green',
        description: 'Success and positive state color',
        tags: ['semantic', 'success'],
      },
    });

    // Semantic colors - Red (error)
    builder.addColor('red', {
      source: { l: 0.55, c: 0.15, h: 25 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Red',
        description: 'Error and destructive state color',
        tags: ['semantic', 'error'],
      },
    });

    // Light theme variant
    builder.addThemeVariant('light', {
      // Backgrounds using Sulphur Yellow for warmth
      background: builder.colors.sulphurYellow50,
      surface: builder.colors.sulphurYellow100,
      surfaceElevated: builder.colors.sulphurYellow200,
      surfaceSubdued: builder.colors.sulphurYellow300,

      // Text
      text: builder.colors.gray900,
      textStrong: builder.colors.gray950,
      textMuted: builder.colors.gray600,
      textInverse: builder.colors.sulphurYellow50,

      // Primary using Vanderpoel Blue
      primary: builder.colors.vandarPoelBlue500,
      primaryHover: builder.colors.vandarPoelBlue600,
      primaryActive: builder.colors.vandarPoelBlue700,

      // Semantic
      success: builder.colors.green500,
      warning: builder.colors.yellowOrange600,
      error: builder.colors.red500,
      info: builder.colors.vandarPoelBlue500,

      // UI Elements
      border: builder.colors.gray200,
      borderStrong: builder.colors.gray300,
      borderWidth: '1px',
      focus: builder.colors.vandarPoelBlue500,

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
      // Backgrounds
      background: builder.colors.gray950,
      surface: builder.colors.gray900,
      surfaceElevated: builder.colors.gray800,
      surfaceSubdued: builder.colors.black500,

      // Text using Sulphur Yellow tint
      text: builder.colors.sulphurYellow50,
      textStrong: builder.colors.white500,
      textMuted: builder.colors.sulphurYellow200,
      textInverse: builder.colors.gray900,

      // Primary using lighter Vanderpoel Blue for dark backgrounds
      primary: builder.colors.vandarPoelBlue400,
      primaryHover: builder.colors.vandarPoelBlue300,
      primaryActive: builder.colors.vandarPoelBlue200,

      // Semantic (lighter shades for dark backgrounds)
      success: builder.colors.green400,
      warning: builder.colors.yellowOrange400,
      error: builder.colors.red400,
      info: builder.colors.vandarPoelBlue400,

      // UI Elements
      border: builder.colors.gray800,
      borderStrong: builder.colors.gray700,
      borderWidth: '1px',
      focus: builder.colors.vandarPoelBlue400,

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

      // Shadows (lighter shadows for dark backgrounds)
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

    // NOTE: Built-in validation utilities are available but commented out
    // because they run before ColorRef serialization. To use them, call
    // validateTheme() after build() completes:
    //
    //   const config = builder.build();
    //   const errors = validateTheme(config);
    //
    // For now, we only validate theme structure:

    // Add plugin-specific validations
    // Ensure all required colors exist
    const requiredColors = [
      'gray',
      'sulphurYellow',
      'yellowOrange',
      'vandarPoelBlue',
      'green',
      'red',
    ];
    for (const colorName of requiredColors) {
      if (!config.colors[colorName]) {
        errors.push({
          plugin: 'blueprint-core',
          type: 'missing_color' as const,
          message: `Required color '${colorName}' is missing`,
          context: { colorName },
        });
      }
    }

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

    return errors;
  }
}

export const blueprintCoreTheme = new BlueprintCoreTheme();
export default blueprintCoreTheme;
