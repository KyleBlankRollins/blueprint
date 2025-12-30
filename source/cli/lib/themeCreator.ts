/**
 * Interactive theme creator
 * Generates a new theme configuration through CLI prompts
 */

import { input, select, confirm } from '@inquirer/prompts';
import { parse, oklch, formatHex } from 'culori';
import { getContrastRatio } from '../../themes/color/colorUtils.js';

export interface ThemeCreatorOptions {
  from?: string;
  name?: string;
  color?: string;
}

export interface ThemeColors {
  name: string;
  primary: { l: number; c: number; h: number };
  success?: { l: number; c: number; h: number };
  error?: { l: number; c: number; h: number };
  warning?: { l: number; c: number; h: number };
}

/**
 * Default semantic color values
 * These provide accessible, distinguishable colors for common UI states
 */
const SEMANTIC_DEFAULTS = {
  success: { l: 0.55, c: 0.13, h: 145 }, // Green, medium lightness for good contrast
  error: { l: 0.55, c: 0.15, h: 25 }, // Red, slightly higher chroma for urgency
  warning: { l: 0.65, c: 0.13, h: 85 }, // Yellow, lighter for visibility on dark/light
} as const;

/**
 * Convert hex color to OKLCH color space
 * @param hex - Hex color string (e.g., "#3b82f6")
 * @returns OKLCH color object or null if conversion fails
 */
function hexToOKLCH(hex: string): { l: number; c: number; h: number } | null {
  const color = parse(hex);
  if (!color) return null;

  const oklchColor = oklch(color);
  if (!oklchColor) return null;

  return {
    l: oklchColor.l,
    c: oklchColor.c ?? 0,
    h: oklchColor.h ?? 0,
  };
}

/**
 * Format OKLCH color for display
 * @param color - OKLCH color object
 * @returns Formatted OKLCH string
 */
function formatOKLCH(color: { l: number; c: number; h: number }): string {
  return `oklch(${color.l.toFixed(2)} ${color.c.toFixed(2)} ${color.h.toFixed(0)})`;
}

/**
 * Preview contrast ratios for a color against common backgrounds
 * @param colorHex - Hex color to check
 * @param label - Label for display
 * @returns Object with contrast ratios and adjustment needs
 */
function previewContrast(
  colorHex: string,
  label: string = 'Color'
): { lightRatio: number; darkRatio: number; needsAdjustment: boolean } {
  const lightBg = '#ffffff';
  const darkBg = '#080b0e';

  const lightRatio = getContrastRatio(colorHex, lightBg);
  const darkRatio = getContrastRatio(colorHex, darkBg);

  console.log(`\n${label} Contrast Preview:`);
  console.log(
    `  On white:      ${lightRatio.toFixed(2)}:1 ${lightRatio >= 4.5 ? '✅' : lightRatio >= 3.0 ? '⚠️' : '❌'}`
  );
  console.log(
    `  On dark:       ${darkRatio.toFixed(2)}:1 ${darkRatio >= 4.5 ? '✅' : darkRatio >= 3.0 ? '⚠️' : '❌'}`
  );
  console.log(`  (✅ ≥4.5:1 text, ⚠️ ≥3:1 UI, ❌ <3:1 fail)`);

  const needsAdjustment = lightRatio < 3.0 || darkRatio < 3.0;

  if (needsAdjustment) {
    console.log(`\n  💡 Tip: For better accessibility:`);
    if (lightRatio < 3.0) {
      console.log(`     - Darken for light backgrounds (reduce lightness)`);
    }
    if (darkRatio < 3.0) {
      console.log(`     - Lighten for dark backgrounds (increase lightness)`);
    }
  }

  console.log('');

  return { lightRatio, darkRatio, needsAdjustment };
}

/**
 * Validate hex color input
 * @param hex - Hex color string to validate
 * @returns True if valid hex color, false otherwise
 */
function isValidHex(hex: string): boolean {
  const color = parse(hex);
  return color !== undefined;
}

/**
 * Interactive theme creation workflow
 */
