/**
 * Theme system type definitions
 * These types define the structure of theme configurations and generated themes.
 */

/** Standard color scale steps (50-950) */
export type ColorStep =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

/**
 * Opaque type for color references
 * Provides type safety when referencing colors in theme variants
 * Uses branded type pattern for runtime compatibility
 */
export type ColorRef = {
  readonly __colorRef: symbol;
  readonly colorName: string;
  readonly step: number;
};

/** Standard theme variant names */
export type ThemeVariant = 'light' | 'dark';

export interface OKLCHColor {
  /** Lightness (0-1) */
  l: number;
  /** Chroma (0-0.4 typical) */
  c: number;
  /** Hue (0-360) */
  h: number;
}

/**
 * Color definition for theme plugins
 */
export interface ColorDefinition {
  /** Source OKLCH color (typically the 500 step) */
  source: OKLCHColor;
  /** Scale steps to generate (e.g., [50, 100, 200, ..., 950]) */
  scale: readonly number[];
  /** Optional metadata about the color */
  metadata?: {
    name?: string;
    description?: string;
    tags?: string[];
  };
}

/**
 * Semantic tokens for theme variants
 * Generic over color reference type for flexibility
 */
export interface SemanticTokens<TColorRef = ColorRef | string> {
  // Backgrounds
  background: TColorRef;
  surface: TColorRef;
  surfaceElevated: TColorRef;
  surfaceSubdued: TColorRef;

  // Text
  text: TColorRef;
  textStrong: TColorRef;
  textMuted: TColorRef;
  textInverse: TColorRef;

  // Primary brand
  primary: TColorRef;
  primaryHover: TColorRef;
  primaryActive: TColorRef;

  // Semantic states
  success: TColorRef;
  warning: TColorRef;
  error: TColorRef;
  info: TColorRef;

  // UI elements
  border: TColorRef;
  borderStrong: TColorRef;
  borderWidth: string;
  focus: TColorRef;
  backdrop: TColorRef;

  // Typography
  fontFamily: string;
  fontFamilyMono: string;
  fontFamilyHeading: string;

  // Border radius
  borderRadius: string;
  borderRadiusLarge: string;
  borderRadiusFull: string;

  // Shadows
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
}

/**
 * Plugin dependency specification
 */
export interface PluginDependency {
  /** Plugin ID */
  id: string;
  /** Semver version range (optional) */
  version?: string;
  /** Whether this dependency is optional */
  optional?: boolean;
}

/**
 * Validation error from theme validation
 */
export interface ValidationError {
  /** Plugin that generated the error (if applicable) */
  plugin?: string;
  /** Type of validation error */
  type:
    | 'missing_color'
    | 'invalid_ref'
    | 'contrast_violation'
    | 'duplicate_id'
    | 'dependency_missing'
    | 'accessibility'
    | 'missing_token';
  /** Human-readable error message */
  message: string;
  /** Additional context about the error */
  context?: Record<string, unknown>;
}

/**
 * Validation warning from theme validation
 */
export interface ValidationWarning {
  /** Plugin that generated the warning (if applicable) */
  plugin?: string;
  /** Type of validation warning */
  type: 'low_contrast' | 'similar_colors' | 'deprecated_api';
  /** Human-readable warning message */
  message: string;
  /** Suggested fix */
  suggestion?: string;
}

/**
 * Result of theme validation
 */
export interface ValidationResult {
  /** Whether the theme is valid */
  valid: boolean;
  /** Validation errors (prevent build) */
  errors: ValidationError[];
  /** Validation warnings (allow build but may cause issues) */
  warnings: ValidationWarning[];
}

/**
 * Theme builder interface for plugin registration
 * This is the API that plugins interact with during registration
 */
export interface ThemeBuilderInterface {
  readonly colors: Record<string, ColorRef>;
  addColor(name: string, config: ColorDefinition): ThemeBuilderInterface;
  getColor(name: string): ColorDefinition | undefined;
  hasColor(name: string): boolean;
  addThemeVariant(
    name: string,
    tokens: SemanticTokens<ColorRef | string>
  ): ThemeBuilderInterface;
  getThemeVariant(name: string): SemanticTokens<ColorRef> | undefined;
  extendThemeVariant(
    baseName: string,
    newName: string,
    overrides: Partial<SemanticTokens<ColorRef>>
  ): ThemeBuilderInterface;
}

