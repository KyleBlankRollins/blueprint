/**
 * Theme Discovery Utilities
 * Discovers available theme variants from plugin source files
 */

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parsePluginMetadata } from './pluginMetadata.js';

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
 * Discover all available theme variants from plugin source files
 *
 * Scans source/themes/plugins directory for actual plugin files (source of truth),
 * then checks for corresponding generated CSS files.
 *
 * @param generatedDir - Path to the generated themes directory (used to check for generated CSS files)
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

  // Determine plugins directory (source of truth)
  // For production: generatedDir will be 'source/themes/generated', so plugins are at 'source/themes/plugins'
  // For tests: generatedDir will be 'test-dir', so plugins are at 'test-dir/../source/themes/plugins'
  // We derive plugins dir by going up from generated dir and into plugins
  const pluginsDir = join(generatedDir, '..', 'plugins');

  let pluginEntries: string[];
  try {
    pluginEntries = readdirSync(pluginsDir);
  } catch (error) {
    console.warn(
      `⚠️  Cannot read plugins directory: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return [];
  }

  // Scan each plugin directory
  for (const entry of pluginEntries) {
    const pluginPath = join(pluginsDir, entry);

    // Skip non-directories and special directories
    try {
      const stats = statSync(pluginPath);
      if (
        !stats.isDirectory() ||
        stats.isSymbolicLink() ||
        entry.startsWith('.') ||
        entry.startsWith('_')
      ) {
        continue;
      }
    } catch (error) {
      console.warn(
        `⚠️  Cannot access ${entry}:`,
        error instanceof Error ? error.message : 'Unknown error'
      );
      continue;
    }

    // Check for index.ts file
    const indexPath = join(pluginPath, 'index.ts');
    let pluginContent: string;
    try {
      pluginContent = readFileSync(indexPath, 'utf-8');
    } catch {
      // Skip plugins without index.ts
      continue;
    }

    // Parse plugin metadata to get plugin ID
    const metadata = parsePluginMetadata(pluginContent);
    if (!metadata.id) {
      console.warn(`⚠️  Plugin in ${entry} has no ID, skipping`);
      continue;
    }

    const pluginId = metadata.id;

    // Extract theme variant names from plugin source
    // Look for builder.addThemeVariant('variant-name', ...)
    const variantPattern = /builder\.addThemeVariant\s*\(\s*['"]([^'"]+)['"]/g;
    const variants: string[] = [];
    let match;

    while ((match = variantPattern.exec(pluginContent)) !== null) {
      variants.push(match[1]);
    }

    if (variants.length === 0) {
      // Plugin defines no variants, skip
      continue;
    }

    // For each variant, check if generated CSS exists
    for (const variantName of variants) {
      const cssFileName = `${variantName}.css`;
      const relativePath = `${pluginId}/${cssFileName}`;
      const fullPath = join(generatedDir, relativePath);

      themes.push({
        name: variantName,
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
