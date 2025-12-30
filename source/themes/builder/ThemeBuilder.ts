/**
 * ThemeBuilder - Fluent API for building themes from plugins
 *
 * @example
 * ```typescript
 * const builder = new ThemeBuilder()
 *   .use(primitivesPlugin)
 *   .use(blueprintCorePlugin);
 *
 * const theme = builder.build();
 * ```
 */

import type {
  ThemePlugin,
  ThemeBuilderInterface,
  ColorDefinition,
  SemanticTokens,
  ValidationResult,
  ThemeConfig,
  ColorRef,
  ColorScale,
  ColorStep,
  ThemeVariant,
} from '../core/types.js';
import { createColorRef, serializeColorRef } from '../color/colorRefUtils.js';
import { ThemeValidator } from './ThemeValidator.js';
import { createDefaultThemeConfig } from './defaults.js';

/**
 * Internal color registry entry
 */
interface ColorRegistryEntry {
  definition: ColorDefinition;
  refs: Record<number, ColorRef>;
}

/**
 * Internal theme variant entry
 */
interface ThemeVariantEntry {
  tokens: SemanticTokens<ColorRef>;
  baseVariant?: string;
}

/**
 * ThemeBuilder class for composing themes from plugins
 */
export class ThemeBuilder implements ThemeBuilderInterface {
  private plugins: ThemePlugin[] = [];
  private colorRegistry: Map<string, ColorRegistryEntry> = new Map();
  private themeVariants: Map<string, ThemeVariantEntry> = new Map();
  private _colors: Record<string, ColorRef> = {};

  /**
   * Typed color registry - access like builder.colors.gray50, builder.colors.blue500
   * Updated dynamically as colors are registered via plugins
   */
  get colors(): Record<string, ColorRef> {
    return this._colors;
  }

  /**
   * Register a plugin with the builder
   *
   * @param plugin - Theme plugin to register
   * @returns this for method chaining
   * @example
   * ```typescript
   * builder.use(blueprintCorePlugin).use(oceanThemePlugin);
   * ```
   */
  use(plugin: ThemePlugin): this {
    // Validate plugin metadata
    if (!plugin.id) {
      throw new Error('Plugin must have an id');
    }
    if (!plugin.version) {
      throw new Error(`Plugin "${plugin.id}" must have a version`);
    }
    if (!plugin.register || typeof plugin.register !== 'function') {
      throw new Error(`Plugin "${plugin.id}" must have a register function`);
    }

    // Check for duplicate plugin IDs
    if (this.plugins.some((p) => p.id === plugin.id)) {
      console.warn(
        `⚠️  Plugin "${plugin.id}" is already registered. The new version will replace the existing one.`
      );
      // Remove existing plugin
      this.plugins = this.plugins.filter((p) => p.id !== plugin.id);
    }

    this.plugins.push(plugin);

    // Execute plugin's register function
    const result = plugin.register(this);

    // Handle async registration
    if (result instanceof Promise) {
      throw new Error(
        `Plugin "${plugin.id}" uses async registration. Use registerAsync() instead.`
      );
    }

    return this;
  }

  /**
   * Register a plugin asynchronously
   *
   * @param plugin - Theme plugin to register
   * @returns Promise that resolves to this for method chaining
   */
  async useAsync(plugin: ThemePlugin): Promise<this> {
    // Validate plugin metadata
    if (!plugin.id) {
      throw new Error('Plugin must have an id');
    }
    if (!plugin.version) {
      throw new Error(`Plugin "${plugin.id}" must have a version`);
    }
    if (!plugin.register || typeof plugin.register !== 'function') {
      throw new Error(`Plugin "${plugin.id}" must have a register function`);
    }

    // Check for duplicate plugin IDs
    if (this.plugins.some((p) => p.id === plugin.id)) {
      console.warn(
        `⚠️  Plugin "${plugin.id}" is already registered. The new version will replace the existing one.`
      );
      // Remove existing plugin
      this.plugins = this.plugins.filter((p) => p.id !== plugin.id);
    }

    this.plugins.push(plugin);

    // Execute plugin's register function (may be async)
    await plugin.register(this);

    return this;
  }

