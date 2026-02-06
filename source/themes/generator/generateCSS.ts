/**
 * CSS generation functions for theme output
 * Generates CSS custom properties from theme configuration
 */

import type {
  GeneratedColorStep,
  ThemeConfig,
  OKLCHColor,
} from '../core/types.js';
import { formatOKLCHforCSS } from '../color/colorUtils.js';

/**
 * Context for resolving color references to OKLCH values
 * Passed to generateThemeCSS to enable direct OKLCH value resolution
 */
export interface ColorResolutionContext {
  colors: Record<string, Record<number, GeneratedColorStep>>;
}

// Token prefix constants
const TOKEN_PREFIX = 'bp';
const COLOR_PREFIX = `${TOKEN_PREFIX}-color`;
const SPACING_PREFIX = `${TOKEN_PREFIX}-spacing`;
const RADIUS_PREFIX = `${TOKEN_PREFIX}-border-radius`;
const DURATION_PREFIX = `${TOKEN_PREFIX}-duration`;
const EASE_PREFIX = `${TOKEN_PREFIX}-ease`;
const TRANSITION_PREFIX = `${TOKEN_PREFIX}-transition`;
const FONT_PREFIX = `${TOKEN_PREFIX}-font`;
const FONT_SIZE_PREFIX = `${TOKEN_PREFIX}-font-size`;
const LINE_HEIGHT_PREFIX = `${TOKEN_PREFIX}-line-height`;
const FONT_WEIGHT_PREFIX = `${TOKEN_PREFIX}-font-weight`;
const FOCUS_PREFIX = `${TOKEN_PREFIX}-focus`;
const Z_INDEX_PREFIX = `${TOKEN_PREFIX}-z`;
const OPACITY_PREFIX = `${TOKEN_PREFIX}-opacity`;
const BREAKPOINT_PREFIX = `${TOKEN_PREFIX}-breakpoint`;
const ICON_SIZE_PREFIX = `${TOKEN_PREFIX}-icon-size`;

// Accessibility constants
const REDUCED_MOTION_DURATION = '0.01ms';
const HIGH_CONTRAST_BORDER_WIDTH = '2px';
const HIGH_CONTRAST_FOCUS_WIDTH = '3px';

/**
 * Convert camelCase to kebab-case for CSS custom properties
 * @param str - String in camelCase
 * @returns String in kebab-case
 */
function toKebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * Get the CSS selector for a theme variant
 * @param themeName - Name of the theme variant
 * @returns CSS selector string
 */
function getThemeSelector(themeName: string): string {
  return themeName === 'light'
    ? ':root, [data-theme="light"]'
    : `[data-theme="${themeName}"]`;
}

/**
 * Resolve a color reference to an OKLCH value
 * @param primitiveRef - Color reference (e.g., 'blue.500', 'white', 'black', or 'oklch(0.5 0.1 180)')
 * @param context - Optional color resolution context with generated color scales
 * @returns OKLCH color value string
 * @throws {Error} If the color reference format is invalid or color not found
 */
function resolveColorToOKLCH(
  primitiveRef: string,
  context?: ColorResolutionContext
): string {
  // If already an OKLCH string, return as-is
  if (primitiveRef.startsWith('oklch(')) {
    return primitiveRef;
  }

  // Handle special colors
  if (primitiveRef === 'white') return 'oklch(1 0 0)';
  if (primitiveRef === 'black') return 'oklch(0 0 0)';

  const [colorName, step] = primitiveRef.split('.');
  if (!colorName || !step) {
    throw new Error(
      `Invalid color reference: "${primitiveRef}". Expected format: "colorName.step", "white", "black", or "oklch(...)"`
    );
  }

  // If no context provided, fall back to var() reference (legacy behavior)
  if (!context) {
    return `var(--${TOKEN_PREFIX}-${colorName}-${step})`;
  }

  // Look up the color in the context
  const colorScale = context.colors[colorName];
  if (!colorScale) {
    throw new Error(
      `Color "${colorName}" not found in theme. Available colors: ${Object.keys(context.colors).join(', ')}`
    );
  }

  const colorStep = colorScale[parseInt(step, 10)];
  if (!colorStep) {
    throw new Error(
      `Step "${step}" not found for color "${colorName}". Available steps: ${Object.keys(colorScale).join(', ')}`
    );
  }

  return formatOKLCHforCSS(colorStep.oklch);
}

/**
 * Generate primitive color tokens CSS
 * Creates both hex fallbacks and OKLCH values with @supports
 *
 * @param colors - Generated color scales with OKLCH and hex values
 * @returns CSS string with primitive color tokens
 */
