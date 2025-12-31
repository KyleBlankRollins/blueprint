/**
 * Theme integration helpers
 * @deprecated - Plugin-based themes are self-contained
 */

import { join } from 'path';
import { readFile } from 'fs/promises';

const CONFIG_PATH = 'source/themes/config/theme.config.ts';

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @deprecated - No longer needed with plugin-based themes
 */
export async function integrateTheme(): Promise<void> {
  throw new Error(
    'Theme integration is no longer needed. Plugins are self-contained - just register them in theme.config.ts'
  );
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
