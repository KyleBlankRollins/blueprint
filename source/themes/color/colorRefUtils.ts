/**
 * Utilities for working with ColorRef objects
 * Provides creation, serialization, and parsing of color references
 */

import type { ColorRef } from '../core/types.js';

/**
 * Create a typed color reference
 *
 * @param colorName - Name of the color (e.g., 'gray', 'blue')
 * @param step - Scale step (e.g., 50, 100, 500)
 * @returns Typed ColorRef object
 * @example
 * ```typescript
 * const ref = createColorRef('gray', 50);
 * // ref can be used in semantic tokens
 * ```
 */
export function createColorRef(colorName: string, step: number): ColorRef {
  return {
    __colorRef: Symbol('colorRef'),
    colorName,
    step,
  } as ColorRef;
}

/**
 * Serialize a color ref to string format
 *
 * @param ref - ColorRef to serialize
 * @returns String in format "colorName.step" (e.g., "gray.50")
 * @example
 * ```typescript
 * const ref = createColorRef('gray', 50);
 * serializeColorRef(ref); // "gray.50"
 * ```
 */
export function serializeColorRef(ref: ColorRef): string {
  return `${ref.colorName}.${ref.step}`;
}

/**
 * Parse a serialized color ref string back to ColorRef
 *
 * @param refString - String in format "colorName.step"
 * @returns ColorRef object or null if invalid format
 * @example
 * ```typescript
 * parseColorRef("gray.50"); // ColorRef { colorName: "gray", step: 50 }
 * parseColorRef("invalid"); // null
 * ```
 */
export function parseColorRef(refString: string): ColorRef | null {
  const match = refString.match(/^([a-zA-Z][a-zA-Z0-9]*?)\.(\d+)$/);
  if (!match) return null;

  const [, colorName, stepStr] = match;
  const step = parseInt(stepStr, 10);

  if (isNaN(step)) return null;

  return createColorRef(colorName, step);
}

/**
 * Check if a value is a valid ColorRef
 *
 * @param value - Value to check
 * @returns true if value is a ColorRef, false otherwise
 */
export function isColorRef(value: unknown): value is ColorRef {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__colorRef' in value &&
    'colorName' in value &&
    'step' in value &&
    typeof (value as ColorRef).colorName === 'string' &&
    typeof (value as ColorRef).step === 'number'
  );
}
