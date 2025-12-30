/**
 * Helper function to define theme configuration with type safety
 *
 * This function simply passes through the ThemeConfig object.
 * It exists primarily for type checking and to provide a consistent API.
 *
 * Recommended usage: Use ThemeBuilder.build() directly instead of this function.
 *
 * @param config - Theme configuration (typically from ThemeBuilder.build())
 * @returns The same theme configuration
 *
 * @example
 * ```typescript
 * // Direct approach (recommended):
 * const theme = new ThemeBuilder().use(plugin).build();
 *
 * // With defineTheme (optional):
 * const theme = defineTheme(new ThemeBuilder().use(plugin).build());
 * ```
 */

import type { ThemeConfig } from '../core/types.js';

export function defineTheme(config: ThemeConfig): ThemeConfig {
  return config;
}
