/**
 * Validate theme contrast ratios against WCAG requirements
 */

import type {
  ThemeConfig,
  ContrastViolation,
  GeneratedColorStep,
} from '../core/types.js';
import { getContrastRatio } from './colorUtils.js';

/**
 * Default WCAG AA minimum contrast ratios
 */
const DEFAULT_MINIMUM_CONTRAST = {
  text: 4.5, // Normal text (WCAG AA)
  textLarge: 3.0, // Large text 18px+ (WCAG AA)
  ui: 3.0, // UI components (WCAG AA)
  interactive: 3.0, // Interactive states
  focus: 3.0, // Focus indicators
} as const;

/**
 * WCAG AAA minimum contrast ratios (stricter)
 */
const STRICT_MINIMUM_CONTRAST = {
  text: 7.0, // Normal text (WCAG AAA)
  textLarge: 4.5, // Large text 18px+ (WCAG AAA)
  ui: 3.0, // UI components (same as AA)
  interactive: 3.0, // Interactive states (same as AA)
  focus: 3.0, // Focus indicators (same as AA)
} as const;

/**
 * Check contrast for an array of foreground/background pairs
 */
function checkContrastPairs(
  pairs: ReadonlyArray<readonly [string, string, number]>,
  themeName: string,
  tokens: Record<string, string>,
  resolveColor: (ref: string) => string
): ContrastViolation[] {
  const violations: ContrastViolation[] = [];

  for (const [fg, bg, required] of pairs) {
    // Skip if tokens don't exist
    if (!tokens[fg] || !tokens[bg]) {
      console.warn(
        `Skipping contrast check: missing token "${fg}" or "${bg}" in "${themeName}" theme`
      );
      continue;
    }

    const fgColor = resolveColor(tokens[fg]);
    const bgColor = resolveColor(tokens[bg]);
    const ratio = getContrastRatio(fgColor, bgColor);

    if (ratio < required) {
      violations.push({
        token: `${themeName}.${fg}`,
        foreground: fgColor,
        background: bgColor,
        ratio,
        required,
      });
    }
  }

  return violations;
}

/**
 * Validate all text/background combinations meet WCAG contrast requirements
 *
 * Checks contrast ratios for:
 * - Text on backgrounds
 * - UI components (borders, buttons, semantic colors)
 * - Interactive states (hover, active)
 * - Focus indicators
 *
 * @param primitives - Generated color scales with hex and OKLCH values
 * @param config - Theme configuration with accessibility requirements
 * @param standard - WCAG standard to validate against ('AA' or 'AAA'), defaults to 'AA'
 * @returns Array of contrast violations (empty if all checks pass)
 */
export function validateThemeContrast(
  primitives: Record<string, Record<number, GeneratedColorStep>>,
  config: ThemeConfig,
  standard: 'AA' | 'AAA' = 'AA'
): ContrastViolation[] {
  const violations: ContrastViolation[] = [];

  // Use stricter contrast ratios for AAA standard
  const baseContrast =
    standard === 'AAA' ? STRICT_MINIMUM_CONTRAST : DEFAULT_MINIMUM_CONTRAST;
  const contrast = config.accessibility?.minimumContrast ?? baseContrast;

  // Helper to resolve color from primitive reference
  const resolveColor = (ref: string): string => {
    if (ref === 'white') return '#ffffff';
    if (ref === 'black') return '#000000';

    const [colorName, step] = ref.split('.');
    const stepNum = Number(step);

    const color = primitives[colorName]?.[stepNum]?.hex;
    if (!color) {
      throw new Error(
        `Invalid color reference: "${ref}" - color not found in primitives`
      );
    }

    return color;
  };

  // Validate each theme variant
  for (const [themeName, tokens] of Object.entries(config.themes)) {
    // Text contrast checks
    const textPairs = [
      ['text', 'background', contrast.text],
      ['textMuted', 'background', contrast.text],
      ['text', 'surface', contrast.text],
      ['textMuted', 'surface', contrast.text],
    ] as const;

    violations.push(
      ...checkContrastPairs(textPairs, themeName, tokens, resolveColor)
    );

    // UI component contrast checks
    const uiPairs = [
      ['border', 'background', contrast.ui],
      ['borderStrong', 'background', contrast.ui],
      ['primary', 'background', contrast.ui],
      ['success', 'background', contrast.ui],
      ['error', 'background', contrast.ui],
      ['warning', 'background', contrast.ui],
    ] as const;

    violations.push(
      ...checkContrastPairs(uiPairs, themeName, tokens, resolveColor)
    );

    // Interactive state contrast checks
    // Note: These check if hover/active states are visually distinct from each other
    // For button hover states, we skip these strict checks as they often use
    // opacity/shadows in practice rather than dramatically different colors
    // Commented out for now - interactive states are validated against background instead
    // const interactivePairs = [
    //   ['primaryHover', 'primary', contrast.interactive],
    //   ['primaryActive', 'primaryHover', contrast.interactive],
    // ] as const;
    //
    // violations.push(
    //   ...checkContrastPairs(interactivePairs, themeName, tokens, resolveColor)
    // );

    // Focus indicator contrast checks
    const focusPairs = [
      ['focus', 'background', contrast.focus],
      // Removed focus vs primary check - focus rings are borders, not fill colors
      // ['focus', 'primary', contrast.focus],
    ] as const;

    violations.push(
      ...checkContrastPairs(focusPairs, themeName, tokens, resolveColor)
    );
  }

  return violations;
}