/**
 * Theme plugin interface
 * All theme plugins must implement this interface
 */
export interface ThemePlugin {
  // Required metadata
  /** Unique plugin identifier */
  id: string;
  /** Semantic version */
  version: string;

  // Optional metadata
  /** Display name */
  name?: string;
  /** Plugin description */
  description?: string;
  /** Author name or email */
  author?: string;
  /** License identifier */
  license?: string;
  /** Plugin homepage URL */
  homepage?: string;
  /** Tags for categorization */
  tags?: string[];

  // Dependencies
  /** Required plugin dependencies */
  dependencies?: PluginDependency[];
  /** Plugins this works well with */
  peerPlugins?: string[];

  // Lifecycle hooks
  /** Register colors, themes, and other config with the builder */
  register(builder: ThemeBuilderInterface): void | Promise<void>;
  /** Run before theme is built */
  beforeBuild?(config: Partial<ThemeConfig>): void;
  /** Run after theme is built */
  afterBuild?(config: ThemeConfig): void;
  /** Custom validation logic */
  validate?(config: ThemeConfig): ValidationError[];
}

export interface ColorScale {
  /** Source OKLCH color (typically the 500 step) */
  source: OKLCHColor;
  /** Scale steps to generate (e.g., [50, 100, 200, ..., 950]) */
  scale: ColorStep[];
}

export interface DarkModeAdjustments {
  /** Multiply chroma by this factor for dark backgrounds (default: 0.85) */
  chromaMultiplier?: number;
  /** Boost contrast for better readability (default: 1.1) */
  contrastBoost?: number;
}

export interface SpacingConfig {
  /** Base unit in pixels */
  base: number;
  /** Scale multipliers */
  scale: number[];
  /** Semantic spacing names mapped to scale indices */
  semantic?: Record<string, number>;
}

export interface MotionConfig {
  /** Duration values in milliseconds */
  durations: Record<string, number>;
  /** Easing function definitions */
  easings: Record<string, string>;
  /** Combined transition presets (duration + easing) */
  transitions?: Record<string, string>;
}

export interface TypographyConfig {
  /** Font family stacks */
  fontFamilies: Record<string, string>;
  /** Font sizes in pixels */
  fontSizes: Record<string, number>;
  /** Line height values */
  lineHeights: Record<string, number>;
  /** Font weights */
  fontWeights?: Record<string, number>;
}

export interface FocusConfig {
  /** Focus ring width in pixels */
  width: number;
  /** Focus ring offset in pixels */
  offset: number;
  /** Focus ring style */
  style: 'solid' | 'dashed' | 'dotted' | 'double';
}

export interface AccessibilityConfig {
  /** Enforce WCAG contrast requirements */
  enforceWCAG?: boolean;
  /** Minimum contrast ratios for different contexts */
  minimumContrast?: {
    /** Normal text (WCAG AA: 4.5:1) */
    text: number;
    /** Large text 18px+ (WCAG AA: 3.0:1) */
    textLarge: number;
    /** UI components like borders, icons (WCAG AA: 3.0:1) */
    ui: number;
    /** Interactive states (hover/active) */
    interactive: number;
    /** Focus indicators */
    focus: number;
  };
  /** Ensure colors are distinguishable for colorblind users */
  colorBlindSafe?: boolean;
  /** Minimum hue difference in degrees between semantic colors */
  minHueDifference?: number;
  /** Support high contrast mode */
  highContrast?: boolean;
}

