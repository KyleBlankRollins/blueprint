/**
 * Color system utilities and tools
 * OKLCH color manipulation, scale generation, and validation
 */

// Color utilities and conversion
export {
  isValidOKLCH,
  convertOKLCHtoHex,
  formatOKLCHforCSS,
  adjustLightness,
  adjustChroma,
  adjustHue,
  getContrastRatio,
  meetsWCAG,
} from './colorUtils.js';

// Color reference system
export { createColorRefs } from './colorRefs.js';
export {
  createColorRef,
  serializeColorRef,
  parseColorRef,
  isColorRef,
} from './colorRefUtils.js';

// Color scale generation
export {
  generateColorScale,
  generateAllColorScales,
} from './generateColorScale.js';

// Contrast validation
export { validateThemeContrast } from './validateContrast.js';

// Re-export types from core
export type {
  OKLCHColor,
  ColorRef,
  ColorStep,
  ColorScale,
  ColorDefinition,
} from '../core/index.js';
