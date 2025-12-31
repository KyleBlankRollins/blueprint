/**
 * Theme integration helpers
 * Plugin-based theme registration utilities
 */

import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { THEME_CONFIG_FILE } from '../constants.js';

const CONFIG_PATH = THEME_CONFIG_FILE;

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Register a theme plugin in theme.config.ts
 */
export async function registerPlugin(
  pluginId: string,
  options?: {
    importPath?: string;
    constName?: string;
  }
): Promise<void> {
  const configPath = join(process.cwd(), CONFIG_PATH);

  if (!existsSync(configPath)) {
    throw new Error(
      `theme.config.ts not found at ${configPath}\nMake sure you are in the project root directory.`
    );
  }

  // Generate default names
  const constName =
    options?.constName ||
    pluginId
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('') + 'Plugin';
  const importPath = options?.importPath || `../plugins/${pluginId}/index.js`;

  let content = await readFile(configPath, 'utf-8');

  // Check if already registered
  if (content.includes(`'${pluginId}'`) || content.includes(`"${pluginId}"`)) {
    throw new Error(
      `Plugin "${pluginId}" appears to already be registered in theme.config.ts`
    );
  }

  const lines = content.split('\n');

  // Find last import
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex === -1) {
    throw new Error('Could not find import statements in theme.config.ts');
  }

  // Add import
  const importStatement = `import ${constName} from '${importPath}';`;
  lines.splice(lastImportIndex + 1, 0, importStatement);

  // Find ThemeBuilder
  let builderIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('new ThemeBuilder()')) {
      builderIndex = i;
      break;
    }
  }

  if (builderIndex === -1) {
    throw new Error('Could not find ThemeBuilder in theme.config.ts');
  }

  // Find last .use() call
  let lastUseIndex = builderIndex;
  for (let i = builderIndex; i < lines.length; i++) {
    if (lines[i].trim().startsWith('.use(')) {
      lastUseIndex = i;
    }
    if (lines[i].includes(';') && i > builderIndex) {
      break;
    }
  }

  // Add registration
  const indent = lines[lastUseIndex].match(/^\s*/)?.[0] || '  ';
  lines.splice(lastUseIndex + 1, 0, `${indent}.use(${constName})`);

  // Write back
  await writeFile(configPath, lines.join('\n'), 'utf-8');
}

/**
 * Check if a theme plugin already exists in the config.
 */
export async function themeExists(themeName: string): Promise<boolean> {
  if (!themeName) {
    throw new Error('Theme name is required');
  }

  const configPath = join(process.cwd(), CONFIG_PATH);

  try {
    const content = await readFile(configPath, 'utf-8');

    // Check if plugin directory or import exists
    const escapedName = escapeRegex(themeName);
    const pluginPattern = new RegExp(`${escapedName}Plugin`, 'i');
    return pluginPattern.test(content);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to check if theme "${themeName}" exists: ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Unregister a plugin from theme.config.ts
 */
export async function unregisterPlugin(pluginId: string): Promise<void> {
  const configPath = join(process.cwd(), CONFIG_PATH);

  if (!existsSync(configPath)) {
    throw new Error(`theme.config.ts not found at ${configPath}`);
  }

  let content = await readFile(configPath, 'utf-8');
  const lines = content.split('\n');

  // Remove import line
  const importPattern = new RegExp(`from.*plugins/${pluginId}/index`);
  const filteredLines = lines.filter((line) => !importPattern.test(line));

  // Remove .use() line
  const usePattern = new RegExp(`\\.use\\([^)]*${escapeRegex(pluginId)}`);
  const finalLines = filteredLines.filter((line) => !usePattern.test(line));

  await writeFile(configPath, finalLines.join('\n'), 'utf-8');
}

/**
 * @deprecated - Use registerPlugin() instead
 */
export async function integrateTheme(): Promise<void> {
  throw new Error(
    'integrateTheme() is deprecated. Use registerPlugin() instead.'
  );
}