export interface ThemeConfig {
  /** Color definitions and scales */
  readonly colors: Record<string, ColorScale>;
  /** Dark mode color adjustments */
  readonly darkMode?: DarkModeAdjustments;
  /** Spacing scale */
  readonly spacing: SpacingConfig;
  /** Border radius values */
  readonly radius: Record<string, number>;
  /** Motion/animation settings */
  readonly motion: MotionConfig;
  /** Typography settings */
  readonly typography: TypographyConfig;
  /** Focus indicator settings */
  readonly focus?: FocusConfig;
  /** Z-index scale */
  readonly zIndex?: Record<string, number>;
  /** Opacity scale */
  readonly opacity?: Record<string, number>;
  /** Responsive breakpoints */
  readonly breakpoints?: Record<string, string>;
  /** Theme variant definitions (must include light and dark) */
  readonly themes: Record<ThemeVariant, Record<string, string | OKLCHColor>> &
    Record<string, Record<string, string | OKLCHColor>>;
  /** Theme metadata - maps variant names to their plugin IDs */
  readonly themeMetadata?: Record<string, { pluginId?: string }>;
  /** Accessibility validation rules */
  readonly accessibility?: AccessibilityConfig;
}

export interface GeneratedColorStep {
  /** OKLCH color value (modern browsers with @supports) */
  oklch: OKLCHColor;
  /** Hex color value (fallback for older browsers) */
  hex: string;
}

export interface ContrastViolation {
  /** Token that violates contrast requirements */
  token: string;
  /** Foreground color (hex string or OKLCH object) */
  foreground: string | OKLCHColor;
  /** Background color (hex string or OKLCH object) */
  background: string | OKLCHColor;
  /** Actual contrast ratio */
  ratio: number;
  /** Required contrast ratio */
  required: number;
}

// ============================================================================
// Plugin Asset Types
// ============================================================================

/**
 * Font asset with metadata for @font-face generation
 */
export interface FontAssetDefinition {
  type: 'font';
  /** Path relative to plugin's assets/ directory (e.g., 'fonts/Figtree.woff2') */
  path: string;
  /** Font family name for @font-face */
  family: string;
  /** Font weight - single value or range (e.g., '400' or '100 900' for variable) */
  weight?: string;
  /** Font style (e.g., 'normal', 'italic') */
  style?: string;
  /** Font display strategy */
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  /** Unicode range (optional, for subsetting) */
  unicodeRange?: string;
}

/**
 * Generic asset (images, icons, other files)
 */
export interface GenericAssetDefinition {
  type: 'image' | 'icon' | 'other';
  /** Path relative to plugin's assets/ directory */
  path: string;
}

/**
 * Union type for all asset definitions
 */
export type PluginAssetDefinition = FontAssetDefinition | GenericAssetDefinition;

/**
 * Resolved asset with full paths (internal use during build)
 */
export interface ResolvedAsset {
  /** Original definition */
  definition: PluginAssetDefinition;
  /** Plugin that owns this asset */
  pluginId: string;
  /** Absolute source path */
  sourcePath: string;
  /** Relative target path from output directory */
  targetPath: string;
}

/**
 * Result of copying plugin assets
 */
export interface AssetCopyResult {
  /** Successfully copied asset paths */
  copied: string[];
  /** Warning messages (e.g., large file sizes) */
  warnings: string[];
}

// ============================================================================
// Runtime type guards for validation
// ============================================================================

/**
 * Runtime type guards for validation
 * Use these to validate user input at runtime
 */

/**
 * Check if a value is a valid OKLCH color
 * Note: Does not validate ranges (use isValidOKLCH from colorUtils for that)
 */
export function isOKLCHColor(value: unknown): value is OKLCHColor {
  return (
    typeof value === 'object' &&
    value !== null &&
    'l' in value &&
    'c' in value &&
    'h' in value &&
    typeof (value as OKLCHColor).l === 'number' &&
    typeof (value as OKLCHColor).c === 'number' &&
    typeof (value as OKLCHColor).h === 'number'
  );
}

/**
 * Check if a value is a valid ColorScale
 */
export function isColorScale(value: unknown): value is ColorScale {
  return (
    typeof value === 'object' &&
    value !== null &&
    'source' in value &&
    'scale' in value &&
    isOKLCHColor((value as ColorScale).source) &&
    Array.isArray((value as ColorScale).scale) &&
    (value as ColorScale).scale.every(
      (step): step is ColorStep =>
        typeof step === 'number' &&
        [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].includes(step)
    )
  );
}