export function generatePrimitivesCSS(
  colors: Record<string, Record<number, GeneratedColorStep>>
): string {
  let css = '/* Generated primitive color tokens */\n:root {\n';

  // Hex fallbacks first (for all browsers)
  for (const [colorName, scale] of Object.entries(colors)) {
    css += `\n  /* ${colorName} scale */\n`;

    for (const [step, { hex }] of Object.entries(scale)) {
      css += `  --${TOKEN_PREFIX}-${colorName}-${step}: ${hex};\n`;
    }
  }

  css += '}\n\n';

  // OKLCH values for modern browsers
  css += '/* OKLCH colors for modern browsers */\n';
  css += '@supports (color: oklch(0 0 0)) {\n  :root {\n';

  for (const [colorName, scale] of Object.entries(colors)) {
    css += `\n    /* ${colorName} scale */\n`;

    for (const [step, { oklch }] of Object.entries(scale)) {
      css += `    --${TOKEN_PREFIX}-${colorName}-${step}: ${formatOKLCHforCSS(oklch)};\n`;
    }
  }

  css += '  }\n}\n';

  return css;
}

/**
 * Generate semantic theme tokens CSS
 * Maps semantic names to direct OKLCH color values (not var() references)
 *
 * @param themeName - Name of the theme variant (e.g., 'light', 'dark')
 * @param mappings - Map of semantic token names to color references or direct values
 * @param context - Optional color resolution context for direct OKLCH output
 * @returns CSS string with semantic theme tokens
 * @throws {Error} If a color reference is invalid
 */
export function generateThemeCSS(
  themeName: string,
  mappings: Record<string, string | OKLCHColor>,
  context?: ColorResolutionContext
): string {
  const selector = getThemeSelector(themeName);
  let css = `/* ${themeName} theme */\n${selector} {\n`;

  // Color tokens (use --bp-color- prefix)
  const colorTokens = [
    'background',
    'surface',
    'surfaceElevated',
    'surfaceSubdued',
    'text',
    'textStrong',
    'textMuted',
    'textInverse',
    'primary',
    'primaryHover',
    'primaryActive',
    'secondary',
    'secondaryHover',
    'link',
    'linkHover',
    'linkVisited',
    'success',
    'successHover',
    'successBg',
    'warning',
    'warningHover',
    'warningBg',
    'error',
    'errorHover',
    'errorBg',
    'info',
    'infoHover',
    'infoBg',
    'hoverOverlay',
    'activeOverlay',
    'selectedBg',
    'placeholder',
    'inputBg',
    'inputBorder',
    'border',
    'borderStrong',
    'focus',
    'backdrop',
  ];

  // Typography tokens (use --bp- prefix)
  const typographyTokens = [
    'fontFamily',
    'fontFamilyMono',
    'fontFamilyHeading',
  ];

  // Border tokens (use --bp- prefix)
  const borderTokens = [
    'borderWidth',
    'borderRadius',
    'borderRadiusLarge',
    'borderRadiusFull',
  ];

  // Shadow tokens (use --bp- prefix)
  const shadowTokens = ['shadowSm', 'shadowMd', 'shadowLg', 'shadowXl'];

  for (const [semanticToken, primitiveRef] of Object.entries(mappings)) {
    const tokenName = toKebabCase(semanticToken);

    if (colorTokens.includes(semanticToken)) {
      // Color tokens: resolve to direct OKLCH value
      const colorValue =
        typeof primitiveRef === 'object'
          ? formatOKLCHforCSS(primitiveRef)
          : resolveColorToOKLCH(primitiveRef, context);
      css += `  --${COLOR_PREFIX}-${tokenName}: ${colorValue};\n`;
    } else if (
      typographyTokens.includes(semanticToken) ||
      borderTokens.includes(semanticToken) ||
      shadowTokens.includes(semanticToken)
    ) {
      // Non-color semantic tokens: use direct value with --bp- prefix
      css += `  --${TOKEN_PREFIX}-${tokenName}: ${primitiveRef};\n`;
    } else {
      // Fallback for any unknown tokens (should not happen with strict typing)
      css += `  --${TOKEN_PREFIX}-${tokenName}: ${primitiveRef};\n`;
    }
  }

  css += '}\n';
  return css;
}

/**
 * Generate spacing tokens CSS
 *
 * @param config - Theme configuration
 * @returns CSS string with spacing scale tokens
 * @throws {Error} If spacing configuration is invalid
 */
