/**
 * Shared icon registry — runtime singleton.
 *
 * Icons register themselves by calling registerIcon() as a side effect
 * when their entry module is imported. The bp-icon component reads from
 * this registry at render time via getIconSvg().
 *
 * This module intentionally contains NO SVG data. It is the meeting point
 * between icon entry modules (writers) and the bp-icon component (reader).
 */

const registry = new Map<string, string>();

/**
 * Register an icon's SVG content. Called by per-icon entry modules.
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