  /**
   * Add a color scale to the theme
   * Automatically creates typed color refs for all steps in the scale
   *
   * @param name - Color name (e.g., 'oceanBlue', 'gray')
   * @param config - Color definition with source color and scale steps
   * @returns this for method chaining
   * @example
   * ```typescript
   * builder.addColor('oceanBlue', {
   *   source: { l: 0.5, c: 0.15, h: 220 },
   *   scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
   * });
   * // Now builder.colors.oceanBlue50, .oceanBlue100, etc. are available
   * ```
   */
  addColor(name: string, config: ColorDefinition): this {
    // Validate color name
    if (!name || typeof name !== 'string') {
      throw new Error('Color name must be a non-empty string');
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
      throw new Error(
        `Color name "${name}" is invalid. Must start with a letter and contain only alphanumeric characters.`
      );
    }

    // Validate config
    if (!config.source) {
      throw new Error(`Color "${name}" must have a source color`);
    }
    if (!config.scale || config.scale.length === 0) {
      throw new Error(
        `Color "${name}" must have a scale with at least one step`
      );
    }

    // Warn if overwriting
    if (this.colorRegistry.has(name)) {
      console.warn(
        `⚠️  Color "${name}" is being overwritten. Previous definition will be replaced.`
      );
    }

    // Create color refs for each step in the scale
    const refs: Record<number, ColorRef> = {};
    for (const step of config.scale) {
      const ref = createColorRef(name, step);
      refs[step] = ref;

      // Add to colors registry with compound name
      const compoundName = `${name}${step}`;
      this._colors[compoundName] = ref;
    }

    // Store the color definition
    this.colorRegistry.set(name, {
      definition: config,
      refs,
    });

    return this;
  }

  /**
   * Get a color definition by name
   *
   * @param name - Color name
   * @returns Color definition or undefined if not found
   */
  getColor(name: string): ColorDefinition | undefined {
    return this.colorRegistry.get(name)?.definition;
  }

  /**
   * Check if a color exists
   *
   * @param name - Color name
   * @returns true if color exists, false otherwise
   */
  hasColor(name: string): boolean {
    return this.colorRegistry.has(name);
  }

  /**
   * Add a theme variant (e.g., 'light', 'dark', 'ocean')
   *
   * @param name - Theme variant name
   * @param tokens - Semantic tokens mapping to color refs
   * @returns this for method chaining
   * @example
   * ```typescript
   * builder.addThemeVariant('ocean-light', {
   *   background: builder.colors.gray50,
   *   primary: builder.colors.oceanBlue700,
   *   text: builder.colors.gray900,
   *   // ... other semantic tokens
   * });
   * ```
   */
  addThemeVariant(name: string, tokens: SemanticTokens<ColorRef>): this {
    // Validate variant name
    if (!name || typeof name !== 'string') {
      throw new Error('Theme variant name must be a non-empty string');
    }
    if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(name)) {
      throw new Error(
        `Theme variant name "${name}" is invalid. Must start with a letter and contain only alphanumeric characters and hyphens.`
      );
    }

    // Warn if overwriting
    if (this.themeVariants.has(name)) {
      console.warn(
        `⚠️  Theme variant "${name}" is being overwritten. Previous definition will be replaced.`
      );
    }

    // Validate that all tokens are provided
    this.validateSemanticTokens(tokens);

    // Store the theme variant
    this.themeVariants.set(name, { tokens });

