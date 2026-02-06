/**
 * Base class for all Blueprint theme plugins
 *
 * Provides default design tokens (spacing, typography, motion, etc.) that can be
 * selectively overridden by theme implementations. All themes must extend this class
 * and implement the required abstract methods.
 *
 * ## Features
 *
 * - **Default design tokens** - Sensible defaults for spacing, typography, motion, radius, opacity, breakpoints, focus, accessibility, zIndex
 * - **Selective overrides** - Override only what you need, inherit the rest
 * - **Deep merge support** - Partial overrides via ThemeBuilder's deep merge
 * - **Type safety** - TypeScript enforces complete theme definitions
 *
 * ## Usage
 *
 * ### Minimal Theme (Use All Defaults)
 *
 * ```typescript
 * import { ThemeBase } from '@blueprint/themes/builder';
 * import type { ThemeBuilder } from '@blueprint/themes/builder';
 *
 * export class MinimalTheme extends ThemeBase {
 *   id = 'minimal';
 *   version = '1.0.0';
 *   name = 'Minimal Theme';
 *   description = 'Simple theme with default design tokens';
 *   author = 'Your Name';
 *   license = 'MIT';
 *   tags = ['minimal'];
 *
 *   register(builder: ThemeBuilder) {
 *     builder.addColor('blue', {
 *       source: { l: 0.5, c: 0.15, h: 240 },
 *       scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
 *     });
 *
 *     builder.addThemeVariant('light', {
 *       background: builder.colors.gray50,
 *       text: builder.colors.gray900,
 *       primary: builder.colors.blue500,
 *     });
 *   }
 * }
 *
 * export const minimalTheme = new MinimalTheme();
 * ```
 *
 * ### Custom Spacing
 *
 * ```typescript
 * export class TightTheme extends ThemeBase {
 *   id = 'tight';
 *   version = '1.0.0';
 *   // ... other metadata
 *
 *   // Override spacing for a more compact UI
 *   protected spacing = {
 *     base: 3, // Smaller base unit (default is 4)
 *     scale: [0, 0.33, 0.67, 1, 1.33, 1.67, 2, 2.67, 3.33, 4, 5.33, 6.67, 8, 10.67, 13.33, 16],
 *     semantic: {
 *       xs: 0.67,
 *       sm: 1.33,
 *       md: 2.67,
 *       lg: 4,
 *       xl: 5.33,
 *     },
 *   };
 *
 *   register(builder: ThemeBuilder) {
 *     // ... register colors and variants
 *   }
 * }
 * ```
 *
 * ### Custom Motion
 *
 * ```typescript
 * export class SlowTheme extends ThemeBase {
 *   id = 'slow';
 *   version = '1.0.0';
 *   // ... other metadata
 *
 *   // Override motion for slower, more deliberate animations
 *   protected motion = {
 *     durations: {
 *       instant: 0,
 *       fast: 200,   // Slower than default 150ms
 *       normal: 400, // Slower than default 300ms
 *       slow: 600,   // Slower than default 500ms
 *     },
 *     easings: {
 *       linear: 'linear',
 *       in: 'cubic-bezier(0.32, 0, 0.67, 0)',
 *       out: 'cubic-bezier(0.33, 1, 0.68, 1)',
 *       inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
 *       bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
 *     },
 *     transitions: {
 *       fast: '200ms cubic-bezier(0.33, 1, 0.68, 1)',
 *       base: '400ms cubic-bezier(0.65, 0, 0.35, 1)',
 *       slow: '600ms cubic-bezier(0.65, 0, 0.35, 1)',
 *       bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
 *     },
 *   };
 *
 *   register(builder: ThemeBuilder) {
 *     // ... register colors and variants
 *   }
 * }
 * ```
 *
 * ### Multiple Overrides
 *
 * ```typescript
 * export class FullCustomTheme extends ThemeBase {
 *   id = 'full-custom';
 *   version = '1.0.0';
 *   // ... other metadata
 *
 *   // Override spacing
 *   protected spacing = {
 *     base: 8,
 *     scale: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
 *     semantic: { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 },
 *   };
 *
 *   // Override typography
 *   protected typography = {
 *     fontFamilies: {
 *       sans: 'Georgia, serif',
 *       mono: '"Courier New", monospace',
 *     },
 *     fontSizes: {
 *       xs: 14, sm: 16, base: 18, lg: 20, xl: 24,
 *       '2xl': 28, '3xl': 32, '4xl': 40,
 *     },
 *     lineHeights: {
 *       none: 1, tight: 1.3, snug: 1.45, normal: 1.6,
 *       relaxed: 1.75, loose: 2.2,
 *     },
 *     fontWeights: {
 *       normal: 400, medium: 500, semibold: 600, bold: 700,
 *     },
 *   };
 *
 *   // Override radius
 *   protected radius = {
 *     none: 0, sm: 4, md: 8, lg: 16, xl: 24,
 *     '2xl': 32, '3xl': 48, full: 9999,
 *   };
 *
 *   register(builder: ThemeBuilder) {
 *     // ... register colors and variants
 *   }
 * }
 * ```
 *
 * ## Design Token Reference
 *
 * All protected properties can be overridden:
 *
 * - `spacing` - Base unit, scale array, semantic values
 * - `typography` - Font families, sizes, line heights, weights
 * - `motion` - Durations, easings, transitions
 * - `radius` - Border radius scale
 * - `opacity` - Standard opacity values
 * - `breakpoints` - Responsive breakpoints
 * - `focus` - Focus indicator styling
 * - `accessibility` - WCAG rules and contrast requirements
 * - `zIndex` - Stacking order for UI layers
 *
 * @see {@link DesignTokens} for the complete type definition
 */

