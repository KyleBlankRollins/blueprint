import { readFileSync, existsSync, writeFileSync } from 'fs';
import * as TOML from '@iarna/toml';
import { error, warn } from '../../utils/logger.js';
import type { ComponentFeature } from './types.js';
import { FEATURES_FILE } from './constants.js';

/**
 * Read component feature definition from features.toml
 */
export function getComponentFeature(
  componentName: string
): ComponentFeature | null {
  if (!existsSync(FEATURES_FILE)) {
    warn(`Features file not found: ${FEATURES_FILE}`);
    return null;
  }

  try {
    const tomlContent = readFileSync(FEATURES_FILE, 'utf8');
    const data = TOML.parse(tomlContent) as unknown as {
      component: ComponentFeature[];
    };

    const feature = data.component.find((c) => c.name === componentName);

    return feature || null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      error(`Failed to parse features.toml: ${err.message}`);
    }
    return null;
  }
}

/**
 * Update component feature status in features.toml
 */
export function updateComponentFeature(
  componentName: string,
  updates: Partial<ComponentFeature>
): void {
  if (!existsSync(FEATURES_FILE)) {
    warn(`Features file not found: ${FEATURES_FILE}`);
    return;
  }

  try {
    const tomlContent = readFileSync(FEATURES_FILE, 'utf8');
    const data = TOML.parse(tomlContent) as unknown as {
      component: ComponentFeature[];
    };

    const componentIndex = data.component.findIndex(
      (c) => c.name === componentName
    );

    if (componentIndex === -1) {
      warn(`Component ${componentName} not found in features.toml`);
      return;
    }

    // Update the component with new values
    data.component[componentIndex] = {
      ...data.component[componentIndex],
      ...updates,
    };

    // Write back to file
    const updatedToml = TOML.stringify(data as unknown as TOML.JsonMap);
    writeFileSync(FEATURES_FILE, updatedToml, 'utf8');
  } catch (err: unknown) {
    if (err instanceof Error) {
      error(`Failed to update features.toml: ${err.message}`);
    }
  }
}
