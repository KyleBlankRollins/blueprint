/**
 * Preview server utilities for theme CLI
 * Provides consistent theme preview functionality across commands
 */

import { spawn } from 'child_process';
import { access } from 'fs/promises';
import { join } from 'path';
import { openBrowser } from '../../utils/browser.js';
import { getThemeNames, themeExists } from './discoverThemes.js';
import {
  DEFAULT_VITE_PORT,
  BROWSER_OPEN_DELAY_MS,
  GENERATED_THEMES_DIR,
  DEMO_DIR,
  THEME_PREVIEW_HTML,
} from '../constants.js';

export interface PreviewServerOptions {
  /** Theme variant to display (e.g., 'ocean-light') */
  theme?: string;
  /** Show all themes side-by-side */
  all?: boolean;
  /** Auto-open browser (default: true) */
  openBrowser?: boolean;
  /** Port number (default: 5173) */
  port?: number;
  /** Generated themes directory (default: 'source/themes/generated') */
  generatedDir?: string;
}

/**
 * Start Vite dev server for theme preview
 *
 * @param options - Preview configuration options
 * @returns Cleanup function to stop server gracefully
 * @throws Error if theme validation fails or preview.html not found
 * @example
 * // Preview specific theme
 * const cleanup = await startPreviewServer({ theme: 'ocean-light' });
 * // ... user interaction
 * await cleanup();
 *
 * @example
 * // Preview all themes
 * const cleanup = await startPreviewServer({ all: true, openBrowser: false });
 */
export async function startPreviewServer(
  options: PreviewServerOptions = {}
): Promise<() => Promise<void>> {
  const {
    theme,
    all = false,
    openBrowser: shouldOpenBrowser = true,
    port = DEFAULT_VITE_PORT,
    generatedDir = GENERATED_THEMES_DIR,
  } = options;

  console.log('🎨 Starting theme preview...\n');

  // Validate theme if specified
  if (theme && !all) {
    const availableThemes = getThemeNames(generatedDir);

    if (!themeExists(generatedDir, theme)) {
      throw new Error(
        `Invalid theme '${theme}'. Available themes: ${availableThemes.join(', ')}\n\nRun "npm run theme:generate" to generate themes.`
      );
    }
  }

  // Check if theme-preview.html exists
  const previewPath = join(process.cwd(), DEMO_DIR, THEME_PREVIEW_HTML);
  try {
    await access(previewPath);
  } catch {
    throw new Error(
      `${DEMO_DIR}/${THEME_PREVIEW_HTML} not found\n\nMake sure you are in the project root directory.`
    );
  }

  // Build the URL with query params
  const baseUrl = `http://localhost:${port}/${DEMO_DIR}/${THEME_PREVIEW_HTML}`;
  const params = new URLSearchParams();

  if (all) {
    params.set('all', 'true');
  } else if (theme) {
    params.set('theme', theme);
  }

  const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  console.log('📦 Starting Vite dev server...');
  console.log(`🌐 Preview URL: ${url}\n`);

  // Start Vite dev server
  const viteProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
  });

  // Track timeout for cleanup
  let browserTimeout: ReturnType<typeof setTimeout> | null = null;

  // Wait for server to start, then open browser
  if (shouldOpenBrowser) {
    browserTimeout = setTimeout(() => {
      openBrowser(url);
    }, BROWSER_OPEN_DELAY_MS);
  }

  // Setup error handler
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

  // Return cleanup function
  return async () => {
    console.log('\n\n👋 Stopping theme preview...');
    if (browserTimeout) clearTimeout(browserTimeout);
    viteProcess.kill('SIGTERM');

    // Force kill if not stopped after 1 second
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!viteProcess.killed) {
          viteProcess.kill('SIGKILL');
        }
        resolve();
      }, 1000);
    });
  };
}

/**
 * Start preview server and attach cleanup handlers
 * This is a convenience wrapper that handles SIGINT/SIGTERM
 *
 * @param options - Preview configuration options
 * @example
 * await startPreviewServerWithCleanup({ theme: 'ocean-light' });
 * // Server runs until user presses Ctrl+C
 */
export async function startPreviewServerWithCleanup(
  options: PreviewServerOptions = {}
): Promise<void> {
  const cleanup = await startPreviewServer(options);

  // Handle process termination gracefully
  const handleTermination = async () => {
    await cleanup();
    process.exit(0);
  };

  process.once('SIGINT', handleTermination);
  process.once('SIGTERM', handleTermination);
}
