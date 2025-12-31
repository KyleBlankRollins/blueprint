/**
 * Wada Sanzo Plugin
 * Theme inspired by Japanese artist and dyer Wada Sanzo (1883-1967)
 *
 * This plugin provides accent colors from Wada Sanzo's "A Dictionary of Color Combinations"
 * (originally published in the 1930s). These colors have historical significance and
 * provide unique, harmonious combinations.
 *
 * Colors included:
 * - Sulphur Yellow: A soft, muted yellow
 * - Yellow Orange: A warm, earthy orange
 * - Vanderpoel Blue: A deep, sophisticated blue
 *
 * These can be used as accent colors alongside the Blueprint core theme or as
 * the foundation for custom theme variants.
 *
 * @module wada-sanzo
 * @version 1.0.0
 */

import type { ThemePlugin } from '../../core/types.js';

export const wadaSanzoPlugin: ThemePlugin = {
  id: 'wada-sanzo',
  version: '1.0.0',
  name: 'Wada Sanzo Color Palette',
  description:
    "Accent colors from Wada Sanzo's Dictionary of Color Combinations (1930s)",
  author: 'Blueprint Team',
  license: 'MIT',
  tags: ['accent', 'historical', 'wada-sanzo', 'japanese'],
  homepage: 'https://github.com/blueprint/blueprint',

  dependencies: [{ id: 'primitives' }, { id: 'blueprint-core' }],

  register(builder) {
    // Sulphur Yellow - A soft, muted yellow
    // Original: From Wada Sanzo's palette
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
    // Original: From Wada Sanzo's palette
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
    // Original: From Wada Sanzo's palette (named after color theorist Emily Vanderpoel)
    builder.addColor('vandarPoelBlue', {
      source: { l: 0.4025, c: 0.0836, h: 233.38 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Vanderpoel Blue',
        description: 'Deep, sophisticated blue from Wada Sanzo palette',
        tags: ['accent', 'wada-sanzo', 'blue', 'historical'],
      },
    });

    // Wada Light - A light theme variant using Wada Sanzo colors
    builder.addThemeVariant('wada-light', {
      // Backgrounds using Sulphur Yellow for warmth
      background: builder.colors.sulphurYellow50,
      surface: builder.colors.sulphurYellow100,
      surfaceElevated: builder.colors.sulphurYellow200,
      surfaceSubdued: builder.colors.sulphurYellow300,

      // Text
      text: builder.colors.gray900,
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
      focus: builder.colors.vandarPoelBlue500,
    });

    // Wada Dark - A dark theme variant using Wada Sanzo colors
    builder.addThemeVariant('wada-dark', {
      // Backgrounds
      background: builder.colors.gray950,
      surface: builder.colors.gray900,
      surfaceElevated: builder.colors.gray800,
      surfaceSubdued: builder.colors.black500,

      // Text using Sulphur Yellow tint
      text: builder.colors.sulphurYellow50,
      textMuted: builder.colors.sulphurYellow200,
      textInverse: builder.colors.gray900,

      // Primary using lighter Vanderpoel Blue for dark backgrounds
      primary: builder.colors.vandarPoelBlue400,
      primaryHover: builder.colors.vandarPoelBlue300,
      primaryActive: builder.colors.vandarPoelBlue200,

      // Semantic
      success: builder.colors.green400,
      warning: builder.colors.yellowOrange400,
      error: builder.colors.red400,
      info: builder.colors.vandarPoelBlue400,

      // UI Elements
      border: builder.colors.gray800,
      borderStrong: builder.colors.gray700,
      focus: builder.colors.vandarPoelBlue400,
    });
  },

  // Validation rules for Wada Sanzo
  validate(config) {
    const errors = [];

    // Ensure all Wada Sanzo colors exist
    const requiredColors = ['sulphurYellow', 'yellowOrange', 'vandarPoelBlue'];
    for (const colorName of requiredColors) {
      if (!config.colors[colorName]) {
        errors.push({
          plugin: 'wada-sanzo',
          type: 'missing_color' as const,
          message: `Required Wada Sanzo color '${colorName}' is missing`,
          context: { colorName },
        });
      }
    }

    // Ensure both Wada theme variants exist
    const requiredThemes = ['wada-light', 'wada-dark'];
    for (const themeName of requiredThemes) {
      if (!config.themes[themeName]) {
        errors.push({
          plugin: 'wada-sanzo',
          type: 'missing_color' as const,
          message: `Required Wada Sanzo theme variant '${themeName}' is missing`,
          context: { themeName },
        });
      }
    }

    return errors;
  },
};

export default wadaSanzoPlugin;
