/**
 * Theme builder module
 * Provides ThemeBuilder API, validation, and defaults
 */

// Export ThemeBuilder and plugin system
export { ThemeBuilder } from './ThemeBuilder.js';
export { ThemeValidator } from './ThemeValidator.js';
export { defineTheme } from './defineTheme.js';

// Export default theme values
export {
  DEFAULT_SPACING,
  DEFAULT_RADIUS,
  DEFAULT_MOTION,
  DEFAULT_TYPOGRAPHY,
  DEFAULT_FOCUS,
  DEFAULT_Z_INDEX,
  DEFAULT_OPACITY,
  DEFAULT_BREAKPOINTS,
  DEFAULT_ACCESSIBILITY,
  createDefaultThemeConfig,
} from './defaults.js';

// Re-export types from core
export type {
  ThemePlugin,
  ThemeBuilderInterface,
  ColorDefinition,
  SemanticTokens,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  PluginDependency,
  ColorRef,
  ThemeConfig,
  ContrastViolation,
} from '../core/types.js';

// Re-export utilities from color module
export { generateAllColorScales } from '../color/generateColorScale.js';
export { validateThemeContrast } from '../color/validateContrast.js';

// Legacy buildTheme function for backward compatibility
import type { ThemeConfig } from '../core/types.js';
import { generateAllColorScales } from '../color/generateColorScale.js';
import {
  generatePrimitivesCSS,
  generateThemeCSS,
  generateSpacingCSS,
  generateRadiusCSS,
  generateMotionCSS,
  generateTypographyCSS,
  generateUtilityCSS,
  generateReducedMotionCSS,
  generateHighContrastCSS,
  generateIndexCSS,
} from '../generator/generateCSS.js';

export interface GeneratedFiles {
  readonly 'primitives.css': string;
  readonly 'utilities.css': string;
  readonly 'light.css': string;
  readonly 'dark.css': string;
  readonly 'index.css': string;
}

/**
 * Generate the utilities CSS file by concatenating all utility generators
 * @param config - Theme configuration
 * @returns Combined CSS string with all utility tokens
 */
function generateUtilitiesFile(config: ThemeConfig): string {
  return [
    generateSpacingCSS(config),
    generateRadiusCSS(config),
    generateMotionCSS(config),
    generateTypographyCSS(config),
    generateUtilityCSS(config),
    generateReducedMotionCSS(),
    generateHighContrastCSS(config),
  ].join('');
}

/**
 * Generate all theme files from configuration
 *
 * Creates 5 CSS files:
 * - primitives.css: Color scales with hex fallbacks + OKLCH for modern browsers
 * - utilities.css: Spacing, radius, motion, typography, focus, z-index, opacity, breakpoints
 * - light.css: Light theme semantic color tokens
 * - dark.css: Dark theme semantic color tokens
 * - index.css: Main import file that loads all theme CSS
 *
 * @param config - Complete theme configuration with colors, spacing, typography, etc.
 * @returns Object containing all generated CSS file contents
 * @throws {Error} If configuration is invalid or CSS generation fails
 */
export function buildTheme(config: ThemeConfig): GeneratedFiles {
  // Validate configuration
  if (!config.colors || Object.keys(config.colors).length === 0) {
    throw new Error(
      'Theme configuration must include at least one color scale'
    );
  }
  if (!config.themes?.light) {
    throw new Error('Theme configuration must include a light theme variant');
  }
  if (!config.themes?.dark) {
    throw new Error('Theme configuration must include a dark theme variant');
  }

  try {
    // Generate primitive color scales (shared by all themes)
    const primitives = generateAllColorScales(config.colors);

    // Build CSS files
    const files: GeneratedFiles = {
      // Primitive color scales (shared by all themes)
      'primitives.css': generatePrimitivesCSS(primitives),

      // Utilities (spacing, radius, motion, typography, etc.)
      'utilities.css': generateUtilitiesFile(config),

      // Light theme (maps semantic tokens to primitives)
      'light.css': generateThemeCSS('light', config.themes.light),

      // Dark theme (maps semantic tokens to primitives)
      'dark.css': generateThemeCSS('dark', config.themes.dark),

      // Index file (imports all theme CSS)
      'index.css': generateIndexCSS(),
    };

    return files;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to build theme: ${message}`);
  }
}