    return this;
  }

  /**
   * Extend an existing theme variant with partial token overrides
   *
   * @param baseName - Name of the base theme variant to extend
   * @param newName - Name for the new extended variant
   * @param overrides - Partial semantic tokens to override
   * @returns this for method chaining
   * @example
   * ```typescript
   * builder.extendThemeVariant('ocean', 'ocean-dark', {
   *   background: builder.colors.gray950,
   *   surface: builder.colors.gray900,
   *   primary: builder.colors.oceanBlue400
   * });
   * ```
   */
  extendThemeVariant(
    baseName: string,
    newName: string,
    overrides: Partial<SemanticTokens<ColorRef>>
  ): this {
    // Get base variant
    const baseVariant = this.themeVariants.get(baseName);
    if (!baseVariant) {
      throw new Error(
        `Cannot extend theme variant "${baseName}" - it does not exist. Available variants: ${Array.from(this.themeVariants.keys()).join(', ')}`
      );
    }

    // Merge base tokens with overrides
    const mergedTokens: SemanticTokens<ColorRef> = {
      ...baseVariant.tokens,
      ...overrides,
    };

    // Store the extended variant
    this.themeVariants.set(newName, {
      tokens: mergedTokens,
      baseVariant: baseName,
    });

    return this;
  }

  /**
   * Get a theme variant by name
   *
   * @param name - Theme variant name
   * @returns Semantic tokens or undefined if not found
   */
  getThemeVariant(name: string): SemanticTokens<ColorRef> | undefined {
    return this.themeVariants.get(name)?.tokens;
  }

  /**
   * Validate the current theme configuration
   *
   * @returns Validation result with errors and warnings
   */
  validate(): ValidationResult {
    const validator = new ThemeValidator({
      getPlugins: () => this.plugins,
      getThemeVariantEntries: () => this.themeVariants,
      getColorRegistry: () => this.colorRegistry,
      buildInternal: () => this.buildInternal(),
      resolveColorRef: (ref) => this.resolveColorRef(ref),
    });
    return validator.validate();
  }

  /**
   * Build the final theme configuration
   * Runs beforeBuild hooks, validates, builds, and runs afterBuild hooks
   *
   * @returns Complete theme configuration
   * @throws {Error} If validation fails
   */
  build(): ThemeConfig {
    // Run beforeBuild hooks
    const partialConfig = this.buildInternal();
    for (const plugin of this.plugins) {
      if (plugin.beforeBuild) {
        plugin.beforeBuild(partialConfig);
      }
    }

    // Validate before building
    const validation = this.validate();
    if (!validation.valid) {
      const errorMessages = validation.errors
        .map((e) => `  - ${e.message}`)
        .join('\n');
      throw new Error(
        `Theme validation failed:\n${errorMessages}\n\nFix these errors before building the theme.`
      );
    }

    // Build the config
    const config = this.buildInternal();

    // Run afterBuild hooks
    for (const plugin of this.plugins) {
      if (plugin.afterBuild) {
        plugin.afterBuild(config);
      }
    }

    return config;
  }

  /**
   * Get all registered plugins
   *
   * @returns Array of registered plugins
   */
  getPlugins(): ThemePlugin[] {
    return [...this.plugins];
  }

  /**
   * Get all color names
   *
   * @returns Array of color names
   */
  getColorNames(): string[] {
    return Array.from(this.colorRegistry.keys());
  }

  /**
   * Get all theme variant names
   *
   * @returns Array of theme variant names
   */
  getThemeVariantNames(): string[] {
    return Array.from(this.themeVariants.keys());
  }

  /**
   * Resolve a color ref to its serialized string format
   * @private
   */
  private resolveColorRef(ref: ColorRef): string | null {
    const colorEntry = this.colorRegistry.get(ref.colorName);
    if (!colorEntry) {
      return null;
    }

    if (!colorEntry.refs[ref.step]) {
      return null;
    }

    return serializeColorRef(ref);
  }

  /**
   * Validate semantic tokens
   * @private
   */
  private validateSemanticTokens(tokens: SemanticTokens<ColorRef>): void {
    const validator = new ThemeValidator({
      getPlugins: () => this.plugins,
      getThemeVariantEntries: () => this.themeVariants,
      getColorRegistry: () => this.colorRegistry,
      buildInternal: () => this.buildInternal(),
      resolveColorRef: (ref) => this.resolveColorRef(ref),
    });
    validator.validateSemanticTokens(tokens);
  }

  /**
   * Build the theme config without hooks or validation
   * @private
   */
  private buildInternal(): ThemeConfig {
    // Convert color registry to the format expected by ThemeConfig
    const colors: Record<string, ColorScale> = {};
    for (const [name, entry] of this.colorRegistry) {
      colors[name] = {
        source: entry.definition.source,
        scale: entry.definition.scale as ColorStep[],
      };
    }

    // Convert theme variants to use string color refs
    const themes: Record<string, Record<string, string>> = {};
    for (const [variantName, variant] of this.themeVariants) {
      const serializedTokens: Record<string, string> = {};
      for (const [tokenName, colorRef] of Object.entries(variant.tokens)) {
        serializedTokens[tokenName] = serializeColorRef(colorRef);
      }
      themes[variantName] = serializedTokens;
    }

    // Ensure we have at least light and dark themes
    if (!themes.light) {
      throw new Error(
        'Theme configuration must include a "light" variant. Use builder.addThemeVariant("light", {...}) to define it.'
      );
    }
    if (!themes.dark) {
      throw new Error(
        'Theme configuration must include a "dark" variant. Use builder.addThemeVariant("dark", {...}) to define it.'
      );
    }

    // Build the theme config with defaults
    const config: ThemeConfig = {
      colors,
      themes: themes as Record<ThemeVariant, Record<string, string>> &
        Record<string, Record<string, string>>,
      ...createDefaultThemeConfig(),
    };

    return config;
  }
}
