import type { ComplexAttributeConverter } from 'lit';

/**
 * A custom Lit attribute converter for boolean properties that default to `true`.
 *
 * Lit's built-in `type: Boolean` follows native HTML boolean attribute semantics:
 * any attribute presence (even `="false"`) is treated as `true`. This converter
 * instead parses the attribute value so `="false"` correctly sets the property
 * to `false`.
 *
 * Behavior:
 * - Attribute absent → `null` (property uses its default)
 * - `attribute=""` or `attribute` (no value) → `true`
 * - `attribute="false"` → `false`
 * - `attribute="true"` or any other value → `true`
 *
 * Usage:
 * ```ts
 * @property({ converter: booleanConverter, reflect: true })
 * declare showBackdrop: boolean;
 * ```
 */
export const booleanConverter: ComplexAttributeConverter<boolean> = {
  fromAttribute(value: string | null): boolean {
    if (value === null) {
      return true;
    }
    return value.toLowerCase() !== 'false';
  },
  toAttribute(value: boolean): string | null {
    return value ? '' : 'false';
  },
};
