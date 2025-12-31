import { Command } from 'commander';
import { spawn } from 'child_process';
import { platform } from 'os';
import { existsSync } from 'fs';
import { join } from 'path';
import { generateTheme } from './generate-theme.js';
import { blueprintTheme } from '../../themes/config/theme.config.js';
import {
  generateAllColorScales,
  validateThemeContrast,
  type ContrastViolation,
} from '../../themes/builder/index.js';
import {
  discoverThemes,
  getThemeNames,
  themeExists,
} from '../lib/discoverThemes.js';

// Constants
const DEFAULT_VITE_PORT = 5173;
const BROWSER_OPEN_DELAY = 2000;
const GENERATED_THEMES_DIR = 'source/themes/generated';

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
        console.log('🎨 Starting theme preview...\n');

        // Discover available themes
        const availableThemes = getThemeNames(GENERATED_THEMES_DIR);

        // Validate theme option
        if (!themeExists(GENERATED_THEMES_DIR, options.theme)) {
          console.error(
            `❌ Invalid theme '${options.theme}'. Available themes: ${availableThemes.join(', ')}`
          );
          console.error('\nRun "npm run theme:generate" to generate themes.\n');
          process.exit(1);
        }

        // Check if theme-preview.html exists
        const previewPath = join(process.cwd(), 'demo', 'theme-preview.html');
        if (!existsSync(previewPath)) {
          console.error('❌ demo/theme-preview.html not found');
          console.error('\nMake sure you are in the project root directory.');
          process.exit(1);
        }

        // Build the URL with query params
        const baseUrl = `http://localhost:${DEFAULT_VITE_PORT}/demo/theme-preview.html`;
        const params = new URLSearchParams();

        if (options.all) {
          params.set('all', 'true');
        } else {
          params.set('theme', options.theme);
        }

        const url = `${baseUrl}?${params.toString()}`;

        console.log('📦 Starting Vite dev server...');
        console.log(`🌐 Preview URL: ${url}\n`);

        // Start Vite dev server
        const viteProcess = spawn('npm', ['run', 'dev'], {
          stdio: 'inherit',
          shell: true,
        });

        // Track timeout for cleanup
        let browserTimeout: ReturnType<typeof setTimeout> | null = null;

        // Wait a bit for server to start, then open browser
        if (options.open) {
          browserTimeout = setTimeout(() => {
            openBrowser(url);
          }, BROWSER_OPEN_DELAY);
        }

        // Handle process termination gracefully
        const cleanup = () => {
          console.log('\n\n👋 Stopping theme preview...');
          if (browserTimeout) clearTimeout(browserTimeout);
          viteProcess.kill('SIGTERM');

          // Force kill if not stopped after 1 second
          setTimeout(() => {
            if (!viteProcess.killed) {
              viteProcess.kill('SIGKILL');
            }
            process.exit(0);
          }, 1000);
        };

        process.once('SIGINT', cleanup);
        process.once('SIGTERM', cleanup);

        viteProcess.on('error', (err) => {
          console.error('❌ Failed to start Vite dev server');
          console.error(`   ${err.message}`);
          if (browserTimeout) clearTimeout(browserTimeout);
          process.exit(1);
        });

        viteProcess.on('exit', (code) => {
          if (code !== 0 && code !== null) {
            console.error(`\n❌ Vite dev server exited with code ${code}`);
            if (browserTimeout) clearTimeout(browserTimeout);
            process.exit(code);
          }
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

  // Validate command
  theme
    .command('validate')
    .description('Validate theme accessibility and contrast ratios')
    .option('--strict', 'Use WCAG AAA standards (7:1 for text)')
    .action((options: { strict?: boolean }) => {
      console.log('🔍 Validating Blueprint theme...\n');
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
    });

  // List command
  theme
    .command('list')
    .description('List all available theme variants')
    .option('--json', 'Output as JSON')
    .action((options: { json?: boolean }) => {
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

      console.log('🎨 Available Theme Variants:\n');

      // Group by plugin
      const byPlugin = new Map<string, typeof themes>();
      themes.forEach((theme) => {
        if (!byPlugin.has(theme.pluginId)) {
          byPlugin.set(theme.pluginId, []);
        }
        byPlugin.get(theme.pluginId)!.push(theme);
      });

      for (const [pluginId, pluginThemes] of byPlugin) {
        console.log(`📦 ${pluginId}:`);
        pluginThemes.forEach((theme) => {
          console.log(`   • ${theme.name}`);
          console.log(`     Path: ${theme.path}`);
        });
        console.log('');
      }

      console.log(`Total: ${themes.length} theme variant(s)\n`);
    });

  // Create command
  theme
    .command('create')
    .description('Create a new theme interactively')
    .option('--from <theme>', 'Base theme to copy from (light or dark)')
    .option('--name <name>', 'Theme name')
    .option('--color <hex>', 'Primary brand color (hex format)')
    .action(
      async (options: { from?: string; name?: string; color?: string }) => {
        try {
          // Discover available themes
          const availableThemeNames = getThemeNames(GENERATED_THEMES_DIR);

          // Validate input options
          if (options.from && !availableThemeNames.includes(options.from)) {
            console.error(
              `❌ Invalid --from option. Available themes: ${availableThemeNames.join(', ')}`
            );
            process.exit(1);
          }
          if (options.color && !/^#[0-9A-Fa-f]{6}$/.test(options.color)) {
            console.error(
              '❌ Invalid --color format. Must be hex format (e.g., #3b82f6)'
            );
            process.exit(1);
          }

          const { confirm } = await import('@inquirer/prompts');
          const { createThemeInteractive } =
            await import('../lib/themeCreator.js');
          const { registerPlugin } = await import('../lib/registerPlugin.js');
          const { generateTheme } = await import('./generate-theme.js');

          const result = await createThemeInteractive(options);

          // Automatically register and generate
          console.log('🔧 Setting up your theme...\n');

          try {
            // Step 1: Register plugin in theme.config.ts
            await registerPlugin(result.pluginId);

            // Step 2: Generate CSS
            console.log('   🎨 Generating theme CSS...');
            await generateTheme({ validate: false });

            console.log('\n✅ Theme is ready to use!\n');

            // Step 3: Offer to preview
            const shouldPreview = await confirm({
              message: 'Preview themes in your browser?',
              default: true,
            });

            if (shouldPreview) {
              console.log('\n🚀 Launching preview...\n');

              // Start Vite dev server
              const vite = await import('vite');
              const server = await vite.createServer({
                configFile: 'vite.config.ts',
                server: { open: false },
              });

              try {
                await server.listen();
                const port = server.config.server.port ?? DEFAULT_VITE_PORT;
                // Navigate to the newly created theme variant (default to light)
                const themeVariant = `${result.pluginId}-light`;
                const url = `http://localhost:${port}/demo/theme-preview.html?theme=${themeVariant}`;

                openBrowser(url);
                console.log(`Preview running at: ${url}`);
                console.log('Press Ctrl+C to stop\n');

                // Handle cleanup on termination
                const cleanup = async () => {
                  await server.close();
                  process.exit(0);
                };

                process.once('SIGINT', cleanup);
                process.once('SIGTERM', cleanup);
              } catch (error) {
                await server.close();
                throw error;
              }
            } else {
              console.log('Run `npm run dev` to preview your themes.\n');
            }
          } catch (setupError) {
            console.error(
              `\n⚠️  Theme created but setup failed: ${setupError instanceof Error ? setupError.message : 'Unknown error'}`
            );
            console.log('\nManual steps:');
            console.log(
              `  1. Import: import ${result.pluginId}Plugin from '../plugins/${result.pluginId}/index.js';`
            );
            console.log(`  2. Register: .use(${result.pluginId}Plugin)`);
            console.log(`  3. Generate: npm run theme:generate`);
            console.log(`  4. Preview: npm run dev\n`);
          }
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            error.message.includes('User force closed')
          ) {
            console.log('\n👋 Theme creation cancelled.');
            process.exit(0);
          }
          console.error(
            `\n❌ Failed to create theme: ${error instanceof Error ? error.message : 'Unknown error'}\n`
          );
          process.exit(1);
        }
      }
    );
}

/**
 * Open URL in default browser (cross-platform)
 */
function openBrowser(url: string): void {
  const os = platform();
  let command: string;
  let args: string[];

  switch (os) {
    case 'darwin': // macOS
      command = 'open';
      args = [url];
      break;
    case 'win32': // Windows
      command = 'cmd';
      args = ['/c', 'start', '""', url]; // Empty title prevents URL being interpreted as window title
      break;
    default: // Linux and others
      command = 'xdg-open';
      args = [url];
      break;
  }

  const browserProcess = spawn(command, args, {
    stdio: 'ignore',
    detached: true,
  });

  browserProcess.on('error', () => {
    console.log(
      '⚠️  Could not auto-open browser. Please navigate manually to:'
    );
    console.log(`   ${url}`);
  });

  browserProcess.unref();
  console.log('🚀 Opening browser...\n');
}