import type {
  ThemePlugin,
  ThemeBuilderInterface,
  ThemeConfig,
  ValidationError,
  SpacingConfig,
  MotionConfig,
  TypographyConfig,
  FocusConfig,
  AccessibilityConfig,
  PluginAssetDefinition,
} from '../core/types.js';

import {
  DEFAULT_SPACING,
  DEFAULT_RADIUS,
  DEFAULT_MOTION,
  DEFAULT_TYPOGRAPHY,
  DEFAULT_FOCUS,
  DEFAULT_Z_INDEX,
  DEFAULT_OPACITY,
  DEFAULT_BREAKPOINTS,
  DEFAULT_ACCESSIBILITY,
  DEFAULT_ICON_SIZES,
} from './defaults.js';

/**
 * Design tokens returned by getDesignTokens()
 * This is the shape that ThemeBuilder expects for merging
 */
export interface DesignTokens {
  spacing: SpacingConfig;
  radius: Record<string, number>;
  motion: MotionConfig;
  typography: TypographyConfig;
  iconSizes: Record<string, number>;
  focus: FocusConfig;
  zIndex: Record<string, number>;
  opacity: Record<string, number>;
  breakpoints: Record<string, string>;
  accessibility: AccessibilityConfig;
}

/**
 * Abstract base class for theme plugins
 *
 * Provides default design tokens (spacing, typography, motion, etc.) that can be
 * overridden by subclasses. Themes must implement the required ThemePlugin interface
 * methods (register, id, version).
 *
 * Design tokens are exposed as protected properties so subclasses can override them
 * while keeping the implementation details private from external consumers.
 */
export abstract class ThemeBase implements ThemePlugin {
  // ============================================================================
  // Required ThemePlugin metadata - must be implemented by subclasses
  // ============================================================================

  abstract readonly id: string;
  abstract readonly version: string;

  // ============================================================================
  // Optional ThemePlugin metadata
  // ============================================================================

  readonly name?: string;
  readonly description?: string;
  readonly author?: string;
  readonly license?: string;
  readonly homepage?: string;
  readonly tags?: string[];

  // ============================================================================
  // Protected design token properties - can be overridden by subclasses
  // ============================================================================

  protected spacing: SpacingConfig = {
    base: DEFAULT_SPACING.base,
    scale: [...DEFAULT_SPACING.scale],
    semantic: { ...DEFAULT_SPACING.semantic },
  };
  protected radius: Record<string, number> = { ...DEFAULT_RADIUS };
  protected motion: MotionConfig = {
    durations: { ...DEFAULT_MOTION.durations },
    easings: { ...DEFAULT_MOTION.easings },
    transitions: { ...DEFAULT_MOTION.transitions },
  };
  protected typography: TypographyConfig = {
    fontFamilies: { ...DEFAULT_TYPOGRAPHY.fontFamilies },
    fontSizes: { ...DEFAULT_TYPOGRAPHY.fontSizes },
    lineHeights: { ...DEFAULT_TYPOGRAPHY.lineHeights },
    fontWeights: { ...DEFAULT_TYPOGRAPHY.fontWeights },
  };
  protected focus: FocusConfig = { ...DEFAULT_FOCUS };
  protected iconSizes: Record<string, number> = { ...DEFAULT_ICON_SIZES };
  protected zIndex: Record<string, number> = { ...DEFAULT_Z_INDEX };
  protected opacity: Record<string, number> = { ...DEFAULT_OPACITY };
  protected breakpoints: Record<string, string> = { ...DEFAULT_BREAKPOINTS };
  protected accessibility: AccessibilityConfig = { ...DEFAULT_ACCESSIBILITY };

