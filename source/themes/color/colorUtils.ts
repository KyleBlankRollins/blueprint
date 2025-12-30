/**
 * Color utilities for OKLCH manipulation, conversion, and validation
 * Uses culori for accurate color math and WCAG contrast calculations
 */

import { formatHex, wcagContrast, oklch } from 'culori';
import type { OKLCHColor } from '../core/types.js';

// Constants for OKLCH color space constraints
const MAX_CHROMA = 0.4;

/**
 * Convert OKLCH color to hex string
 */
export function convertOKLCHtoHex(color: OKLCHColor): string {
  const oklchColor = oklch({
    mode: 'oklch',
    l: color.l,
    c: color.c,
    h: color.h,
  });

  if (!oklchColor) {
    return '#000000';
  }

  const hex = formatHex(oklchColor);
  return hex ?? '#000000';
}

/**
 * Convert hex string to OKLCH color
 */
export function convertHexToOKLCH(hex: string): OKLCHColor {
  const color = oklch(hex);

  if (!color) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return {
    l: color.l ?? 0,
    c: color.c ?? 0,
    h: color.h ?? 0,
  };
}

/**
 * Calculate WCAG contrast ratio between two colors
 * @param foreground - Foreground color (OKLCH or hex)
 * @param background - Background color (OKLCH or hex)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(
  foreground: OKLCHColor | string,
  background: OKLCHColor | string
): number {
  const fgColor =
    typeof foreground === 'string' ? foreground : convertOKLCHtoHex(foreground);
  const bgColor =
    typeof background === 'string' ? background : convertOKLCHtoHex(background);

  const ratio = wcagContrast(fgColor, bgColor);
  return ratio ?? 1;
}

/**
 * Check if contrast ratio meets WCAG requirements
 * @param ratio - Contrast ratio
 * @param level - WCAG level ('AA' or 'AAA')
 * @param largeText - Whether this is large text (18px+ or 14px+ bold)
 */
export function meetsWCAG(
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  largeText = false
): boolean {
  if (level === 'AAA') {
    return largeText ? ratio >= 4.5 : ratio >= 7.0;
  }
  return largeText ? ratio >= 3.0 : ratio >= 4.5;
}

/**
 * Adjust OKLCH color lightness
 * @param color - OKLCH color to adjust
 * @param amount - Amount to adjust lightness by (-1 to 1)
 * @returns New OKLCH color with adjusted lightness
 */
export function adjustLightness(color: OKLCHColor, amount: number): OKLCHColor {
  return {
    ...color,
    l: Math.max(0, Math.min(1, color.l + amount)),
  };
}

/**
 * Adjust OKLCH color chroma
 * @param color - OKLCH color to adjust
 * @param amount - Amount to adjust chroma by
 * @returns New OKLCH color with adjusted chroma
 */
export function adjustChroma(color: OKLCHColor, amount: number): OKLCHColor {
  return {
    ...color,
    c: Math.max(0, Math.min(MAX_CHROMA, color.c + amount)),
  };
}

/**
 * Adjust OKLCH color hue
 * @param color - OKLCH color to adjust
 * @param degrees - Degrees to rotate hue by (positive or negative)
 * @returns New OKLCH color with adjusted hue
 */
export function adjustHue(color: OKLCHColor, degrees: number): OKLCHColor {
  return {
    ...color,
    h: (((color.h + degrees) % 360) + 360) % 360,
  };
}

/**
 * Interpolate between two OKLCH colors
 * @param color1 - Starting color
 * @param color2 - Ending color
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated OKLCH color
 */
export function interpolateOKLCH(
  color1: OKLCHColor,
  color2: OKLCHColor,
  t: number
): OKLCHColor {
  // Calculate shortest path for hue interpolation
  let hueDiff = color2.h - color1.h;
  if (hueDiff > 180) {
    hueDiff -= 360;
  } else if (hueDiff < -180) {
    hueDiff += 360;
  }

  return {
    l: color1.l + (color2.l - color1.l) * t,
    c: color1.c + (color2.c - color1.c) * t,
    h: (((color1.h + hueDiff * t) % 360) + 360) % 360,
  };
}

/**
 * Format OKLCH color for CSS
 * @param color - OKLCH color to format
 * @returns CSS oklch() function string
 */
export function formatOKLCHforCSS(color: OKLCHColor): string {
  return `oklch(${color.l.toFixed(2)} ${color.c.toFixed(2)} ${color.h.toFixed(1)})`;
}

/**
 * Calculate hue difference between two colors (0-180 degrees)
 */
export function getHueDifference(
  color1: OKLCHColor,
  color2: OKLCHColor
): number {
  const diff = Math.abs(color1.h - color2.h);
  return Math.min(diff, 360 - diff);
}

/**
 * Validate OKLCH color values are in valid ranges
 * @param color - OKLCH color to validate
 * @returns True if all color values are within valid ranges
 */
export function isValidOKLCH(color: OKLCHColor): boolean {
  return (
    color.l >= 0 &&
    color.l <= 1 &&
    color.c >= 0 &&
    color.c <= MAX_CHROMA &&
    color.h >= 0 &&
    color.h < 360
  );
}
