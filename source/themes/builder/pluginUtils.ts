/**
 * Plugin utility functions
 * Provides helpers for plugin creation, validation, and dependency management
 */

import type {
  ThemePlugin,
  ColorRef,
  ValidationError,
  ColorDefinition,
} from '../core/types.js';

/** Valid color scale steps */
const VALID_STEPS = new Set([
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
]);

/**
 * Create a theme plugin with type safety
 * This is a helper function that provides better TypeScript inference
 *
 * @param plugin - Plugin configuration
 * @returns Typed theme plugin
 *
 * @example
 * ```typescript
 * export default createPlugin({
 *   id: 'ocean',
 *   version: '1.0.0',
 *   register(builder) {
 *     builder.addColor('oceanBlue', { l: 0.5, c: 0.15, h: 220 });
 *   }
 * });
 * ```
 */
export function createPlugin(plugin: ThemePlugin): ThemePlugin {
  return plugin;
}

/**
 * Validate plugin metadata and structure
 * Checks that required fields are present and valid
 *
 * @param plugin - Plugin to validate
 * @returns Array of validation errors (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = validatePlugin(myPlugin);
 * if (errors.length > 0) {
 *   console.error('Plugin validation failed:', errors);
 * }
 * ```
 */
export function validatePlugin(plugin: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check if plugin is an object
  if (!plugin || typeof plugin !== 'object') {
    errors.push({
      type: 'invalid_ref',
      message: 'Plugin must be an object',
      context: { plugin },
    });
    return errors;
  }

  const p = plugin as Partial<ThemePlugin>;

  // Validate required fields
  if (!p.id || typeof p.id !== 'string') {
    errors.push({
      type: 'invalid_ref',
      message: 'Plugin must have a string "id" field',
      context: { plugin },
    });
  } else {
    // Validate ID format (lowercase, alphanumeric with dashes)
    if (!/^[a-z0-9-]+$/.test(p.id)) {
      errors.push({
        type: 'invalid_ref',
        message:
          'Plugin ID must be lowercase alphanumeric with dashes (e.g., "my-theme")',
        context: { id: p.id },
      });
    }
  }

  if (!p.version || typeof p.version !== 'string') {
    errors.push({
      type: 'invalid_ref',
      message: 'Plugin must have a string "version" field',
      context: { plugin },
    });
  } else {
    // Validate semver format (basic check)
    if (!/^\d+\.\d+\.\d+/.test(p.version)) {
      errors.push({
        type: 'invalid_ref',
        message:
          'Plugin version must be in semver format (e.g., "1.0.0", "2.1.3-beta")',
        context: { version: p.version },
      });
    }
  }

  if (!p.register || typeof p.register !== 'function') {
    errors.push({
      type: 'invalid_ref',
      message: 'Plugin must have a "register" function',
      context: { plugin },
    });
  }

  // Validate optional fields if present
  if (p.name !== undefined && typeof p.name !== 'string') {
    errors.push({
      type: 'invalid_ref',
      message: 'Plugin "name" must be a string if provided',
      context: { name: p.name },
    });
  }

  if (p.description !== undefined && typeof p.description !== 'string') {
    errors.push({
      type: 'invalid_ref',
      message: 'Plugin "description" must be a string if provided',
      context: { description: p.description },
    });
  }

  if (p.author !== undefined && typeof p.author !== 'string') {
    errors.push({
      type: 'invalid_ref',
      message: 'Plugin "author" must be a string if provided',
      context: { author: p.author },
    });
  }

  // Validate dependencies array
  if (p.dependencies !== undefined) {
    if (!Array.isArray(p.dependencies)) {
      errors.push({
        type: 'invalid_ref',
        message: 'Plugin "dependencies" must be an array if provided',
        context: { dependencies: p.dependencies },
      });
    } else {
      p.dependencies.forEach((dep, index) => {
        if (!dep.id || typeof dep.id !== 'string') {
          errors.push({
            type: 'dependency_missing',
            message: `Dependency at index ${index} must have a string "id"`,
            context: { dependency: dep },
          });
        }
        if (dep.version !== undefined && typeof dep.version !== 'string') {
          errors.push({
            type: 'invalid_ref',
            message: `Dependency "${dep.id}" version must be a string if provided`,
            context: { dependency: dep },
          });
        }
      });
    }
  }

  return errors;
}

/**
 * Create a typed color reference
 * This creates an opaque ColorRef object that can be serialized
 *
 * @param colorName - Name of the color (e.g., "blue", "oceanBlue")
 * @param step - Color scale step (50-950)
 * @returns Typed color reference
 * @throws Error if colorName is invalid or step is not a valid color scale step
 *
 * @example
 * ```typescript
 * const blueRef = createColorRef('blue', 500);
 * // Returns: { __colorRef: Symbol(), colorName: 'blue', step: 500 }
 * ```
 */
