/**
 * Automatically integrate a new theme into theme.config.ts
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { ThemeColors } from './themeCreator.js';

const CONFIG_PATH = 'source/themes/config/theme.config.ts';

/**
 * Update theme.config.ts with new theme colors
 */
export async function integrateTheme(theme: ThemeColors): Promise<void> {
  const configPath = join(process.cwd(), CONFIG_PATH);
  let content = await readFile(configPath, 'utf-8');

  // 1. Add color definitions
  content = addColorDefinitions(content, theme);

  // 2. Update createColorRefs call
  content = updateColorRefs(content, theme);

  // 3. Add theme mappings
  content = addThemeMappings(content, theme);

  // Write back to file
  await writeFile(configPath, content, 'utf-8');
}

/**
 * Add color definitions to the colors section
 */
function addColorDefinitions(content: string, theme: ThemeColors): string {
  const colorNames: string[] = [];

  // Build list of color names to add
  colorNames.push(`${theme.name}Primary`);
  if (theme.success) colorNames.push(`${theme.name}Success`);
  if (theme.error) colorNames.push(`${theme.name}Error`);
  if (theme.warning) colorNames.push(`${theme.name}Warning`);

  // Build the color definitions
  const definitions: string[] = [];
  definitions.push(`\n    // ${theme.name} theme colors`);

  definitions.push(`    ${theme.name}Primary: {`);
  definitions.push(
    `      source: { l: ${theme.primary.l.toFixed(4)}, c: ${theme.primary.c.toFixed(4)}, h: ${theme.primary.h.toFixed(2)} },`
  );
  definitions.push(
    `      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],`
  );
  definitions.push(`    },`);

  if (theme.success) {
    definitions.push(`    ${theme.name}Success: {`);
    definitions.push(
      `      source: { l: ${theme.success.l.toFixed(4)}, c: ${theme.success.c.toFixed(4)}, h: ${theme.success.h.toFixed(2)} },`
    );
    definitions.push(
      `      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],`
    );
    definitions.push(`    },`);
  }

  if (theme.error) {
    definitions.push(`    ${theme.name}Error: {`);
    definitions.push(
      `      source: { l: ${theme.error.l.toFixed(4)}, c: ${theme.error.c.toFixed(4)}, h: ${theme.error.h.toFixed(2)} },`
    );
    definitions.push(
      `      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],`
    );
    definitions.push(`    },`);
  }

  if (theme.warning) {
    definitions.push(`    ${theme.name}Warning: {`);
    definitions.push(
      `      source: { l: ${theme.warning.l.toFixed(4)}, c: ${theme.warning.c.toFixed(4)}, h: ${theme.warning.h.toFixed(2)} },`
    );
    definitions.push(
      `      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],`
    );
    definitions.push(`    },`);
  }

  // Find the closing brace of the colors section
  // Look for the pattern: "  },\n\n  // Dark mode adjustments" or similar
  const colorsEndPattern =
    /(\n {2}},\n\n {2}\/\/ Dark mode adjustments|secondaryAccent:\s*{[^}]+},\n)/;
  const match = content.match(colorsEndPattern);

  if (match && match.index !== undefined) {
    const insertPos = match.index + match[0].length;
    content =
      content.slice(0, insertPos) +
      definitions.join('\n') +
      content.slice(insertPos);
  } else {
    throw new Error('Could not find colors section in theme.config.ts');
  }

  return content;
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
  const pattern = /const colors = createColorRefs\(\[([\s\S]*?)\] as const\);/;
  const match = content.match(pattern);

  if (!match) {
    throw new Error('Could not find createColorRefs call in theme.config.ts');
  }

  const existingColors = match[1];

  // Add new color names (with proper indentation)
  const newColors = colorNames.map((name) => `  '${name}',`).join('\n');

  const updated = content.replace(
    pattern,
    `const colors = createColorRefs([${existingColors}\n${newColors}\n] as const);`
  );

  return updated;
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
  const themesEndPattern =
    /(\n {2}},\n\n {2}\/\/ Accessibility validation rules)/;
  const match = content.match(themesEndPattern);

  if (match && match.index !== undefined) {
    const insertPos = match.index;
    content =
      content.slice(0, insertPos) +
      '\n' +
      mappings.join('\n') +
      content.slice(insertPos);
  } else {
    throw new Error('Could not find themes section in theme.config.ts');
  }

  return content;
}

/**
 * Check if a theme name already exists in the config
 */
export async function themeExists(themeName: string): Promise<boolean> {
  const configPath = join(process.cwd(), CONFIG_PATH);
  const content = await readFile(configPath, 'utf-8');

  // Check if theme exists in themes section
  const themePattern = new RegExp(`\\s+${themeName}: {2}{`, 'g');
  return themePattern.test(content);
}
