/**
 * Shared icon registry — runtime singleton.
 *
 * Consumers can register icons by name so that `<bp-icon name="...">` can
 * look them up at render time. The `all.ts` barrel imports every icon entry
 * and registers them all (used in Storybook / dev tools).
 *
 * Internal Blueprint components do NOT use this registry. They import SVG
 * data as value bindings and pass it directly to `<bp-icon>` via the `svg`
 * property, which guarantees the data survives bundler tree-shaking.
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

/**
 * Get all currently registered icon names.
 * Useful for Storybook and dev-tool enumeration.
 */
export function getRegisteredIconNames(): string[] {
  return [...registry.keys()];
}