export function generateSpacingCSS(config: ThemeConfig): string {
  if (!config.spacing?.base || config.spacing.base <= 0) {
    throw new Error(
      'Invalid spacing configuration: base must be a positive number'
    );
  }
  if (!config.spacing?.scale || config.spacing.scale.length === 0) {
    throw new Error(
      'Invalid spacing configuration: scale must be a non-empty array'
    );
  }

  let css = '\n/* Spacing scale */\n:root {\n';

  const { base, scale, semantic } = config.spacing;

  // Generate numeric scale (e.g., --bp-spacing-0, --bp-spacing-1, etc.)
  for (const multiplier of scale) {
    const value = base * multiplier;
    const key = multiplier.toString().replace('.', '-');
    css += `  --${SPACING_PREFIX}-${key}: ${value}px;\n`;
  }

  // Generate semantic spacing if provided
  if (semantic) {
    css += '\n  /* Semantic spacing */\n';
    for (const [name, scaleIndex] of Object.entries(semantic)) {
      const multiplier = scale[scaleIndex];
      const value = base * multiplier;
      css += `  --${SPACING_PREFIX}-${name}: ${value}px;\n`;
    }
  }

  css += '}\n';
  return css;
}

/**
 * Generate border radius tokens CSS
 *
 * @param config - Theme configuration
 * @returns CSS string with border radius tokens
 */
export function generateRadiusCSS(config: ThemeConfig): string {
  let css = '\n/* Border radius scale */\n:root {\n';

  for (const [name, value] of Object.entries(config.radius)) {
    css += `  --${RADIUS_PREFIX}-${name}: ${value}px;\n`;
  }

  css += '}\n';
  return css;
}

/**
 * Generate motion/animation tokens CSS
 *
 * @param config - Theme configuration
 * @returns CSS string with motion tokens (durations, easings, transitions)
 */
export function generateMotionCSS(config: ThemeConfig): string {
  let css = '\n/* Motion tokens */\n:root {\n';

  // Durations
  css += '  /* Durations */\n';
  for (const [name, value] of Object.entries(config.motion.durations)) {
    css += `  --${DURATION_PREFIX}-${name}: ${value}ms;\n`;
  }

  // Easings
  css += '\n  /* Easing functions */\n';
  for (const [name, value] of Object.entries(config.motion.easings)) {
    css += `  --${EASE_PREFIX}-${name}: ${value};\n`;
  }

  // Transitions (combined duration + easing)
  if (config.motion?.transitions) {
    css += '\n  /* Transition presets */\n';
    for (const [name, value] of Object.entries(config.motion.transitions)) {
      css += `  --${TRANSITION_PREFIX}-${name}: ${value};\n`;
    }
  }

  css += '}\n';
  return css;
}

/**
 * Generate typography tokens CSS
 *
 * @param config - Theme configuration
 * @returns CSS string with typography tokens (font families, sizes, weights, line heights)
 */
export function generateTypographyCSS(config: ThemeConfig): string {
  let css = '\n/* Typography tokens */\n:root {\n';

  // Font families
  css += '  /* Font families */\n';
  for (const [name, value] of Object.entries(config.typography.fontFamilies)) {
    css += `  --${FONT_PREFIX}-${name}: ${value};\n`;
  }

  // Font sizes
  css += '\n  /* Font sizes */\n';
  for (const [name, value] of Object.entries(config.typography.fontSizes)) {
    css += `  --${FONT_SIZE_PREFIX}-${name}: ${value}px;\n`;
  }

  // Line heights
  css += '\n  /* Line heights */\n';
  for (const [name, value] of Object.entries(config.typography.lineHeights)) {
    css += `  --${LINE_HEIGHT_PREFIX}-${name}: ${value};\n`;
  }

  // Font weights
  if (config.typography?.fontWeights) {
    css += '\n  /* Font weights */\n';
    for (const [name, value] of Object.entries(config.typography.fontWeights)) {
      css += `  --${FONT_WEIGHT_PREFIX}-${name}: ${value};\n`;
    }
  }

  css += '}\n';
  return css;
}

/**\n * Generate icon size tokens CSS\n *\n * @param config - Theme configuration\n * @returns CSS string with icon size tokens\n */
export function generateIconSizeCSS(config: ThemeConfig): string {
  if (!config.iconSizes || Object.keys(config.iconSizes).length === 0) {
    return '';
  }

  let css = '\n/* Icon size tokens */\n:root {\n';
  for (const [name, value] of Object.entries(config.iconSizes)) {
    css += `  --${ICON_SIZE_PREFIX}-${name}: ${value}px;\n`;
  }
  css += '}\n';
  return css;
}

/**
 * Generate utility tokens CSS (focus, z-index, opacity, etc.)
 *
 * @param config - Theme configuration
 * @returns CSS string with utility tokens
 */
