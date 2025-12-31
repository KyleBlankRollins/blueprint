/**
 * Plugin metadata parsing utilities
 * Provides centralized metadata extraction from theme plugin files
 */

import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { PLUGINS_DIR, PLUGIN_ID_REGEX, SEMVER_REGEX } from '../constants.js';

/** Node.js error with code property for error checking */
interface NodeError extends Error {
  code?: string;
}

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
 * @throws Error if there's a filesystem error other than not found (e.g., permissions)
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
  } catch (error) {
    // ENOENT = not found (expected)
    if ((error as NodeError).code === 'ENOENT') {
      return false;
    }
    // Other errors (permissions, etc.) should bubble up
    throw error;
  }
}

/**
 * Get the absolute path to a plugin directory
 *
 * @param pluginId - Plugin ID
 * @returns Absolute path to plugin directory
 * @throws Error if pluginId is invalid or empty
 */
export function getPluginPath(pluginId: string): string {
  if (!pluginId || !PLUGIN_ID_REGEX.test(pluginId)) {
    throw new Error(
      `Invalid plugin ID: "${pluginId}" - must be kebab-case (lowercase, hyphens only)`
    );
  }
  return join(process.cwd(), PLUGINS_DIR, pluginId);
}

/**
 * Read and parse plugin metadata from index.ts file
 *
 * @param pluginId - Plugin ID (matches directory name)
 * @returns Parsed metadata object with guaranteed 'id', 'version', 'tags', 'dependencies'
 *          properties and optional 'name', 'description', 'author', 'license', 'homepage',
 *          'repository' properties
 * @throws Error if pluginId is invalid, plugin not found, or index.ts missing
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Plugin not found: ${pluginId} - ${message}`);
  }

  const pluginFile = join(pluginDir, 'index.ts');

  // Check if index.ts exists
  try {
    await access(pluginFile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Plugin file not found: ${pluginFile} - ${message}`);
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
    // Try multiple patterns to support both object-based and class-based plugins
    const patterns = [
      // Class property: readonly id = 'value' or id = 'value'
      new RegExp(
        `(?:readonly\\s+)?${field}\\s*=\\s*['"\`]([^'"\`]+)['"\`]`,
        'i'
      ),
      // Object property: id: 'value'
      new RegExp(`${field}:\\s*['"\`]([^'"\`]+)['"\`]`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) return match[1];
    }
    return undefined;
  };

  const extractArray = (field: string): string[] => {
    // Class property: readonly tags = ['a', 'b'] or tags = ['a', 'b']
    const classPattern = new RegExp(
      `(?:readonly\\s+)?${field}\\s*=\\s*\\[([^\\]]+)\\]`,
      'i'
    );
    let match = content.match(classPattern);

    // Object property: tags: ['a', 'b']
    if (!match) {
      const objectPattern = new RegExp(`${field}:\\s*\\[([^\\]]+)\\]`, 'i');
      match = content.match(objectPattern);
    }

    if (!match) return [];

    return match[1]
      .split(',')
      .map((s) => s.trim().replace(/['"]/g, ''))
      .filter(Boolean);
  };

  const extractDependencies = (): string[] => {
    // Class property: readonly dependencies = [{ id: 'plugin' }]
    const classPattern = /(?:readonly\s+)?dependencies\s*=\s*\[([^\]]+)\]/i;
    let match = content.match(classPattern);

    // Object property: dependencies: [{ id: 'plugin' }]
    if (!match) {
      const objectPattern = /dependencies:\s*\[([^\]]+)\]/i;
      match = content.match(objectPattern);
    }

    if (!match) return [];

    // Extract dependency IDs from { id: 'plugin-name' } format
    const depPattern = /id:\s*['"]([^'"]+)['"]/g;
    const deps: string[] = [];
    let dependencyMatch;

    while ((dependencyMatch = depPattern.exec(match[1])) !== null) {
      deps.push(dependencyMatch[1]);
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
 * @returns Array of plugin IDs (directory names that are valid directories)
 * @throws Error if there's a filesystem error other than plugins directory not existing
 * @example
 * const plugins = await listPlugins();
 * console.log(`Found ${plugins.length} plugins:`, plugins);
 * // "Found 5 plugins: ['blueprint-core', 'ocean', 'forest', ...]"
 */
export async function listPlugins(): Promise<string[]> {
  const { readdir, stat } = await import('fs/promises');
  const pluginsDir = join(process.cwd(), PLUGINS_DIR);

  try {
    const entries = await readdir(pluginsDir);
    const results = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = join(pluginsDir, entry);
        try {
          const stats = await stat(fullPath);
          return stats.isDirectory() ? entry : null;
        } catch {
          return null;
        }
      })
    );
    return results.filter((entry): entry is string => entry !== null);
  } catch (error) {
    // ENOENT = plugins directory doesn't exist (expected for new projects)
    if ((error as NodeError).code === 'ENOENT') {
      return [];
    }
    // Other errors (permissions, etc.) should bubble up
    throw error;
  }
}
