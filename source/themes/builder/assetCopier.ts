/**
 * Asset Copying Utility
 *
 * Copies resolved plugin assets to the output directory.
 * Includes size warnings for large assets.
 */

import { copyFile, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { ResolvedAsset, AssetCopyResult } from '../core/types.js';

/**
 * Warning threshold for large assets (5MB)
 */
const MAX_ASSET_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Copy resolved assets to output directory
 *
 * @param assets - Resolved assets from collectPluginAssets()
 * @param outputDir - Base output directory for generated themes
 * @returns Result with copied paths and any warnings
 *
 * @example
 * ```typescript
 * const assets = await collectPluginAssets(plugins, pluginsDir);
 * const { copied, warnings } = await copyPluginAssets(assets, 'source/themes/generated');
 *
 * console.log(`Copied ${copied.length} assets`);
 * warnings.forEach(w => console.warn(w));
 * ```
 */
export async function copyPluginAssets(
  assets: ResolvedAsset[],
  outputDir: string
): Promise<AssetCopyResult> {
  const copied: string[] = [];
  const warnings: string[] = [];

  for (const asset of assets) {
    const targetPath = join(outputDir, asset.targetPath);

    // Create target directory if needed
    const targetDir = dirname(targetPath);
    await mkdir(targetDir, { recursive: true });

    // Check file size and warn if large
    try {
      const stats = await stat(asset.sourcePath);
      if (stats.size > MAX_ASSET_SIZE_BYTES) {
        const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
        warnings.push(
          `Asset "${asset.targetPath}" is ${sizeMB}MB - consider optimizing`
        );
      }
    } catch {
      // If we can't stat, just proceed with copy (error will surface there)
    }

    // Copy the file
    await copyFile(asset.sourcePath, targetPath);
    copied.push(asset.targetPath);
  }

  return { copied, warnings };
}

/**
 * Get total size of assets in bytes
 *
 * @param assets - Resolved assets to measure
 * @returns Total size in bytes
 */
export async function getAssetsTotalSize(
  assets: ResolvedAsset[]
): Promise<number> {
  let total = 0;

  for (const asset of assets) {
    try {
      const stats = await stat(asset.sourcePath);
      total += stats.size;
    } catch {
      // Skip files we can't stat
    }
  }

  return total;
}

/**
 * Format bytes as human-readable string
 *
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "256 KB")
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
}
