/**
 * Theme plugin validation utilities
 * Validates plugin structure, metadata, and implementation
 */

import { readFile, access } from 'fs/promises';
import { join } from 'path';
import {
  parsePluginMetadata,
  getPluginPath,
  type PluginMetadata,
} from '../theme/pluginMetadata.js';
import { PLUGIN_ID_REGEX, SEMVER_REGEX } from '../constants.js';

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  file?: string;
  line?: number;
}

export interface PluginValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  pluginId?: string;
  metadata?: PluginMetadata;
}

/**
 * Validate a theme plugin
 */
export async function validateThemePlugin(
  pluginIdOrPath: string
): Promise<PluginValidationResult> {
  const issues: ValidationIssue[] = [];

  // Determine plugin path
  let pluginDir: string;
  if (pluginIdOrPath.includes('/') || pluginIdOrPath.includes('\\')) {
    pluginDir = pluginIdOrPath;
  } else {
    pluginDir = getPluginPath(pluginIdOrPath);
  }

  // Check if directory exists
  try {
    await access(pluginDir);
  } catch {
    return {
      valid: false,
      issues: [
        {
          type: 'error',
          message: `Plugin directory not found: ${pluginDir}`,
        },
      ],
    };
  }

  // Check required files
  const pluginFile = join(pluginDir, 'index.ts');
  const readmeFile = join(pluginDir, 'README.md');

  // Check if index.ts exists
  let pluginFileExists = true;
  try {
    await access(pluginFile);
  } catch {
    pluginFileExists = false;
    issues.push({
      type: 'error',
      message: 'Missing required file: index.ts',
      file: pluginFile,
    });
  }

  // Check if README.md exists
  try {
    await access(readmeFile);
  } catch {
    issues.push({
      type: 'warning',
      message: 'Missing README.md - documentation recommended',
      file: readmeFile,
    });
  }

  // If index.ts doesn't exist, can't validate further
  if (!pluginFileExists) {
    return {
      valid: false,
      issues,
    };
  }

  // Read and validate plugin file
  const content = await readFile(pluginFile, 'utf-8');
  const metadata = parsePluginMetadata(content);

  // Validate metadata
  validateMetadata(metadata, issues);

  // Validate structure
  validateStructure(content, issues);

  // Validate color definitions
  validateColorDefinitions(content, issues);

  // Validate theme variants
  validateThemeVariants(content, issues);

  return {
    valid: issues.filter((i) => i.type === 'error').length === 0,
    issues,
    pluginId: metadata.id,
    metadata,
  };
}

/**
 * Validate plugin metadata
 */
function validateMetadata(
  metadata: PluginMetadata,
  issues: ValidationIssue[]
): void {
  // Required fields
  if (!metadata.id) {
    issues.push({
      type: 'error',
      message: 'Missing required field: id',
    });
  } else if (!PLUGIN_ID_REGEX.test(metadata.id)) {
    issues.push({
      type: 'error',
      message: `Invalid plugin ID: "${metadata.id}" - must be kebab-case`,
    });
  }

  if (!metadata.version) {
    issues.push({
      type: 'error',
      message: 'Missing required field: version',
    });
  } else if (!SEMVER_REGEX.test(metadata.version)) {
    issues.push({
      type: 'warning',
      message: `Version "${metadata.version}" should follow semver (e.g., 1.0.0)`,
    });
  }

  // Recommended fields
  if (!metadata.name) {
    issues.push({
      type: 'warning',
      message: 'Missing recommended field: name',
    });
  }

  if (!metadata.description) {
    issues.push({
      type: 'warning',
      message: 'Missing recommended field: description',
    });
  }

  if (!metadata.author) {
    issues.push({
      type: 'warning',
      message: 'Missing recommended field: author',
    });
  }

  if (!metadata.license) {
    issues.push({
      type: 'warning',
      message: 'Missing recommended field: license',
    });
  }
}

/**
 * Validate plugin structure
 */
