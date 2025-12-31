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
} from '../../theme/discoverThemes.js';

describe('discoverThemes', () => {
  const testDir = join(process.cwd(), 'test-themes-temp');
  const testPluginsDir = join(testDir, 'plugins');
  const testGeneratedDir = join(testDir, 'generated');
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Clean up any existing test directories
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    if (existsSync(testPluginsDir)) {
      rmSync(testPluginsDir, { recursive: true, force: true });
    }

    // Clear cache before each test
    clearThemeCache();
    // Spy on console.warn to suppress expected warnings in tests
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up test directories after each test
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    if (existsSync(testPluginsDir)) {
      rmSync(testPluginsDir, { recursive: true, force: true });
    }

    // Clear cache after each test
    clearThemeCache();
    // Restore console.warn
    consoleWarnSpy.mockRestore();
  });

  /**
   * Helper to create a mock plugin with variants
   */
  function createMockPlugin(
    pluginId: string,
    variants: string[],
    pluginsDir = testPluginsDir
  ) {
    const pluginDir = join(pluginsDir, pluginId);
    mkdirSync(pluginDir, { recursive: true });

    const variantCalls = variants
      .map((v) => `  builder.addThemeVariant('${v}', {});`)
      .join('\n');

    const pluginContent = `
import { ThemeBase } from '../../builder/ThemeBase.js';
import type { ThemeBuilderInterface } from '../../core/types.js';

export class TestTheme extends ThemeBase {
  readonly id = '${pluginId}';
  readonly version = '1.0.0';
  readonly name = 'Test Theme';
  readonly description = 'Test theme for unit tests';
  readonly author = 'Test';
  readonly license = 'MIT';
  readonly tags = ['test'];

  register(builder: ThemeBuilderInterface): void {
${variantCalls}
  }
}

export const testTheme = new TestTheme();
export default testTheme;
`;

    writeFileSync(join(pluginDir, 'index.ts'), pluginContent);
  }

  describe('discoverThemes()', () => {
    it('should return empty array when plugins directory does not exist', () => {
      // Use a path where plugins directory won't exist
      const themes = discoverThemes('/nonexistent/path/generated');
      expect(themes).toEqual([]);
    });

    it('should return empty array when no plugins exist', () => {
      mkdirSync(testPluginsDir, { recursive: true });
      mkdirSync(testGeneratedDir, { recursive: true });
      const themes = discoverThemes(testGeneratedDir);
      expect(themes).toEqual([]);
    });

    it('should discover themes from a single plugin', () => {
      createMockPlugin('test-plugin', ['light', 'dark']);

      const themes = discoverThemes(testGeneratedDir);

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
      createMockPlugin('plugin-a', ['light']);
      createMockPlugin('plugin-b', ['dark']);

      const themes = discoverThemes(testGeneratedDir);

      expect(themes).toHaveLength(2);
      expect(themes[0].pluginId).toBe('plugin-a');
      expect(themes[1].pluginId).toBe('plugin-b');
    });

    it('should skip plugins without index.ts', () => {
      mkdirSync(testPluginsDir, { recursive: true });
      mkdirSync(join(testPluginsDir, 'incomplete-plugin'), { recursive: true });

      createMockPlugin('valid-plugin', ['light']);

      const themes = discoverThemes(testGeneratedDir);
      expect(themes).toHaveLength(1);
      expect(themes[0].pluginId).toBe('valid-plugin');
    });

    it('should skip plugins without plugin ID', () => {
      mkdirSync(testPluginsDir, { recursive: true });
      const pluginDir = join(testPluginsDir, 'no-id-plugin');
      mkdirSync(pluginDir, { recursive: true });

      // Plugin without id field
      const pluginContent = `
export class TestTheme {
  register(builder) {
    builder.addThemeVariant('light', {});
  }
}
`;
      writeFileSync(join(pluginDir, 'index.ts'), pluginContent);

      createMockPlugin('valid-plugin', ['light']);

      const themes = discoverThemes(testGeneratedDir);
      expect(themes).toHaveLength(1);
      expect(themes[0].pluginId).toBe('valid-plugin');
    });

    it('should skip plugins with no theme variants', () => {
      createMockPlugin('plugin-with-variants', ['light', 'dark']);
      createMockPlugin('plugin-without-variants', []);

      const themes = discoverThemes(testGeneratedDir);
      expect(themes).toHaveLength(2);
      expect(themes.every((t) => t.pluginId === 'plugin-with-variants')).toBe(
        true
      );
    });

    it('should sort themes deterministically by plugin then name', () => {
      createMockPlugin('z-plugin', ['z-theme', 'a-theme']);
      createMockPlugin('a-plugin', ['z-theme', 'a-theme']);

      const themes = discoverThemes(testGeneratedDir);

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
      createMockPlugin('test-plugin', ['light']);

      // First call - should cache
      const themes1 = discoverThemes(testGeneratedDir);
      expect(themes1).toHaveLength(1);

      // Add another plugin after first call
      createMockPlugin('another-plugin', ['dark']);

      // Second call with cache - should return cached result
      const themes2 = discoverThemes(testGeneratedDir);
      expect(themes2).toHaveLength(1); // Still 1 because of cache

      // Third call with cache disabled - should see new plugin
      const themes3 = discoverThemes(testGeneratedDir, false);
      expect(themes3).toHaveLength(2);
    });

    it('should skip special directories (starting with . or _)', () => {
      createMockPlugin('valid-plugin', ['light']);
      createMockPlugin('.hidden-plugin', ['dark']);
      createMockPlugin('_internal-plugin', ['custom']);

      const themes = discoverThemes(testGeneratedDir);
      expect(themes).toHaveLength(1);
      expect(themes[0].pluginId).toBe('valid-plugin');
    });

    it('should provide correct fullPath for themes', () => {
      createMockPlugin('test-plugin', ['light']);

      const themes = discoverThemes(testGeneratedDir);

      expect(themes[0].fullPath).toBe(
        join(testGeneratedDir, 'test-plugin', 'light.css')
      );
      expect(themes[0].path).toBe('test-plugin/light.css');
    });
  });

  describe('clearThemeCache()', () => {
    it('should clear the cache', () => {
      createMockPlugin('test-plugin', ['light']);

      // First call - caches result
      const themes1 = discoverThemes(testGeneratedDir);
      expect(themes1).toHaveLength(1);

      // Add new plugin
      createMockPlugin('another-plugin', ['dark']);

      // Cache prevents seeing new plugin
      const themes2 = discoverThemes(testGeneratedDir);
      expect(themes2).toHaveLength(1);

      // Clear cache
      clearThemeCache();

      // Now should see both plugins
      const themes3 = discoverThemes(testGeneratedDir);
      expect(themes3).toHaveLength(2);
    });
  });

  describe('getThemeNames()', () => {
    it('should return array of theme names', () => {
      createMockPlugin('test-plugin', ['light', 'dark']);

      const names = getThemeNames(testGeneratedDir);

      expect(names).toEqual(['dark', 'light']);
    });

    it('should return empty array when no themes exist', () => {
      mkdirSync(testPluginsDir, { recursive: true });
      mkdirSync(testGeneratedDir, { recursive: true });
      const names = getThemeNames(testGeneratedDir);
      expect(names).toEqual([]);
    });
  });

  describe('getThemeByName()', () => {
    beforeEach(() => {
      createMockPlugin('test-plugin', ['light', 'dark']);
    });

    it('should find theme by exact name', () => {
      const theme = getThemeByName(testGeneratedDir, 'light');

      expect(theme).toBeDefined();
      expect(theme?.name).toBe('light');
      expect(theme?.pluginId).toBe('test-plugin');
    });

    it('should return undefined for non-existent theme', () => {
      const theme = getThemeByName(testGeneratedDir, 'nonexistent');
      expect(theme).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      const theme = getThemeByName(testGeneratedDir, 'Light');
      expect(theme).toBeUndefined();
    });
  });

  describe('getThemesByPlugin()', () => {
    beforeEach(() => {
      createMockPlugin('plugin-a', ['light', 'dark']);
      createMockPlugin('plugin-b', ['custom']);
    });

    it('should return all themes for a specific plugin', () => {
      const themes = getThemesByPlugin(testGeneratedDir, 'plugin-a');

      expect(themes).toHaveLength(2);
      expect(themes[0].name).toBe('dark');
      expect(themes[1].name).toBe('light');
      expect(themes.every((t) => t.pluginId === 'plugin-a')).toBe(true);
    });

    it('should return empty array for non-existent plugin', () => {
      const themes = getThemesByPlugin(testGeneratedDir, 'nonexistent');
      expect(themes).toEqual([]);
    });

    it('should filter correctly with multiple plugins', () => {
      const themesA = getThemesByPlugin(testGeneratedDir, 'plugin-a');
      const themesB = getThemesByPlugin(testGeneratedDir, 'plugin-b');

      expect(themesA).toHaveLength(2);
      expect(themesB).toHaveLength(1);
      expect(themesB[0].name).toBe('custom');
    });
  });

  describe('themeExists()', () => {
    beforeEach(() => {
      createMockPlugin('test-plugin', ['light']);
    });

    it('should return true for existing theme', () => {
      expect(themeExists(testGeneratedDir, 'light')).toBe(true);
    });

    it('should return false for non-existent theme', () => {
      expect(themeExists(testGeneratedDir, 'dark')).toBe(false);
    });

    it('should return false when no plugins exist', () => {
      rmSync(testPluginsDir, { recursive: true, force: true });
      mkdirSync(testPluginsDir, { recursive: true });
      clearThemeCache();
      expect(themeExists(testGeneratedDir, 'light')).toBe(false);
    });
  });
});
