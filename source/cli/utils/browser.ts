/**
 * Browser utilities for CLI commands
 * Cross-platform browser opening functionality
 */

import { spawn } from 'child_process';
import { platform } from 'os';

/**
 * Open URL in default browser (cross-platform)
 *
 * @param url - URL to open in browser
 * @param silent - Suppress console output (default: false)
 * @example
 * openBrowser('http://localhost:5173/demo');
 * openBrowser('http://localhost:5173', true); // Silent mode
 */
export function openBrowser(url: string, silent = false): void {
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
    if (!silent) {
      console.log(
        '⚠️  Could not auto-open browser. Please navigate manually to:'
      );
      console.log(`   ${url}`);
    }
  });

  browserProcess.unref();

  if (!silent) {
    console.log('🚀 Opening browser...\n');
  }
}
