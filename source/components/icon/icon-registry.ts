/**
 * Shared icon registry — runtime singleton.
 *
 * Serves two roles:
 * 1. **Lazy-load cache** — When `<bp-icon name="...">` dynamically imports
 *    an icon entry module, the SVG is stored here so subsequent renders of
 *    the same icon name are instant.
 * 2. **Bulk registration** — `all.ts` imports every icon entry and calls
 *    `registerIcon()` for each one (used by Storybook / dev tools).
 *
 * Internal Blueprint components bypass the registry entirely. They import
 * SVG data as value bindings and pass them directly via the `svg` property,
 * which guarantees the data survives bundler tree-shaking.
 */

const registry = new Map<string, string>();

/**
 * Register an icon's SVG content by name.
 * Duplicate registrations silently overwrite (idempotent).
 */
export function registerIcon(name: string, svg: string): void {
  registry.set(name, svg);
}

/**
 * Retrieve the raw SVG string for a registered icon.
 * Returns undefined if the icon has not been registered.
 */
export function getIconSvg(name: string): string | undefined {
  return registry.get(name);
}


