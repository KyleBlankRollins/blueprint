/**
 * CLI command: bp theme generate
 * Generates CSS files from theme configuration
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ThemeBuilder,
  ThemeBase,
  buildTheme,
  validateThemeContrast,
  generateAllColorScales,
  generateFontFaceCSSForPlugin,
  type ContrastViolation,
} from '../../themes/builder/index.js';
// Import Node.js-only utilities directly (not from barrel export)
import { collectPluginAssets } from '../../themes/builder/assetCollector.js';
import {
  copyPluginAssets,
  formatBytes,
  getAssetsTotalSize,
} from '../../themes/builder/assetCopier.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BYTES_PER_KB = 1024;

/**
 * Generate theme CSS files from configuration
 *
 * @param options - Generation options
 * @param options.validate - Whether to validate WCAG contrast when enforceWCAG is enabled (default: true)
 * @param options.outputDir - Output directory path (default: source/themes/generated)
 * @throws {Error} If WCAG validation fails or file operations error
 * @example
 * await generateTheme({ validate: false, outputDir: './custom' });
 */
export async function generateTheme(
  options: {
    validate?: boolean;
    outputDir?: string;
  } = {}
): Promise<void> {
  const {
    validate = true,
    outputDir = join(__dirname, '../../../source/themes/generated'),
  } = options;
  const pluginsDir = join(__dirname, '../../../source/themes/plugins');

  console.log('🎨 Generating Blueprint theme...\n');

  // Build theme from default plugins (keep builder for plugin access)
  const builder = ThemeBuilder.withDefaults();
  const blueprintTheme = builder.build();

  // Get ThemeBase plugins for asset collection
  const allPlugins = builder.getPlugins();
  const themeBasePlugins = allPlugins.filter(
    (p): p is ThemeBase => p instanceof ThemeBase
  );

  // Validate contrast if both validation is enabled and WCAG enforcement is configured
  if (validate && blueprintTheme.accessibility?.enforceWCAG) {
    console.log('🔍 Validating WCAG contrast ratios...');
    const primitives = generateAllColorScales(blueprintTheme.colors);
    const violations = validateThemeContrast(primitives, blueprintTheme);

    if (violations.length > 0) {
      console.error('\n❌ Contrast violations detected:\n');
      violations.forEach((v: ContrastViolation) => {
        console.error(
          `  ${v.token}: ${v.ratio.toFixed(2)}:1 (requires ${v.required}:1)`
        );
        console.error(`    Foreground: ${v.foreground}`);
        console.error(`    Background: ${v.background}`);
      });
      console.error('\n');
      throw new Error(`Found ${violations.length} contrast violation(s)`);
    }
    console.log('✅ All contrast ratios meet WCAG requirements\n');
  }

  // Collect plugin assets
  console.log('📦 Collecting plugin assets...');
  const resolvedAssets = await collectPluginAssets(
    themeBasePlugins,
    pluginsDir
  );

  if (resolvedAssets.length > 0) {
    console.log(
      `   Found ${resolvedAssets.length} asset(s) from ${themeBasePlugins.length} plugin(s)`
    );
  } else {
    console.log('   No assets found');
  }

  // Generate @font-face CSS for each plugin
  const fontFaceByPlugin = new Map<string, string>();
  for (const plugin of themeBasePlugins) {
    const fontFaceCSS = generateFontFaceCSSForPlugin(resolvedAssets, plugin.id);
    if (fontFaceCSS) {
      fontFaceByPlugin.set(plugin.id, fontFaceCSS);
    }
  }

  // Generate theme files with @font-face CSS
  console.log('\n📝 Building theme files...');
  const files = buildTheme(blueprintTheme, { fontFaceByPlugin });

  // Create output directory and write files
  try {
    mkdirSync(outputDir, { recursive: true });

    let totalCssSize = 0;
    for (const [filename, content] of Object.entries(files) as [
      string,
      string,
    ][]) {
      const filePath = join(outputDir, filename);

      // Create subdirectories if filename contains path separators
      const fileDir = dirname(filePath);
      if (fileDir !== outputDir) {
        mkdirSync(fileDir, { recursive: true });
      }

      writeFileSync(filePath, content, 'utf-8');
      const size = Buffer.byteLength(content, 'utf-8');
      totalCssSize += size;
      console.log(`  ✓ ${filename} (${(size / BYTES_PER_KB).toFixed(2)} KB)`);
    }

    // Copy plugin assets
    if (resolvedAssets.length > 0) {
      console.log('\n📁 Copying assets...');
      const { copied, warnings } = await copyPluginAssets(
        resolvedAssets,
        outputDir
      );

      for (const path of copied) {
        console.log(`  ✓ ${path}`);
      }

      for (const warning of warnings) {
        console.log(`  ⚠️  ${warning}`);
      }

      // Report asset sizes
      const assetSize = await getAssetsTotalSize(resolvedAssets);
      console.log(`   Total assets: ${formatBytes(assetSize)}`);
    }

    // Generate themes manifest for demo page
    const { discoverThemes } = await import('../lib/theme/discoverThemes.js');
    const themes = discoverThemes(outputDir, false); // Don't use cache

    const manifest = {
      themes: themes.map((theme) => ({
        value: theme.name,
        label: `${theme.name
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')} (${theme.pluginId})`,
        pluginId: theme.pluginId,
      })),
      generatedAt: new Date().toISOString(),
    };

    const manifestPath = join(outputDir, 'themes.json');
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`\n  ✓ themes.json (manifest)`);

    console.log(`\n✅ Theme generated successfully!`);
    console.log(`   CSS size: ${(totalCssSize / BYTES_PER_KB).toFixed(2)} KB`);
    console.log(`   Output: ${outputDir}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to write theme files: ${message}`);
  }
}

// Run if called directly
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  generateTheme().catch((error) => {
    console.error('Error generating theme:', error);
    process.exit(1);
  });
}
