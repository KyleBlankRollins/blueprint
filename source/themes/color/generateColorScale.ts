/**
 * Generate color scales from source OKLCH colors
 * Creates 11-step scales (50-950) with perceptually uniform progression
 */

import type {
  OKLCHColor,
  GeneratedColorStep,
  DarkModeAdjustments,
} from '../core/types.js';
import { convertOKLCHtoHex, isValidOKLCH } from './colorUtils.js';

/**
 * Lightness curve calibration for color scales
 *
 * These values define the lightness (L in OKLCH) at each step.
 * Carefully calibrated for balanced visual distribution:
 * - 50: Very light (0.95) for subtle backgrounds
 * - 500: Source lightness (anchor point)
 * - 950: Very dark (0.27 × source.l) for maximum contrast
 *
 * Non-linear progression ensures perceptually uniform steps.
 */
const BASE_LIGHTNESS_CURVE: Record<number, number> = {
  50: 0.95,
  100: 0.9,
  200: 0.8,
  300: 0.7,
  400: 0.65,
  500: 1.0, // Multiplier for source.l
  600: 0.91,
  700: 0.82,
  800: 0.64,
  900: 0.45,
  950: 0.27,
} as const;

/**
 * Chroma curve calibration for color scales
 *
 * These values define the chroma (C in OKLCH) at each step.
 * Reduces saturation at extremes for better visual balance:
 * - Very light colors (50-200): Low chroma for subtle tints
 * - Mid-range (400-600): Full chroma for vibrant colors
 * - Very dark colors (900-950): Reduced chroma to avoid muddiness
 */
const BASE_CHROMA_CURVE: Record<number, number> = {
  50: 0.13,
  100: 0.27,
  200: 0.4,
  300: 0.6,
  400: 0.8,
  500: 1.0,
  600: 1.0,
  700: 0.93,
  800: 0.8,
  900: 0.67,
  950: 0.4,
} as const;

/**
 * Apply contrast boost to lightness values
 *
 * Boosts contrast by moving lightness values away from middle gray (0.5):
 * - Light colors (>0.5): pushed toward white (1.0)
 * - Dark colors (<0.5): pushed toward black (0.0)
 *
 * Formula:
 * - For light: L + (1 - L) × (boost - 1)
 * - For dark: L - L × (boost - 1)
 *
 * @param lightness - Base lightness value (0-1)
 * @param boost - Contrast boost factor (e.g., 1.1 = 10% more contrast)
 * @returns Boosted lightness value, clamped to 0-1
 */
function applyContrastBoost(lightness: number, boost: number): number {
  if (boost === 1.0) {
    return lightness;
  }

  const boosted =
    lightness > 0.5
      ? lightness + (1 - lightness) * (boost - 1)
      : lightness - lightness * (boost - 1);

  return Math.max(0, Math.min(1, boosted));
}

/**
 * Generate an 11-step color scale (50-950) from a source OKLCH color
 * @param source - Base OKLCH color (typically the 500 step)
 * @param steps - Scale steps to generate (default: [50, 100, 200, ..., 950])
 * @param darkModeAdjustments - Optional chroma/contrast adjustments for dark mode
 * @throws {Error} If source color is invalid or unsupported steps are provided
 * @returns Color scale with OKLCH and hex values for each step
 */
export function generateColorScale(
  source: OKLCHColor,
  steps: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  darkModeAdjustments?: DarkModeAdjustments
): Record<number, GeneratedColorStep> {
  // Validate source color
  if (!isValidOKLCH(source)) {
    throw new Error(
      `Invalid source OKLCH color: L=${source.l}, C=${source.c}, H=${source.h}`
    );
  }

  // Validate all steps are supported
  const supportedSteps = Object.keys(BASE_LIGHTNESS_CURVE).map(Number);
  for (const step of steps) {
    if (!supportedSteps.includes(step)) {
      throw new Error(
        `Unsupported color step: ${step}. Supported steps: ${supportedSteps.join(', ')}`
      );
    }
  }

  const scale: Record<number, GeneratedColorStep> = {};

  // Apply dark mode adjustments if provided
  const chromaMultiplier = darkModeAdjustments?.chromaMultiplier ?? 1.0;
  const contrastBoost = darkModeAdjustments?.contrastBoost ?? 1.0;

  // Build lightness map from base curve and source color
  const lightnessMap: Record<number, number> = {};
  for (const [step, multiplier] of Object.entries(BASE_LIGHTNESS_CURVE)) {
    const stepNum = Number(step);
    const baseLightness = stepNum === 500 ? source.l : source.l * multiplier;
    lightnessMap[stepNum] = applyContrastBoost(baseLightness, contrastBoost);
  }

  // Build chroma map from base curve and source color
  const chromaMap: Record<number, number> = {};
  for (const [step, multiplier] of Object.entries(BASE_CHROMA_CURVE)) {
    chromaMap[Number(step)] = source.c * multiplier * chromaMultiplier;
  }

  // Generate each step in the scale
  for (const step of steps) {
    const oklch: OKLCHColor = {
      l: lightnessMap[step],
      c: chromaMap[step],
      h: source.h, // Hue remains constant across the scale
    };

    scale[step] = {
      oklch,
      hex: convertOKLCHtoHex(oklch),
    };
  }

  return scale;
}

/**
 * Generate all color scales from theme config
 */
export function generateAllColorScales(
  colors: Record<string, { source: OKLCHColor; scale: number[] }>,
  darkModeAdjustments?: DarkModeAdjustments
): Record<string, Record<number, GeneratedColorStep>> {
  const result: Record<string, Record<number, GeneratedColorStep>> = {};

  for (const [colorName, colorConfig] of Object.entries(colors)) {
    result[colorName] = generateColorScale(
      colorConfig.source,
      colorConfig.scale,
      darkModeAdjustments
    );
  }

  return result;
}
