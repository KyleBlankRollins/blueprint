# Theme Plugin Asset Management

**Status:** Proposed
**Created:** January 27, 2026
**Updated:** January 27, 2026
**Author:** Blueprint Team

## Overview

This design document describes how theme plugins can bundle and distribute their own static assets (fonts, images, icons, etc.) alongside CSS theme definitions. This enables themes to be fully self-contained and portable.

## Problem Statement

Currently, the theme system only generates CSS files. Theme plugins cannot bundle font files or other assets that their themes depend on. This creates several issues:

1. **No self-hosted font support** - Themes must rely on external CDNs (Google Fonts, etc.)
2. **Plugin portability** - Plugins cannot be truly self-contained
3. **Privacy concerns** - External font CDNs create GDPR compliance issues
4. **Offline support** - Themes don't work in air-gapped or restricted environments
5. **Inconsistent experience** - Users must manually add font links to their HTML

## Goals

1. Enable theme plugins to bundle static assets (fonts, icons, images)
2. Maintain plugin isolation - each plugin manages its own assets
3. Preserve existing theme build pipeline compatibility
4. Support both build-time and runtime asset resolution
5. Keep the API simple and intuitive

## Non-Goals

- Dynamic asset loading at runtime
- Asset optimization/compression (handled by build tools)
- Asset versioning/cache busting (consumer responsibility)
- Image processing or transformation

## Proposed Solution

### 1. Plugin Asset Directory Structure

Each theme plugin can include an `assets/` directory:

```
source/themes/plugins/
├── blueprint-core/
│   ├── index.ts
│   └── assets/
│       └── fonts/
│           ├── Figtree-VariableFont.woff2
│           └── Figtree-LICENSE.txt
├── corporate-theme/
│   ├── index.ts
│   └── assets/
│       ├── fonts/
│       │   └── CustomFont.woff2
│       └── icons/
│           └── logo.svg
```

### 2. Type System Updates

#### Asset Definition Types

```typescript
// source/themes/core/types.ts

/**
 * Font asset with metadata for @font-face generation
 */
export interface FontAssetDefinition {
  type: 'font';
  /** Path relative to plugin's assets/ directory (e.g., 'fonts/Figtree.woff2') */
  path: string;
  /** Font family name for @font-face */
  family: string;
  /** Font weight - single value or range (e.g., '400' or '100 900' for variable) */
  weight?: string;
  /** Font style (e.g., 'normal', 'italic') */
  style?: string;
  /** Font display strategy */
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  /** Unicode range (optional, for subsetting) */
  unicodeRange?: string;
}

/**
 * Generic asset (images, icons, other files)
 */
export interface GenericAssetDefinition {
  type: 'image' | 'icon' | 'other';
  /** Path relative to plugin's assets/ directory */
  path: string;
}

export type PluginAssetDefinition =
  | FontAssetDefinition
  | GenericAssetDefinition;

/**
 * Resolved asset with full paths (internal use)
 */
export interface ResolvedAsset {
  /** Original definition */
  definition: PluginAssetDefinition;
  /** Plugin that owns this asset */
  pluginId: string;
  /** Absolute source path */
  sourcePath: string;
  /** Relative target path from output directory */
  targetPath: string;
}
```

#### Extend ThemeBase Class

```typescript
// source/themes/builder/ThemeBase.ts

export abstract class ThemeBase {
  abstract readonly id: string;
  // ... existing fields ...

  /**
   * Define static assets bundled with this plugin.
   * Override to provide fonts, images, or other assets.
   *
   * @returns Array of asset definitions, or empty array if no assets
   */
  getAssets(): PluginAssetDefinition[] {
    return [];
  }
}
```

### 3. Asset Collection and Validation

