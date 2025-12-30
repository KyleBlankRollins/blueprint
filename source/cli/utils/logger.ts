/**
 * Consistent logging utilities for CLI output
 */

export function success(message: string): void {
  console.log(`✅ ${message}`);
}

export function error(message: string): void {
  console.error(`❌ ${message}`);
}

export function warning(message: string): void {
  console.warn(`⚠️  ${message}`);
}

export function info(message: string): void {
  console.log(`ℹ️  ${message}`);
}

export function list(items: string[], prefix = '  -'): void {
  items.forEach((item) => console.log(`${prefix} ${item}`));
}

export function section(title: string): void {
  console.log(`\n${title}:`);
}
