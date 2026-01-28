/**
 * Asset Collection and Validation
 *
 * Collects and validates static assets from theme plugins.
 * Ensures assets exist, have valid extensions, and don't contain path traversal.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type {
  PluginAssetDefinition,
  ResolvedAsset,
} from '../core/types.js';
import type { ThemeBase } from './ThemeBase.js';

/**
 * Allowed file extensions per asset type
 */
const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  font: ['.woff', '.woff2', '.ttf', '.otf', '.eot'],
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg'],
  icon: ['.svg', '.ico'],
  other: ['.txt', '.md', '.json', '.xml', '.license'],
};

/**
 * Blocked file extensions (security)
 */
const BLOCKED_EXTENSIONS = [
  '.exe',
  '.dll',
  '.sh',
  '.bat',
  '.cmd',
  '.ps1',
  '.js',
  '.ts',
  '.mjs',
  '.cjs',
];

/**
 * Collect and validate assets from all registered plugins
 *
 * @param plugins - Array of theme plugins to collect assets from
 * @param pluginsDir - Base directory where plugin source files are located
 * @returns Array of resolved assets ready for copying
 * @throws Error if validation fails (invalid path, missing file, blocked extension)
 *
 * @example
 * ```typescript
 * const plugins = builder.getPlugins();
 * const assets = await collectPluginAssets(plugins, 'source/themes/plugins');
 * ```
 */
export async function collectPluginAssets(
  plugins: ThemeBase[],
  pluginsDir: string
): Promise<ResolvedAsset[]> {
  const resolved: ResolvedAsset[] = [];

  for (const plugin of plugins) {
    const assets = plugin.getAssets();

    if (assets.length === 0) {
      continue;
    }

    const pluginAssetsDir = join(pluginsDir, plugin.id, 'assets');

    for (const asset of assets) {
      const resolvedAsset = resolveAndValidateAsset(
        asset,
        plugin.id,
        pluginAssetsDir
      );
      resolved.push(resolvedAsset);
    }
  }

  return resolved;
}

/**
 * Resolve asset paths and validate
 *
 * @param asset - Asset definition from plugin
 * @param pluginId - Plugin identifier for error messages
 * @param pluginAssetsDir - Absolute path to plugin's assets directory
 * @returns Resolved asset with full paths
 * @throws Error if validation fails
 */
function resolveAndValidateAsset(
  asset: PluginAssetDefinition,
  pluginId: string,
  pluginAssetsDir: string
): ResolvedAsset {
  // Validate path doesn't contain traversal
  if (asset.path.includes('..') || asset.path.startsWith('/')) {
    throw new Error(
      `Plugin "${pluginId}": Invalid asset path "${asset.path}" - must be relative without traversal`
    );
  }

  // Normalize path separators
  const normalizedPath = asset.path.replace(/\\/g, '/');

  // Check file extension
  const lastDotIndex = normalizedPath.lastIndexOf('.');
  const ext = lastDotIndex >= 0 ? normalizedPath.substring(lastDotIndex).toLowerCase() : '';

  if (BLOCKED_EXTENSIONS.includes(ext)) {
    throw new Error(
      `Plugin "${pluginId}": Blocked file type "${ext}" for asset "${asset.path}"`
    );
  }

  const allowedExts = ALLOWED_EXTENSIONS[asset.type];
  if (allowedExts && !allowedExts.includes(ext)) {
    throw new Error(
      `Plugin "${pluginId}": Extension "${ext}" not allowed for type "${asset.type}". ` +
        `Allowed: ${allowedExts.join(', ')}`
    );
  }

  // Build paths
  const sourcePath = join(pluginAssetsDir, normalizedPath);
  const targetPath = `${pluginId}/assets/${normalizedPath}`;

  // Verify source file exists
  if (!existsSync(sourcePath)) {
    throw new Error(
      `Plugin "${pluginId}": Asset file not found: ${sourcePath}`
    );
  }

  return {
    definition: asset,
    pluginId,
    sourcePath,
    targetPath,
  };
}

/**
 * Filter resolved assets by plugin ID
 *
 * @param assets - All resolved assets
 * @param pluginId - Plugin ID to filter by
 * @returns Assets belonging to the specified plugin
 */
export function filterAssetsByPlugin(
  assets: ResolvedAsset[],
  pluginId: string
): ResolvedAsset[] {
  return assets.filter((asset) => asset.pluginId === pluginId);
}

/**
 * Get unique plugin IDs from resolved assets
 *
 * @param assets - Resolved assets
 * @returns Array of unique plugin IDs
 */
export function getPluginIdsFromAssets(assets: ResolvedAsset[]): string[] {
  return Array.from(new Set(assets.map((asset) => asset.pluginId)));
}
