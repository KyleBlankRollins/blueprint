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
    .action((options: { theme: string; all: boolean; open: boolean }) => {
      console.log('🎨 Starting theme preview...\n');

      // Validate theme option
      if (options.theme !== 'light' && options.theme !== 'dark') {
        console.error('❌ Invalid theme. Must be "light" or "dark"');
        process.exit(1);
      }

      // Check if theme-preview.html exists
      const previewPath = join(process.cwd(), 'demo', 'theme-preview.html');
      if (!existsSync(previewPath)) {
        console.error('❌ demo/theme-preview.html not found');
        console.log('\nMake sure you are in the project root directory.');
        process.exit(1);
      }

      // Build the URL with query params
      const baseUrl = 'http://localhost:5173/demo/theme-preview.html';
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
        }, 2000);
      }

      // Handle process termination
      process.once('SIGINT', () => {
        console.log('\n\n👋 Stopping theme preview...');
        if (browserTimeout) clearTimeout(browserTimeout);
        viteProcess.kill();
        process.exit(0);
      });

      process.once('SIGTERM', () => {
        console.log('\n\n👋 Stopping theme preview...');
        if (browserTimeout) clearTimeout(browserTimeout);
        viteProcess.kill();
        process.exit(0);
      });

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
    .action(() => {
      console.log('🔍 Validating Blueprint theme...\n');

      const primitives = generateAllColorScales(blueprintTheme.colors);
      const violations = validateThemeContrast(primitives, blueprintTheme);

      if (violations.length === 0) {
        console.log('✅ Theme validation passed\n');
        console.log('All contrast ratios meet WCAG requirements.');
        return;
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
          const { confirm } = await import('@inquirer/prompts');
          const { createThemeInteractive } =
            await import('../lib/themeCreator.js');
          const { integrateTheme, themeExists } =
            await import('../lib/themeIntegration.js');
          const { generateTheme } = await import('./generate-theme.js');
          const { validateThemeContrast } =
            await import('../../themes/builder/index.js');
          const { generateAllColorScales } =
            await import('../../themes/builder/index.js');

          const theme = await createThemeInteractive(options);

          console.log('\n✅ Theme created successfully!\n');

          // Check if theme already exists
          if (await themeExists(theme.name)) {
            console.log(
              `⚠️  A theme named "${theme.name}" already exists in theme.config.ts`
            );
            const overwrite = await confirm({
              message: 'Do you want to overwrite it?',
              default: false,
            });

            if (!overwrite) {
              console.log('\n👋 Theme creation cancelled.\n');
              process.exit(0);
            }
          }

          // Ask if user wants automatic integration
          const automate = await confirm({
            message:
              'Would you like me to automatically update theme.config.ts and generate the theme?',
            default: true,
          });

          if (automate) {
            console.log('\n🔧 Integrating theme...\n');

            // Step 1: Update theme.config.ts
            console.log('  ✓ Updating theme.config.ts...');
            await integrateTheme(theme);

            // Step 2: Generate theme CSS
            console.log('  ✓ Generating theme CSS...');
            await generateTheme({ validate: false });

            // Step 3: Validate theme
            console.log('  ✓ Validating contrast ratios...');
            // For ES modules, we can't clear cache, so we'll just re-import
            // The updated file will be used in the next run
            const { blueprintTheme: updatedTheme } = await import(
              `../../themes/config/theme.config.js?t=${Date.now()}`
            );
            const primitives = generateAllColorScales(updatedTheme.colors);
            const violations = validateThemeContrast(primitives, updatedTheme);

            if (violations.length > 0) {
              console.log(
                `\n  ⚠️  Found ${violations.length} contrast violations`
              );
              console.log('     Run: bp theme validate (for details)\n');
            } else {
              console.log('  ✓ All contrast checks passed!\n');
            }

            // Step 4: Offer to preview
            const shouldPreview = await confirm({
              message: `Preview the "${theme.name}" theme in your browser?`,
              default: true,
            });

            if (shouldPreview) {
              console.log('\n🚀 Launching preview...\n');

              // Start Vite dev server
              const vite = await import('vite');
              const server = await vite.createServer({
                configFile: 'vite.config.ts',
                server: {
                  open: false,
                },
              });

              await server.listen();
              const port = server.config.server.port ?? 5173;
              const url = `http://localhost:${port}/demo/?theme=${theme.name}`;

              openBrowser(url);
              console.log(`Preview running at: ${url}`);
              console.log('Press Ctrl+C to stop\n');
            } else {
              console.log('\n✅ Theme integration complete!\n');
              console.log(`Run: bp theme preview --theme ${theme.name}\n`);
            }
          } else {
            // Manual mode - show code snippets
            const { generateThemeConfig, generateSemanticExample } =
              await import('../lib/themeCreator.js');

            console.log(
              '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
            );
            console.log(
              '📝 Step 1: Add color definitions to theme.config.ts\n'
            );
            console.log('In the `colors` section, add:');
            console.log('```typescript');
            console.log(generateThemeConfig(theme));
            console.log('```\n');
            console.log(
              '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
            );
            console.log('📝 Step 2: Add semantic mappings (example)\n');
            console.log('In the `themes` section, add:');
            console.log('```typescript');
            console.log(generateSemanticExample(theme));
            console.log('```\n');
            console.log(
              '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
            );
            console.log('🚀 Manual steps:');
            console.log(
              '  1. Update source/themes/config/theme.config.ts with the code above'
            );
            console.log(`  2. Add to color refs: '${theme.name}Primary', etc.`);
            console.log('  3. Run: bp theme generate');
            console.log('  4. Run: bp theme validate');
            console.log(
              `  5. Preview: bp theme preview --theme ${theme.name}\n`
            );
          }
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            error.message.includes('User force closed')
          ) {
            console.log('\n👋 Theme creation cancelled.');
            process.exit(0);
          }
          throw error;
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
