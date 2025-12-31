/**
 * Theme Discovery Utilities
 * Discovers available theme variants from the generated CSS directory structure
 */

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export interface ThemeInfo {
  /** Theme variant name (e.g., 'light', 'dark', 'wada-light') */
  name: string;
  /** Plugin ID that owns this theme (e.g., 'blueprint-core', 'wada-sanzo') */
  pluginId: string;
  /** Relative path to the CSS file (e.g., 'blueprint-core/light.css') */
  path: string;
  /** Full absolute path to the CSS file */
  fullPath: string;
}

/**
 * Cache for discovered themes to avoid repeated file system scans
 */
const themeCache = new Map<string, ThemeInfo[]>();

/**
 * Clear the theme discovery cache
 * Call this after generating new themes or when the file system changes
 */
export function clearThemeCache(): void {
  themeCache.clear();
}

/**
 * Discover all available theme variants from the generated directory
 *
 * @param generatedDir - Path to the generated themes directory
 * @param useCache - Whether to use cached results (default: true)
 * @returns Array of theme objects containing name, pluginId, path, and fullPath
 * @throws Does not throw - returns empty array on errors
 * @example
 * const themes = discoverThemes('source/themes/generated');
 * // Returns: [
 * //   { name: 'light', pluginId: 'blueprint-core', path: 'blueprint-core/light.css', ... },
 * //   { name: 'dark', pluginId: 'blueprint-core', path: 'blueprint-core/dark.css', ... },
 * //   { name: 'wada-light', pluginId: 'wada-sanzo', path: 'wada-sanzo/wada-light.css', ... }
 * // ]
 */
export function discoverThemes(
  generatedDir: string,
  useCache = true
): ThemeInfo[] {
  // Check cache first
  if (useCache && themeCache.has(generatedDir)) {
    return themeCache.get(generatedDir)!;
  }

  const themes: ThemeInfo[] = [];
  let entries: string[];

  // Read the directory with error handling
  try {
    entries = readdirSync(generatedDir);
  } catch (error) {
    console.warn(
      `⚠️  Cannot read themes directory: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return [];
  }

  for (const entry of entries) {
    const entryPath = join(generatedDir, entry);

    // Skip files in the root directory (primitives.css, utilities.css, index.css)
    try {
      const stats = statSync(entryPath);
      if (!stats.isDirectory() || stats.isSymbolicLink()) {
        continue;
      }
    } catch (error) {
      console.warn(
        `⚠️  Cannot access ${entry}:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
      continue;
    }

    // This is a plugin directory
    const pluginId = entry;

    // Look for .css files in this plugin directory
    const pluginDir = entryPath;

    let cssFiles: string[];
    try {
      cssFiles = readdirSync(pluginDir).filter((file) => file.endsWith('.css'));
    } catch (error) {
      console.warn(
        `⚠️  Cannot read plugin directory ${pluginId}:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
      continue;
    }

    for (const cssFile of cssFiles) {
      const themeName = cssFile.replace('.css', '');

      // Validate theme name (must start with letter, can contain alphanumeric and hyphens)
      if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(themeName)) {
        console.warn(
          `⚠️  Skipping invalid theme name: ${themeName} (must start with a letter)`
        );
        continue;
      }

      const relativePath = `${pluginId}/${cssFile}`;
      const fullPath = join(pluginDir, cssFile);

      themes.push({
        name: themeName,
        pluginId,
        path: relativePath,
        fullPath,
      });
    }
  }

  // Sort themes for deterministic output (by plugin, then by name)
  const sortedThemes = themes.sort((a, b) => {
    if (a.pluginId !== b.pluginId) {
      return a.pluginId.localeCompare(b.pluginId);
    }
    return a.name.localeCompare(b.name);
  });

  // Cache the results
  if (useCache) {
    themeCache.set(generatedDir, sortedThemes);
  }

  return sortedThemes;
}

/**
 * Get all theme variant names
 *
 * @param generatedDir - Path to the generated themes directory
 * @returns Array of theme variant names
 * @example
 * const themeNames = getThemeNames('source/themes/generated');
 * // Returns: ['light', 'dark', 'wada-light', 'wada-dark']
 */
export function getThemeNames(generatedDir: string): string[] {
  const themes = discoverThemes(generatedDir);
  return themes.map((t) => t.name);
}

/**
 * Get theme info by variant name
 *
 * @param generatedDir - Path to the generated themes directory
 * @param themeName - Theme variant name to find
 * @returns Theme info or undefined if not found
 * @example
 * const theme = getThemeByName('source/themes/generated', 'wada-light');
 * // Returns: { name: 'wada-light', pluginId: 'wada-sanzo', ... }
 */
export function getThemeByName(
  generatedDir: string,
  themeName: string
): ThemeInfo | undefined {
  const themes = discoverThemes(generatedDir);
  return themes.find((t) => t.name === themeName);
}

/**
 * Get all themes for a specific plugin
 *
 * @param generatedDir - Path to the generated themes directory
 * @param pluginId - Plugin ID to filter by
 * @returns Array of theme info for the plugin
 * @example
 * const wadaThemes = getThemesByPlugin('source/themes/generated', 'wada-sanzo');
 * // Returns: [
 * //   { name: 'wada-light', pluginId: 'wada-sanzo', ... },
 * //   { name: 'wada-dark', pluginId: 'wada-sanzo', ... }
 * // ]
 */
export function getThemesByPlugin(
  generatedDir: string,
  pluginId: string
): ThemeInfo[] {
  const themes = discoverThemes(generatedDir);
  return themes.filter((t) => t.pluginId === pluginId);
}

/**
 * Check if a theme variant exists
 *
 * @param generatedDir - Path to the generated themes directory
 * @param themeName - Theme variant name to check
 * @returns True if theme exists, false otherwise
 */
export function themeExists(generatedDir: string, themeName: string): boolean {
  return getThemeByName(generatedDir, themeName) !== undefined;
}
