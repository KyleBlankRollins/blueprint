/**
 * Automatically integrate a new theme into theme.config.ts
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { ThemeColors } from './themeCreator.js';

const CONFIG_PATH = 'source/themes/config/theme.config.ts';
const DEFAULT_COLOR_SCALE = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

// Regex patterns for finding sections in theme.config.ts
const COLORS_SECTION_END =
  /(\n {2}},\n\n {2}\/\/ Dark mode adjustments|secondaryAccent:\s*{[^}]+},\n)/;
const COLOR_REFS_CALL =
  /const colors = createColorRefs\(\[([\s\S]*?)\] as const\);/;
const THEMES_SECTION_END =
  /(\n {2}},\n\n {2}\/\/ Accessibility validation rules)/;

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build color definition block for a single color
 */
function buildColorDefinition(
  name: string,
  color: { l: number; c: number; h: number }
): string[] {
  return [
    `    ${name}: {`,
    `      source: { l: ${color.l.toFixed(4)}, c: ${color.c.toFixed(4)}, h: ${color.h.toFixed(2)} },`,
    `      scale: [${DEFAULT_COLOR_SCALE.join(', ')}],`,
    `    },`,
  ];
}

/**
 * Integrates a new theme into the theme configuration file.
 * Updates color definitions, color refs, and theme mappings.
 *
 * @param theme - The theme colors to integrate
 * @throws {Error} If theme validation fails
 * @throws {Error} If the config file cannot be read/written
 * @throws {Error} If required patterns are not found in the config file
 * @example
 * await integrateTheme({
 *   name: 'Ocean',
 *   primary: { l: 0.5, c: 0.15, h: 220 }
 * });
 */
export async function integrateTheme(theme: ThemeColors): Promise<void> {
  // Input validation
  if (!theme?.name) {
    throw new Error('Theme name is required');
  }
  if (!theme?.primary) {
    throw new Error('Theme must have a primary color');
  }

  const configPath = join(process.cwd(), CONFIG_PATH);

  try {
    let content = await readFile(configPath, 'utf-8');

    // 1. Add color definitions
    content = addColorDefinitions(content, theme);

    // 2. Update createColorRefs call
    content = updateColorRefs(content, theme);

    // 3. Add theme mappings
    content = addThemeMappings(content, theme);

    // Write back to file
    await writeFile(configPath, content, 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to integrate theme "${theme.name}": ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Add color definitions to the colors section
 */
function addColorDefinitions(content: string, theme: ThemeColors): string {
  // Build the color definitions using helper function
  const definitions: string[] = [];
  definitions.push(`\n    // ${theme.name} theme colors`);

  definitions.push(
    ...buildColorDefinition(`${theme.name}Primary`, theme.primary)
  );

  if (theme.success) {
    definitions.push(
      ...buildColorDefinition(`${theme.name}Success`, theme.success)
    );
  }

  if (theme.error) {
    definitions.push(
      ...buildColorDefinition(`${theme.name}Error`, theme.error)
    );
  }

  if (theme.warning) {
    definitions.push(
      ...buildColorDefinition(`${theme.name}Warning`, theme.warning)
    );
  }

  // Find the closing brace of the colors section
  const match = content.match(COLORS_SECTION_END);

  if (!match || match.index === undefined) {
    throw new Error('Could not find colors section in theme.config.ts');
  }

  const insertPos = match.index + match[0].length;
  return (
    content.slice(0, insertPos) +
    definitions.join('\n') +
    content.slice(insertPos)
  );
}

/**
 * Update createColorRefs call to include new color names
 */
function updateColorRefs(content: string, theme: ThemeColors): string {
  const colorNames: string[] = [];

  colorNames.push(`${theme.name}Primary`);
  if (theme.success) colorNames.push(`${theme.name}Success`);
  if (theme.error) colorNames.push(`${theme.name}Error`);
  if (theme.warning) colorNames.push(`${theme.name}Warning`);

  // Find the createColorRefs call
  const match = content.match(COLOR_REFS_CALL);

  if (!match || !match[1]) {
    throw new Error('Could not find createColorRefs call in theme.config.ts');
  }

  const existingColors = match[1];

  // Add new color names (with proper indentation)
  const newColors = colorNames.map((name) => `  '${name}',`).join('\n');

  return content.replace(
    COLOR_REFS_CALL,
    `const colors = createColorRefs([${existingColors}\n${newColors}\n] as const);`
  );
}

/**
 * Add theme mappings to the themes section
 */
function addThemeMappings(content: string, theme: ThemeColors): string {
  const mappings: string[] = [];

  mappings.push(`    ${theme.name}: {`);
  mappings.push(`      // Backgrounds`);
  mappings.push(`      background: colors.gray50,`);
  mappings.push(`      surface: colors.gray100,`);
  mappings.push(`      surfaceElevated: colors.white,`);
  mappings.push(`      surfaceSubdued: colors.gray200,`);
  mappings.push(``);
  mappings.push(`      // Text`);
  mappings.push(`      text: colors.gray900,`);
  mappings.push(`      textMuted: colors.gray700,`);
  mappings.push(`      textInverse: colors.white,`);
  mappings.push(``);
  mappings.push(`      // Primary`);
  mappings.push(`      primary: colors.${theme.name}Primary700,`);
  mappings.push(`      primaryHover: colors.${theme.name}Primary800,`);
  mappings.push(`      primaryActive: colors.${theme.name}Primary900,`);
  mappings.push(``);
  mappings.push(`      // Semantic`);

  if (theme.success) {
    mappings.push(`      success: colors.${theme.name}Success700,`);
  } else {
    mappings.push(`      success: colors.green700,`);
  }

  if (theme.warning) {
    mappings.push(`      warning: colors.${theme.name}Warning700,`);
  } else {
    mappings.push(`      warning: colors.yellow700,`);
  }

  if (theme.error) {
    mappings.push(`      error: colors.${theme.name}Error700,`);
  } else {
    mappings.push(`      error: colors.red700,`);
  }

  mappings.push(`      info: colors.accent500,`);
  mappings.push(``);
  mappings.push(`      // UI Elements`);
  mappings.push(`      border: colors.gray200,`);
  mappings.push(`      borderStrong: colors.gray300,`);
  mappings.push(`      focus: colors.${theme.name}Primary700,`);
  mappings.push(`    },`);

  // Find the closing brace of the themes section
  const match = content.match(THEMES_SECTION_END);

  if (!match || match.index === undefined) {
    throw new Error('Could not find themes section in theme.config.ts');
  }

  const insertPos = match.index;
  return (
    content.slice(0, insertPos) +
    '\n' +
    mappings.join('\n') +
    content.slice(insertPos)
  );
}

/**
 * Check if a theme name already exists in the config.
 *
 * @param themeName - The name of the theme to check
 * @returns True if the theme exists, false otherwise
 * @throws {Error} If the config file cannot be read
 * @example
 * const exists = await themeExists('Ocean');
 * if (exists) {
 *   console.log('Theme already exists');
 * }
 */
export async function themeExists(themeName: string): Promise<boolean> {
  if (!themeName) {
    throw new Error('Theme name is required');
  }

  const configPath = join(process.cwd(), CONFIG_PATH);

  try {
    const content = await readFile(configPath, 'utf-8');

    // Check if theme exists in themes section
    // Escape regex special characters in theme name
    const escapedName = escapeRegex(themeName);
    const themePattern = new RegExp(`^\\s+${escapedName}:\\s*{`, 'm');
    return themePattern.test(content);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to check if theme "${themeName}" exists: ${error.message}`
      );
    }
    throw error;
  }
}
