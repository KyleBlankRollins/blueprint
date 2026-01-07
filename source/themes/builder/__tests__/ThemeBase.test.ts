/**
 * ThemeBase Integration Tests
 * Tests for multi-theme loading, design token merging, and overrides
 */

import { describe, it, expect } from 'vitest';
import { ThemeBase } from '../ThemeBase.js';
import { ThemeBuilder } from '../ThemeBuilder.js';
import { blueprintCoreTheme } from '../../plugins/blueprint-core/index.js';

// Minimal test theme with custom spacing
class TightSpacingTheme extends ThemeBase {
  id = 'tight-spacing';
  version = '1.0.0';
  name = 'Tight Spacing Theme';
  description = 'Theme with reduced spacing';
  author = 'Test';
  license = 'MIT';
  tags = ['test', 'compact'];

  protected spacing = {
    base: 2, // Smaller than default 4
    scale: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
    semantic: {
      xs: 0.5,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4,
    },
  };

  register() {
    // Don't register any colors - rely on other themes
  }
}

// Test theme with custom motion
class SlowMotionTheme extends ThemeBase {
  id = 'slow-motion';
  version = '1.0.0';
  name = 'Slow Motion Theme';
  description = 'Theme with slower animations';
  author = 'Test';
  license = 'MIT';
  tags = ['test', 'slow'];

  protected motion = {
    durations: {
      instant: 0,
      fast: 300, // Slower than default 150
      normal: 600, // Slower than default 300
      slow: 1000, // Slower than default 500
    },
    easings: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    transitions: {
      fast: '300ms cubic-bezier(0, 0, 0.2, 1)',
      base: '600ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '1000ms cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  };

  register() {
    // Don't register any colors - rely on other themes
  }
}

// Test theme with multiple overrides
class FullCustomTheme extends ThemeBase {
  id = 'full-custom';
  version = '1.0.0';
  name = 'Full Custom Theme';
  description = 'Theme with multiple design token overrides';
  author = 'Test';
  license = 'MIT';
  tags = ['test', 'custom'];

  protected spacing = {
    base: 8,
    scale: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
    semantic: { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 },
  };

  protected radius = {
    none: 0,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    full: 9999,
  };

