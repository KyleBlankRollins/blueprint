/**
 * Blueprint Theme Configuration
 * Source of truth for all design tokens
 *
 * PHASE 4: ThemeBase Class Architecture
 * - Themes extend ThemeBase abstract class
 * - Design tokens (spacing, typography, motion, etc.) are provided by ThemeBase plugins
 * - Each theme can override default design tokens or use sensible defaults
 * - ThemeBuilder automatically merges design tokens from all plugins
 * - No hardcoded tokens - everything comes from theme classes
 */

import { ThemeBuilder } from '../builder/ThemeBuilder.js';
import { blueprintCoreTheme } from '../plugins/blueprint-core/index.js';
import { wadaSanzoTheme } from '../plugins/wada-sanzo/index.js';

// Build theme from plugins
// Note: Primitives (white, black) are automatically registered by ThemeBuilder
const builder = new ThemeBuilder()
  .use(blueprintCoreTheme) // Load core theme (gray, blue, green, red, yellow + light/dark)
  .use(wadaSanzoTheme); // Load Wada Sanzo accents + wada-light/wada-dark

/**
 * Get a fresh ThemeBuilder instance with all plugins loaded
 * Used by CLI commands for type generation
 */
export function getThemeBuilder(): ThemeBuilder {
  return new ThemeBuilder().use(blueprintCoreTheme).use(wadaSanzoTheme);
}

// Validate before building
const validation = builder.validate();
if (!validation.valid) {
  console.error('❌ Theme validation failed:');
  validation.errors.forEach((error) => {
    console.error(`  - [${error.plugin}] ${error.message}`);
  });
  throw new Error('Theme validation failed');
}

if (validation.warnings.length > 0) {
  console.warn('⚠️ Theme validation warnings:');
  validation.warnings.forEach((warning) => {
    console.warn(`  - [${warning.plugin}] ${warning.message}`);
  });
}

// Build the final theme configuration
// Design tokens (spacing, typography, motion, etc.) are now provided by ThemeBase plugins
// and merged automatically by ThemeBuilder
export const blueprintTheme = builder.build();
