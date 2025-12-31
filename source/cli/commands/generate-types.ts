/**
 * CLI command: bp theme generate-types
 * Generates TypeScript declaration files from theme configuration
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { access, constants, mkdir } from 'node:fs/promises';
import * as logger from '../utils/logger.js';
import { ThemeBuilder } from '../../themes/builder/ThemeBuilder.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Generate TypeScript declaration files for theme colors and variants
 *
 * This creates a .d.ts file with:
 * - ColorName union type with all registered colors
 * - Individual color scale interfaces (e.g., GrayColorScale)
 * - Complete ColorRegistry interface for builder.colors
 * - ThemeVariantName union type
 * - Module augmentation for type-safe autocomplete
 *
 * @param options - Generation options
 * @param options.outputPath - Output file path for generated types (default: source/themes/generated/theme.d.ts)
 * @param options.includeJSDoc - Whether to include JSDoc comments (default: true)
 * @param options.moduleName - Module name for imports (default: relative paths)
 * @param options.watch - Watch mode for continuous regeneration (default: false)
 * @throws {Error} If file write fails or theme config is invalid
 *
 * @example
 * ```bash
 * bp theme generate-types
 * bp theme generate-types --output custom/theme.d.ts
 * bp theme generate-types --watch
 * ```
 */
export async function generateTypes(
  options: {
    outputPath?: string;
    includeJSDoc?: boolean;
    moduleName?: string;
    watch?: boolean;
  } = {}
): Promise<void> {
  const {
    outputPath = join(__dirname, '../../../source/themes/generated/theme.d.ts'),
    includeJSDoc = true,
    moduleName,
    watch = false,
  } = options;

  try {
    logger.info('📝 Generating TypeScript theme declarations...\n');

    // Create builder with default plugins
    const builder = ThemeBuilder.withDefaults();

    // Validate builder instance
    if (!builder || typeof builder.generateTypes !== 'function') {
      throw new Error(
        'ThemeBuilder instance must have a generateTypes() method'
      );
    }

    // Validate output path is writable
    try {
      const dir = dirname(outputPath);
      await mkdir(dir, { recursive: true });
      // Check if we can write to the directory
      await access(dir, constants.W_OK);
    } catch (err) {
      throw new Error(
        `Cannot write to output path ${outputPath}: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    // Generate types
    await builder.generateTypes({
      outputPath,
      includeJSDoc,
      moduleName,
    });

    logger.success(`✓ Generated type declarations: ${outputPath}\n`);

    // Display info about generated types
    const colorCount = builder.getColorNames().length;
    const variantCount = builder.getThemeVariantNames().length;

    logger.info(`  Colors: ${colorCount}`);
    logger.info(`  Theme variants: ${variantCount}`);
    logger.info(`  JSDoc comments: ${includeJSDoc ? 'yes' : 'no'}\n`);

    // Watch mode
    if (watch) {
      logger.info('👀 Watching for changes...');
      logger.info('   Press Ctrl+C to stop\n');

      // Import chokidar for file watching
      const chokidar = await import('chokidar');
      const watchPaths = [join(__dirname, '../../themes/plugins/**/*.ts')];

      const watcher = chokidar.watch(watchPaths, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 500,
          pollInterval: 100,
        },
      });

      watcher.on('change', async (triggeredPath: string) => {
        logger.info(`\n🔄 Detected change in ${triggeredPath}`);
        logger.info('   Reloading theme plugins and regenerating types...\n');

        try {
          // Note: In ESM, we can't easily clear module cache
          // The plugins should be designed to be stateless, so creating
          // a fresh builder instance should be sufficient
          const refreshedBuilder = ThemeBuilder.withDefaults();

          await refreshedBuilder.generateTypes({
            outputPath,
            includeJSDoc,
            moduleName,
          });

          logger.success('✓ Types regenerated\n');
        } catch (err) {
          logger.error('✗ Regeneration failed:');
          if (err instanceof Error) {
            logger.error(`  ${err.message}`);
            if (process.env.DEBUG || process.env.VERBOSE) {
              logger.error(`\n${err.stack}\n`);
            } else {
              logger.error(
                '  (Run with DEBUG=1 or VERBOSE=1 for stack trace)\n'
              );
            }
          } else {
            logger.error(`  ${String(err)}\n`);
          }
        }
      });

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        logger.info('\n👋 Stopping watch mode...');
        watcher.close();
        process.exit(0);
      });
    }
  } catch (err) {
    logger.error('✗ Type generation failed:');
    if (err instanceof Error) {
      logger.error(`  ${err.message}`);
      if (process.env.DEBUG || process.env.VERBOSE) {
        logger.error(`\n${err.stack}\n`);
      } else {
        logger.error('  (Run with DEBUG=1 or VERBOSE=1 for stack trace)\n');
      }
    } else {
      logger.error(`  ${String(err)}\n`);
    }
    throw err;
  }
}

/**
 * Generate types and log any errors
 * Used by CLI command handler
 *
 * @param options - Generation options
 */
export async function generateTypesCommand(
  options: Parameters<typeof generateTypes>[0] = {}
): Promise<void> {
  try {
    await generateTypes(options);
  } catch {
    // Error already logged in generateTypes
    process.exit(1);
  }
}
