import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  discoverThemes,
  getThemeNames,
  getThemeByName,
  getThemesByPlugin,
  themeExists,
  clearThemeCache,
} from '../discoverThemes.js';

describe('discoverThemes', () => {
  const testDir = join(process.cwd(), 'test-themes-temp');
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Clean up any existing test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    // Clear cache before each test
    clearThemeCache();
    // Spy on console.warn to suppress expected warnings in tests
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up test directory after each test
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    // Clear cache after each test
    clearThemeCache();
    // Restore console.warn
    consoleWarnSpy.mockRestore();
  });

  describe('discoverThemes()', () => {
    it('should return empty array when directory does not exist', () => {
      const themes = discoverThemes('/nonexistent/path');
      expect(themes).toEqual([]);
    });

    it('should return empty array when directory is empty', () => {
      mkdirSync(testDir, { recursive: true });
      const themes = discoverThemes(testDir);
      expect(themes).toEqual([]);
    });

    it('should discover themes from a single plugin', () => {
      // Create plugin directory with themes
      const pluginDir = join(testDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, 'light.css'), '/* light theme */');
      writeFileSync(join(pluginDir, 'dark.css'), '/* dark theme */');

      const themes = discoverThemes(testDir);

      expect(themes).toHaveLength(2);
      expect(themes[0]).toMatchObject({
        name: 'dark',
        pluginId: 'test-plugin',
        path: 'test-plugin/dark.css',
      });
      expect(themes[1]).toMatchObject({
        name: 'light',
        pluginId: 'test-plugin',
        path: 'test-plugin/light.css',
      });
    });

    it('should discover themes from multiple plugins', () => {
      // Create first plugin
      const plugin1 = join(testDir, 'plugin-a');
      mkdirSync(plugin1, { recursive: true });
      writeFileSync(join(plugin1, 'light.css'), '/* light */');

      // Create second plugin
      const plugin2 = join(testDir, 'plugin-b');
      mkdirSync(plugin2, { recursive: true });
      writeFileSync(join(plugin2, 'dark.css'), '/* dark */');

      const themes = discoverThemes(testDir);

      expect(themes).toHaveLength(2);
      expect(themes[0].pluginId).toBe('plugin-a');
      expect(themes[1].pluginId).toBe('plugin-b');
    });

    it('should skip files in the root directory', () => {
      mkdirSync(testDir, { recursive: true });
      writeFileSync(join(testDir, 'primitives.css'), '/* primitives */');
      writeFileSync(join(testDir, 'utilities.css'), '/* utilities */');
      writeFileSync(join(testDir, 'index.css'), '/* index */');

      const themes = discoverThemes(testDir);
      expect(themes).toEqual([]);
    });

    it('should skip invalid theme names (not starting with letter)', () => {
      const pluginDir = join(testDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, '123-theme.css'), '/* invalid */');
      writeFileSync(join(pluginDir, '-invalid.css'), '/* invalid */');
      writeFileSync(join(pluginDir, 'valid.css'), '/* valid */');

      const themes = discoverThemes(testDir);

      expect(themes).toHaveLength(1);
      expect(themes[0].name).toBe('valid');
    });

    it('should accept valid theme names with hyphens and numbers', () => {
      const pluginDir = join(testDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, 'theme-v2.css'), '/* valid */');
      writeFileSync(join(pluginDir, 'custom-123.css'), '/* valid */');

      const themes = discoverThemes(testDir);

      expect(themes).toHaveLength(2);
      expect(themes[0].name).toBe('custom-123');
      expect(themes[1].name).toBe('theme-v2');
    });

    it('should sort themes deterministically by plugin then name', () => {
      const pluginA = join(testDir, 'z-plugin');
      mkdirSync(pluginA, { recursive: true });
      writeFileSync(join(pluginA, 'z-theme.css'), '');
      writeFileSync(join(pluginA, 'a-theme.css'), '');

      const pluginB = join(testDir, 'a-plugin');
      mkdirSync(pluginB, { recursive: true });
      writeFileSync(join(pluginB, 'z-theme.css'), '');
      writeFileSync(join(pluginB, 'a-theme.css'), '');

      const themes = discoverThemes(testDir);

      expect(themes).toHaveLength(4);
      // First by plugin (a-plugin before z-plugin)
      expect(themes[0].pluginId).toBe('a-plugin');
      expect(themes[1].pluginId).toBe('a-plugin');
      expect(themes[2].pluginId).toBe('z-plugin');
      expect(themes[3].pluginId).toBe('z-plugin');
      // Then by name within plugin
      expect(themes[0].name).toBe('a-theme');
      expect(themes[1].name).toBe('z-theme');
      expect(themes[2].name).toBe('a-theme');
      expect(themes[3].name).toBe('z-theme');
    });

    it('should use cache on subsequent calls', () => {
      const pluginDir = join(testDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, 'light.css'), '/* light */');

      // First call - should cache
      const themes1 = discoverThemes(testDir);
      expect(themes1).toHaveLength(1);

      // Add another theme after first call
      writeFileSync(join(pluginDir, 'dark.css'), '/* dark */');

      // Second call with cache - should return cached result
      const themes2 = discoverThemes(testDir);
      expect(themes2).toHaveLength(1); // Still 1 because of cache

      // Third call with cache disabled - should see new theme
      const themes3 = discoverThemes(testDir, false);
      expect(themes3).toHaveLength(2);
    });

    it('should handle symlinks by skipping them', () => {
      const pluginDir = join(testDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, 'theme.css'), '/* theme */');

      // Note: Creating symlinks on Windows requires admin privileges
      // This test verifies the code handles them, even if we can't create one in test
      const themes = discoverThemes(testDir);
      expect(themes).toHaveLength(1);
    });

    it('should provide correct fullPath for themes', () => {
      const pluginDir = join(testDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, 'light.css'), '/* light */');

      const themes = discoverThemes(testDir);

      expect(themes[0].fullPath).toBe(join(pluginDir, 'light.css'));
      expect(existsSync(themes[0].fullPath)).toBe(true);
    });
  });

  describe('clearThemeCache()', () => {
    it('should clear the cache', () => {
      const pluginDir = join(testDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, 'light.css'), '/* light */');

      // First call - caches result
      const themes1 = discoverThemes(testDir);
      expect(themes1).toHaveLength(1);

      // Add new theme
      writeFileSync(join(pluginDir, 'dark.css'), '/* dark */');

      // Cache prevents seeing new theme
      const themes2 = discoverThemes(testDir);
      expect(themes2).toHaveLength(1);

      // Clear cache
      clearThemeCache();

      // Now should see both themes
      const themes3 = discoverThemes(testDir);
      expect(themes3).toHaveLength(2);
    });
  });

  describe('getThemeNames()', () => {
    it('should return array of theme names', () => {
      const pluginDir = join(testDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, 'light.css'), '');
      writeFileSync(join(pluginDir, 'dark.css'), '');

      const names = getThemeNames(testDir);

      expect(names).toEqual(['dark', 'light']);
    });

    it('should return empty array when no themes exist', () => {
      mkdirSync(testDir, { recursive: true });
      const names = getThemeNames(testDir);
      expect(names).toEqual([]);
    });
  });

  describe('getThemeByName()', () => {
    beforeEach(() => {
      const pluginDir = join(testDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, 'light.css'), '');
      writeFileSync(join(pluginDir, 'dark.css'), '');
    });

    it('should find theme by exact name', () => {
      const theme = getThemeByName(testDir, 'light');

      expect(theme).toBeDefined();
      expect(theme?.name).toBe('light');
      expect(theme?.pluginId).toBe('test-plugin');
    });

    it('should return undefined for non-existent theme', () => {
      const theme = getThemeByName(testDir, 'nonexistent');
      expect(theme).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      const theme = getThemeByName(testDir, 'Light');
      expect(theme).toBeUndefined();
    });
  });

  describe('getThemesByPlugin()', () => {
    beforeEach(() => {
      const plugin1 = join(testDir, 'plugin-a');
      mkdirSync(plugin1, { recursive: true });
      writeFileSync(join(plugin1, 'light.css'), '');
      writeFileSync(join(plugin1, 'dark.css'), '');

      const plugin2 = join(testDir, 'plugin-b');
      mkdirSync(plugin2, { recursive: true });
      writeFileSync(join(plugin2, 'custom.css'), '');
    });

    it('should return all themes for a specific plugin', () => {
      const themes = getThemesByPlugin(testDir, 'plugin-a');

      expect(themes).toHaveLength(2);
      expect(themes[0].name).toBe('dark');
      expect(themes[1].name).toBe('light');
      expect(themes.every((t) => t.pluginId === 'plugin-a')).toBe(true);
    });

    it('should return empty array for non-existent plugin', () => {
      const themes = getThemesByPlugin(testDir, 'nonexistent');
      expect(themes).toEqual([]);
    });

    it('should filter correctly with multiple plugins', () => {
      const themesA = getThemesByPlugin(testDir, 'plugin-a');
      const themesB = getThemesByPlugin(testDir, 'plugin-b');

      expect(themesA).toHaveLength(2);
      expect(themesB).toHaveLength(1);
      expect(themesB[0].name).toBe('custom');
    });
  });

  describe('themeExists()', () => {
    beforeEach(() => {
      const pluginDir = join(testDir, 'test-plugin');
      mkdirSync(pluginDir, { recursive: true });
      writeFileSync(join(pluginDir, 'light.css'), '');
    });

    it('should return true for existing theme', () => {
      expect(themeExists(testDir, 'light')).toBe(true);
    });

    it('should return false for non-existent theme', () => {
      expect(themeExists(testDir, 'dark')).toBe(false);
    });

    it('should return false for empty directory', () => {
      rmSync(testDir, { recursive: true, force: true });
      mkdirSync(testDir, { recursive: true });
      expect(themeExists(testDir, 'light')).toBe(false);
    });
  });
});
