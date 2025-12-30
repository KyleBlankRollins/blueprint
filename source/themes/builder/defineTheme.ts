/**
 * Helper function to define theme configuration with type safety
 */

import type { ThemeConfig } from '../builder/types.js';

export function defineTheme(config: ThemeConfig): ThemeConfig {
  return config;
}