export function createColorRef(colorName: string, step: number): ColorRef {
  if (!colorName || typeof colorName !== 'string') {
    throw new Error('Color name must be a non-empty string');
  }

  if (!VALID_STEPS.has(step)) {
    throw new Error(
      `Invalid color step: ${step}. Must be one of: ${Array.from(VALID_STEPS).join(', ')}`
    );
  }

  return {
    __colorRef: Symbol('colorRef'),
    colorName,
    step,
  } as ColorRef;
}

/**
 * Parse a color reference string into components
 * Converts "colorName.step" format to { colorName, step }
 *
 * @param ref - Color reference string (e.g., "blue.500", "oceanBlue.700")
 * @returns Parsed color name and step, or null if invalid
 *
 * @example
 * ```typescript
 * resolveColorRef('blue.500')
 * // Returns: { colorName: 'blue', step: 500 }
 *
 * resolveColorRef('oceanBlue.700')
 * // Returns: { colorName: 'oceanBlue', step: 700 }
 *
 * resolveColorRef('invalid')
 * // Returns: null
 * ```
 */
export function resolveColorRef(
  ref: string
): { colorName: string; step: number } | null {
  // Match "colorName.step" format (dot is required)
  const match = ref.match(/^([a-zA-Z][a-zA-Z0-9_]*?)\.(\d+)$/);

  if (!match) {
    return null;
  }

  const [, colorName, stepStr] = match;
  const step = parseInt(stepStr, 10);

  // Validate step is a valid color scale step
  if (!VALID_STEPS.has(step)) {
    return null;
  }

  return { colorName, step };
}

/**
 * Convert a ColorRef to a string for serialization
 * Converts to "colorName.step" format for CSS generation
 *
 * @param ref - Color reference object
 * @returns String representation (e.g., "blue.500")
 *
 * @example
 * ```typescript
 * const ref = createColorRef('blue', 500);
 * serializeColorRef(ref)
 * // Returns: "blue.500"
 * ```
 */
export function serializeColorRef(ref: ColorRef): string {
  return `${ref.colorName}.${ref.step}`;
}

/**
 * Check plugin dependencies and return any missing dependencies
 *
 * @param plugin - Plugin to check
 * @param availablePlugins - Map of available plugin IDs to their versions
 * @returns Array of validation errors for missing dependencies
 *
 * @example
 * ```typescript
 * const errors = checkPluginDependencies(
 *   myPlugin,
 *   new Map([['primitives', '1.0.0']])
 * );
 * if (errors.length > 0) {
 *   console.error('Missing dependencies:', errors);
 * }
 * ```
 */
export function checkPluginDependencies(
  plugin: ThemePlugin,
  availablePlugins: Map<string, string>
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!plugin.dependencies || plugin.dependencies.length === 0) {
    return errors;
  }

  for (const dep of plugin.dependencies) {
    // Skip optional dependencies
    if (dep.optional) {
      continue;
    }

    // Check if dependency is available
    if (!availablePlugins.has(dep.id)) {
      errors.push({
        plugin: plugin.id,
        type: 'dependency_missing',
        message: `Plugin "${plugin.id}" requires dependency "${dep.id}" which is not available`,
        context: {
          pluginId: plugin.id,
          missingDependency: dep.id,
          requiredVersion: dep.version,
        },
      });
      continue;
    }

    // If version is specified, validate it (basic semver check)
    if (dep.version) {
      const availableVersion = availablePlugins.get(dep.id)!;

      // Simple version validation - could be enhanced with proper semver library
      if (!isVersionCompatible(availableVersion, dep.version)) {
        errors.push({
          plugin: plugin.id,
          type: 'dependency_missing',
          message: `Plugin "${plugin.id}" requires dependency "${dep.id}" version ${dep.version}, but version ${availableVersion} is available`,
          context: {
            pluginId: plugin.id,
            dependency: dep.id,
            requiredVersion: dep.version,
            availableVersion,
          },
        });
      }
    }
  }

  return errors;
}

/**
 * Simple version compatibility check
 *
 * TODO: Replace with proper semver library (e.g., 'semver' package) for production use.
 * This basic implementation only handles common cases and may have edge case bugs,
 * particularly with ^0.x.y versions and < / <= operators.
 *
 * @param available - Available version (e.g., "1.2.0")
 * @param required - Required version or range (e.g., "1.0.0", "^1.0.0", ">=1.2.0")
 * @returns Whether the versions are compatible
 */
function isVersionCompatible(available: string, required: string): boolean {
  // Handle exact version match
  if (available === required) {
    return true;
  }

  // Parse versions
  const availableParts = available.split('.').map(Number);
  const requiredParts = required
    .replace(/^[\^~>=<]+/, '')
    .split('.')
    .map(Number);

  // Handle caret (^) - allows changes that don't modify left-most non-zero digit
  if (required.startsWith('^')) {
    if (requiredParts[0] !== 0) {
      return (
        availableParts[0] === requiredParts[0] &&
        (availableParts[1] > requiredParts[1] ||
          (availableParts[1] === requiredParts[1] &&
            availableParts[2] >= requiredParts[2]))
      );
    }
  }

  // Handle tilde (~) - allows patch-level changes
  if (required.startsWith('~')) {
    return (
      availableParts[0] === requiredParts[0] &&
      availableParts[1] === requiredParts[1] &&
      availableParts[2] >= requiredParts[2]
    );
  }

  // Handle >= operator
  if (required.startsWith('>=')) {
    return (
      availableParts[0] > requiredParts[0] ||
      (availableParts[0] === requiredParts[0] &&
        availableParts[1] > requiredParts[1]) ||
      (availableParts[0] === requiredParts[0] &&
        availableParts[1] === requiredParts[1] &&
        availableParts[2] >= requiredParts[2])
    );
  }

  // Default: exact match required
  return available === required;
}