```typescript
// source/themes/builder/assetCollector.ts

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type {
  ThemeBase,
  PluginAssetDefinition,
  ResolvedAsset,
} from '../core/types.js';

const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  font: ['.woff', '.woff2', '.ttf', '.otf', '.eot'],
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg'],
  icon: ['.svg', '.ico'],
  other: ['.txt', '.md', '.json', '.xml'],
};

const BLOCKED_EXTENSIONS = [
  '.exe',
  '.dll',
  '.sh',
  '.bat',
  '.cmd',
  '.ps1',
  '.js',
  '.ts',
];

/**
 * Collect and validate assets from all registered plugins
 */
export async function collectPluginAssets(
  plugins: ThemeBase[],
  pluginsDir: string
): Promise<ResolvedAsset[]> {
  const resolved: ResolvedAsset[] = [];

  for (const plugin of plugins) {
    const assets = plugin.getAssets();
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

  // Check file extension
  const ext = asset.path.substring(asset.path.lastIndexOf('.')).toLowerCase();

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
  const sourcePath = join(pluginAssetsDir, asset.path);
  const targetPath = `${pluginId}/assets/${asset.path}`;

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
```

### 4. Asset Copying Utility

```typescript
// source/themes/builder/assetCopier.ts

import { copyFile, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { ResolvedAsset } from '../core/types.js';

const MAX_ASSET_SIZE_BYTES = 5 * 1024 * 1024; // 5MB warning threshold

export interface CopyResult {
  copied: string[];
  warnings: string[];
}

/**
 * Copy resolved assets to output directory
 */
export async function copyPluginAssets(
  assets: ResolvedAsset[],
  outputDir: string
): Promise<CopyResult> {
  const copied: string[] = [];
  const warnings: string[] = [];

  for (const asset of assets) {
    const targetPath = join(outputDir, asset.targetPath);

    // Create target directory
    await mkdir(dirname(targetPath), { recursive: true });

    // Check file size
    const stats = await stat(asset.sourcePath);
    if (stats.size > MAX_ASSET_SIZE_BYTES) {
      warnings.push(
        `Asset "${asset.targetPath}" is ${(stats.size / 1024 / 1024).toFixed(1)}MB - consider optimizing`
      );
    }

    // Copy file
    await copyFile(asset.sourcePath, targetPath);
    copied.push(asset.targetPath);
  }

  return { copied, warnings };
}
```

### 5. @font-face CSS Generation

This is the key piece that generates proper CSS for bundled fonts.

```typescript
// source/themes/builder/fontFaceGenerator.ts

import type { ResolvedAsset, FontAssetDefinition } from '../core/types.js';

/**
 * Generate @font-face CSS declarations from font assets
 *
 * @param assets - Resolved assets (filters to fonts only)
 * @param cssFileDepth - How many directories deep the CSS file is from output root
 *                       e.g., 'blueprint-core/light.css' = 1
 * @returns CSS string with @font-face declarations
 */
export function generateFontFaceCSS(
  assets: ResolvedAsset[],
  cssFileDepth: number = 1
): string {
  const fontAssets = assets.filter(
    (a): a is ResolvedAsset & { definition: FontAssetDefinition } =>
      a.definition.type === 'font'
  );

  if (fontAssets.length === 0) return '';

  // Calculate relative path prefix from CSS file to assets
  // If CSS is at 'blueprint-core/light.css', assets are at 'blueprint-core/assets/'
  // So relative path is './assets/'
  const pathPrefix = './assets/';

  const declarations = fontAssets.map((asset) => {
    const font = asset.definition;
    const relativePath = pathPrefix + font.path;

    // Determine format from extension
    const ext = font.path.substring(font.path.lastIndexOf('.') + 1);
    const format = getFontFormat(ext);

    const parts = [
      `@font-face {`,
      `  font-family: '${font.family}';`,
      `  src: url('${relativePath}') format('${format}');`,
    ];

    if (font.weight) {
      parts.push(`  font-weight: ${font.weight};`);
    }

    if (font.style) {
      parts.push(`  font-style: ${font.style};`);
    }

    parts.push(`  font-display: ${font.display || 'swap'};`);

    if (font.unicodeRange) {
      parts.push(`  unicode-range: ${font.unicodeRange};`);
    }

    parts.push(`}`);

    return parts.join('\n');
  });

  return `/* Auto-generated @font-face declarations */\n${declarations.join('\n\n')}\n`;
}

function getFontFormat(ext: string): string {
  const formats: Record<string, string> = {
    woff2: 'woff2',
    woff: 'woff',
    ttf: 'truetype',
    otf: 'opentype',
    eot: 'embedded-opentype',
  };
  return formats[ext] || ext;
}
```