function validateStructure(content: string, issues: ValidationIssue[]): void {
  // Check for ThemePlugin type
  if (!content.includes('ThemePlugin')) {
    issues.push({
      type: 'error',
      message: 'Plugin must use ThemePlugin type',
    });
  }

  // Check for register function
  if (!content.match(/register\s*\(/)) {
    issues.push({
      type: 'error',
      message: 'Plugin must implement register() function',
    });
  }

  // Check for export
  if (!content.match(/export\s+(const|default)/)) {
    issues.push({
      type: 'error',
      message: 'Plugin must export the plugin object',
    });
  }

  // Check imports
  if (!content.includes("from '../../core/types.js'")) {
    if (!content.includes("from '@blueprint/themes'")) {
      issues.push({
        type: 'warning',
        message: 'Plugin should import from core/types.js',
      });
    }
  }
}

/**
 * Validate color definitions
 */
function validateColorDefinitions(
  content: string,
  issues: ValidationIssue[]
): void {
  const addColorPattern = /builder\.addColor\s*\(\s*['"]([^'"]+)['"]/g;
  const colors: string[] = [];
  let match;

  while ((match = addColorPattern.exec(content)) !== null) {
    colors.push(match[1]);
  }

  if (colors.length === 0) {
    issues.push({
      type: 'warning',
      message: 'No colors defined - plugin should define at least one color',
    });
  }

  // Check for duplicate color names
  const seen = new Set<string>();
  for (const color of colors) {
    if (seen.has(color)) {
      issues.push({
        type: 'error',
        message: `Duplicate color definition: "${color}"`,
      });
    }
    seen.add(color);
  }

  // Validate color definitions have required properties
  // Use [\s\S]*? to match across lines (non-greedy)
  const colorDefPattern = /builder\.addColor\s*\([\s\S]*?source:/g;
  const validDefs = content.match(colorDefPattern) || [];

  if (validDefs.length < colors.length) {
    issues.push({
      type: 'error',
      message: 'Some color definitions missing required "source" property',
    });
  }

  // Check OKLCH values are reasonable
  const oklchPattern = /l:\s*([\d.]+).*c:\s*([\d.]+).*h:\s*([\d.]+)/g;
  while ((match = oklchPattern.exec(content)) !== null) {
    const l = parseFloat(match[1]);
    const c = parseFloat(match[2]);
    const h = parseFloat(match[3]);

    if (l < 0 || l > 1) {
      issues.push({
        type: 'error',
        message: `Invalid lightness value: ${l} - must be between 0 and 1`,
      });
    }

    if (c < 0 || c > 0.4) {
      issues.push({
        type: 'warning',
        message: `Unusual chroma value: ${c} - typically between 0 and 0.4`,
      });
    }

    if (h < 0 || h > 360) {
      issues.push({
        type: 'error',
        message: `Invalid hue value: ${h} - must be between 0 and 360`,
      });
    }
  }
}

/**
 * Validate theme variants
 */
function validateThemeVariants(
  content: string,
  issues: ValidationIssue[]
): void {
  const variantPattern = /builder\.addThemeVariant\s*\(\s*['"]([^'"]+)['"]/g;
  const variants: string[] = [];
  let match;

  while ((match = variantPattern.exec(content)) !== null) {
    variants.push(match[1]);
  }

  if (variants.length === 0) {
    issues.push({
      type: 'warning',
      message: 'No theme variants defined - plugin should define at least one',
    });
  }

  // Check for duplicate variant names
  const seen = new Set<string>();
  for (const variant of variants) {
    if (seen.has(variant)) {
      issues.push({
        type: 'error',
        message: `Duplicate theme variant: "${variant}"`,
      });
    }
    seen.add(variant);
  }

  // Check that variants use builder.colors references
  for (const variant of variants) {
    const variantRegex = new RegExp(
      `addThemeVariant\\s*\\(\\s*['"]${variant}['"][^}]+\\}`,
      's'
    );
    const variantMatch = content.match(variantRegex);

    if (variantMatch) {
      const variantContent = variantMatch[0];

      // Check for hardcoded colors (should use builder.colors)
      if (
        variantContent.match(/#[0-9a-f]{6}/i) ||
        variantContent.match(/rgb\(/) ||
        variantContent.match(/oklch\(/)
      ) {
        issues.push({
          type: 'warning',
          message: `Theme variant "${variant}" contains hardcoded colors - should use builder.colors references`,
        });
      }

      // Check for required semantic tokens
      const requiredTokens = [
        'background',
        'text',
        'primary',
        'surface',
        'border',
      ];

      for (const token of requiredTokens) {
        const tokenPattern = new RegExp(`${token}:\\s*builder\\.colors\\.`);
        if (!tokenPattern.test(variantContent)) {
          issues.push({
            type: 'warning',
            message: `Theme variant "${variant}" missing recommended token: ${token}`,
          });
        }
      }
    }
  }
}

/**
 * Validate all plugins in a directory
 */
export async function validateAllPlugins(
  pluginsDir?: string
): Promise<Map<string, PluginValidationResult>> {
  const dir = pluginsDir || join(process.cwd(), 'source/themes/plugins');
  const results = new Map<string, PluginValidationResult>();

  try {
    await access(dir);
  } catch {
    return results;
  }

  const { readdir } = await import('fs/promises');
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      !entry.name.startsWith('_')
    ) {
      const result = await validateThemePlugin(join(dir, entry.name));
      results.set(entry.name, result);
    }
  }

  return results;
}
