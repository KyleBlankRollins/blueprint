/**
 * @font-face CSS Generation
 *
 * Generates CSS @font-face declarations from font asset definitions.
 * Handles variable fonts, weight ranges, and proper format detection.
 */

import type { ResolvedAsset, FontAssetDefinition } from '../core/types.js';

/**
 * Font format mapping from file extension
 */
const FONT_FORMATS: Record<string, string> = {
  woff2: 'woff2',
  woff: 'woff',
  ttf: 'truetype',
  otf: 'opentype',
  eot: 'embedded-opentype',
};

/**
 * Type guard for font assets
 */
function isFontAsset(
  asset: ResolvedAsset
): asset is ResolvedAsset & { definition: FontAssetDefinition } {
  return asset.definition.type === 'font';
}

/**
 * Get font format string from file extension
 *
 * @param path - File path or name
 * @returns CSS format() value
 */
function getFontFormat(path: string): string {
  const ext = path.substring(path.lastIndexOf('.') + 1).toLowerCase();
  return FONT_FORMATS[ext] || ext;
}

/**
 * Generate @font-face CSS declarations from font assets
 *
 * The generated CSS uses relative paths that work when the CSS file
 * is located at `{pluginId}/{variant}.css` and assets are at
 * `{pluginId}/assets/fonts/...`.
 *
 * @param assets - Resolved assets (will filter to fonts only)
 * @returns CSS string with @font-face declarations, or empty string if no fonts
 *
 * @example
 * ```typescript
 * const assets = await collectPluginAssets(plugins, pluginsDir);
 * const pluginAssets = filterAssetsByPlugin(assets, 'blueprint-core');
 * const fontFaceCSS = generateFontFaceCSS(pluginAssets);
 *
 * // Output:
 * // @font-face {
 * //   font-family: 'Figtree';
 * //   src: url('./assets/fonts/Figtree-Variable.woff2') format('woff2');
 * //   font-weight: 300 900;
 * //   font-style: normal;
 * //   font-display: swap;
 * // }
 * ```
 */
export function generateFontFaceCSS(assets: ResolvedAsset[]): string {
  const fontAssets = assets.filter(isFontAsset);

  if (fontAssets.length === 0) {
    return '';
  }

  const declarations = fontAssets.map((asset) => {
    const font = asset.definition;
    const relativePath = `./assets/${font.path}`;
    const format = getFontFormat(font.path);

    const lines: string[] = [
      '@font-face {',
      `  font-family: '${font.family}';`,
      `  src: url('${relativePath}') format('${format}');`,
    ];

    if (font.weight) {
      lines.push(`  font-weight: ${font.weight};`);
    }

    if (font.style) {
      lines.push(`  font-style: ${font.style};`);
    }

    // Default to 'swap' for better UX (shows fallback font immediately)
    lines.push(`  font-display: ${font.display || 'swap'};`);

    if (font.unicodeRange) {
      lines.push(`  unicode-range: ${font.unicodeRange};`);
    }

    lines.push('}');

    return lines.join('\n');
  });

  return [
    '/* Auto-generated @font-face declarations */',
    '',
    ...declarations,
    '',
  ].join('\n');
}

/**
 * Generate @font-face CSS for a specific plugin
 *
 * Convenience function that filters assets by plugin ID before generating.
 *
 * @param assets - All resolved assets
 * @param pluginId - Plugin ID to filter by
 * @returns CSS string with @font-face declarations for the plugin
 */
export function generateFontFaceCSSForPlugin(
  assets: ResolvedAsset[],
  pluginId: string
): string {
  const pluginAssets = assets.filter((a) => a.pluginId === pluginId);
  return generateFontFaceCSS(pluginAssets);
}

/**
 * Check if a plugin has any font assets
 *
 * @param assets - All resolved assets
 * @param pluginId - Plugin ID to check
 * @returns True if the plugin has at least one font asset
 */
export function pluginHasFonts(
  assets: ResolvedAsset[],
  pluginId: string
): boolean {
  return assets.some(
    (a) => a.pluginId === pluginId && a.definition.type === 'font'
  );
}

/**
 * Get all unique font families from assets
 *
 * @param assets - Resolved assets
 * @returns Array of unique font family names
 */
export function getFontFamilies(assets: ResolvedAsset[]): string[] {
  const families = new Set<string>();

  for (const asset of assets) {
    if (isFontAsset(asset)) {
      families.add(asset.definition.family);
    }
  }

  return Array.from(families);
}
