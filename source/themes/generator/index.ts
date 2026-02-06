/**
 * CSS generation utilities
 * Generate CSS files from theme configurations
 */

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
} from './generateCSS.js';

// Re-export types from core
export type { ThemeConfig, GeneratedColorStep } from '../core/index.js';
