/**
 * Core theme system types and constants
 * Foundational definitions used throughout the theme system
 */

export type {
  ColorStep,
  ColorRef,
  ThemeVariant,
  OKLCHColor,
  ColorDefinition,
  SemanticTokens,
  PluginDependency,
  ValidationError,
  ValidationWarning,
  ValidationResult,
  ThemePlugin,
  ThemeBuilderInterface,
  ColorScale,
  DarkModeAdjustments,
  SpacingConfig,
  MotionConfig,
  TypographyConfig,
  FocusConfig,
  AccessibilityConfig,
  ThemeConfig,
  GeneratedColorStep,
  ContrastViolation,
} from './types.js';

export { isOKLCHColor, isColorScale } from './types.js';
