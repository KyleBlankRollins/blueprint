/**
 * Forest Theme Plugin
 * Auto-generated theme plugin
 */

import type { ThemePlugin } from '../../core/types.js';

export const forestPlugin: ThemePlugin = {
  id: 'forest',
  version: '1.0.0',
  name: 'Forest Theme',
  description: 'Custom theme with forest primary color',
  author: 'Unknown',
  license: 'MIT',
  tags: ['custom', 'forest'],

  dependencies: [{ id: 'primitives' }, { id: 'blueprint-core' }],

  register(builder) {
    // Define primary color
    builder.addColor('forestPrimary', {
      source: { l: 0.6271, c: 0.1699, h: 149.21 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Forest Primary',
        description: 'Primary brand color for forest theme',
        tags: ['brand', 'primary'],
      },
    });

    // Forest Light variant
    builder.addThemeVariant('forest-light', {
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
      primary: builder.colors.forestPrimary600,
      primaryHover: builder.colors.forestPrimary700,
      primaryActive: builder.colors.forestPrimary800,

      // Semantic - using Blueprint core colors
      success: builder.colors.green500,
      warning: builder.colors.yellow600,
      error: builder.colors.red500,
      info: builder.colors.blue500,

      // UI Elements
      border: builder.colors.gray200,
      borderStrong: builder.colors.gray300,
      focus: builder.colors.forestPrimary500,
    });

    // Forest Dark variant
    builder.addThemeVariant('forest-dark', {
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
      primary: builder.colors.forestPrimary400,
      primaryHover: builder.colors.forestPrimary300,
      primaryActive: builder.colors.forestPrimary200,

      // Semantic - lighter shades
      success: builder.colors.green400,
      warning: builder.colors.yellow400,
      error: builder.colors.red400,
      info: builder.colors.blue400,

      // UI Elements
      border: builder.colors.gray800,
      borderStrong: builder.colors.gray700,
      focus: builder.colors.forestPrimary400,
    });
  },
};

export default forestPlugin;
