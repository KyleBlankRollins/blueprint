/**
 * Plugin metadata parsing utilities
 * Provides centralized metadata extraction from theme plugin files
 */

import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { PLUGINS_DIR, PLUGIN_ID_REGEX, SEMVER_REGEX } from './constants.js';

export interface PluginMetadata {
  /** Plugin ID (kebab-case) */
  id: string;
  /** Plugin version (semver) */
  version: string;
  /** Display name */
  name?: string;
  /** Short description */
  description?: string;
  /** Author name */
  author?: string;
  /** License (e.g., MIT) */
  license?: string;
  /** Homepage URL */
  homepage?: string;
  /** Repository URL */
  repository?: string;
  /** Tags for categorization */
  tags: string[];
  /** Plugin dependencies */
  dependencies: string[];
}

/**
 * Check if a plugin exists
 *
 * @param pluginId - Plugin ID to check
 * @returns True if plugin directory exists
 * @example
 * if (await pluginExists('ocean')) {
 *   console.log('Ocean plugin is installed');
 * }
 */
export async function pluginExists(pluginId: string): Promise<boolean> {
  const pluginDir = join(process.cwd(), PLUGINS_DIR, pluginId);
  try {
    await access(pluginDir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the absolute path to a plugin directory
 *
 * @param pluginId - Plugin ID
 * @returns Absolute path to plugin directory
 */
export function getPluginPath(pluginId: string): string {
  return join(process.cwd(), PLUGINS_DIR, pluginId);
}

/**
 * Read and parse plugin metadata from index.ts file
 *
 * @param pluginId - Plugin ID (matches directory name)
 * @returns Parsed metadata object
 * @throws Error if plugin not found or invalid
 * @example
 * const metadata = await readPluginMetadata('ocean');
 * console.log(`${metadata.name} v${metadata.version}`);
 * // "Ocean Theme v1.0.0"
 */
export async function readPluginMetadata(
  pluginId: string
): Promise<PluginMetadata> {
  const pluginDir = getPluginPath(pluginId);

  // Check if plugin exists
  try {
    await access(pluginDir);
  } catch {
    throw new Error(`Plugin not found: ${pluginId}`);
  }

  const pluginFile = join(pluginDir, 'index.ts');

  // Check if index.ts exists
  try {
    await access(pluginFile);
  } catch {
    throw new Error(`Plugin file not found: ${pluginFile}`);
  }

  // Read plugin file
  const content = await readFile(pluginFile, 'utf-8');

  // Parse metadata
  return parsePluginMetadata(content);
}

/**
 * Parse metadata from plugin file content
 *
 * @param content - Plugin file content
 * @returns Parsed metadata
 * @internal
 */
export function parsePluginMetadata(content: string): PluginMetadata {
  const extractField = (field: string): string | undefined => {
    // Try multiple quote styles
    const patterns = [
      new RegExp(`${field}:\\s*['"\`]([^'"\`]+)['"\`]`, 'i'),
      new RegExp(`${field}:\\s*['"]([^'"]+)['"]`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) return match[1];
    }
    return undefined;
  };

  const extractArray = (field: string): string[] => {
    const regex = new RegExp(`${field}:\\s*\\[([^\\]]+)\\]`, 'i');
    const match = content.match(regex);
    if (!match) return [];

    return match[1]
      .split(',')
      .map((s) => s.trim().replace(/['"]/g, ''))
      .filter(Boolean);
  };

  const extractDependencies = (): string[] => {
    const regex = /dependencies:\s*\[([^\]]+)\]/i;
    const match = content.match(regex);
    if (!match) return [];

    // Extract dependency IDs from { id: 'plugin-name' } format
    const depPattern = /id:\s*['"]([^'"]+)['"]/g;
    const deps: string[] = [];
    let depMatch;

    while ((depMatch = depPattern.exec(match[1])) !== null) {
      deps.push(depMatch[1]);
    }

    return deps;
  };

  // Extract all fields
  const id = extractField('id') || '';
  const version = extractField('version') || '';
  const name = extractField('name');
  const description = extractField('description');
  const author = extractField('author');
  const license = extractField('license');
  const homepage = extractField('homepage');
  const repository = extractField('repository');
  const tags = extractArray('tags');
  const dependencies = extractDependencies();

  return {
    id,
    version,
    name,
    description,
    author,
    license,
    homepage,
    repository,
    tags,
    dependencies,
  };
}

/**
 * Validate plugin metadata
 *
 * @param metadata - Metadata to validate
 * @returns Array of validation error messages (empty if valid)
 * @example
 * const metadata = await readPluginMetadata('ocean');
 * const errors = validatePluginMetadata(metadata);
 * if (errors.length > 0) {
 *   console.error('Invalid metadata:', errors);
 * }
 */
export function validatePluginMetadata(metadata: PluginMetadata): string[] {
  const errors: string[] = [];

  // Required field: id
  if (!metadata.id) {
    errors.push('Missing required field: id');
  } else if (!PLUGIN_ID_REGEX.test(metadata.id)) {
    errors.push(
      `Invalid plugin ID: "${metadata.id}" - must be kebab-case (lowercase, hyphens only)`
    );
  }

  // Required field: version
  if (!metadata.version) {
    errors.push('Missing required field: version');
  } else if (!SEMVER_REGEX.test(metadata.version)) {
    errors.push(
      `Invalid version: "${metadata.version}" - should follow semver (e.g., 1.0.0)`
    );
  }

  return errors;
}

/**
 * List all installed theme plugins
 *
 * @returns Array of plugin IDs
 * @example
 * const plugins = await listPlugins();
 * console.log(`Found ${plugins.length} plugins:`, plugins);
 * // "Found 5 plugins: ['blueprint-core', 'ocean', 'forest', ...]"
 */
export async function listPlugins(): Promise<string[]> {
  const { readdirSync, statSync } = await import('fs');
  const pluginsDir = join(process.cwd(), PLUGINS_DIR);

  try {
    const entries = readdirSync(pluginsDir);
    return entries.filter((entry) => {
      const fullPath = join(pluginsDir, entry);
      try {
        return statSync(fullPath).isDirectory();
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}
