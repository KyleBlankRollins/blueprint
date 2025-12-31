/**
 * Benzol Theme Plugin
 * Auto-generated theme plugin
 */

import type { ThemePlugin } from '../../core/types.js';

export const benzolPlugin: ThemePlugin = {
  id: 'benzol',
  version: '1.0.0',
  name: 'Benzol Theme',
  description: 'Custom theme with benzol primary color',
  author: 'Unknown',
  license: 'MIT',
  tags: ['custom', 'benzol'],

  dependencies: [{ id: 'primitives' }, { id: 'blueprint-core' }],

  register(builder) {
    // Define primary color
    builder.addColor('benzolPrimary', {
      source: { l: 0.6089, c: 0.1065, h: 186.59 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Benzol Primary',
        description: 'Primary brand color for benzol theme',
        tags: ['brand', 'primary'],
      },
    });

    // Benzol Light variant
    builder.addThemeVariant('benzol-light', {
      // Backgrounds
      background: builder.colors.gray50,
      surface: builder.colors.gray100,
      surfaceElevated: builder.colors.white500,
      surfaceSubdued: builder.colors.gray200,

      // Text
      text: builder.colors.gray900,
      textMuted: builder.colors.gray600,
      textInverse: builder.colors.white500,

      // Primary - using custom color
      primary: builder.colors.benzolPrimary600,
      primaryHover: builder.colors.benzolPrimary700,
      primaryActive: builder.colors.benzolPrimary800,

      // Semantic - using Blueprint core colors
      success: builder.colors.green500,
      warning: builder.colors.yellow600,
      error: builder.colors.red500,
      info: builder.colors.blue500,

      // UI Elements
      border: builder.colors.gray200,
      borderStrong: builder.colors.gray300,
      focus: builder.colors.benzolPrimary500,
    });

    // Benzol Dark variant
    builder.addThemeVariant('benzol-dark', {
      // Backgrounds
      background: builder.colors.gray950,
      surface: builder.colors.gray900,
      surfaceElevated: builder.colors.gray800,
      surfaceSubdued: builder.colors.black500,

      // Text
      text: builder.colors.gray50,
      textMuted: builder.colors.gray400,
      textInverse: builder.colors.gray900,

      // Primary - lighter shades for dark backgrounds
      primary: builder.colors.benzolPrimary400,
      primaryHover: builder.colors.benzolPrimary300,
      primaryActive: builder.colors.benzolPrimary200,

      // Semantic - lighter shades
      success: builder.colors.green400,
      warning: builder.colors.yellow400,
      error: builder.colors.red400,
      info: builder.colors.blue400,

      // UI Elements
      border: builder.colors.gray800,
      borderStrong: builder.colors.gray700,
      focus: builder.colors.benzolPrimary400,
    });
  },
};

export default benzolPlugin;
