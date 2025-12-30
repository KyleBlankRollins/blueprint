import { Command } from 'commander';
import { spawn } from 'child_process';
import { platform } from 'os';
import { existsSync } from 'fs';
import { join } from 'path';

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
