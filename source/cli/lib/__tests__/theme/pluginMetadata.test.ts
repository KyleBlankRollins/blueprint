import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  pluginExists,
  getPluginPath,
  readPluginMetadata,
  parsePluginMetadata,
  validatePluginMetadata,
  listPlugins,
  type PluginMetadata,
} from '../../theme/pluginMetadata.js';

describe('pluginMetadata', () => {
  let testDir: string;
  let pluginsDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    // Save original working directory
    originalCwd = process.cwd();

    // Create temporary test directory
    testDir = join(tmpdir(), `blueprint-test-${Date.now()}`);
    pluginsDir = join(testDir, 'source/themes/plugins');
    await mkdir(pluginsDir, { recursive: true });

    // Change to test directory
    process.chdir(testDir);
  });

  afterEach(async () => {
    // Restore original working directory
    process.chdir(originalCwd);

    // Clean up test directory
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('getPluginPath', () => {
    it('should return correct path for valid plugin ID', () => {
      const path = getPluginPath('ocean');
      expect(path).toMatch(/source.themes.plugins.ocean/);
    });

    it('should return correct path for multi-word plugin ID', () => {
      const path = getPluginPath('blueprint-core');
      expect(path).toMatch(/source.themes.plugins.blueprint-core/);
    });

    it('should throw error for empty plugin ID', () => {
      expect(() => getPluginPath('')).toThrow(
        'Invalid plugin ID: "" - must be kebab-case'
      );
    });

    it('should throw error for invalid plugin ID with uppercase', () => {
      expect(() => getPluginPath('Ocean')).toThrow(
        'Invalid plugin ID: "Ocean" - must be kebab-case'
      );
    });

    it('should throw error for invalid plugin ID with spaces', () => {
      expect(() => getPluginPath('ocean theme')).toThrow(
        'Invalid plugin ID: "ocean theme" - must be kebab-case'
      );
    });

    it('should throw error for invalid plugin ID with underscores', () => {
      expect(() => getPluginPath('ocean_theme')).toThrow(
        'Invalid plugin ID: "ocean_theme" - must be kebab-case'
      );
    });

    it('should throw error for path traversal attempt', () => {
      expect(() => getPluginPath('../../../etc/passwd')).toThrow(
        'Invalid plugin ID'
      );
    });
  });

  describe('pluginExists', () => {
    it('should return true when plugin directory exists', async () => {
      await mkdir(join(pluginsDir, 'ocean'), { recursive: true });
      const exists = await pluginExists('ocean');
      expect(exists).toBe(true);
    });

    it('should return false when plugin directory does not exist', async () => {
      const exists = await pluginExists('nonexistent');
      expect(exists).toBe(false);
    });
  });

  describe('readPluginMetadata', () => {
    it('should read and parse valid plugin metadata', async () => {
      const oceanDir = join(pluginsDir, 'ocean');
      await mkdir(oceanDir, { recursive: true });

      const pluginContent = `
        export class OceanTheme {
          readonly id = 'ocean';
          readonly version = '1.0.0';
          readonly name = 'Ocean Theme';
          readonly description = 'A blue ocean theme';
          readonly author = 'John Doe';
          readonly license = 'MIT';
          readonly tags = ['blue', 'ocean'];
          readonly dependencies = [];
        }
      `;

      await writeFile(join(oceanDir, 'index.ts'), pluginContent);

      const metadata = await readPluginMetadata('ocean');

      expect(metadata.id).toBe('ocean');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.name).toBe('Ocean Theme');
      expect(metadata.description).toBe('A blue ocean theme');
      expect(metadata.author).toBe('John Doe');
      expect(metadata.license).toBe('MIT');
      expect(metadata.tags).toEqual(['blue', 'ocean']);
      expect(metadata.dependencies).toEqual([]);
    });

    it('should throw error when plugin directory does not exist', async () => {
      await expect(readPluginMetadata('nonexistent')).rejects.toThrow(
        'Plugin not found: nonexistent'
      );
    });

    it('should throw error when index.ts does not exist', async () => {
      await mkdir(join(pluginsDir, 'empty'), { recursive: true });
      await expect(readPluginMetadata('empty')).rejects.toThrow(
        'Plugin file not found'
      );
    });

    it('should throw error for invalid plugin ID', async () => {
      await expect(readPluginMetadata('')).rejects.toThrow('Invalid plugin ID');
    });
  });

  describe('parsePluginMetadata', () => {
    it('should parse class-based plugin metadata', () => {
      const content = `
        export class TestTheme {
          readonly id = 'test-theme';
          readonly version = '2.1.0';
          readonly name = 'Test Theme';
          readonly description = 'A test theme';
          readonly author = 'Jane Smith';
          readonly license = 'Apache-2.0';
          readonly homepage = 'https://example.com';
          readonly repository = 'https://github.com/example/test';
          readonly tags = ['test', 'example'];
          readonly dependencies = [];
        }
      `;

      const metadata = parsePluginMetadata(content);

      expect(metadata.id).toBe('test-theme');
      expect(metadata.version).toBe('2.1.0');
      expect(metadata.name).toBe('Test Theme');
      expect(metadata.description).toBe('A test theme');
      expect(metadata.author).toBe('Jane Smith');
      expect(metadata.license).toBe('Apache-2.0');
      expect(metadata.homepage).toBe('https://example.com');
      expect(metadata.repository).toBe('https://github.com/example/test');
      expect(metadata.tags).toEqual(['test', 'example']);
      expect(metadata.dependencies).toEqual([]);
    });

    it('should parse object-based plugin metadata', () => {
      const content = `
        export const testTheme = {
          id: 'test-theme',
          version: '1.5.2',
          name: 'Test Theme',
          description: 'Object-based theme',
          tags: ['test', 'object'],
          dependencies: []
        };
      `;

      const metadata = parsePluginMetadata(content);

      expect(metadata.id).toBe('test-theme');
      expect(metadata.version).toBe('1.5.2');
      expect(metadata.name).toBe('Test Theme');
      expect(metadata.description).toBe('Object-based theme');
      expect(metadata.tags).toEqual(['test', 'object']);
      expect(metadata.dependencies).toEqual([]);
    });

    it('should parse plugin with dependencies', () => {
      const content = `
        export class ForestTheme {
          readonly id = 'forest';
          readonly version = '1.0.0';
          readonly dependencies = [
            { id: 'blueprint-core' },
            { id: 'color-utils' }
          ];
        }
      `;

      const metadata = parsePluginMetadata(content);

      expect(metadata.id).toBe('forest');
      expect(metadata.dependencies).toEqual(['blueprint-core', 'color-utils']);
    });

    it('should handle missing optional fields', () => {
      const content = `
        export class MinimalTheme {
          readonly id = 'minimal';
          readonly version = '1.0.0';
        }
      `;

      const metadata = parsePluginMetadata(content);

      expect(metadata.id).toBe('minimal');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.name).toBeUndefined();
      expect(metadata.description).toBeUndefined();
      expect(metadata.author).toBeUndefined();
      expect(metadata.license).toBeUndefined();
      expect(metadata.homepage).toBeUndefined();
      expect(metadata.repository).toBeUndefined();
      expect(metadata.tags).toEqual([]);
      expect(metadata.dependencies).toEqual([]);
    });

    it('should handle empty arrays', () => {
      const content = `
        export class EmptyTheme {
          readonly id = 'empty';
          readonly version = '1.0.0';
          readonly tags = [];
          readonly dependencies = [];
        }
      `;

      const metadata = parsePluginMetadata(content);

      expect(metadata.tags).toEqual([]);
      expect(metadata.dependencies).toEqual([]);
    });

    it('should handle single quotes, double quotes, and backticks', () => {
      const content = `
        export class QuoteTheme {
          readonly id = "double-quotes";
          readonly version = '1.0.0';
          readonly name = \`Backtick Name\`;
        }
      `;

      const metadata = parsePluginMetadata(content);

      expect(metadata.id).toBe('double-quotes');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.name).toBe('Backtick Name');
    });

    it('should handle tags with various quote styles', () => {
      const content = `
        export class TagTheme {
          readonly id = 'tag-test';
          readonly version = '1.0.0';
          readonly tags = ["double", 'single', 'template'];
        }
      `;

      const metadata = parsePluginMetadata(content);

      expect(metadata.tags).toEqual(['double', 'single', 'template']);
    });

    it('should return empty strings for missing required fields', () => {
      const content = `
        export class IncompleteTheme {
          readonly name = 'Incomplete';
        }
      `;

      const metadata = parsePluginMetadata(content);

      expect(metadata.id).toBe('');
      expect(metadata.version).toBe('');
      expect(metadata.name).toBe('Incomplete');
    });
  });

  describe('validatePluginMetadata', () => {
    it('should return no errors for valid metadata', () => {
      const metadata: PluginMetadata = {
        id: 'ocean',
        version: '1.0.0',
        name: 'Ocean Theme',
        tags: [],
        dependencies: [],
      };

      const errors = validatePluginMetadata(metadata);
      expect(errors).toEqual([]);
    });

    it('should return error for missing id', () => {
      const metadata: PluginMetadata = {
        id: '',
        version: '1.0.0',
        tags: [],
        dependencies: [],
      };

      const errors = validatePluginMetadata(metadata);
      expect(errors).toContain('Missing required field: id');
    });

    it('should return error for invalid id format (uppercase)', () => {
      const metadata: PluginMetadata = {
        id: 'OceanTheme',
        version: '1.0.0',
        tags: [],
        dependencies: [],
      };

      const errors = validatePluginMetadata(metadata);
      expect(errors[0]).toContain('Invalid plugin ID');
      expect(errors[0]).toContain('kebab-case');
    });

    it('should return error for invalid id format (spaces)', () => {
      const metadata: PluginMetadata = {
        id: 'ocean theme',
        version: '1.0.0',
        tags: [],
        dependencies: [],
      };

      const errors = validatePluginMetadata(metadata);
      expect(errors[0]).toContain('Invalid plugin ID');
      expect(errors[0]).toContain('kebab-case');
    });

    it('should return error for invalid id format (underscores)', () => {
      const metadata: PluginMetadata = {
        id: 'ocean_theme',
        version: '1.0.0',
        tags: [],
        dependencies: [],
      };

      const errors = validatePluginMetadata(metadata);
      expect(errors[0]).toContain('Invalid plugin ID');
      expect(errors[0]).toContain('kebab-case');
    });

    it('should return error for missing version', () => {
      const metadata: PluginMetadata = {
        id: 'ocean',
        version: '',
        tags: [],
        dependencies: [],
      };

      const errors = validatePluginMetadata(metadata);
      expect(errors).toContain('Missing required field: version');
    });

    it('should return error for invalid semver format', () => {
      const metadata: PluginMetadata = {
        id: 'ocean',
        version: 'v1.0',
        tags: [],
        dependencies: [],
      };

      const errors = validatePluginMetadata(metadata);
      expect(errors).toContain(
        'Invalid version: "v1.0" - should follow semver (e.g., 1.0.0)'
      );
    });

    it('should return error for invalid semver with extra suffix', () => {
      const metadata: PluginMetadata = {
        id: 'ocean',
        version: '1.0.0-beta',
        tags: [],
        dependencies: [],
      };

      const errors = validatePluginMetadata(metadata);
      expect(errors[0]).toContain('Invalid version');
      expect(errors[0]).toContain('semver');
    });

    it('should return multiple errors for multiple issues', () => {
      const metadata: PluginMetadata = {
        id: 'Invalid_ID',
        version: 'not-semver',
        tags: [],
        dependencies: [],
      };

      const errors = validatePluginMetadata(metadata);
      expect(errors).toHaveLength(2);
      expect(errors[0]).toContain('Invalid plugin ID');
      expect(errors[1]).toContain('Invalid version');
    });

    it('should accept valid kebab-case IDs', () => {
      const validIds = [
        'ocean',
        'blueprint-core',
        'multi-word-theme',
        'theme123',
        'a',
      ];

      validIds.forEach((id) => {
        const metadata: PluginMetadata = {
          id,
          version: '1.0.0',
          tags: [],
          dependencies: [],
        };

        const errors = validatePluginMetadata(metadata);
        expect(errors).toEqual([]);
      });
    });

    it('should accept valid semver versions', () => {
      const validVersions = ['1.0.0', '0.0.1', '999.999.999', '1.2.3'];

      validVersions.forEach((version) => {
        const metadata: PluginMetadata = {
          id: 'test',
          version,
          tags: [],
          dependencies: [],
        };

        const errors = validatePluginMetadata(metadata);
        expect(errors).toEqual([]);
      });
    });
  });

  describe('listPlugins', () => {
    it('should return list of plugin directories', async () => {
      await mkdir(join(pluginsDir, 'ocean'), { recursive: true });
      await mkdir(join(pluginsDir, 'forest'), { recursive: true });
      await mkdir(join(pluginsDir, 'blueprint-core'), { recursive: true });
      await writeFile(join(pluginsDir, 'README.md'), '# Plugins');

      const plugins = await listPlugins();

      expect(plugins).toContain('ocean');
      expect(plugins).toContain('forest');
      expect(plugins).toContain('blueprint-core');
      expect(plugins).not.toContain('README.md');
    });

    it('should return empty array when plugins directory does not exist', async () => {
      // Remove plugins directory
      await rm(pluginsDir, { recursive: true, force: true });

      const plugins = await listPlugins();
      expect(plugins).toEqual([]);
    });

    it('should handle empty plugins directory', async () => {
      const plugins = await listPlugins();
      expect(plugins).toEqual([]);
    });

    it('should filter out non-directory entries', async () => {
      await mkdir(join(pluginsDir, 'ocean'), { recursive: true });
      await mkdir(join(pluginsDir, 'forest'), { recursive: true });
      await writeFile(join(pluginsDir, 'theme.css'), '');
      await writeFile(join(pluginsDir, 'config.json'), '{}');

      const plugins = await listPlugins();

      expect(plugins).toContain('ocean');
      expect(plugins).toContain('forest');
      expect(plugins).not.toContain('theme.css');
      expect(plugins).not.toContain('config.json');
    });

    it('should handle mixed content in plugins directory', async () => {
      await mkdir(join(pluginsDir, 'ocean'), { recursive: true });
      await mkdir(join(pluginsDir, '.git'), { recursive: true });
      await mkdir(join(pluginsDir, 'node_modules'), { recursive: true });
      await mkdir(join(pluginsDir, 'forest'), { recursive: true });
      await mkdir(join(pluginsDir, 'blueprint-core'), { recursive: true });
      await writeFile(join(pluginsDir, '.DS_Store'), '');

      const plugins = await listPlugins();

      expect(plugins).toContain('ocean');
      expect(plugins).toContain('forest');
      expect(plugins).toContain('blueprint-core');
      expect(plugins).not.toContain('.DS_Store');
    });
  });
});