export async function createThemeInteractive(
  options: ThemeCreatorOptions
): Promise<ThemeColors> {
  console.log('🎨 Blueprint Theme Creator\n');

  // Step 1: Theme name
  const themeName =
    options.name ||
    (await input({
      message: 'Theme name:',
      default: 'custom',
      validate: (value) =>
        /^[a-z][a-z0-9-]*$/.test(value) ||
        'Theme name must start with lowercase letter and contain only lowercase letters, numbers, and hyphens',
    }));

  console.log(`\n✨ Creating "${themeName}" theme...\n`);

  // Step 2: Choose creation method
  const method = options.color
    ? 'color'
    : options.from
      ? 'copy'
      : await select({
          message: 'How would you like to create the theme?',
          choices: [
            { name: 'From brand color (recommended)', value: 'color' },
            { name: 'From existing theme', value: 'copy' },
            { name: 'Manual OKLCH values (advanced)', value: 'manual' },
          ],
        });

  let primaryColor: { l: number; c: number; h: number };

  // Step 3: Get primary color based on method
  if (method === 'color') {
    const hexColor =
      options.color ||
      (await input({
        message: 'Primary brand color (hex):',
        default: '#3b82f6',
        validate: (value) => isValidHex(value) || 'Invalid hex color',
      }));

    const oklchColor = hexToOKLCH(hexColor);
    if (!oklchColor) {
      throw new Error(
        `Failed to convert color "${hexColor}" to OKLCH. Please check the hex format (e.g., #3b82f6).`
      );
    }

    primaryColor = oklchColor;
    console.log(`\nConverted to OKLCH: ${formatOKLCH(primaryColor)}`);

    // Preview contrast
    previewContrast(hexColor, 'Primary color');
  } else if (method === 'copy') {
    const baseTheme =
      options.from ||
      (await select({
        message: 'Base theme to copy from:',
        choices: [
          { name: 'Light theme', value: 'light' },
          { name: 'Dark theme', value: 'dark' },
        ],
      }));

    // Use Blueprint blue as default
    primaryColor =
      baseTheme === 'light'
        ? { l: 0.4025, c: 0.0836, h: 233.38 }
        : { l: 0.4025, c: 0.0836, h: 233.38 };

    console.log(
      `\n📋 Copying from ${baseTheme} theme (you can modify colors next)`
    );
  } else {
    // Manual OKLCH input
    console.log('\nEnter OKLCH values for primary color:');
    console.log('  Lightness (0-1): How light/dark');
    console.log('  Chroma (0-0.4): How saturated');
    console.log('  Hue (0-360): Color angle\n');

    const l = parseFloat(
      await input({
        message: 'Lightness (0-1):',
        default: '0.55',
        validate: (v) =>
          (!isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 1) ||
          'Must be between 0 and 1',
      })
    );

    const c = parseFloat(
      await input({
        message: 'Chroma (0-0.4):',
        default: '0.15',
        validate: (v) =>
          (!isNaN(parseFloat(v)) &&
            parseFloat(v) >= 0 &&
            parseFloat(v) <= 0.4) ||
          'Must be between 0 and 0.4',
      })
    );

    const h = parseFloat(
      await input({
        message: 'Hue (0-360):',
        default: '250',
        validate: (v) =>
          (!isNaN(parseFloat(v)) &&
            parseFloat(v) >= 0 &&
            parseFloat(v) <= 360) ||
          'Must be between 0 and 360',
      })
    );

    primaryColor = { l, c, h };
  }

  // Step 4: Ask about semantic colors
  const addSemanticColors = await confirm({
    message: 'Add semantic colors (success, error, warning)?',
    default: true,
  });

  let success: { l: number; c: number; h: number } | undefined;
  let error: { l: number; c: number; h: number } | undefined;
  let warning: { l: number; c: number; h: number } | undefined;

  if (addSemanticColors) {
    console.log('\n🎨 Generating semantic colors from primary...');

    // Generate semantic colors using defaults but matching primary's general lightness/chroma feel
    success = {
      l: SEMANTIC_DEFAULTS.success.l,
      c: primaryColor.c * 0.87, // Similar saturation to primary
      h: SEMANTIC_DEFAULTS.success.h,
    };

    error = {
      l: SEMANTIC_DEFAULTS.error.l,
      c: primaryColor.c, // Match primary chroma for consistency
      h: SEMANTIC_DEFAULTS.error.h,
    };

    warning = {
      l: SEMANTIC_DEFAULTS.warning.l,
      c: primaryColor.c * 0.87,
      h: SEMANTIC_DEFAULTS.warning.h,
    };

    console.log(`  Success: ${formatOKLCH(success)}`);
    console.log(`  Error:   ${formatOKLCH(error)}`);
    console.log(`  Warning: ${formatOKLCH(warning)}`);
  }

  // Step 5: Generate preview
  console.log('\n📊 Generating color scale preview...\n');

  // Convert OKLCH to hex for preview
  const primaryOklch = { ...primaryColor, mode: 'oklch' as const };
  const primaryHex = formatHex(primaryOklch);

  console.log(`Primary (500): ${primaryHex}`);
  previewContrast(primaryHex, 'Primary color');

  return {
    name: themeName,
    primary: primaryColor,
    success,
    error,
    warning,
  };
}

