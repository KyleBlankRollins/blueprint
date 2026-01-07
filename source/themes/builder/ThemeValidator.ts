/**
 * Theme validation logic
 * Handles validation of theme configurations, plugin dependencies, and semantic tokens
 */

import type {
  ThemePlugin,
  SemanticTokens,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ColorRef,
  ThemeConfig,
  ColorDefinition,
} from '../core/types.js';

/**
 * Internal interface for accessing builder state during validation
 */
interface BuilderState {
  getPlugins(): ThemePlugin[];
  getThemeVariantEntries(): Map<string, { tokens: SemanticTokens<ColorRef> }>;
  getColorRegistry(): Map<string, { definition: ColorDefinition }>;
  buildInternal(): ThemeConfig;
  resolveColorRef(ref: ColorRef): string | null;
}

/**
 * ThemeValidator handles all validation logic for themes
 */
export class ThemeValidator {
  constructor(private builder: BuilderState) {}

  /**
   * Validate the entire theme configuration
   *
   * @returns ValidationResult with errors and warnings
   */
  validate(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    this.validatePluginDependencies(errors);
    this.validateThemeVariants(errors);
    this.runPluginValidation(errors);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate that all required semantic tokens are present
   *
   * @param tokens - Semantic tokens to validate
   * @throws {Error} If any required token is missing
   */
  validateSemanticTokens(tokens: SemanticTokens<ColorRef>): void {
    const requiredTokens: (keyof SemanticTokens<ColorRef>)[] = [
      'background',
      'surface',
      'surfaceElevated',
      'surfaceSubdued',
      'text',
      'textMuted',
      'textInverse',
      'primary',
      'primaryHover',
      'primaryActive',
      'success',
      'warning',
      'error',
      'info',
      'border',
      'borderStrong',
      'focus',
    ];

    for (const token of requiredTokens) {
      if (!tokens[token]) {
        throw new Error(`Missing required semantic token: ${token}`);
      }
    }
  }

  /**
   * Validate plugin dependencies
   * @private
   */
  private validatePluginDependencies(errors: ValidationError[]): void {
    const plugins = this.builder.getPlugins();

    for (const plugin of plugins) {
      if (plugin.dependencies) {
        for (const dep of plugin.dependencies) {
          const depPlugin = plugins.find((p) => p.id === dep.id);
          if (!depPlugin && !dep.optional) {
            errors.push({
              plugin: plugin.id,
              type: 'dependency_missing',
              message: `Required dependency "${dep.id}" is missing`,
              context: { dependency: dep },
            });
          }
        }
      }
    }
  }

  /**
   * Validate all theme variants
   * @private
   */
  private validateThemeVariants(errors: ValidationError[]): void {
    const themeVariants = this.builder.getThemeVariantEntries();

    for (const [variantName, variant] of themeVariants) {
      // Validate semantic token structure
      try {
        this.validateSemanticTokens(variant.tokens);
      } catch (error) {
        errors.push({
          plugin: undefined,
          type: 'invalid_ref',
          message: `Theme variant "${variantName}": ${error instanceof Error ? error.message : 'Unknown error'}`,
          context: { variantName },
        });
      }

      // Check that all tokens are valid
      for (const [tokenName, tokenValue] of Object.entries(variant.tokens)) {
        // Non-color tokens (strings) that don't need color resolution
        const nonColorTokens = [
          'borderWidth',
          'shadowSm',
          'shadowMd',
          'shadowLg',
          'shadowXl',
          'fontFamily',
          'fontFamilyMono',
          'fontFamilyHeading',
          'borderRadius',
          'borderRadiusLarge',
          'borderRadiusFull',
        ];

        if (nonColorTokens.includes(tokenName)) {
          // Validate string token
          if (typeof tokenValue !== 'string') {
            errors.push({
              plugin: undefined,
              type: 'invalid_ref',
              message: `Theme variant "${variantName}": Token "${tokenName}" must be a string`,
              context: { variantName, tokenName, value: tokenValue },
            });
          }
        } else {
          // Validate ColorRef token
          const resolved = this.builder.resolveColorRef(tokenValue);
          if (!resolved) {
            errors.push({
              plugin: undefined,
              type: 'missing_color',
              message: `Theme variant "${variantName}": Token "${tokenName}" references non-existent color`,
              context: { variantName, tokenName, colorRef: tokenValue },
            });
          }
        }
      }
    }
  }

  /**
   * Run plugin-specific validation hooks
   * @private
   */
  private runPluginValidation(errors: ValidationError[]): void {
    const plugins = this.builder.getPlugins();
    const config = this.builder.buildInternal();

    for (const plugin of plugins) {
      if (plugin.validate) {
        try {
          const pluginErrors = plugin.validate(config);
          errors.push(...pluginErrors);
        } catch (error) {
          errors.push({
            plugin: plugin.id,
            type: 'invalid_ref',
            message: `Plugin validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      }
    }
  }
}
