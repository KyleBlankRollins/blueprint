/**
 * Integration tests for the plugin system
 * Tests the complete workflow from plugin registration to theme build
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeBuilder } from '../ThemeBuilder.js';
import {
  basicPlugin,
  themeVariantPlugin,
  extendVariantPlugin,
  dependentPlugin,
} from './fixtures/mockPlugins.js';
import { blueprintCoreTheme } from '../../plugins/blueprint-core/index.js';
import { wadaSanzoTheme } from '../../plugins/wada-sanzo/index.js';

describe('Plugin System Integration', () => {
  let builder: ThemeBuilder;

  beforeEach(() => {
    builder = new ThemeBuilder();
  });

  describe('Basic Plugin Registration', () => {
    it('should register a plugin and add colors', () => {
      builder.use(basicPlugin);

      expect(builder.getPlugins()).toHaveLength(1);
      expect(builder.getPlugins()[0].id).toBe('basic');
      expect(builder.hasColor('testBlue')).toBe(true);
      expect(builder.getColorNames()).toContain('testBlue');
    });

    it('should create typed color refs', () => {
      builder.use(basicPlugin);

      expect(builder.colors.testBlue50).toBeDefined();
      expect(builder.colors.testBlue500).toBeDefined();
      expect(builder.colors.testBlue950).toBeDefined();
      expect(builder.colors.testBlue50.colorName).toBe('testBlue');
      expect(builder.colors.testBlue50.step).toBe(50);
    });

    it('should handle multiple plugins', () => {
      builder.use(basicPlugin).use(dependentPlugin);

      expect(builder.getPlugins()).toHaveLength(2);
      expect(builder.hasColor('testBlue')).toBe(true);
      expect(builder.hasColor('dependentRed')).toBe(true);
    });
  });

  describe('Theme Variant Management', () => {
    it('should add theme variant', () => {
      builder.use(basicPlugin).use(themeVariantPlugin);

      const variant = builder.getThemeVariant('light');
      expect(variant).toBeDefined();
      expect(variant?.primary).toBeDefined();
    });

    it('should extend theme variant', () => {
      builder.use(basicPlugin).use(themeVariantPlugin).use(extendVariantPlugin);

      const base = builder.getThemeVariant('light');
      const extended = builder.getThemeVariant('light-extended');

      expect(base).toBeDefined();
      expect(extended).toBeDefined();
      expect(extended?.primary).not.toEqual(base?.primary);
    });

    it('should list all theme variant names', () => {
      builder.use(basicPlugin).use(themeVariantPlugin);

      const names = builder.getThemeVariantNames();
      expect(names).toContain('light');
    });
  });

  describe('Plugin Dependencies', () => {
    it('should handle plugin dependencies in correct order', () => {
      // Add dependent plugin first - dependencies should still work
      builder.use(dependentPlugin).use(basicPlugin);

      expect(builder.hasColor('testBlue')).toBe(true);
      expect(builder.hasColor('dependentRed')).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should validate successfully with complete theme', () => {
      builder.use(basicPlugin).use(themeVariantPlugin);

      // Need dark variant too
      builder.addThemeVariant('dark', {
        background: builder.colors.gray950,
        surface: builder.colors.gray900,
        surfaceElevated: builder.colors.gray800,
        surfaceSubdued: builder.colors.gray900,
        text: builder.colors.gray50,
        textMuted: builder.colors.gray400,
        textInverse: builder.colors.gray900,
        primary: builder.colors.testBlue400,
        primaryHover: builder.colors.testBlue300,
        primaryActive: builder.colors.testBlue200,
        success: builder.colors.gray500,
        warning: builder.colors.gray500,
        error: builder.colors.gray500,
        info: builder.colors.testBlue400,
        border: builder.colors.gray700,
        borderStrong: builder.colors.gray600,
        focus: builder.colors.testBlue400,
      });

      const result = builder.validate();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation without required theme variants', () => {
      builder.use(basicPlugin);

      // Validation throws an error during buildInternal when required themes are missing
      // This is expected behavior - wrap in try/catch
      try {
        builder.validate();
        expect.fail('Should have thrown an error for missing theme variants');
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toMatch(/light|dark/);
      }
    });
  });

  describe('Build Process', () => {
    it('should build complete theme config', () => {
      builder.use(basicPlugin).use(themeVariantPlugin);

      // Add dark variant
      builder.addThemeVariant('dark', {
        background: builder.colors.gray950,
        surface: builder.colors.gray900,
        surfaceElevated: builder.colors.gray800,
        surfaceSubdued: builder.colors.gray900,
        text: builder.colors.gray50,
        textMuted: builder.colors.gray400,
        textInverse: builder.colors.gray900,
        primary: builder.colors.testBlue400,
        primaryHover: builder.colors.testBlue300,
        primaryActive: builder.colors.testBlue200,
        success: builder.colors.gray500,
        warning: builder.colors.gray500,
        error: builder.colors.gray500,
        info: builder.colors.testBlue400,
        border: builder.colors.gray700,
        borderStrong: builder.colors.gray600,
        focus: builder.colors.testBlue400,
      });

      const config = builder.build();

      expect(config.colors).toBeDefined();
      expect(config.themes).toBeDefined();
      expect(config.themes.light).toBeDefined();
      expect(config.themes.dark).toBeDefined();
      expect(config.spacing).toBeDefined();
      expect(config.radius).toBeDefined();
    });

    it('should throw error when building without light theme', () => {
      builder.use(basicPlugin);

      expect(() => builder.build()).toThrow('light');
    });

    it('should throw error when building without dark theme', () => {
      builder.use(basicPlugin).use(themeVariantPlugin);

      expect(() => builder.build()).toThrow('dark');
    });

    it('should serialize color refs to strings in theme config', () => {
      builder.use(basicPlugin).use(themeVariantPlugin);

      builder.addThemeVariant('dark', {
        background: builder.colors.gray950,
        surface: builder.colors.gray900,
        surfaceElevated: builder.colors.gray800,
        surfaceSubdued: builder.colors.gray900,
        text: builder.colors.gray50,
        textMuted: builder.colors.gray400,
        textInverse: builder.colors.gray900,
        primary: builder.colors.testBlue400,
        primaryHover: builder.colors.testBlue300,
        primaryActive: builder.colors.testBlue200,
        success: builder.colors.gray500,
        warning: builder.colors.gray500,
        error: builder.colors.gray500,
        info: builder.colors.testBlue400,
        border: builder.colors.gray700,
        borderStrong: builder.colors.gray600,
        focus: builder.colors.testBlue400,
      });

      const config = builder.build();

      // Check that theme values are serialized strings, not ColorRef objects
      expect(typeof config.themes.light.primary).toBe('string');
      expect(config.themes.light.primary).toMatch(/\./); // Should contain dot
    });
  });

  describe('Introspection', () => {
    it('should get all plugin metadata', () => {
      builder.use(basicPlugin).use(dependentPlugin);

      const plugins = builder.getPlugins();
      expect(plugins).toHaveLength(2);
      expect(plugins.map((p) => p.id)).toContain('basic');
      expect(plugins.map((p) => p.id)).toContain('dependent');
    });

    it('should get all color names', () => {
      builder.use(basicPlugin).use(dependentPlugin);

      const colors = builder.getColorNames();
      expect(colors).toContain('testBlue');
      expect(colors).toContain('dependentRed');
    });

    it('should get all theme variant names', () => {
      builder.use(basicPlugin).use(themeVariantPlugin).use(extendVariantPlugin);

      const variants = builder.getThemeVariantNames();
      expect(variants).toContain('light');
      expect(variants).toContain('light-extended');
    });

    it('should return null from getDesignTokens() when no ThemeBase plugins registered', () => {
      // ThemeBuilder starts with null tokens (primitives aren't a ThemeBase plugin)
      const emptyBuilder = new ThemeBuilder();

      const tokens = emptyBuilder.getDesignTokens();
      expect(tokens).toBeNull();
    });
  });

  describe('Design Token Merging', () => {
    it('should return design tokens from ThemeBase plugins via getDesignTokens()', () => {
      // BasicPlugin extends ThemeBase, so it provides design tokens
      builder.use(basicPlugin);

      const tokens = builder.getDesignTokens();

      expect(tokens).not.toBeNull();
      expect(tokens!.spacing).toBeDefined();
      expect(tokens!.typography).toBeDefined();
      expect(tokens!.motion).toBeDefined();
      expect(tokens!.radius).toBeDefined();
      expect(tokens!.focus).toBeDefined();
      expect(tokens!.zIndex).toBeDefined();
      expect(tokens!.opacity).toBeDefined();
      expect(tokens!.breakpoints).toBeDefined();
      expect(tokens!.accessibility).toBeDefined();
    });

    it('should return design tokens from real ThemeBase plugins', () => {
      const builder = new ThemeBuilder().use(blueprintCoreTheme);

      const tokens = builder.getDesignTokens();

      expect(tokens).not.toBeNull();
      expect(tokens!.spacing).toBeDefined();
      expect(tokens!.typography).toBeDefined();
      expect(tokens!.motion).toBeDefined();
      expect(tokens!.radius).toBeDefined();
      expect(tokens!.focus).toBeDefined();
      expect(tokens!.zIndex).toBeDefined();
      expect(tokens!.opacity).toBeDefined();
      expect(tokens!.breakpoints).toBeDefined();
      expect(tokens!.accessibility).toBeDefined();
    });

    it('should merge design tokens from multiple ThemeBase plugins', () => {
      const builder = new ThemeBuilder()
        .use(blueprintCoreTheme)
        .use(wadaSanzoTheme);

      const tokens = builder.getDesignTokens();

      expect(tokens).not.toBeNull();
      expect(tokens!.spacing.base).toBe(4);
      expect(tokens!.typography.fontFamilies.sans).toBeDefined();
    });

    it('should allow inspecting design tokens without triggering build', () => {
      const builder = new ThemeBuilder().use(blueprintCoreTheme);

      // Can access tokens before adding required theme variants
      const tokens = builder.getDesignTokens();
      expect(tokens).not.toBeNull();

      // Build would fail at this point (no light/dark variants)
      // blueprintCoreTheme registers light/dark, so this actually works
      // Change test to verify we can get tokens independently of build
      const config = builder.build();
      expect(config.spacing).toEqual(tokens!.spacing);
    });
  });
});
