/**
 * Color Picker Utilities
 *
 * Pure functions for color parsing, conversion, and formatting.
 * Supports HEX, RGB, HSL formats with alpha channel.
 */

/**
 * Internal HSV color representation
 */
export interface HSVColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
  a: number; // 0-1
}

/**
 * RGB color representation
 */
export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-1
}

/**
 * HSL color representation
 */
export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a: number; // 0-1
}

/**
 * Color output format
 */
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

/**
 * Parses a color string and returns HSV representation
 * @param value Color string in hex, rgb, or hsl format
 * @returns HSV color object or null if parsing fails
 */
export function parseColor(value: string): HSVColor | null {
  if (!value) return null;

  value = value.trim().toLowerCase();

  // HEX format
  if (value.startsWith('#')) {
    return parseHex(value);
  }

  // RGB/RGBA format
  if (value.startsWith('rgb')) {
    return parseRgb(value);
  }

  // HSL/HSLA format
  if (value.startsWith('hsl')) {
    return parseHsl(value);
  }

  return null;
}

/**
 * Parses a hex color string to HSV
 * @param hex Hex color string (with or without #, 3/4/6/8 digits)
 * @returns HSV color object or null if invalid
 */
export function parseHex(hex: string): HSVColor | null {
  hex = hex.replace('#', '');

  let r: number,
    g: number,
    b: number,
    a = 1;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    a = parseInt(hex[3] + hex[3], 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (hex.length === 8) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    a = parseInt(hex.substring(6, 8), 16) / 255;
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
    return null;
  }

  return rgbToHsv({ r, g, b, a });
}

/**
 * Parses an rgb/rgba color string to HSV
 * @param rgb RGB color string (e.g., 'rgb(255, 87, 51)' or 'rgba(255, 87, 51, 0.5)')
 * @returns HSV color object or null if invalid
 */
export function parseRgb(rgb: string): HSVColor | null {
  const match = rgb.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/
  );
  if (!match) return null;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  return rgbToHsv({ r, g, b, a });
}

/**
 * Parses an hsl/hsla color string to HSV
 * @param hsl HSL color string (e.g., 'hsl(14, 100%, 60%)' or 'hsla(14, 100%, 60%, 0.5)')
 * @returns HSV color object or null if invalid
 */
export function parseHsl(hsl: string): HSVColor | null {
  const match = hsl.match(
    /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)/
  );
  if (!match) return null;

  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]);
  const l = parseFloat(match[3]);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  return hslToHsv({ h, s, l, a });
}

/**
 * Converts RGB color to HSV color space
 * @param rgb RGB color object with r, g, b (0-255) and a (0-1)
 * @returns HSV color object with h (0-360), s (0-100), v (0-100), a (0-1)
 */
export function rgbToHsv(rgb: RGBColor): HSVColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }

  if (h < 0) h += 360;

  return { h, s, v, a: rgb.a };
}

/**
 * Converts HSV color to RGB color space
 * @param hsv HSV color object with h (0-360), s (0-100), v (0-100), a (0-1)
 * @returns RGB color object with r, g, b (0-255) and a (0-1)
 */
export function hsvToRgb(hsv: HSVColor): RGBColor {
  const h = hsv.h;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a: hsv.a,
  };
}

/**
 * Converts HSL color to HSV color space
 * @param hsl HSL color object with h (0-360), s (0-100), l (0-100), a (0-1)
 * @returns HSV color object with h (0-360), s (0-100), v (0-100), a (0-1)
 */
export function hslToHsv(hsl: HSLColor): HSVColor {
  const h = hsl.h;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const v = l + s * Math.min(l, 1 - l);
  const sv = v === 0 ? 0 : 2 * (1 - l / v);

  return { h, s: sv * 100, v: v * 100, a: hsl.a };
}

/**
 * Converts HSV color to HSL color space
 * @param hsv HSV color object with h (0-360), s (0-100), v (0-100), a (0-1)
 * @returns HSL color object with h (0-360), s (0-100), l (0-100), a (0-1)
 */
export function hsvToHsl(hsv: HSVColor): HSLColor {
  const h = hsv.h;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

  return { h, s: sl * 100, l: l * 100, a: hsv.a };
}

/**
 * Rounds alpha value to 2 decimal places
 * @param a Alpha value (0-1)
 * @returns Rounded alpha value
 */
export function roundAlpha(a: number): number {
  return Math.round(a * 100) / 100;
}

/**
 * Formats an HSV color to the specified output format
 * @param hsv HSV color object
 * @param format Output format (hex, rgb, or hsl)
 * @param includeAlpha Whether to include alpha channel in output
 * @returns Formatted color string
 */
export function formatColorOutput(
  hsv: HSVColor,
  format: ColorFormat,
  includeAlpha: boolean
): string {
  const rgb = hsvToRgb(hsv);
  const hsl = hsvToHsl(hsv);

  switch (format) {
    case 'rgb':
      if (includeAlpha && hsv.a < 1) {
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${roundAlpha(hsv.a)})`;
      }
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    case 'hsl':
      if (includeAlpha && hsv.a < 1) {
        return `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${roundAlpha(hsv.a)})`;
      }
      return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;

    case 'hex':
    default: {
      const hexR = rgb.r.toString(16).padStart(2, '0');
      const hexG = rgb.g.toString(16).padStart(2, '0');
      const hexB = rgb.b.toString(16).padStart(2, '0');
      if (includeAlpha && hsv.a < 1) {
        const hexA = Math.round(hsv.a * 255)
          .toString(16)
          .padStart(2, '0');
        return `#${hexR}${hexG}${hexB}${hexA}`;
      }
      return `#${hexR}${hexG}${hexB}`;
    }
  }
}