export function generateUtilityCSS(config: ThemeConfig): string {
  let css = '\n/* Utility tokens */\n:root {\n';

  // Focus ring
  if (config.focus) {
    css += '  /* Focus indicators */\n';
    css += `  --${FOCUS_PREFIX}-width: ${config.focus.width}px;\n`;
    css += `  --${FOCUS_PREFIX}-offset: ${config.focus.offset}px;\n`;
    css += `  --${FOCUS_PREFIX}-style: ${config.focus.style};\n`;
    css += `  --${FOCUS_PREFIX}-ring: var(--${FOCUS_PREFIX}-width) var(--${FOCUS_PREFIX}-style) var(--${COLOR_PREFIX}-focus);\n`;
  }

  // Z-index
  if (config.zIndex) {
    css += '\n  /* Z-index scale */\n';
    for (const [name, value] of Object.entries(config.zIndex)) {
      css += `  --${Z_INDEX_PREFIX}-${name}: ${value};\n`;
    }
  }

  // Opacity
  if (config.opacity) {
    css += '\n  /* Opacity scale */\n';
    for (const [name, value] of Object.entries(config.opacity)) {
      css += `  --${OPACITY_PREFIX}-${name}: ${value};\n`;
    }
  }

  // Text colors (inverse for tooltips, buttons, etc.)
  css += '\n  /* Text colors */\n';
  css += `  --${COLOR_PREFIX}-text-inverse: #ffffff;\n`;

  // Breakpoints
  if (config.breakpoints) {
    css += '\n  /* Breakpoints */\n';
    for (const [name, value] of Object.entries(config.breakpoints)) {
      css += `  --${BREAKPOINT_PREFIX}-${name}: ${value};\n`;
    }
  }

  css += '}\n';
  return css;
}

/**
 * Generate reduced motion media query CSS
 * Respects user preference for reduced motion
 *
 * @returns CSS string with prefers-reduced-motion media query
 */
export function generateReducedMotionCSS(): string {
  return `
/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  :root {
    --${TRANSITION_PREFIX}-fast: 0ms;
    --${TRANSITION_PREFIX}-base: 0ms;
    --${TRANSITION_PREFIX}-slow: 0ms;
  }
  
  *,
  *::before,
  *::after {
    animation-duration: ${REDUCED_MOTION_DURATION} !important;
    animation-iteration-count: 1 !important;
    transition-duration: ${REDUCED_MOTION_DURATION} !important;
  }
}
`;
}

/**
 * Generate high contrast mode CSS
 * Respects user preference for increased contrast
 *
 * @param config - Theme configuration
 * @returns CSS string with prefers-contrast media query, or empty string if disabled
 */
export function generateHighContrastCSS(config: ThemeConfig): string {
  if (!config.accessibility?.highContrast) {
    return '/* High contrast mode disabled in configuration */\n';
  }

  return `
/* High contrast mode support */
@media (prefers-contrast: more) {
  :root {
    --${COLOR_PREFIX}-text: #000000;
    --${COLOR_PREFIX}-background: #ffffff;
    --${TOKEN_PREFIX}-border-width: ${HIGH_CONTRAST_BORDER_WIDTH};
    --${FOCUS_PREFIX}-width: ${HIGH_CONTRAST_FOCUS_WIDTH};
  }
  
  [data-theme="dark"] {
    --${COLOR_PREFIX}-text: #ffffff;
    --${COLOR_PREFIX}-background: #000000;
    --${COLOR_PREFIX}-text-inverse: #000000;
  }
}
`;
}

/**
 * Generate main index CSS that imports all theme files
 *
 * @param themesByPlugin - Map of plugin IDs to their theme variant names
 * @param pluginsWithFonts - Set of plugin IDs that have fonts.css files
 * @returns CSS string with import statements for all theme files
 */
export function generateIndexCSS(
  themesByPlugin?: Map<string, string[]>,
  pluginsWithFonts?: Set<string>
): string {
  let imports = `/**
 * Blueprint Theme System
 * Auto-generated theme files - DO NOT EDIT MANUALLY
 *
 * To regenerate: npm run theme:generate
 */

/* Utility tokens (spacing, radius, motion, typography, etc.) */
@import './utilities.css';

`;

  // If no plugin map provided, use legacy imports
  if (!themesByPlugin) {
    imports += `/* Light theme (default) */
@import './light.css';

/* Dark theme */
@import './dark.css';
`;
    return imports;
  }

  // Generate imports organized by plugin
  for (const [pluginId, variantNames] of themesByPlugin) {
    imports += `/* ${pluginId} themes */\n`;

    // Import fonts.css first if this plugin has fonts
    if (pluginsWithFonts?.has(pluginId)) {
      imports += `@import './${pluginId}/fonts.css'; /* bundled fonts */\n`;
    }

    for (const variantName of variantNames) {
      const comment =
        variantName === 'light'
          ? ' (default)'
          : variantName === 'dark'
            ? ''
            : '';
      imports += `@import './${pluginId}/${variantName}.css'; /* ${variantName}${comment} */\n`;
    }
    imports += '\n';
  }

  return imports;
}