  // ============================================================================
  // Required ThemePlugin lifecycle methods
  // ============================================================================

  /**
   * Register colors and theme variants with the builder
   * Must be implemented by all theme subclasses
   */
  abstract register(builder: ThemeBuilderInterface): void | Promise<void>;

  // ============================================================================
  // Optional ThemePlugin lifecycle hooks
  // ============================================================================

  /**
   * Optional: Run before theme is built
   */
  beforeBuild?(config: Partial<ThemeConfig>): void;

  /**
   * Optional: Run after theme is built
   */
  afterBuild?(config: ThemeConfig): void;

  /**
   * Optional: Custom validation logic
   */
  validate?(config: ThemeConfig): ValidationError[];

  // ============================================================================
  // Public API for accessing design tokens
  // ============================================================================

  /**
   * Define static assets bundled with this plugin.
   * Override to provide fonts, images, or other assets.
   *
   * @returns Array of asset definitions, or empty array if no assets
   * @example
   * ```typescript
   * getAssets(): PluginAssetDefinition[] {
   *   return [
   *     {
   *       type: 'font',
   *       path: 'fonts/MyFont.woff2',
   *       family: 'My Font',
   *       weight: '400 700',
   *       display: 'swap',
   *     },
   *   ];
   * }
   * ```
   */
  getAssets(): PluginAssetDefinition[] {
    return [];
  }

  /**
   * Get all design tokens as a plain object for merging
   * Used by ThemeBuilder to combine tokens from multiple themes
   */
  getDesignTokens(): DesignTokens {
    return {
      spacing: this.spacing,
      radius: this.radius,
      motion: this.motion,
      typography: this.typography,
      iconSizes: this.iconSizes,
      focus: this.focus,
      zIndex: this.zIndex,
      opacity: this.opacity,
      breakpoints: this.breakpoints,
      accessibility: this.accessibility,
    };
  }

  // ============================================================================
  // Helper methods for subclasses to access defaults
  // ============================================================================

  /**
   * Get default spacing config (for subclass overrides)
   */
  protected getDefaultSpacing(): SpacingConfig {
    return {
      base: DEFAULT_SPACING.base,
      scale: [...DEFAULT_SPACING.scale],
      semantic: { ...DEFAULT_SPACING.semantic },
    };
  }

  /**
   * Get default radius config (for subclass overrides)
   */
  protected getDefaultRadius(): Record<string, number> {
    return { ...DEFAULT_RADIUS };
  }

  /**
   * Get default motion config (for subclass overrides)
   */
  protected getDefaultMotion(): MotionConfig {
    return {
      durations: { ...DEFAULT_MOTION.durations },
      easings: { ...DEFAULT_MOTION.easings },
      transitions: { ...DEFAULT_MOTION.transitions },
    };
  }

  /**
   * Get default typography config (for subclass overrides)
   */
  protected getDefaultTypography(): TypographyConfig {
    return {
      fontFamilies: { ...DEFAULT_TYPOGRAPHY.fontFamilies },
      fontSizes: { ...DEFAULT_TYPOGRAPHY.fontSizes },
      lineHeights: { ...DEFAULT_TYPOGRAPHY.lineHeights },
      fontWeights: { ...DEFAULT_TYPOGRAPHY.fontWeights },
    };
  }

  /**
   * Get default focus config (for subclass overrides)
   */
  protected getDefaultFocus(): FocusConfig {
    return { ...DEFAULT_FOCUS };
  }

  /**
   * Get default z-index config (for subclass overrides)
   */
  protected getDefaultZIndex(): Record<string, number> {
    return { ...DEFAULT_Z_INDEX };
  }

  /**
   * Get default opacity config (for subclass overrides)
   */
  protected getDefaultOpacity(): Record<string, number> {
    return { ...DEFAULT_OPACITY };
  }

  /**
   * Get default breakpoints config (for subclass overrides)
   */
  protected getDefaultBreakpoints(): Record<string, string> {
    return { ...DEFAULT_BREAKPOINTS };
  }

  /**
   * Get default accessibility config (for subclass overrides)
   */
  protected getDefaultAccessibility(): AccessibilityConfig {
    return { ...DEFAULT_ACCESSIBILITY };
  }
}