/**
 * Generate TypeScript declaration for a color scale
 * Creates type-safe property names for all color steps
 *
 * @param colorName - Name of the color
 * @param definition - Color definition with scale steps
 * @returns TypeScript declaration string
 *
 * @example
 * ```typescript
 * generateColorTypes('blue', {
 *   source: { l: 0.5, c: 0.15, h: 220 },
 *   scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
 * });
 * // Returns:
 * // "  blue50: ColorRef;\n  blue100: ColorRef;\n  ..."
 * ```
 */
export function generateColorTypes(
  colorName: string,
  definition: ColorDefinition
): string {
  const steps = definition.scale;
  const properties = steps.map((step) => `  ${colorName}${step}: ColorRef;`);
  return properties.join('\n');
}

/**
 * Generate complete ColorRegistry type definition from all colors
 *
 * @param colors - Map of color names to their definitions
 * @returns TypeScript interface declaration
 *
 * @example
 * ```typescript
 * const colors = new Map([
 *   ['blue', { source: {...}, scale: [50, 100, ...] }],
 *   ['gray', { source: {...}, scale: [50, 100, ...] }]
 * ]);
 * generateColorRegistryTypes(colors);
 * // Returns:
 * // "interface ColorRegistry {\n  blue50: ColorRef;\n  blue100: ColorRef;\n  ...\n}"
 * ```
 */
export function generateColorRegistryTypes(
  colors: Map<string, ColorDefinition>
): string {
  const allProperties: string[] = [];

  for (const [colorName, definition] of colors) {
    const colorTypes = generateColorTypes(colorName, definition);
    allProperties.push(colorTypes);
  }

  return `interface ColorRegistry {\n${allProperties.join('\n')}\n}`;
}

/**
 * Topologically sort plugins based on dependencies
 * Ensures plugins are loaded in the correct order (dependencies first)
 *
 * @param plugins - Array of plugins to sort
 * @returns Sorted array of plugins
 * @throws Error if circular dependencies are detected
 *
 * @example
 * ```typescript
 * const sorted = sortPluginsByDependencies([
 *   oceanPlugin,  // depends on primitives
 *   primitives,   // no dependencies
 *   forestPlugin  // depends on primitives
 * ]);
 * // Returns: [primitives, oceanPlugin, forestPlugin]
 * ```
 */
export function sortPluginsByDependencies(
  plugins: ThemePlugin[]
): ThemePlugin[] {
  const pluginMap = new Map<string, ThemePlugin>();
  const graph = new Map<string, Set<string>>(); // Maps plugin ID -> set of plugins that depend on it
  const inDegree = new Map<string, number>();

  // Initialize all plugins
  for (const plugin of plugins) {
    pluginMap.set(plugin.id, plugin);
    graph.set(plugin.id, new Set());
    inDegree.set(plugin.id, 0);
  }

  // Build reverse graph: for each plugin, track what depends on it
  // Also calculate in-degrees (number of dependencies each plugin has)
  for (const plugin of plugins) {
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        // dep.id is depended upon by plugin.id
        if (!graph.has(dep.id)) {
          graph.set(dep.id, new Set());
        }
        graph.get(dep.id)!.add(plugin.id);

        // plugin has an incoming edge from its dependency
        inDegree.set(plugin.id, (inDegree.get(plugin.id) || 0) + 1);
      }
    }
  }

  // Topological sort using Kahn's algorithm
  // Start with plugins that have no dependencies (in-degree = 0)
  const sorted: ThemePlugin[] = [];
  const queue: string[] = [];

  for (const [id, degree] of inDegree) {
    if (degree === 0) {
      queue.push(id);
    }
  }

  // Process plugins in dependency order
  while (queue.length > 0) {
    const id = queue.shift()!;
    const plugin = pluginMap.get(id);
    if (plugin) {
      sorted.push(plugin);
    }

    // Process plugins that depend on this one
    const dependents = graph.get(id) || new Set();
    for (const dependent of dependents) {
      const newDegree = (inDegree.get(dependent) || 0) - 1;
      inDegree.set(dependent, newDegree);
      if (newDegree === 0) {
        queue.push(dependent);
      }
    }
  }

  // Check for cycles
  if (sorted.length !== plugins.length) {
    const unsorted = plugins
      .filter((p) => !sorted.includes(p))
      .map((p) => p.id);
    throw new Error(
      `Circular dependency detected in plugins: ${unsorted.join(', ')}`
    );
  }

  return sorted;
}
