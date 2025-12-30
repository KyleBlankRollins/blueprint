/**
 * Validate theme contrast ratios against WCAG requirements
 */

import type {
  ThemeConfig,
  ContrastViolation,
  GeneratedColorStep,
} from './types.js';
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
 * @returns Array of contrast violations (empty if all checks pass)
 */
export function validateThemeContrast(
  primitives: Record<string, Record<number, GeneratedColorStep>>,
  config: ThemeConfig
): ContrastViolation[] {
  const violations: ContrastViolation[] = [];

  const contrast =
    config.accessibility?.minimumContrast ?? DEFAULT_MINIMUM_CONTRAST;

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
    const interactivePairs = [
      ['primaryHover', 'primary', contrast.interactive],
      ['primaryActive', 'primaryHover', contrast.interactive],
    ] as const;

    violations.push(
      ...checkContrastPairs(interactivePairs, themeName, tokens, resolveColor)
    );

    // Focus indicator contrast checks
    const focusPairs = [
      ['focus', 'background', contrast.focus],
      ['focus', 'primary', contrast.focus],
    ] as const;

    violations.push(
      ...checkContrastPairs(focusPairs, themeName, tokens, resolveColor)
    );
  }

  return violations;
}
