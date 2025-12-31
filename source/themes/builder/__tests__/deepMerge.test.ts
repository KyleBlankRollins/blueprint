import { describe, it, expect } from 'vitest';
import { deepMerge, deepMergeTokens } from '../deepMerge.js';

describe('deepMerge', () => {
  describe('basic object merging', () => {
    it('should merge two simple objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { c: 3, d: 4 };
      const result = deepMerge(obj1, obj2 as Partial<typeof obj1>);

      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    it('should return empty object when no sources provided', () => {
      const result = deepMerge();
      expect(result).toEqual({});
    });

    it('should return copy of single source object', () => {
      const obj = { a: 1, b: 2 };
      const result = deepMerge(obj);

      expect(result).toEqual(obj);
      expect(result).not.toBe(obj); // Should be a new object
    });

    it('should handle empty objects', () => {
      const result = deepMerge({}, { a: 1 }, {});
      expect(result).toEqual({ a: 1 });
    });
  });

  describe('property precedence', () => {
    it('should allow later sources to override earlier sources', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = deepMerge(obj1, obj2);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should apply precedence across multiple sources', () => {
      const obj1 = { a: 1 };
      const obj2 = { a: 2 };
      const obj3 = { a: 3 };
      const result = deepMerge(obj1, obj2, obj3);

      expect(result.a).toBe(3);
    });
  });

  describe('nested object merging', () => {
    it('should merge nested objects deeply', () => {
      const base = {
        spacing: { base: 4, scale: [1, 2, 3] },
        radius: { sm: 2, md: 4 },
      };

      const override = {
        spacing: { scale: [1, 2, 4, 8] },
        radius: { lg: 8 },
      };

      const result = deepMerge(
        base,
        override as unknown as Partial<typeof base>
      );

      expect(result).toEqual({
        spacing: { base: 4, scale: [1, 2, 4, 8] },
        radius: { sm: 2, md: 4, lg: 8 },
      });
    });

    it('should merge deeply nested objects', () => {
      const obj1 = {
        level1: {
          level2: {
            level3: {
              a: 1,
              b: 2,
            },
          },
        },
      };

      const obj2 = {
        level1: {
          level2: {
            level3: {
              b: 3,
              c: 4,
            },
          },
        },
      };

      const result = deepMerge(obj1, obj2 as unknown as Partial<typeof obj1>);

      expect(result.level1.level2.level3).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should preserve nested objects not in override', () => {
      const obj1 = {
        colors: { primary: 'blue', secondary: 'green' },
        spacing: { sm: 4, md: 8 },
      };

      const obj2 = {
        colors: { primary: 'red' },
      };

      const result = deepMerge(obj1, obj2 as Partial<typeof obj1>);

      expect(result.colors).toEqual({ primary: 'red', secondary: 'green' });
      expect((result as typeof obj1).spacing).toEqual({ sm: 4, md: 8 });
    });
  });

  describe('array handling', () => {
    it('should replace arrays instead of merging them', () => {
      const obj1 = { arr: [1, 2, 3] };
      const obj2 = { arr: [4, 5] };
      const result = deepMerge(obj1, obj2);

      expect(result.arr).toEqual([4, 5]);
    });

    it('should replace empty array with new array', () => {
      const obj1 = { arr: [] };
      const obj2 = { arr: [1, 2, 3] };
      const result = deepMerge(obj1, obj2);

      expect(result.arr).toEqual([1, 2, 3]);
    });

    it('should replace array with empty array', () => {
      const obj1 = { arr: [1, 2, 3] };
      const obj2 = { arr: [] };
      const result = deepMerge(obj1, obj2);

      expect(result.arr).toEqual([]);
    });
  });

  describe('primitive value handling', () => {
    it('should replace primitive values', () => {
      const obj1 = { str: 'hello', num: 42, bool: true };
      const obj2 = { str: 'world', num: 0, bool: false };
      const result = deepMerge(obj1, obj2);

      expect(result).toEqual({ str: 'world', num: 0, bool: false });
    });

    it('should handle string replacement', () => {
      const obj1 = { value: 'old' };
      const obj2 = { value: 'new' };
      const result = deepMerge(obj1, obj2);

      expect(result.value).toBe('new');
    });

    it('should handle number replacement including zero', () => {
      const obj1 = { value: 100 };
      const obj2 = { value: 0 };
      const result = deepMerge(obj1, obj2);

      expect(result.value).toBe(0);
    });

    it('should handle boolean replacement', () => {
      const obj1 = { enabled: true };
      const obj2 = { enabled: false };
      const result = deepMerge(obj1, obj2);

      expect(result.enabled).toBe(false);
    });
  });

  describe('null and undefined handling', () => {
    it('should override with null values', () => {
      const obj1 = { value: 'something' };
      const obj2 = { value: null };
      const result = deepMerge(obj1, obj2 as unknown as Partial<typeof obj1>);

      expect(result.value).toBeNull();
    });

    it('should not override with undefined values', () => {
      const obj1 = { value: 'something' };
      const obj2 = { value: undefined };
      const result = deepMerge(obj1, obj2);

      expect(result.value).toBe('something');
    });

    it('should replace object with null', () => {
      const obj1 = { nested: { a: 1, b: 2 } };
      const obj2 = { nested: null };
      const result = deepMerge(obj1, obj2 as unknown as Partial<typeof obj1>);

      expect(result.nested).toBeNull();
    });

    it('should skip properties with undefined values', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: undefined, c: 3 };
      const result = deepMerge(obj1, obj2);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle null in first source', () => {
      const obj1 = { value: null };
      const obj2 = { other: 'test' };
      const result = deepMerge(obj1, obj2 as Partial<typeof obj1>);

      expect(result.value).toBeNull();
      expect((result as typeof obj1 & typeof obj2).other).toBe('test');
    });
  });

  describe('Object.create(null) handling', () => {
    it('should merge objects created with Object.create(null)', () => {
      const obj1 = Object.create(null) as Record<string, unknown>;
      obj1.a = 1;
      obj1.b = 2;

      const obj2 = Object.create(null) as Record<string, unknown>;
      obj2.b = 3;
      obj2.c = 4;

      const result = deepMerge(obj1, obj2);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge nested Object.create(null) objects', () => {
      const nested1 = Object.create(null) as Record<string, unknown>;
      nested1.x = 10;

      const nested2 = Object.create(null) as Record<string, unknown>;
      nested2.y = 20;

      const obj1 = { config: nested1 };
      const obj2 = { config: nested2 };

      const result = deepMerge(obj1, obj2);

      expect(result.config).toEqual({ x: 10, y: 20 });
    });

    it('should handle mix of regular objects and Object.create(null)', () => {
      const obj1 = { a: 1 };
      const obj2 = Object.create(null) as Record<string, unknown>;
      obj2.b = 2;

      const result = deepMerge(obj1, obj2);

      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('non-plain object handling', () => {
    it('should replace class instances instead of merging', () => {
      class CustomClass {
        constructor(public value: number) {}
      }

      const obj1 = { instance: new CustomClass(1) };
      const obj2 = { instance: new CustomClass(2) };
      const result = deepMerge(obj1, obj2);

      expect(result.instance).toBe(obj2.instance);
      expect(result.instance).toBeInstanceOf(CustomClass);
      expect((result.instance as CustomClass).value).toBe(2);
    });

    it('should replace Date objects instead of merging', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2025-12-31');

      const obj1 = { created: date1 };
      const obj2 = { created: date2 };
      const result = deepMerge(obj1, obj2);

      expect(result.created).toBe(date2);
    });

    it('should replace functions instead of merging', () => {
      const fn1 = () => 'first';
      const fn2 = () => 'second';

      const obj1 = { handler: fn1 };
      const obj2 = { handler: fn2 };
      const result = deepMerge(obj1, obj2);

      expect(result.handler).toBe(fn2);
    });

    it('should skip non-object sources', () => {
      const obj1 = { a: 1 };
      const result = deepMerge(
        obj1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        null as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        undefined as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        42 as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        'string' as any,
        { b: 2 } as Partial<typeof obj1>
      );

      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('edge cases', () => {
    it('should handle objects with symbol keys', () => {
      const sym1 = Symbol('key1');
      const sym2 = Symbol('key2');

      const obj1 = { [sym1]: 'value1', regular: 'test' };
      const obj2 = { [sym2]: 'value2' };
      const result = deepMerge(obj1, obj2 as Partial<typeof obj1>);

      expect(result.regular).toBe('test');
      // Note: for...in doesn't iterate over symbol keys, so symbols won't be merged
      // This is expected behavior for design token merging
    });

    it('should handle very deeply nested objects', () => {
      const depth = 10;
      let obj1: Record<string, unknown> = { value: 1 };
      let obj2: Record<string, unknown> = { value: 2 };

      for (let i = 0; i < depth; i++) {
        obj1 = { nested: obj1 };
        obj2 = { nested: obj2 };
      }

      const result = deepMerge(obj1, obj2);

      let current: Record<string, unknown> = result;
      for (let i = 0; i < depth; i++) {
        current = current.nested as Record<string, unknown>;
      }

      expect(current.value).toBe(2);
    });

    it('should not mutate source objects', () => {
      const obj1 = { a: 1, nested: { b: 2 } };
      const obj2 = { nested: { c: 3 } };
      const obj1Copy = JSON.parse(JSON.stringify(obj1));
      const obj2Copy = JSON.parse(JSON.stringify(obj2));

      deepMerge(obj1, obj2 as unknown as Partial<typeof obj1>);

      expect(obj1).toEqual(obj1Copy);
      expect(obj2).toEqual(obj2Copy);
    });

    it('should handle objects with numeric string keys', () => {
      const obj1 = { '0': 'zero', '1': 'one' };
      const obj2 = { '1': 'ONE', '2': 'two' };
      const result = deepMerge(obj1, obj2);

      expect(result).toEqual({ '0': 'zero', '1': 'ONE', '2': 'two' });
    });
  });

  describe('design token use cases', () => {
    it('should merge spacing tokens correctly', () => {
      const base = {
        spacing: {
          unit: 4,
          scale: {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24,
          },
        },
      };

      const override = {
        spacing: {
          scale: {
            md: 20,
            xl: 32,
          },
        },
      };

      const result = deepMerge(
        base,
        override as unknown as Partial<typeof base>
      );

      expect(result.spacing.unit).toBe(4);
      expect(result.spacing.scale).toEqual({
        xs: 4,
        sm: 8,
        md: 20,
        lg: 24,
        xl: 32,
      });
    });

    it('should merge color tokens with nested structure', () => {
      const base = {
        colors: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#0ea5e9',
          },
          secondary: {
            500: '#8b5cf6',
          },
        },
      };

      const override = {
        colors: {
          primary: {
            500: '#3b82f6',
            600: '#2563eb',
          },
        },
      };

      const result = deepMerge(
        base,
        override as unknown as Partial<typeof base>
      );

      expect(result.colors.primary).toEqual({
        50: '#f0f9ff',
        100: '#e0f2fe',
        500: '#3b82f6',
        600: '#2563eb',
      });
      expect(result.colors.secondary).toEqual({ 500: '#8b5cf6' });
    });
  });
});

describe('deepMergeTokens', () => {
  it('should function identically to deepMerge', () => {
    const base = {
      spacing: { base: 4, scale: [1, 2, 3] },
      radius: { sm: 2, md: 4 },
    };

    const override = {
      spacing: { scale: [1, 2, 4, 8] },
      radius: { lg: 8 },
    };

    const resultMerge = deepMerge(
      base,
      override as unknown as Partial<typeof base>
    );
    const resultTokens = deepMergeTokens(
      base,
      override as unknown as Partial<typeof base>
    );

    expect(resultTokens).toEqual(resultMerge);
  });

  it('should merge multiple overrides', () => {
    const base = { a: 1, b: 2 };
    const override1 = { b: 3, c: 4 };
    const override2 = { c: 5, d: 6 };

    const result = deepMergeTokens(
      base,
      override1 as Partial<typeof base>,
      override2 as Partial<typeof base>
    );

    expect(result).toEqual({ a: 1, b: 3, c: 5, d: 6 });
  });

  it('should work with design token types', () => {
    type DesignTokens = {
      spacing: { base: number; scale: number[] };
      colors: { primary: string };
    };

    const base: DesignTokens = {
      spacing: { base: 4, scale: [1, 2, 4] },
      colors: { primary: 'blue' },
    };

    const override: Partial<DesignTokens> = {
      colors: { primary: 'red' },
    };

    const result = deepMergeTokens(base, override);

    expect(result.colors.primary).toBe('red');
    expect(result.spacing.base).toBe(4);
  });
});