### 6. Integration with Theme Generation

#### Update Theme Variant CSS Generation

Each theme variant's CSS file should include the @font-face declarations at the top:

```typescript
// source/themes/builder/cssGenerator.ts (updated)

export function generateThemeVariantCSS(
  pluginId: string,
  variantName: string,
  tokens: ThemeTokens,
  fontFaceCSS: string
): string {
  const css = [];

  // Add @font-face declarations first
  if (fontFaceCSS) {
    css.push(fontFaceCSS);
  }

  // Add theme tokens
  css.push(`[data-theme="${variantName}"] {`);
  for (const [key, value] of Object.entries(tokens)) {
    css.push(`  --bp-${kebabCase(key)}: ${value};`);
  }
  css.push(`}`);

  return css.join('\n');
}
```

#### Generated Output Structure

```
source/themes/generated/
├── index.css                 # Imports all themes
├── utilities.css             # Utility classes
├── blueprint-core/
│   ├── light.css             # Contains @font-face + tokens
│   ├── dark.css              # Contains @font-face + tokens
│   └── assets/
│       └── fonts/
│           ├── Figtree-VariableFont.woff2
│           └── Figtree-LICENSE.txt
```

#### Example Generated light.css

```css
/* Auto-generated @font-face declarations */
@font-face {
  font-family: 'Figtree';
  src: url('./assets/fonts/Figtree-VariableFont.woff2') format('woff2');
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}

[data-theme='light'] {
  --bp-color-background: oklch(0.89 0.01 91.4);
  --bp-color-surface: oklch(0.94 0.02 91.4);
  --bp-font-family-base:
    'Figtree', -apple-system, BlinkMacSystemFont, sans-serif;
  /* ... other tokens ... */
}
```

### 7. Plugin Implementation Example

```typescript
// source/themes/plugins/blueprint-core/index.ts

import { ThemeBase } from '../../builder/ThemeBase.js';
import type {
  ThemeBuilderInterface,
  PluginAssetDefinition,
} from '../../core/types.js';

export class BlueprintCoreTheme extends ThemeBase {
  readonly id = 'blueprint-core';
  readonly version = '1.0.0';
  readonly name = 'Blueprint Core Theme';
  // ... other metadata ...

  /**
   * Bundle Figtree variable font
   */
  getAssets(): PluginAssetDefinition[] {
    return [
      {
        type: 'font',
        path: 'fonts/Figtree-VariableFont.woff2',
        family: 'Figtree',
        weight: '300 900', // Variable font weight range
        style: 'normal',
        display: 'swap',
      },
      {
        type: 'other',
        path: 'fonts/Figtree-LICENSE.txt',
      },
    ];
  }

  register(builder: ThemeBuilderInterface): void {
    builder.addThemeVariant('light', {
      // ... color tokens ...

      // Reference the bundled font
      fontFamily:
        "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontFamilyMono: '"SF Mono", Monaco, "Cascadia Code", monospace',
      fontFamilyHeading:
        "'Figtree', -apple-system, BlinkMacSystemFont, sans-serif",
    });

    builder.addThemeVariant('dark', {
      // ... same font family references ...
    });
  }
}
```

### 8. CLI Command Updates

