/**
 * Blueprint Core Plugin
 * Default Blueprint theme with light and dark variants
 *
 * Provides:
 * - Core semantic colors (gray, blue, green, red, yellow)
 * - Light theme variant
 * - Dark theme variant with chroma adjustments
 *
 * This is the standard Blueprint theme that most projects will use as their base.
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
  readonly description = 'Default Blueprint theme with light and dark variants';
  readonly author = 'Blueprint Team';
  readonly license = 'MIT';
  readonly tags = ['core', 'theme', 'light', 'dark'];
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

    // Brand colors - Blue (primary)
    builder.addColor('blue', {
      source: { l: 0.55, c: 0.15, h: 240 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Blue',
        description: 'Primary brand color for interactive elements',
        tags: ['brand', 'primary', 'semantic'],
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

    // Semantic colors - Yellow (warning)
    builder.addColor('yellow', {
      source: { l: 0.65, c: 0.13, h: 85 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Yellow',
        description: 'Warning and caution state color',
        tags: ['semantic', 'warning'],
      },
    });

    // Light theme variant
    builder.addThemeVariant('light', {
      // Backgrounds
      background: builder.colors.gray50,
      surface: builder.colors.gray100,
      surfaceElevated: builder.colors.white500,
      surfaceSubdued: builder.colors.gray200,

      // Text
      text: builder.colors.gray900,
      textMuted: builder.colors.gray600,
      textInverse: builder.colors.white500,

      // Primary
      primary: builder.colors.blue500,
      primaryHover: builder.colors.blue600,
      primaryActive: builder.colors.blue700,

      // Semantic
      success: builder.colors.green500,
      warning: builder.colors.yellow600, // Darker for better contrast
      error: builder.colors.red500,
      info: builder.colors.blue500,

      // UI Elements
      border: builder.colors.gray200,
      borderStrong: builder.colors.gray300,
      focus: builder.colors.blue500,
    });

    // Dark theme variant with adjusted colors for dark backgrounds
    builder.addThemeVariant('dark', {
      // Backgrounds
      background: builder.colors.gray950,
      surface: builder.colors.gray900,
      surfaceElevated: builder.colors.gray800,
      surfaceSubdued: builder.colors.black500,

      // Text
      text: builder.colors.gray50,
      textMuted: builder.colors.gray400,
      textInverse: builder.colors.gray900,

      // Primary (lighter shades for dark backgrounds)
      primary: builder.colors.blue500,
      primaryHover: builder.colors.blue400,
      primaryActive: builder.colors.blue300,

      // Semantic (lighter shades for dark backgrounds)
      success: builder.colors.green400,
      warning: builder.colors.yellow400,
      error: builder.colors.red400,
      info: builder.colors.blue400,

      // UI Elements
      border: builder.colors.gray800,
      borderStrong: builder.colors.gray700,
      focus: builder.colors.blue400,
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
    const requiredColors = ['gray', 'blue', 'green', 'red', 'yellow'];
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
