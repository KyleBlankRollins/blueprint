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

// Export plugin utilities
export {
  createPlugin,
  validatePlugin,
  createColorRef,
  resolveColorRef,
  serializeColorRef,
  checkPluginDependencies,
  generateColorTypes,
  generateColorRegistryTypes,
  sortPluginsByDependencies,
} from './pluginUtils.js';

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
  'primitives.css': string;
  'utilities.css': string;
  'index.css': string;
  // Allow dynamic theme files from plugins (e.g., 'blueprint-core/light.css')
  [key: string]: string;
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

      // Index file will be added at the end
      'index.css': '',
    };

    // Group theme variants by plugin
    const themesByPlugin = new Map<string, string[]>();

    for (const [variantName] of Object.entries(config.themes)) {
      const pluginId =
        config.themeMetadata?.[variantName]?.pluginId || 'blueprint-core';

      if (!themesByPlugin.has(pluginId)) {
        themesByPlugin.set(pluginId, []);
      }
      themesByPlugin.get(pluginId)!.push(variantName);
    }

    // Generate CSS files for each plugin's themes
    for (const [pluginId, variantNames] of themesByPlugin) {
      for (const variantName of variantNames) {
        const themeTokens = config.themes[variantName];
        const cssContent = generateThemeCSS(variantName, themeTokens);

        // Store in plugin directory: plugin-id/variant-name.css
        files[`${pluginId}/${variantName}.css`] = cssContent;
      }
    }

    // Generate index file that imports all themes
    files['index.css'] = generateIndexCSS(themesByPlugin);

    return files;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to build theme: ${message}`);
  }
}
