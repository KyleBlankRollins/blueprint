/**
 * Base class for class-based theme definitions
 *
 * Provides default design tokens that can be overridden by theme plugins.
 * All themes must extend this class and implement required color/variant properties.
 *
 * @example
 * ```typescript
 * export class MyTheme extends ThemeBase {
 *   id = 'my-theme';
 *   version = '1.0.0';
 *   name = 'My Theme';
 *
 *   // Override specific spacing values
 *   protected spacing = {
 *     ...this.getDefaultSpacing(),
 *     semantic: { xs: 2, sm: 4, md: 8, lg: 12, xl: 16 }
 *   };
 *
 *   register(builder: ThemeBuilderInterface): void {
 *     builder.addColor('primary', { ... });
 *     builder.addThemeVariant('light', { ... });
 *   }
 * }
 * ```
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
   * Get all design tokens as a plain object for merging
   * Used by ThemeBuilder to combine tokens from multiple themes
   */
  getDesignTokens(): DesignTokens {
    return {
      spacing: this.spacing,
      radius: this.radius,
      motion: this.motion,
      typography: this.typography,
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
