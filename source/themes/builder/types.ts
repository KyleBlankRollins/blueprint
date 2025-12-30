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
  readonly themes: Record<ThemeVariant, Record<string, string>> &
    Record<string, Record<string, string>>;
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
  /** Foreground color */
  foreground: string;
  /** Background color */
  background: string;
  /** Actual contrast ratio */
  ratio: number;
  /** Required contrast ratio */
  required: number;
}

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