/**
 * Helper function to add a color scale definition
 */
function addColorScale(
  colors: string[],
  themeName: string,
  colorType: string,
  colorValue: { l: number; c: number; h: number }
): void {
  colors.push(`    ${themeName}${colorType}: {`);
  colors.push(
    `      source: { l: ${colorValue.l.toFixed(4)}, c: ${colorValue.c.toFixed(4)}, h: ${colorValue.h.toFixed(2)} },`
  );
  colors.push(
    `      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],`
  );
  colors.push(`    },`);
}

/**
 * Generate TypeScript config code for the theme
 * @param theme - Theme color definitions
 * @returns TypeScript code string for theme.config.ts
 */
export function generateThemeConfig(theme: ThemeColors): string {
  const colors: string[] = [];

  colors.push(`    // ${theme.name} theme`);
  addColorScale(colors, theme.name, 'Primary', theme.primary);

  if (theme.success) {
    addColorScale(colors, theme.name, 'Success', theme.success);
  }

  if (theme.error) {
    addColorScale(colors, theme.name, 'Error', theme.error);
  }

  if (theme.warning) {
    addColorScale(colors, theme.name, 'Warning', theme.warning);
  }

  return colors.join('\n');
}

/**
 * Generate example semantic token mappings for the theme
 * @param theme - Theme color definitions
 * @returns TypeScript code string for theme mappings
 */
export function generateSemanticExample(theme: ThemeColors): string {
  const example: string[] = [];

  example.push(`  themes: {`);
  example.push(`    ${theme.name}: {`);
  example.push(`      // Backgrounds`);
  example.push(`      background: colors.gray50,`);
  example.push(`      surface: colors.gray100,`);
  example.push(`      surfaceElevated: colors.white,`);
  example.push(`      surfaceSubdued: colors.gray200,`);
  example.push(``);
  example.push(`      // Text`);
  example.push(`      text: colors.gray900,`);
  example.push(`      textMuted: colors.gray700,`);
  example.push(`      textInverse: colors.white,`);
  example.push(``);
  example.push(`      // Primary`);
  example.push(`      primary: colors.${theme.name}Primary700,`);
  example.push(`      primaryHover: colors.${theme.name}Primary800,`);
  example.push(`      primaryActive: colors.${theme.name}Primary900,`);

  if (theme.success || theme.error || theme.warning) {
    example.push(``);
    example.push(`      // Semantic`);

    if (theme.success) {
      example.push(`      success: colors.${theme.name}Success700,`);
    } else {
      example.push(`      success: colors.green700,`);
    }

    if (theme.warning) {
      example.push(`      warning: colors.${theme.name}Warning700,`);
    } else {
      example.push(`      warning: colors.yellow700,`);
    }

    if (theme.error) {
      example.push(`      error: colors.${theme.name}Error700,`);
    } else {
      example.push(`      error: colors.red700,`);
    }

    example.push(`      info: colors.accent500,`);
  }

  example.push(``);
  example.push(`      // UI Elements`);
  example.push(`      border: colors.gray200,`);
  example.push(`      borderStrong: colors.gray300,`);
  example.push(`      focus: colors.${theme.name}Primary700,`);
  example.push(`    },`);
  example.push(`  },`);

  return example.join('\n');
}
