/**
 * Main theme system exports
 * Organized by feature module for clarity
 */

// Core types and constants
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
  ThemeConfig,
} from './core/index.js';

// Color system
export {
  isValidOKLCH,
  convertOKLCHtoHex,
  formatOKLCHforCSS,
  adjustLightness,
  adjustChroma,
  adjustHue,
  getContrastRatio,
  meetsWCAG,
  createColorRefs,
  createColorRef,
  serializeColorRef,
  parseColorRef,
  isColorRef,
  generateColorScale,
  generateAllColorScales,
  validateThemeContrast,
} from './color/index.js';

// CSS generation
export {
  generatePrimitivesCSS,
  generateThemeCSS,
  generateSpacingCSS,
  generateRadiusCSS,
  generateMotionCSS,
  generateTypographyCSS,
  generateIconSizeCSS,
  generateUtilityCSS,
  generateReducedMotionCSS,
  generateHighContrastCSS,
  generateIndexCSS,
} from './generator/index.js';

// Theme builder
export {
  ThemeBuilder,
  ThemeValidator,
  defineTheme,
  buildTheme,
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
} from './builder/index.js';

export type { GeneratedFiles } from './builder/index.js';

// Theme exports for runtime use
export const lightTheme = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./light.css', import.meta.url).href;
  document.head.appendChild(link);
};
