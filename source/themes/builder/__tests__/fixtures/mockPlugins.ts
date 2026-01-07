/**
 * Mock plugins for testing
 * Provides reusable test fixtures for plugin system tests
 */

import type {
  ThemePlugin,
  ThemeBuilderInterface,
} from '../../../core/types.js';
import { ThemeBase } from '../../ThemeBase.js';

/**
 * Basic plugin with minimal configuration
 * Extends ThemeBase to provide design tokens
 */
export class BasicPlugin extends ThemeBase {
  id = 'basic';
  version = '1.0.0';

  register(builder: ThemeBuilderInterface) {
    builder.addColor('testBlue', {
      source: { l: 0.5, c: 0.15, h: 220 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    });
  }
}

export const basicPlugin = new BasicPlugin();

/**
 * Plugin with full metadata
 */
export class FullMetadataPlugin extends ThemeBase {
  id = 'full-meta';
  version = '2.1.3';
  name = 'Full Metadata Plugin';
  description = 'A plugin with all metadata fields';
  author = 'Blueprint Team';
  license = 'MIT';
  homepage = 'https://example.com';
  tags = ['test', 'mock', 'example'];

  register(builder: ThemeBuilderInterface) {
    builder.addColor('metaColor', {
      source: { l: 0.6, c: 0.12, h: 180 },
      scale: [500],
    });
  }
}

export const fullMetadataPlugin = new FullMetadataPlugin();

/**
 * Plugin that depends on another plugin
 */
export class DependentPlugin extends ThemeBase {
  id = 'dependent';
  version = '1.0.0';
  dependencies = [{ id: 'basic', version: '1.0.0' }];

  register(builder: ThemeBuilderInterface) {
    builder.addColor('dependentRed', {
      source: { l: 0.55, c: 0.22, h: 25 },
      scale: [500, 700],
    });
  }
}

export const dependentPlugin = new DependentPlugin();

/**
 * Plugin with optional dependency
 */
export class OptionalDependencyPlugin extends ThemeBase {
  id = 'optional-dep';
  version = '1.0.0';
  dependencies = [
    { id: 'basic', version: '1.0.0' },
    { id: 'missing', version: '1.0.0', optional: true },
  ];

  register(builder: ThemeBuilderInterface) {
    builder.addColor('optionalGreen', {
      source: { l: 0.6, c: 0.18, h: 140 },
      scale: [500],
    });
  }
}

export const optionalDependencyPlugin = new OptionalDependencyPlugin();

/**
 * Plugin with peer plugins
 */
export class PeerPlugin extends ThemeBase {
  id = 'peer';
  version = '1.0.0';
  peerPlugins = ['basic', 'full-meta'];

  register(builder: ThemeBuilderInterface) {
    builder.addColor('peerYellow', {
      source: { l: 0.8, c: 0.15, h: 90 },
      scale: [500],
    });
  }
}

export const peerPlugin = new PeerPlugin();

/**
 * Plugin with lifecycle hooks
 */
export class LifecyclePlugin extends ThemeBase {
  id = 'lifecycle';
  version = '1.0.0';

  register(builder: ThemeBuilderInterface) {
    builder.addColor('lifecycleOrange', {
      source: { l: 0.65, c: 0.18, h: 50 },
      scale: [500],
    });
  }

  override beforeBuild(
    config: Partial<import('../../../core/types.js').ThemeConfig>
  ) {
    // Hook that runs before build
    console.log('beforeBuild called', config);
  }

  override afterBuild(config: import('../../../core/types.js').ThemeConfig) {
    // Hook that runs after build
    console.log('afterBuild called', config);
  }

  override validate() {
    // Custom validation
    return [];
  }
}

export const lifecyclePlugin = new LifecyclePlugin();

/**
 * Plugin that adds a theme variant
 */
export class ThemeVariantPlugin extends ThemeBase {
  id = 'theme-variant';
  version = '1.0.0';
  dependencies = [{ id: 'basic' }];

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
      textStrong: builder.colors.gray950,
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
      borderWidth: '1px',
      focus: builder.colors.testBlue500,
      fontFamily: 'system-ui, sans-serif',
      fontFamilyMono: 'monospace',
      fontFamilyHeading: 'system-ui, sans-serif',
      borderRadius: '4px',
      borderRadiusLarge: '8px',
      borderRadiusFull: '9999px',
      shadowSm: '0 1px 2px rgba(0,0,0,0.05)',
      shadowMd: '0 4px 6px rgba(0,0,0,0.1)',
      shadowLg: '0 10px 15px rgba(0,0,0,0.1)',
      shadowXl: '0 20px 25px rgba(0,0,0,0.1)',
    });
  }
}

export const themeVariantPlugin = new ThemeVariantPlugin();

/**
 * Plugin that extends a theme variant
 */
export class ExtendVariantPlugin extends ThemeBase {
  id = 'extend-variant';
  version = '1.0.0';
  dependencies = [{ id: 'theme-variant' }];

  register(builder: ThemeBuilderInterface) {
    builder.extendThemeVariant('light', 'light-extended', {
      primary: builder.colors.testBlue700,
      primaryHover: builder.colors.testBlue800,
    });
  }
}

export const extendVariantPlugin = new ExtendVariantPlugin();

/**
 * Plugin with async registration
 */
export class AsyncPlugin extends ThemeBase {
  id = 'async';
  version = '1.0.0';

  async register(builder: ThemeBuilderInterface) {
    // Simulate async operation
    await new Promise((resolve) => globalThis.setTimeout(resolve, 10));

    builder.addColor('asyncPurple', {
      source: { l: 0.5, c: 0.2, h: 280 },
      scale: [500],
    });
  }
}

export const asyncPlugin = new AsyncPlugin();

/**
 * Plugin that causes circular dependency
 * Use with circularDepB
 */
export class CircularDepA extends ThemeBase {
  id = 'circular-a';
  version = '1.0.0';
  dependencies = [{ id: 'circular-b' }];

  register(builder: ThemeBuilderInterface) {
    builder.addColor('circularA', {
      source: { l: 0.5, c: 0.1, h: 0 },
      scale: [500],
    });
  }
}

export const circularDepA = new CircularDepA();

/**
 * Plugin that causes circular dependency
 * Use with circularDepA
 */
export class CircularDepB extends ThemeBase {
  id = 'circular-b';
  version = '1.0.0';
  dependencies = [{ id: 'circular-a' }];

  register(builder: ThemeBuilderInterface) {
    builder.addColor('circularB', {
      source: { l: 0.5, c: 0.1, h: 0 },
      scale: [500],
    });
  }
}

export const circularDepB = new CircularDepB();

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
