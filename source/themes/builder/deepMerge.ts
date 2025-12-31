/**
 * Deep merge utility for combining design tokens
 *
 * Performs a deep merge of objects, with later objects taking precedence.
 * Arrays are replaced (not merged). Handles nested objects recursively.
 *
 * Used by ThemeBuilder to combine design tokens from multiple themes,
 * allowing surgical overrides of specific nested properties.
 *
 * @example
 * ```typescript
 * const base = {
 *   spacing: { base: 4, scale: [1, 2, 3] },
 *   radius: { sm: 2, md: 4 }
 * };
 *
 * const override = {
 *   spacing: { scale: [1, 2, 4, 8] },
 *   radius: { lg: 8 }
 * };
 *
 * const result = deepMerge(base, override);
 * // {
 * //   spacing: { base: 4, scale: [1, 2, 4, 8] },
 * //   radius: { sm: 2, md: 4, lg: 8 }
 * // }
 * ```
 */

/**
 * Type guard to check if value is a plain object
 *
 * Accepts objects with Object.prototype or null prototype (Object.create(null))
 * to support config objects created without prototypes for security/cleanliness.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Deep merge multiple objects
 *
 * Rules:
 * - Plain objects are merged recursively
 * - Arrays are replaced entirely (not merged)
 * - Primitives are replaced
 * - Later sources take precedence over earlier ones
 * - undefined values in sources are ignored (don't override)
 * - null values in sources DO override
 *
 * @param sources - Objects to merge (left to right precedence)
 * @returns New merged object
 *
 * @remarks
 * Type safety: The return type assumes at least one source contains all
 * required properties of T. Passing only Partial<T> sources may result
 * in runtime objects missing required properties.
 */
export function deepMerge<T extends Record<string, unknown>>(
  ...sources: Partial<T>[]
): T {
  const result: Record<string, unknown> = {};

  for (const source of sources) {
    if (!isPlainObject(source)) {
      continue;
    }

    for (const key in source) {
      const sourceValue = source[key];

      // Skip undefined values - they don't override
      if (sourceValue === undefined) {
        continue;
      }

      const currentValue = result[key];

      // If both values are plain objects, merge recursively
      if (isPlainObject(currentValue) && isPlainObject(sourceValue)) {
        result[key] = deepMerge(
          currentValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else {
        // Otherwise, replace with source value
        // This handles: primitives, arrays, null, class instances, etc.
        result[key] = sourceValue;
      }
    }
  }

  return result as T;
}

/**
 * Type-safe deep merge for design tokens
 *
 * Semantic alias for deepMerge when working with design tokens.
 * Provides clearer intent when merging spacing, typography, motion, etc.
 * Functionally identical to deepMerge.
 *
 * @example
 * ```typescript
 * import { deepMergeTokens } from './deepMerge.js';
 *
 * const baseTokens = theme1.getDesignTokens();
 * const overrideTokens = theme2.getDesignTokens();
 * const merged = deepMergeTokens(baseTokens, overrideTokens);
 * ```
 */
export function deepMergeTokens<T extends Record<string, unknown>>(
  base: T,
  ...overrides: Partial<T>[]
): T {
  return deepMerge(base, ...overrides);
}
