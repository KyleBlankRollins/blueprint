/**
 * Interactive theme creator
 * Generates a new theme plugin through CLI prompts
 */

import { input, confirm } from '@inquirer/prompts';
import { parse, oklch } from 'culori';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { getContrastRatio } from '../../themes/color/colorUtils.js';

export interface ThemeCreatorOptions {
  name?: string;
  color?: string;
  author?: string;
}

export interface ThemePluginResult {
  pluginId: string;
  pluginDir: string;
  themeName: string;
  primary: { l: number; c: number; h: number };
}

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
 * Interactive theme plugin creation workflow
 * Creates a complete plugin with light and dark variants
 */
export async function createThemeInteractive(
  options: ThemeCreatorOptions
): Promise<ThemePluginResult> {
  console.log('🎨 Blueprint Theme Plugin Creator\n');
  console.log(
    'This will create a new theme plugin with light and dark variants.\n'
  );

  // Step 1: Plugin ID (used for directory and plugin identifier)
  const pluginId =
    options.name ||
    (await input({
      message: 'Plugin ID (e.g., ocean, forest):',
      default: 'custom',
      validate: (value) =>
        /^[a-z][a-z0-9-]*$/.test(value) ||
        'Must start with lowercase letter and contain only lowercase letters, numbers, and hyphens',
    }));

  // Step 2: Primary brand color
  const hexColor =
    options.color ||
    (await input({
      message: 'Primary brand color (hex):',
      default: '#3b82f6',
      validate: (value) =>
        isValidHex(value) || 'Invalid hex color (e.g., #3b82f6)',
    }));

  const primaryColor = hexToOKLCH(hexColor);
  if (!primaryColor) {
    throw new Error(
      `Failed to convert "${hexColor}" to OKLCH. Use format: #3b82f6`
    );
  }

  console.log(`\n✨ Creating "${pluginId}" plugin...`);
  console.log(`   Primary: ${formatOKLCH(primaryColor)}`);

  // Preview contrast
  const { needsAdjustment } = previewContrast(hexColor, 'Primary color');

  // Step 3: Optional author name (skip if running non-interactively)
  let author = options.author || '';

  // Only prompt if both name and color were NOT provided via options (interactive mode)
  if (!options.name || !options.color) {
    author = await input({
      message: 'Author name (optional):',
      default: '',
    });
  }

  // Step 4: Create both variants by default (skip prompt if non-interactive)
  let createBothVariants = true;
  if (!options.name || !options.color) {
    createBothVariants = await confirm({
      message: 'Create both light and dark variants?',
      default: true,
    });
  }

  if (needsAdjustment) {
    console.log(
      '\n⚠️  Note: Primary color may need adjustment for accessibility.'
    );
    console.log('   You can fine-tune colors after plugin creation.\n');
  }

  // Generate the plugin files
  const pluginDir = join(
    process.cwd(),
    'source',
    'themes',
    'plugins',
    pluginId
  );
  const themeName = pluginId.charAt(0).toUpperCase() + pluginId.slice(1);

  console.log('\n📦 Creating plugin files...');

  try {
    // Create plugin directory
    mkdirSync(pluginDir, { recursive: true });

    // Generate plugin code
    const pluginCode = generatePluginCode(
      pluginId,
      themeName,
      primaryColor,
      author || 'Unknown',
      createBothVariants
    );

    // Write plugin file
    const pluginFile = join(pluginDir, 'index.ts');
    writeFileSync(pluginFile, pluginCode, 'utf-8');
    console.log(`   ✓ Created ${pluginId}/index.ts`);

    // Generate README
    const readmeContent = generatePluginReadme(
      pluginId,
      themeName,
      hexColor,
      primaryColor,
      createBothVariants
    );

    const readmeFile = join(pluginDir, 'README.md');
    writeFileSync(readmeFile, readmeContent, 'utf-8');
    console.log(`   ✓ Created ${pluginId}/README.md`);

    console.log('\n✅ Plugin created successfully!\n');

    return {
      pluginId,
      pluginDir,
      themeName,
      primary: primaryColor,
    };
  } catch (error) {
    throw new Error(
      `Failed to create plugin: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate plugin TypeScript code
 */
function generatePluginCode(
  pluginId: string,
  themeName: string,
  primary: { l: number; c: number; h: number },
  author: string,
  createBothVariants: boolean
): string {
  const colorName = `${pluginId}Primary`;

  return `/**
 * ${themeName} Theme Plugin
 * Auto-generated theme plugin
 */

import type { ThemePlugin } from '../../core/types.js';

export const ${pluginId}Plugin: ThemePlugin = {
  id: '${pluginId}',
  version: '1.0.0',
  name: '${themeName} Theme',
  description: 'Custom theme with ${pluginId} primary color',
  author: '${author}',
  license: 'MIT',
  tags: ['custom', '${pluginId}'],

  dependencies: [{ id: 'primitives' }, { id: 'blueprint-core' }],

  register(builder) {
    // Define primary color
    builder.addColor('${colorName}', {
      source: { l: ${primary.l.toFixed(4)}, c: ${primary.c.toFixed(4)}, h: ${primary.h.toFixed(2)} },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: '${themeName} Primary',
        description: 'Primary brand color for ${pluginId} theme',
        tags: ['brand', 'primary'],
      },
    });

    // ${themeName} Light variant
    builder.addThemeVariant('${pluginId}-light', {
      // Backgrounds
      background: builder.colors.gray50,
      surface: builder.colors.gray100,
      surfaceElevated: builder.colors.white500,
      surfaceSubdued: builder.colors.gray200,

      // Text
      text: builder.colors.gray900,
      textMuted: builder.colors.gray600,
      textInverse: builder.colors.white500,

      // Primary - using custom color
      primary: builder.colors.${colorName}600,
      primaryHover: builder.colors.${colorName}700,
      primaryActive: builder.colors.${colorName}800,

      // Semantic - using Blueprint core colors
      success: builder.colors.green500,
      warning: builder.colors.yellow600,
      error: builder.colors.red500,
      info: builder.colors.blue500,

      // UI Elements
      border: builder.colors.gray200,
      borderStrong: builder.colors.gray300,
      focus: builder.colors.${colorName}500,
    });${
      createBothVariants
        ? `

    // ${themeName} Dark variant
    builder.addThemeVariant('${pluginId}-dark', {
      // Backgrounds
      background: builder.colors.gray950,
      surface: builder.colors.gray900,
      surfaceElevated: builder.colors.gray800,
      surfaceSubdued: builder.colors.black500,

      // Text
      text: builder.colors.gray50,
      textMuted: builder.colors.gray400,
      textInverse: builder.colors.gray900,

      // Primary - lighter shades for dark backgrounds
      primary: builder.colors.${colorName}400,
      primaryHover: builder.colors.${colorName}300,
      primaryActive: builder.colors.${colorName}200,

      // Semantic - lighter shades
      success: builder.colors.green400,
      warning: builder.colors.yellow400,
      error: builder.colors.red400,
      info: builder.colors.blue400,

      // UI Elements
      border: builder.colors.gray800,
      borderStrong: builder.colors.gray700,
      focus: builder.colors.${colorName}400,
    });`
        : ''
    }
  },
};

export default ${pluginId}Plugin;
`;
}

/**
 * Generate plugin README
 */
function generatePluginReadme(
  pluginId: string,
  themeName: string,
  hexColor: string,
  primary: { l: number; c: number; h: number },
  createBothVariants: boolean
): string {
  return `# ${themeName} Theme Plugin

Custom theme plugin for Blueprint.

## Overview

This plugin provides ${createBothVariants ? 'light and dark' : 'a'} theme variant${createBothVariants ? 's' : ''} with a custom primary color.

## Primary Color

- **Hex:** ${hexColor}
- **OKLCH:** oklch(${primary.l.toFixed(2)} ${primary.c.toFixed(2)} ${primary.h.toFixed(0)})

## Theme Variants

${
  createBothVariants
    ? `### ${pluginId}-light

Light theme variant optimized for daylight viewing.

### ${pluginId}-dark

Dark theme variant optimized for low-light viewing.`
    : `### ${pluginId}-light

Light theme variant with custom primary color.`
}

## Usage

\`\`\`typescript
import { ThemeBuilder } from '@blueprint/themes';
import primitivesPlugin from '@blueprint/themes/plugins/primitives';
import blueprintCorePlugin from '@blueprint/themes/plugins/blueprint-core';
import ${pluginId}Plugin from '@blueprint/themes/plugins/${pluginId}';

const builder = new ThemeBuilder()
  .use(primitivesPlugin)
  .use(blueprintCorePlugin)
  .use(${pluginId}Plugin);

const theme = builder.build();
\`\`\`

## Generated Files

After running \`npm run theme:generate\`, the following CSS files will be created:

${
  createBothVariants
    ? `- \`source/themes/generated/${pluginId}/${pluginId}-light.css\`
- \`source/themes/generated/${pluginId}/${pluginId}-dark.css\``
    : `- \`source/themes/generated/${pluginId}/${pluginId}-light.css\``
}

## Metadata

- **Plugin ID:** ${pluginId}
- **Version:** 1.0.0
- **Dependencies:** primitives, blueprint-core

## Customization

You can customize this theme by editing \`index.ts\`:

1. Adjust the primary color's OKLCH values
2. Add additional colors with \`builder.addColor()\`
3. Modify semantic token mappings
4. Create additional theme variants
`;
}
