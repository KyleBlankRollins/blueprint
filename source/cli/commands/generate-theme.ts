/**
 * CLI command: bp theme generate
 * Generates CSS files from theme configuration
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { blueprintTheme } from '../../themes/config/theme.config.js';
import {
  buildTheme,
  validateThemeContrast,
  generateAllColorScales,
  type ContrastViolation,
} from '../../themes/builder/index.js';

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

  console.log('🎨 Generating Blueprint theme...\n');

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

  // Generate theme files
  console.log('📦 Building theme files...');
  const files = buildTheme(blueprintTheme);

  // Create output directory and write files
  try {
    mkdirSync(outputDir, { recursive: true });

    let totalSize = 0;
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
      totalSize += size;
      console.log(`  ✓ ${filename} (${(size / BYTES_PER_KB).toFixed(2)} KB)`);
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
    console.log(`  ✓ themes.json (manifest)`);

    console.log(`\n✅ Theme generated successfully!`);
    console.log(`   Total size: ${(totalSize / BYTES_PER_KB).toFixed(2)} KB`);
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
