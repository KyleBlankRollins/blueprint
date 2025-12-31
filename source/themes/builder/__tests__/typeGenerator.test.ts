/**
 * Tests for type generation utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateColorTypes,
  generateColorScaleType,
  generateColorRegistryType,
  generateThemeVariantTypes,
  generateCompleteTypes,
  type TypeGenerationConfig,
} from '../typeGenerator.js';
import type { ColorDefinition } from '../../core/types.js';

describe('typeGenerator', () => {
  describe('generateColorScaleType', () => {
    it('should generate a color scale interface', () => {
      const result = generateColorScaleType('blue', [50, 500, 950]);

      expect(result).toContain('export interface BlueColorScale {');
      expect(result).toContain('blue50: ColorRef;');
      expect(result).toContain('blue500: ColorRef;');
      expect(result).toContain('blue950: ColorRef;');
    });

    it('should handle single-word color names', () => {
      const result = generateColorScaleType('gray', [500]);

      expect(result).toContain('export interface GrayColorScale {');
      expect(result).toContain('gray500: ColorRef;');
    });

    it('should handle kebab-case color names', () => {
      const result = generateColorScaleType('ocean-blue', [500]);

      expect(result).toContain('export interface OceanBlueColorScale {');
      expect(result).toContain('ocean-blue500: ColorRef;');
    });
  });

  describe('generateColorRegistryType', () => {
    it('should generate ColorRegistry type from color names', () => {
      const result = generateColorRegistryType(['gray', 'blue', 'red']);

      expect(result).toBe(
        'export type ColorRegistry = GrayColorScale & BlueColorScale & RedColorScale;'
      );
    });

    it('should handle single color', () => {
      const result = generateColorRegistryType(['blue']);

      expect(result).toBe('export type ColorRegistry = BlueColorScale;');
    });

    it('should handle empty array', () => {
      const result = generateColorRegistryType([]);

      expect(result).toBe('export type ColorRegistry = Record<never, never>;');
    });
  });

  describe('generateColorTypes', () => {
    let colors: Map<string, ColorDefinition>;
    let config: TypeGenerationConfig;

    beforeEach(() => {
      colors = new Map([
        [
          'gray',
          {
            source: { l: 0.5, c: 0.0, h: 0 },
            scale: [50, 100, 500, 900, 950],
            metadata: {
              name: 'Gray',
              description: 'Neutral gray scale',
            },
          },
        ],
        [
          'blue',
          {
            source: { l: 0.5, c: 0.15, h: 220 },
            scale: [50, 500, 950],
          },
        ],
      ]);

      config = {
        outputPath: 'test.d.ts',
        includeJSDoc: true,
      };
    });

    it('should generate complete type declarations', () => {
      const result = generateColorTypes(colors, config);

      // Check file header
      expect(result).toContain('Auto-generated theme color types');
      expect(result).toContain('DO NOT EDIT MANUALLY');

      // Check imports
      expect(result).toContain('import type { ColorRef } from');

      // Check ColorName type
      expect(result).toContain('export type ColorName =');
      expect(result).toContain("| 'blue'");
      expect(result).toContain("| 'gray'");

      // Check ColorScaleStep type
      expect(result).toContain('export type ColorScaleStep =');
      expect(result).toContain('50 | 100 | 200');

      // Check individual color scales
      expect(result).toContain('export interface GrayColorScale {');
      expect(result).toContain('gray50: ColorRef;');
      expect(result).toContain('gray500: ColorRef;');

      expect(result).toContain('export interface BlueColorScale {');
      expect(result).toContain('blue50: ColorRef;');
      expect(result).toContain('blue500: ColorRef;');

      // Check ColorRegistry
      expect(result).toContain('export interface ColorRegistry');
      expect(result).toContain('extends BlueColorScale');
      expect(result).toContain('GrayColorScale');

      // Check ColorRefString
      expect(result).toContain('export type ColorRefString =');
      expect(result).toContain('`${ColorName}.${ColorScaleStep}`');

      // Check module augmentation
      expect(result).toContain("declare module '../builder/ThemeBuilder.js'");
      expect(result).toContain('readonly colors: ColorRegistry;');
    });

    it('should include JSDoc comments when configured', () => {
      const result = generateColorTypes(colors, {
        ...config,
        includeJSDoc: true,
      });

      expect(result).toContain('/**');
      expect(result).toContain('* Available color names');
      expect(result).toContain('* Neutral gray scale');
    });

    it('should exclude optional JSDoc comments when configured', () => {
      const result = generateColorTypes(colors, {
        ...config,
        includeJSDoc: false,
      });

      // File header should always be present
      expect(result).toContain('Auto-generated theme color types');

      // But optional JSDoc like "Available color names" should not
      expect(result).not.toContain('* Available color names');
      expect(result).not.toContain('* Valid color scale steps');
      expect(result).not.toContain('* Color scale for gray');
    });

    it('should use custom module name for imports', () => {
      const result = generateColorTypes(colors, {
        ...config,
        moduleName: '@blueprint/themes',
      });

      expect(result).toContain(
        "import type { ColorRef } from '@blueprint/themes'"
      );
    });

    it('should handle color metadata descriptions', () => {
      const result = generateColorTypes(colors, config);

      expect(result).toContain('Neutral gray scale');
    });

    it('should sort colors alphabetically', () => {
      const unsortedColors = new Map([
        ['zebra', { source: { l: 0.5, c: 0, h: 0 }, scale: [500] }],
        ['alpha', { source: { l: 0.5, c: 0, h: 0 }, scale: [500] }],
        ['middle', { source: { l: 0.5, c: 0, h: 0 }, scale: [500] }],
      ]);

      const result = generateColorTypes(unsortedColors, config);

      // Color names should appear in alphabetical order
      const alphaPos = result.indexOf("'alpha'");
      const middlePos = result.indexOf("'middle'");
      const zebraPos = result.indexOf("'zebra'");

      expect(alphaPos).toBeLessThan(middlePos);
      expect(middlePos).toBeLessThan(zebraPos);
    });

    // Validation tests
    it('should throw error when no colors are registered', () => {
      const emptyColors = new Map<string, ColorDefinition>();

      expect(() => generateColorTypes(emptyColors, config)).toThrow(
        'Cannot generate types: no colors registered'
      );
    });

    it('should throw error for invalid color names', () => {
      const invalidColors = new Map([
        ['123invalid', { source: { l: 0.5, c: 0, h: 0 }, scale: [500] }],
      ]);

      expect(() => generateColorTypes(invalidColors, config)).toThrow(
        /Invalid color name.*must start with lowercase letter/
      );
    });

    it('should throw error for color names with special characters', () => {
      const invalidColors = new Map([
        ['invalid@color', { source: { l: 0.5, c: 0, h: 0 }, scale: [500] }],
      ]);

      expect(() => generateColorTypes(invalidColors, config)).toThrow(
        /Invalid color name/
      );
    });

    it('should throw error for colors without scale steps', () => {
      const invalidColors = new Map([
        ['blue', { source: { l: 0.5, c: 0.15, h: 220 }, scale: [] }],
      ]);

      expect(() => generateColorTypes(invalidColors, config)).toThrow(
        'Color "blue" has no scale steps'
      );
    });

    it('should accept valid color names with hyphens', () => {
      const validColors = new Map([
        ['ocean-blue', { source: { l: 0.5, c: 0.15, h: 220 }, scale: [500] }],
      ]);

      expect(() => generateColorTypes(validColors, config)).not.toThrow();
    });

    it('should accept valid color names with numbers', () => {
      const validColors = new Map([
        ['blue2', { source: { l: 0.5, c: 0.15, h: 220 }, scale: [500] }],
      ]);

      expect(() => generateColorTypes(validColors, config)).not.toThrow();
    });
  });

  describe('generateThemeVariantTypes', () => {
    it('should generate theme variant name union', () => {
      const result = generateThemeVariantTypes(['light', 'dark', 'ocean']);

      expect(result).toContain('export type ThemeVariantName =');
      expect(result).toContain("| 'light'");
      expect(result).toContain("| 'dark'");
      expect(result).toContain("| 'ocean'");
    });

    it('should include JSDoc when configured', () => {
      const result = generateThemeVariantTypes(['light'], {
        outputPath: '',
        includeJSDoc: true,
      });

      expect(result).toContain('/**');
      expect(result).toContain('* Available theme variant names');
    });

    it('should handle empty array', () => {
      const result = generateThemeVariantTypes([]);

      expect(result).toBe('');
    });
  });

  describe('generateCompleteTypes', () => {
    it('should combine color and variant types', () => {
      const colors = new Map([
        [
          'blue',
          {
            source: { l: 0.5, c: 0.15, h: 220 },
            scale: [50, 500, 950],
          },
        ],
      ]);
      const variants = ['light', 'dark'];
      const config: TypeGenerationConfig = {
        outputPath: 'test.d.ts',
        includeJSDoc: true,
      };

      const result = generateCompleteTypes(colors, variants, config);

      // Should contain color types
      expect(result).toContain('export type ColorName =');
      expect(result).toContain('export interface BlueColorScale {');
      expect(result).toContain('export interface ColorRegistry');

      // Should contain variant types
      expect(result).toContain('export type ThemeVariantName =');
      expect(result).toContain("| 'light'");
      expect(result).toContain("| 'dark'");
    });

    it('should handle no variants', () => {
      const colors = new Map([
        [
          'blue',
          {
            source: { l: 0.5, c: 0.15, h: 220 },
            scale: [500],
          },
        ],
      ]);

      const result = generateCompleteTypes(colors, [], {
        outputPath: 'test.d.ts',
      });

      // Should contain color types
      expect(result).toContain('export type ColorName =');

      // Should not contain variant types
      expect(result).not.toContain('export type ThemeVariantName =');
    });
  });

  describe('PascalCase conversion', () => {
    it('should convert kebab-case to PascalCase', () => {
      const result = generateColorScaleType('ocean-blue', [500]);
      expect(result).toContain('OceanBlueColorScale');
    });

    it('should convert single word to PascalCase', () => {
      const result = generateColorScaleType('gray', [500]);
      expect(result).toContain('GrayColorScale');
    });

    it('should handle multiple dashes', () => {
      const result = generateColorScaleType('deep-ocean-blue', [500]);
      expect(result).toContain('DeepOceanBlueColorScale');
    });
  });
});
