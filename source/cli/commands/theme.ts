import { Command } from 'commander';
import { generateTheme } from './generate-theme.js';
import { blueprintTheme } from '../../themes/config/theme.config.js';
import {
  generateAllColorScales,
  validateThemeContrast,
  type ContrastViolation,
} from '../../themes/builder/index.js';
import { discoverThemes } from '../lib/theme/discoverThemes.js';
import { startPreviewServerWithCleanup } from '../lib/theme/previewServer.js';
import { GENERATED_THEMES_DIR } from '../lib/constants.js';

/**
 * Register theme-related CLI commands.
 * Provides commands for previewing, generating, validating, and creating themes.
 *
 * @param program - Commander program instance to register commands on
 * @example
 * const program = new Command();
 * themeCommand(program);
 */
export function themeCommand(program: Command): void {
  const theme = program.command('theme').description('Theme system utilities');

  theme
    .command('preview')
    .description('Preview theme in browser')
    .option(
      '-t, --theme <name>',
      'Initial theme to display (light or dark)',
      'light'
    )
    .option('--all', 'Show all themes side-by-side')
    .option('--no-open', 'Do not auto-open browser')
    .action(async (options: { theme: string; all: boolean; open: boolean }) => {
      try {
        await startPreviewServerWithCleanup({
          theme: options.theme,
          all: options.all,
          openBrowser: options.open,
          generatedDir: GENERATED_THEMES_DIR,
        });
      } catch (error) {
        console.error(
          `\n❌ Preview failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`
        );
        process.exit(1);
      }
    });

  // Generate command
  theme
    .command('generate')
    .description('Generate CSS theme files from configuration')
    .option('--no-validate', 'Skip WCAG contrast validation')
    .option('-o, --output <dir>', 'Output directory', 'source/themes/generated')
    .action(async (options: { validate: boolean; output: string }) => {
      try {
        await generateTheme({
          validate: options.validate,
          outputDir: options.output,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        console.error(`\n❌ Theme generation failed: ${message}\n`);
        process.exit(1);
      }
    });

  // Validate command - validates plugin structure OR WCAG contrast
  theme
    .command('validate [id]')
    .description(
      'Validate plugin structure (if id provided) or WCAG contrast ratios (if no id)'
    )
    .option(
      '--strict',
      'Treat warnings as errors (plugin) or use AAA standards (WCAG)'
    )
    .action(async (id: string | undefined, options: { strict?: boolean }) => {
      // If id provided, validate plugin structure
      if (id) {
        try {
          const { validateThemePlugin } =
            await import('../lib/validation/plugin.js');

          console.log(`🔍 Validating plugin: ${id}\n`);

          const result = await validateThemePlugin(id);

          // Display metadata if available
          if (result.metadata) {
            console.log(
              `Plugin: ${result.metadata.name || result.metadata.id}`
            );
            console.log(`Version: ${result.metadata.version}`);
            if (result.metadata.author) {
              console.log(`Author: ${result.metadata.author}`);
            }
            console.log('');
          }

          // Display issues
          const errors = result.issues.filter((i) => i.type === 'error');
          const warnings = result.issues.filter((i) => i.type === 'warning');

          if (errors.length > 0) {
            console.error('❌ Errors:\n');
            errors.forEach((issue) => {
              console.error(`  • ${issue.message}`);
              if (issue.file) console.error(`    File: ${issue.file}`);
            });
            console.log('');
          }

          if (warnings.length > 0) {
            console.log('⚠️  Warnings:\n');
            warnings.forEach((issue) => {
              console.log(`  • ${issue.message}`);
              if (issue.file) console.log(`    File: ${issue.file}`);
            });
            console.log('');
          }

          // Determine pass/fail
          const hasErrors = errors.length > 0;
          const failed = hasErrors || (options.strict && warnings.length > 0);

          if (failed) {
            if (hasErrors) {
              console.log(
                `❌ Validation failed with ${errors.length} error(s)\n`
              );
            } else {
              console.log(
                `❌ Validation failed with ${warnings.length} warning(s) (strict mode)\n`
              );
            }
            process.exit(1);
          } else {
            console.log(`✅ Plugin ${id} is valid`);
            if (warnings.length > 0) {
              console.log(
                `   ${warnings.length} warning(s) - consider fixing\n`
              );
            } else {
              console.log('');
            }
          }
        } catch (error) {
          console.error(
            `\n❌ Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`
          );
          process.exit(1);
        }
      } else {
        // No id provided, validate WCAG contrast ratios
        console.log('🔍 Validating WCAG contrast ratios...\n');
        if (options.strict) {
          console.log(
            'Using WCAG AAA standards (stricter contrast requirements)\n'
          );
        }

        const primitives = generateAllColorScales(blueprintTheme.colors);
        const violations = validateThemeContrast(
          primitives,
          blueprintTheme,
          options.strict ? 'AAA' : 'AA'
        );

        if (violations.length === 0) {
          console.log('✅ Theme validation passed\n');
          console.log('All contrast ratios meet WCAG requirements.');
          process.exit(0);
        }

        // Display violations
        console.error('❌ Contrast violations detected:\n');

        const textViolations = violations.filter(
          (v: ContrastViolation) =>
            v.token.includes('text') && !v.token.includes('inverse')
        );
        const uiViolations = violations.filter(
          (v: ContrastViolation) =>
            !v.token.includes('text') || v.token.includes('inverse')
        );

        if (textViolations.length > 0) {
          console.error('📝 Text Contrast:');
          textViolations.forEach((v: ContrastViolation) => {
            console.error(
              `  ${v.token}: ${v.ratio.toFixed(2)}:1 (requires ${v.required}:1)`
            );
            console.error(`    Foreground: ${v.foreground}`);
            console.error(`    Background: ${v.background}\n`);
          });
        }

        if (uiViolations.length > 0) {
          console.error('🎨 UI Component Contrast:');
          uiViolations.forEach((v: ContrastViolation) => {
            console.error(
              `  ${v.token}: ${v.ratio.toFixed(2)}:1 (requires ${v.required}:1)`
            );
            console.error(`    Foreground: ${v.foreground}`);
            console.error(`    Background: ${v.background}\n`);
          });
        }

        console.error(`Found ${violations.length} contrast violation(s)\n`);
        process.exit(1);
      }
    });

  // List command - shows plugins and their variants
  theme
    .command('list')
    .description('List all theme plugins and their variants')
    .option('--json', 'Output as JSON')
    .action(async (options: { json?: boolean }) => {
      const themes = discoverThemes(GENERATED_THEMES_DIR);

      if (themes.length === 0) {
        console.warn('⚠️  No themes found.');
        console.log('\nRun "npm run theme:generate" to generate themes.\n');
        return;
      }

      if (options.json) {
        console.log(JSON.stringify(themes, null, 2));
        return;
      }

      console.log('🎨 Theme Plugins & Variants:\n');

      // Group by plugin
      const byPlugin = new Map<string, typeof themes>();
      themes.forEach((theme) => {
        if (!byPlugin.has(theme.pluginId)) {
          byPlugin.set(theme.pluginId, []);
        }
        byPlugin.get(theme.pluginId)!.push(theme);
      });

      for (const [pluginId, pluginThemes] of byPlugin) {
        console.log(
          `📦 ${pluginId} (${pluginThemes.length} variant${pluginThemes.length !== 1 ? 's' : ''})`
        );
        pluginThemes.forEach((theme) => {
          console.log(`   • ${theme.name}`);
        });
        console.log('');
      }

      console.log(
        `Total: ${byPlugin.size} plugin(s), ${themes.length} variant(s)\n`
      );
    });

  // Create command
  theme
    .command('create')
    .description('Create a new theme plugin')
    .option('--id <id>', 'Plugin ID (kebab-case)')
    .option('--name <name>', 'Display name')
    .option('--description <desc>', 'Short description')
    .option('--color <color>', 'Primary color (hex, oklch, etc.)')
    .option('--author <author>', 'Author name')
    .option('--no-dark', 'Skip dark variant generation')
    .action(
      async (options: {
        id?: string;
        name?: string;
        description?: string;
        color?: string;
        author?: string;
        dark?: boolean;
      }) => {
        try {
          const { createPluginInteractive } =
            await import('../lib/theme/createPluginWorkflow.js');

          await createPluginInteractive({
            id: options.id,
            name: options.name,
            description: options.description,
            primaryColor: options.color,
            author: options.author,
            includeDark: options.dark,
          });
        } catch (error) {
          console.error(
            `\n❌ Plugin creation failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`
          );
          process.exit(1);
        }
      }
    );

  // Info command
  theme
    .command('info <id>')
    .description('Show detailed information about a plugin')
    .action(async (id: string) => {
      try {
        const { readPluginMetadata, getPluginPath } =
          await import('../lib/theme/pluginMetadata.js');

        const metadata = await readPluginMetadata(id);
        const pluginDir = getPluginPath(id);

        console.log(`\n📦 ${id}\n`);
        console.log(`Version:     ${metadata.version || 'N/A'}`);
        console.log(`Name:        ${metadata.name || 'N/A'}`);
        console.log(`Description: ${metadata.description || 'N/A'}`);
        console.log(`Author:      ${metadata.author || 'N/A'}`);
        console.log(`License:     ${metadata.license || 'N/A'}`);

        if (metadata.tags.length > 0) {
          console.log(`Tags:        ${metadata.tags.join(', ')}`);
        }

        if (metadata.homepage) {
          console.log(`Homepage:    ${metadata.homepage}`);
        }

        if (metadata.repository) {
          console.log(`Repository:  ${metadata.repository}`);
        }

        if (metadata.dependencies.length > 0) {
          console.log(`Dependencies: ${metadata.dependencies.join(', ')}`);
        }

        console.log(`\nLocation:    ${pluginDir}\n`);
      } catch (error) {
        console.error(
          `\n❌ Failed to get plugin info: ${error instanceof Error ? error.message : 'Unknown error'}\n`
        );
        process.exit(1);
      }
    });
}