  protected typography = {
    fontFamilies: {
      sans: 'Georgia, serif',
      mono: '"Courier New", monospace',
    },
    fontSizes: {
      xs: 14,
      sm: 16,
      base: 18,
      lg: 20,
      xl: 24,
      '2xl': 28,
      '3xl': 32,
      '4xl': 40,
    },
    lineHeights: {
      none: 1,
      tight: 1.3,
      snug: 1.45,
      normal: 1.6,
      relaxed: 1.75,
      loose: 2.2,
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  };

  register() {
    // Don't register any colors - rely on other themes
  }
}

describe('ThemeBase', () => {
  describe('Design Token Defaults', () => {
    it('should provide default design tokens', () => {
      const tokens = blueprintCoreTheme.getDesignTokens();

      expect(tokens.spacing.base).toBe(4);
      expect(tokens.radius.md).toBe(4);
      expect(tokens.motion.durations.fast).toBe(150);
      expect(tokens.typography.fontFamilies.sans).toContain('system');
      expect(tokens.opacity.disabled).toBe(0.5);
      expect(tokens.breakpoints.md).toBe('768px');
      expect(tokens.focus.width).toBe(2);
      expect(tokens.accessibility.enforceWCAG).toBe(false);
      expect(tokens.zIndex.modal).toBe(1040);
    });

    it('should allow selective spacing overrides', () => {
      const theme = new TightSpacingTheme();
      const tokens = theme.getDesignTokens();

      expect(tokens.spacing.base).toBe(2);
      expect(tokens.spacing.semantic).toBeTruthy();
      expect(tokens.spacing.semantic!.md).toBe(2);
      // Other tokens should be defaults
      expect(tokens.radius.md).toBe(4);
      expect(tokens.motion.durations.fast).toBe(150);
    });

    it('should allow selective radius overrides', () => {
      const theme = new FullCustomTheme();
      const tokens = theme.getDesignTokens();

      expect(tokens.radius.sm).toBe(8);
      expect(tokens.radius.md).toBe(16); // FullCustomTheme override
      // Other tokens from test theme
      expect(tokens.spacing.base).toBe(8);
      expect(tokens.motion.durations.fast).toBe(150); // Default
    });

    it('should allow selective motion overrides', () => {
      const theme = new SlowMotionTheme();
      const tokens = theme.getDesignTokens();

      expect(tokens.motion.durations.fast).toBe(300);
      expect(tokens.motion.durations.normal).toBe(600);
      expect(tokens.motion.transitions).toBeTruthy();
      expect(tokens.motion.transitions!.base).toBe(
        '600ms cubic-bezier(0.4, 0, 0.2, 1)'
      );
      // Other tokens should be defaults
      expect(tokens.spacing.base).toBe(4);
      expect(tokens.radius.md).toBe(4);
    });

    it('should allow multiple design token overrides', () => {
      const theme = new FullCustomTheme();
      const tokens = theme.getDesignTokens();

      expect(tokens.spacing.base).toBe(8);
      expect(tokens.radius.sm).toBe(8);
      expect(tokens.typography.fontFamilies.sans).toBe('Georgia, serif');
      expect(tokens.typography.fontSizes.base).toBe(18);
      // Non-overridden tokens should be defaults
      expect(tokens.motion.durations.fast).toBe(150);
      expect(tokens.opacity.disabled).toBe(0.5);
    });
  });

  describe('Multi-Theme Loading', () => {
    it('should load single theme with defaults', () => {
      const builder = new ThemeBuilder().use(blueprintCoreTheme);
      const config = builder.build();

      expect(config.spacing.base).toBe(4); // Blueprint Core default
      expect(config.colors.blue).toBeDefined();
      expect(config.themes.light).toBeDefined();
    });

    it('should merge design tokens from multiple themes (later overrides earlier)', () => {
      const builder = new ThemeBuilder()
        .use(blueprintCoreTheme)
        .use(new TightSpacingTheme());

      const config = builder.build();

      // TightSpacingTheme should override spacing
      expect(config.spacing.base).toBe(2);
      expect(config.spacing.semantic).toBeTruthy();
      expect(config.spacing.semantic!.md).toBe(2);

      // blueprintCoreTheme doesn't override radius, should be defaults
      expect(config.radius.md).toBe(4);

      // Other tokens from defaults should remain
      expect(config.motion.durations.fast).toBe(150);

      // All themes' colors should be present
      expect(config.colors.gray).toBeDefined();
      expect(config.colors.sulphurYellow).toBeDefined();

      // All theme variants should exist
      expect(config.themes.light).toBeDefined();
      expect(config.themes['wada-light']).toBeDefined();
    });

    it('should handle three themes with different overrides', () => {
      const builder = new ThemeBuilder()
        .use(blueprintCoreTheme)
        .use(new TightSpacingTheme())
        .use(new SlowMotionTheme());

      const config = builder.build();

      // Last theme's motion overrides
      expect(config.motion.durations.fast).toBe(300);
      expect(config.motion.durations.normal).toBe(600);

      // SlowMotionTheme's getDesignTokens() includes default spacing,
      // which overwrites TightSpacingTheme's custom spacing
      expect(config.spacing.base).toBe(4); // Back to defaults from SlowMotionTheme

      // Colors from blueprint-core
      expect(config.colors.blue).toBeDefined();

      // Blueprint core theme variants
      expect(config.themes.light).toBeDefined();
      expect(config.themes.dark).toBeDefined();
    });

    it('should deep merge partial overrides', () => {
      const builder = new ThemeBuilder()
        .use(blueprintCoreTheme)
        .use(new FullCustomTheme());

      const config = builder.build();

      // FullCustomTheme's overrides
      expect(config.spacing.base).toBe(8);
      expect(config.radius.sm).toBe(8);
      expect(config.typography.fontFamilies.sans).toBe('Georgia, serif');
      expect(config.typography.fontSizes.base).toBe(18);

      // FullCustomTheme didn't override motion, should be defaults
      expect(config.motion.durations.fast).toBe(150);
      expect(config.motion.durations.normal).toBe(300);
    });
  });

  describe('Theme Registration', () => {
    it('should call register method during use()', () => {
      let registerCalled = false;

      class TestTheme extends ThemeBase {
        id = 'test';
        version = '1.0.0';
        name = 'Test';
        description = 'Test';
        author = 'Test';
        license = 'MIT';
        tags = ['test'];

        register() {
          registerCalled = true;
        }
      }

      new ThemeBuilder()
        .use(blueprintCoreTheme) // Need colors first
        .use(new TestTheme());
      expect(registerCalled).toBe(true);
    });
  });

  describe('Metadata', () => {
    it('should preserve theme metadata', () => {
      expect(blueprintCoreTheme.id).toBe('blueprint-core');
      expect(blueprintCoreTheme.version).toBe('1.0.0');
      expect(blueprintCoreTheme.name).toBe('Blueprint Core Theme');
      expect(blueprintCoreTheme.description).toBeDefined();
      expect(blueprintCoreTheme.author).toBe('Blueprint Team');
      expect(blueprintCoreTheme.license).toBe('MIT');
      expect(blueprintCoreTheme.tags).toContain('core');
    });
  });
});
