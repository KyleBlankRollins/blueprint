/**
 * Typed color reference system
 * Provides IDE autocomplete and type safety for color references
 */

import type { ColorStep } from '../core/types.js';

/** A color reference string like 'blue.500' or special values 'white'/'black' */
export type ColorReference = string;

/** Special color literals */
export type SpecialColor = 'white' | 'black';

/** Type for flattened color references like 'gray50', 'blue500', etc. */
type FlattenedColorRefs<T extends string> = {
  [K in T as `${K}${ColorStep}`]: ColorReference;
} & { white: SpecialColor; black: SpecialColor };

/**
 * Create typed color references for IDE autocomplete
 * Returns an object where colors.blue500 resolves to the string 'blue.500'
 *
 * @param colorNames - Array of color scale names from theme config
 * @returns Typed object with flattened color references
 *
 * @example
 * ```typescript
 * const colors = createColorRefs(['gray', 'blue', 'red']);
 * const ref = colors.blue500; // 'blue.500' with full type safety
 * const ref2 = colors.gray50; // 'gray.50'
 * ```
 */
export function createColorRefs<T extends string>(
  colorNames: readonly T[]
): FlattenedColorRefs<T> {
  const refs: Record<string, ColorReference | SpecialColor> = {
    white: 'white' as const,
    black: 'black' as const,
  };

  const steps: ColorStep[] = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
  ];

  for (const colorName of colorNames) {
    for (const step of steps) {
      refs[`${colorName}${step}`] = `${colorName}.${step}`;
    }
  }

  return refs as FlattenedColorRefs<T>;
}
