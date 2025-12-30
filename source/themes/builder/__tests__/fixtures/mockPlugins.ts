/**
 * Mock plugins for testing
 * Provides reusable test fixtures for plugin system tests
 */

import type {
  ThemePlugin,
  ThemeBuilderInterface,
} from '../../../core/types.js';

/**
 * Basic plugin with minimal configuration
 */
export const basicPlugin: ThemePlugin = {
  id: 'basic',
  version: '1.0.0',
  register(builder: ThemeBuilderInterface) {
    builder.addColor('testBlue', {
      source: { l: 0.5, c: 0.15, h: 220 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    });
  },
};

/**
 * Plugin with full metadata
 */
export const fullMetadataPlugin: ThemePlugin = {
  id: 'full-meta',
  version: '2.1.3',
  name: 'Full Metadata Plugin',
  description: 'A plugin with all metadata fields',
  author: 'Blueprint Team',
  license: 'MIT',
  homepage: 'https://example.com',
  tags: ['test', 'mock', 'example'],
  register(builder: ThemeBuilderInterface) {
    builder.addColor('metaColor', {
      source: { l: 0.6, c: 0.12, h: 180 },
      scale: [500],
    });
  },
};

/**
 * Plugin that depends on another plugin
 */
export const dependentPlugin: ThemePlugin = {
  id: 'dependent',
  version: '1.0.0',
  dependencies: [{ id: 'basic', version: '1.0.0' }],
  register(builder: ThemeBuilderInterface) {
    builder.addColor('dependentRed', {
      source: { l: 0.55, c: 0.22, h: 25 },
      scale: [500, 700],
    });
  },
};

/**
 * Plugin with optional dependency
 */
export const optionalDependencyPlugin: ThemePlugin = {
  id: 'optional-dep',
  version: '1.0.0',
  dependencies: [
    { id: 'basic', version: '1.0.0' },
    { id: 'missing', version: '1.0.0', optional: true },
  ],
  register(builder: ThemeBuilderInterface) {
    builder.addColor('optionalGreen', {
      source: { l: 0.6, c: 0.18, h: 140 },
      scale: [500],
    });
  },
};

/**
 * Plugin with peer plugins
 */
export const peerPlugin: ThemePlugin = {
  id: 'peer',
  version: '1.0.0',
  peerPlugins: ['basic', 'full-meta'],
  register(builder: ThemeBuilderInterface) {
    builder.addColor('peerYellow', {
      source: { l: 0.8, c: 0.15, h: 90 },
      scale: [500],
    });
  },
};

/**
 * Plugin with lifecycle hooks
 */
export const lifecyclePlugin: ThemePlugin = {
  id: 'lifecycle',
  version: '1.0.0',
  register(builder: ThemeBuilderInterface) {
    builder.addColor('lifecycleOrange', {
      source: { l: 0.65, c: 0.18, h: 50 },
      scale: [500],
    });
  },
  beforeBuild(config) {
    // Hook that runs before build
    console.log('beforeBuild called', config);
  },
  afterBuild(config) {
    // Hook that runs after build
    console.log('afterBuild called', config);
  },
  validate() {
    // Custom validation
    return [];
  },
};

/**
 * Plugin that adds a theme variant
 */
export const themeVariantPlugin: ThemePlugin = {
  id: 'theme-variant',
  version: '1.0.0',
  dependencies: [{ id: 'basic' }],
  register(builder: ThemeBuilderInterface) {
    builder.addColor('gray', {
      source: { l: 0.5, c: 0.01, h: 0 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    });

    builder.addThemeVariant('light', {
      background: builder.colors.gray50,
      surface: builder.colors.gray100,
      surfaceElevated: builder.colors.gray50,
      surfaceSubdued: builder.colors.gray200,
      text: builder.colors.gray900,
      textMuted: builder.colors.gray600,
      textInverse: builder.colors.gray50,
      primary: builder.colors.testBlue500,
      primaryHover: builder.colors.testBlue600,
      primaryActive: builder.colors.testBlue700,
      success: builder.colors.gray500,
      warning: builder.colors.gray500,
      error: builder.colors.gray500,
      info: builder.colors.testBlue500,
      border: builder.colors.gray200,
      borderStrong: builder.colors.gray300,
      focus: builder.colors.testBlue500,
    });
  },
};

/**
 * Plugin that extends a theme variant
 */
export const extendVariantPlugin: ThemePlugin = {
  id: 'extend-variant',
  version: '1.0.0',
  dependencies: [{ id: 'theme-variant' }],
  register(builder: ThemeBuilderInterface) {
    builder.extendThemeVariant('light', 'light-extended', {
      primary: builder.colors.testBlue700,
      primaryHover: builder.colors.testBlue800,
    });
  },
};

/**
 * Plugin with async registration
 */
export const asyncPlugin: ThemePlugin = {
  id: 'async',
  version: '1.0.0',
  async register(builder: ThemeBuilderInterface) {
    // Simulate async operation
    await new Promise((resolve) => globalThis.setTimeout(resolve, 10));

    builder.addColor('asyncPurple', {
      source: { l: 0.5, c: 0.2, h: 280 },
      scale: [500],
    });
  },
};

/**
 * Plugin that causes circular dependency
 * Use with circularDepB
 */
export const circularDepA: ThemePlugin = {
  id: 'circular-a',
  version: '1.0.0',
  dependencies: [{ id: 'circular-b' }],
  register(builder: ThemeBuilderInterface) {
    builder.addColor('circularA', {
      source: { l: 0.5, c: 0.1, h: 0 },
      scale: [500],
    });
  },
};

/**
 * Plugin that causes circular dependency
 * Use with circularDepA
 */
export const circularDepB: ThemePlugin = {
  id: 'circular-b',
  version: '1.0.0',
  dependencies: [{ id: 'circular-a' }],
  register(builder: ThemeBuilderInterface) {
    builder.addColor('circularB', {
      source: { l: 0.5, c: 0.1, h: 0 },
      scale: [500],
    });
  },
};

/**
 * Invalid plugin - missing ID
 */
export const invalidNoId = {
  version: '1.0.0',
  register() {},
} as unknown as ThemePlugin;

/**
 * Invalid plugin - missing version
 */
export const invalidNoVersion = {
  id: 'no-version',
  register() {},
} as unknown as ThemePlugin;

/**
 * Invalid plugin - missing register function
 */
export const invalidNoRegister = {
  id: 'no-register',
  version: '1.0.0',
} as unknown as ThemePlugin;