```typescript
// source/cli/commands/generate-theme.ts (updated)

import { collectPluginAssets } from '../../themes/builder/assetCollector.js';
import { copyPluginAssets } from '../../themes/builder/assetCopier.js';
import { generateFontFaceCSS } from '../../themes/builder/fontFaceGenerator.js';

export async function generateTheme(options = {}): Promise<void> {
  const { validate = true, outputDir = 'source/themes/generated' } = options;
  const pluginsDir = 'source/themes/plugins';

  console.log('🎨 Generating Blueprint theme...\n');

  const builder = ThemeBuilder.withDefaults();
  const config = builder.build();
  const plugins = builder.getPlugins();

  // Collect and validate assets
  console.log('📦 Collecting plugin assets...');
  const assets = await collectPluginAssets(plugins, pluginsDir);

  if (assets.length > 0) {
    console.log(
      `   Found ${assets.length} asset(s) from ${plugins.length} plugin(s)`
    );
  }

  // Generate CSS (with @font-face injected)
  console.log('\n📝 Generating CSS files...');
  for (const plugin of plugins) {
    const pluginAssets = assets.filter((a) => a.pluginId === plugin.id);
    const fontFaceCSS = generateFontFaceCSS(pluginAssets);

    // Generate each variant's CSS with font-face included
    // ... existing generation logic, passing fontFaceCSS ...
  }

  // Copy assets
  if (assets.length > 0) {
    console.log('\n📁 Copying assets...');
    const { copied, warnings } = await copyPluginAssets(assets, outputDir);

    for (const path of copied) {
      console.log(`   ✓ ${path}`);
    }

    for (const warning of warnings) {
      console.log(`   ⚠️  ${warning}`);
    }
  }

  console.log('\n✅ Theme generated successfully!');
}
```

## Asset Resolution at Runtime

### For Consumers Using CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/blueprint@latest/dist/themes/generated/blueprint-core/light.css"
/>
```

The CSS contains relative URLs (`./assets/fonts/...`) that resolve correctly because the CDN serves the entire directory structure.

### For Consumers Bundling

```javascript
import 'blueprint/dist/themes/generated/blueprint-core/light.css';
```

Modern bundlers (Vite, Webpack, Parcel) handle `url()` references in CSS automatically, copying font files to the output and rewriting paths.

### For Consumers in Node/SSR

Assets are part of the published package under `dist/themes/generated/`, maintaining the same relative path structure.

## Migration Path

### Phase 1: Foundation

- Implement type definitions
- Add asset collection with validation
- Add asset copying utility
- Add @font-face generation

### Phase 2: Blueprint Core Font

- Add Figtree font files to blueprint-core plugin
- Implement `getAssets()` in blueprint-core
- Update font-family tokens to use Figtree
- Update documentation

### Phase 3: Extended Assets (Future)

- Support for image assets in CSS (backgrounds, etc.)
- Icon sprite generation
- Asset manifest for tooling

## Backwards Compatibility

- Existing plugins without `getAssets()` work unchanged (method returns empty array by default)
- Existing `buildTheme()` continues to work
- New asset features are opt-in per plugin

## Security Considerations

1. **Path Traversal Prevention**
   - Reject paths containing `..` or starting with `/`
   - All assets scoped to plugin's `assets/` directory

2. **File Type Validation**
   - Allowlist of extensions per asset type
   - Blocklist of executable extensions
   - Extension must match declared type

3. **Size Limits**
   - Warning threshold at 5MB per asset
   - Plugins should document total asset size

## Performance Considerations

1. **Build Time**
   - Asset validation adds file existence checks
   - Copying is async and parallelizable if needed

2. **Bundle Size**
   - Figtree variable font: ~85KB (woff2)
   - Document total plugin asset size in README

3. **Runtime**
   - `font-display: swap` prevents FOIT
   - Variable fonts reduce total download size vs multiple weights

## Implementation Checklist

- [ ] Add `PluginAssetDefinition` types to `core/types.ts`
- [ ] Add `getAssets()` method to `ThemeBase` (returns empty array)
- [ ] Implement `collectPluginAssets()` with validation
- [ ] Implement `copyPluginAssets()` utility
- [ ] Implement `generateFontFaceCSS()`
- [ ] Update CSS generation to include @font-face
- [ ] Update `ThemeBuilder.getPlugins()` to expose plugins
- [ ] Update `generateTheme` CLI command
- [ ] Add Figtree font files to `blueprint-core/assets/fonts/`
- [ ] Implement `getAssets()` in BlueprintCoreTheme
- [ ] Update blueprint-core font-family tokens
- [ ] Add tests for asset collection and validation
- [ ] Add tests for asset copying
- [ ] Add tests for @font-face generation
- [ ] Update documentation

## References

- [Google Fonts: Figtree](https://fonts.google.com/specimen/Figtree)
- [Web Font Best Practices](https://web.dev/font-best-practices/)
- [CSS @font-face descriptor reference](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [Variable Fonts Guide](https://web.dev/variable-fonts/)
