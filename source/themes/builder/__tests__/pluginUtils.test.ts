/**
 * Tests for plugin utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  createPlugin,
  validatePlugin,
  createColorRef,
  resolveColorRef,
  serializeColorRef,
  checkPluginDependencies,
  generateColorTypes,
  generateColorRegistryTypes,
  sortPluginsByDependencies,
} from '../pluginUtils.js';
import type { ThemePlugin, ColorDefinition } from '../../core/types.js';

describe('pluginUtils', () => {
  describe('createPlugin', () => {
    it('should return plugin as-is', () => {
      const plugin: ThemePlugin = {
        id: 'test',
        version: '1.0.0',
        register: () => {},
      };

      const result = createPlugin(plugin);
      expect(result).toBe(plugin);
    });

    it('should preserve all plugin properties', () => {
      const plugin: ThemePlugin = {
        id: 'test',
        version: '1.0.0',
        name: 'Test Plugin',
        description: 'A test plugin',
        author: 'Test Author',
        register: () => {},
      };

      const result = createPlugin(plugin);
      expect(result.id).toBe('test');
      expect(result.name).toBe('Test Plugin');
      expect(result.description).toBe('A test plugin');
      expect(result.author).toBe('Test Author');
    });
  });

  describe('validatePlugin', () => {
    it('should pass valid plugin with minimal fields', () => {
      const plugin: ThemePlugin = {
        id: 'test',
        version: '1.0.0',
        register: () => {},
      };

      const errors = validatePlugin(plugin);
      expect(errors).toHaveLength(0);
    });

    it('should reject non-object plugin', () => {
      const errors = validatePlugin(null);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('must be an object');
    });

    it('should reject plugin without id', () => {
      const plugin = {
        version: '1.0.0',
        register: () => {},
      };

      const errors = validatePlugin(plugin);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes('id'))).toBe(true);
    });

    it('should reject plugin with invalid id format', () => {
      const plugin = {
        id: 'Invalid_ID',
        version: '1.0.0',
        register: () => {},
      };

      const errors = validatePlugin(plugin);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes('lowercase'))).toBe(true);
    });

    it('should reject plugin without version', () => {
      const plugin = {
        id: 'test',
        register: () => {},
      };

      const errors = validatePlugin(plugin);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes('version'))).toBe(true);
    });

    it('should reject plugin with invalid semver', () => {
      const plugin = {
        id: 'test',
        version: 'invalid',
        register: () => {},
      };

      const errors = validatePlugin(plugin);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes('semver'))).toBe(true);
    });

    it('should reject plugin without register function', () => {
      const plugin = {
        id: 'test',
        version: '1.0.0',
      };

      const errors = validatePlugin(plugin);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes('register'))).toBe(true);
    });

    it('should accept valid semver with prerelease', () => {
      const plugin: ThemePlugin = {
        id: 'test',
        version: '1.0.0-beta.1',
        register: () => {},
      };

      const errors = validatePlugin(plugin);
      expect(errors).toHaveLength(0);
    });
  });

  describe('createColorRef', () => {
    it('should create color ref with valid inputs', () => {
      const ref = createColorRef('blue', 500);
      expect(ref.colorName).toBe('blue');
      expect(ref.step).toBe(500);
      expect(ref.__colorRef).toBeDefined();
    });

    it('should throw for invalid step', () => {
      expect(() => createColorRef('blue', 123)).toThrow('Invalid color step');
    });

    it('should throw for empty color name', () => {
      expect(() => createColorRef('', 500)).toThrow(
        'Color name must be a non-empty string'
      );
    });

    it('should accept all valid steps', () => {
      const validSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
      validSteps.forEach((step) => {
        const ref = createColorRef('test', step);
        expect(ref.step).toBe(step);
      });
    });
  });

  describe('resolveColorRef', () => {
    it('should parse valid color ref string', () => {
      const result = resolveColorRef('blue.500');
      expect(result).toEqual({ colorName: 'blue', step: 500 });
    });

    it('should parse camelCase color names', () => {
      const result = resolveColorRef('oceanBlue.700');
      expect(result).toEqual({ colorName: 'oceanBlue', step: 700 });
    });

    it('should return null for invalid format (no dot)', () => {
      const result = resolveColorRef('blue500');
      expect(result).toBeNull();
    });

    it('should return null for invalid step', () => {
      const result = resolveColorRef('blue.123');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = resolveColorRef('');
      expect(result).toBeNull();
    });

    it('should handle all valid steps', () => {
      const validSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
      validSteps.forEach((step) => {
        const result = resolveColorRef(`test.${step}`);
        expect(result).toEqual({ colorName: 'test', step });
      });
    });
  });

  describe('serializeColorRef', () => {
    it('should serialize color ref to string', () => {
      const ref = createColorRef('blue', 500);
      const result = serializeColorRef(ref);
      expect(result).toBe('blue.500');
    });

    it('should handle different color names', () => {
      const ref = createColorRef('oceanBlue', 700);
      const result = serializeColorRef(ref);
      expect(result).toBe('oceanBlue.700');
    });
  });

  describe('checkPluginDependencies', () => {
    it('should return no errors when all dependencies are met', () => {
      const plugin: ThemePlugin = {
        id: 'test',
        version: '1.0.0',
        dependencies: [{ id: 'dep1', version: '1.0.0' }],
        register: () => {},
      };

      const available = new Map([['dep1', '1.0.0']]);
      const errors = checkPluginDependencies(plugin, available);
      expect(errors).toHaveLength(0);
    });

    it('should error when required dependency is missing', () => {
      const plugin: ThemePlugin = {
        id: 'test',
        version: '1.0.0',
        dependencies: [{ id: 'missing' }],
        register: () => {},
      };

      const available = new Map();
      const errors = checkPluginDependencies(plugin, available);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('dependency_missing');
      expect(errors[0].message).toContain('missing');
    });

    it('should skip optional dependencies', () => {
      const plugin: ThemePlugin = {
        id: 'test',
        version: '1.0.0',
        dependencies: [{ id: 'optional', optional: true }],
        register: () => {},
      };

      const available = new Map();
      const errors = checkPluginDependencies(plugin, available);
      expect(errors).toHaveLength(0);
    });

    it('should accept compatible caret version', () => {
      const plugin: ThemePlugin = {
        id: 'test',
        version: '1.0.0',
        dependencies: [{ id: 'dep1', version: '^1.0.0' }],
        register: () => {},
      };

      const available = new Map([['dep1', '1.2.3']]);
      const errors = checkPluginDependencies(plugin, available);
      expect(errors).toHaveLength(0);
    });
  });

  describe('generateColorTypes', () => {
    it('should generate TypeScript declarations for color scale', () => {
      const definition: ColorDefinition = {
        source: { l: 0.5, c: 0.15, h: 220 },
        scale: [500, 700, 900],
      };

      const result = generateColorTypes('blue', definition);
      expect(result).toContain('blue500: ColorRef;');
      expect(result).toContain('blue700: ColorRef;');
      expect(result).toContain('blue900: ColorRef;');
    });

    it('should handle full scale', () => {
      const definition: ColorDefinition = {
        source: { l: 0.5, c: 0.15, h: 220 },
        scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      };

      const result = generateColorTypes('gray', definition);
      expect(result.split('\n')).toHaveLength(11);
    });
  });

  describe('generateColorRegistryTypes', () => {
    it('should generate interface from multiple colors', () => {
      const colors = new Map<string, ColorDefinition>([
        [
          'blue',
          {
            source: { l: 0.5, c: 0.15, h: 220 },
            scale: [500, 700],
          },
        ],
        [
          'gray',
          {
            source: { l: 0.5, c: 0.01, h: 0 },
            scale: [50, 950],
          },
        ],
      ]);

      const result = generateColorRegistryTypes(colors);
      expect(result).toContain('interface ColorRegistry');
      expect(result).toContain('blue500: ColorRef;');
      expect(result).toContain('blue700: ColorRef;');
      expect(result).toContain('gray50: ColorRef;');
      expect(result).toContain('gray950: ColorRef;');
    });
  });

  describe('sortPluginsByDependencies', () => {
    it('should sort plugins with no dependencies', () => {
      const plugins: ThemePlugin[] = [
        { id: 'a', version: '1.0.0', register: () => {} },
        { id: 'b', version: '1.0.0', register: () => {} },
        { id: 'c', version: '1.0.0', register: () => {} },
      ];

      const sorted = sortPluginsByDependencies(plugins);
      expect(sorted).toHaveLength(3);
      expect(sorted.map((p) => p.id)).toEqual(['a', 'b', 'c']);
    });

    it('should sort plugins in dependency order', () => {
      const pluginA: ThemePlugin = {
        id: 'a',
        version: '1.0.0',
        register: () => {},
      };
      const pluginB: ThemePlugin = {
        id: 'b',
        version: '1.0.0',
        dependencies: [{ id: 'a' }],
        register: () => {},
      };
      const pluginC: ThemePlugin = {
        id: 'c',
        version: '1.0.0',
        dependencies: [{ id: 'b' }],
        register: () => {},
      };

      const sorted = sortPluginsByDependencies([pluginC, pluginA, pluginB]);
      expect(sorted.map((p) => p.id)).toEqual(['a', 'b', 'c']);
    });

    it('should throw error for circular dependencies', () => {
      const pluginA: ThemePlugin = {
        id: 'a',
        version: '1.0.0',
        dependencies: [{ id: 'b' }],
        register: () => {},
      };
      const pluginB: ThemePlugin = {
        id: 'b',
        version: '1.0.0',
        dependencies: [{ id: 'a' }],
        register: () => {},
      };

      expect(() => sortPluginsByDependencies([pluginA, pluginB])).toThrow(
        'Circular dependency'
      );
    });

    it('should handle complex dependency graph', () => {
      const plugins: ThemePlugin[] = [
        {
          id: 'e',
          version: '1.0.0',
          dependencies: [{ id: 'd' }],
          register: () => {},
        },
        { id: 'a', version: '1.0.0', register: () => {} },
        {
          id: 'd',
          version: '1.0.0',
          dependencies: [{ id: 'b' }],
          register: () => {},
        },
        {
          id: 'b',
          version: '1.0.0',
          dependencies: [{ id: 'a' }],
          register: () => {},
        },
        {
          id: 'c',
          version: '1.0.0',
          dependencies: [{ id: 'a' }],
          register: () => {},
        },
      ];

      const sorted = sortPluginsByDependencies(plugins);
      const ids = sorted.map((p) => p.id);

      // Verify a is first (no dependencies)
      expect(ids[0]).toBe('a');
      // Verify b and c come after a
      expect(ids.indexOf('b')).toBeGreaterThan(ids.indexOf('a'));
      expect(ids.indexOf('c')).toBeGreaterThan(ids.indexOf('a'));
      // Verify d comes after b
      expect(ids.indexOf('d')).toBeGreaterThan(ids.indexOf('b'));
      // Verify e comes after d
      expect(ids.indexOf('e')).toBeGreaterThan(ids.indexOf('d'));
    });
  });
});
