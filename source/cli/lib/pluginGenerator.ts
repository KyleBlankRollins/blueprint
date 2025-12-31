/**
 * Plugin generation utilities
 * Creates new theme plugin files from templates
 */

import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import { convertHexToOKLCH } from '../../themes/color/colorUtils.js';
import { PLUGINS_DIR, PLUGIN_ID_REGEX } from './constants.js';

export interface PluginGeneratorOptions {
  /** Plugin ID (kebab-case, e.g., 'ocean-theme') */
  id: string;
  /** Display name (e.g., 'Ocean Theme') */
  name: string;
  /** Short description */
  description: string;
  /** Plugin version (semver) */
  version?: string;
  /** Author name */
  author?: string;
  /** License (e.g., 'MIT') */
  license?: string;
  /** Homepage URL */
  homepage?: string;
  /** Tags for categorization */
  tags?: string[];
  /** Primary color in any CSS format (hex, oklch, hsl, etc.) */
  primaryColor?: string;
  /** Example color name (kebab-case) */
  exampleColorName?: string;
  /** Whether to create dark variant */
  includeDark?: boolean;
  /** Output directory (defaults to source/themes/plugins) */
  outputDir?: string;
}

export interface PluginGeneratorResult {
  /** Path to generated plugin file */
  pluginFile: string;
  /** Path to generated README */
  readmeFile: string;
  /** Plugin directory */
  directory: string;
  /** Import statement to add to theme.config.ts */
  importStatement: string;
  /** Builder registration code */
  registrationCode: string;
}

/**
 * Generate a new theme plugin from templates
 */
export async function generateThemePlugin(
  options: PluginGeneratorOptions
): Promise<PluginGeneratorResult> {
  // Validate and set defaults
  const config = {
    id: options.id,
    name: options.name,
    description: options.description,
    version: options.version || '1.0.0',
    author: options.author || 'Blueprint Team',
    license: options.license || 'MIT',
    homepage: options.homepage || '',
    tags: options.tags || ['custom', 'theme'],
    primaryColor: options.primaryColor || '#0ea5e9',
    exampleColorName: options.exampleColorName || toPascalCase(options.id),
    includeDark: options.includeDark ?? true,
    outputDir: options.outputDir || join(process.cwd(), PLUGINS_DIR),
  };

  // Validate plugin ID
  if (!isValidPluginId(config.id)) {
    throw new Error(
      `Invalid plugin ID: "${config.id}". Must be kebab-case (lowercase, hyphens only).`
    );
  }

  // Parse the primary color to get OKLCH values
  const oklch = convertHexToOKLCH(config.primaryColor);

  // Generate derived names
  const pluginConstName = toConstName(config.id);
  const exampleColorDisplay = toTitleCase(config.exampleColorName);

  // Create plugin directory
  const pluginDir = join(config.outputDir, config.id);
  try {
    await access(pluginDir);
    throw new Error(
      `Plugin directory already exists: ${pluginDir}\nPlease choose a different plugin ID or delete the existing directory.`
    );
  } catch (error) {
    // Directory doesn't exist - this is what we want
    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      throw error;
    }
  }

  await mkdir(pluginDir, { recursive: true });

  // Read templates
  const templateDir = join(process.cwd(), 'source/cli/templates');
  const pluginTemplate = await readFile(
    join(templateDir, 'themePlugin.template'),
    'utf-8'
  );
  const readmeTemplate = await readFile(
    join(templateDir, 'themePlugin.README.md'),
    'utf-8'
  );

  // Prepare template variables
  const templateVars = {
    PLUGIN_ID: config.id,
    PLUGIN_NAME: config.name,
    PLUGIN_CONST_NAME: pluginConstName,
    DESCRIPTION: config.description,
    VERSION: config.version,
    AUTHOR: config.author,
    LICENSE: config.license,
    HOMEPAGE: config.homepage,
    TAGS: config.tags.map((t) => `'${t}'`).join(', '),
    EXAMPLE_COLOR: config.exampleColorName,
    EXAMPLE_COLOR_DISPLAY: exampleColorDisplay,
    LIGHTNESS: oklch.l.toFixed(2),
    CHROMA: oklch.c.toFixed(2),
    HUE: Math.round(oklch.h).toString(),
    VARIANT_COUNT: config.includeDark ? '2' : '1',
    VARIANT_LIST: config.includeDark
      ? `${config.id}-light, ${config.id}-dark`
      : `${config.id}-light`,
    COLOR_LIST: config.exampleColorName,
    COLOR_DESCRIPTION: `Primary theme color for ${config.name}`,
    USE_CASES: 'Primary actions, links, focus states',
    OVERVIEW_TEXT: `${config.name} provides a custom color palette with ${config.includeDark ? 'light and dark' : 'a light'} theme variant${config.includeDark ? 's' : ''}.`,
    ISSUES_URL: config.homepage
      ? `${config.homepage}/issues`
      : 'https://github.com/blueprint/blueprint/issues',
  };

  // Replace template variables
  const pluginContent = replaceTemplateVars(pluginTemplate, templateVars);
  const readmeContent = replaceTemplateVars(readmeTemplate, templateVars);

  // Write files
  const pluginFile = join(pluginDir, 'index.ts');
  const readmeFile = join(pluginDir, 'README.md');

  await writeFile(pluginFile, pluginContent, 'utf-8');
  await writeFile(readmeFile, readmeContent, 'utf-8');

  // Generate import and registration code
  const importStatement = `import ${pluginConstName} from './plugins/${config.id}/index.js';`;
  const registrationCode = `.use(${pluginConstName})`;

  return {
    pluginFile,
    readmeFile,
    directory: pluginDir,
    importStatement,
    registrationCode,
  };
}

/**
 * Add plugin to theme.config.ts
 */
export async function addPluginToConfig(
  pluginId: string,
  importStatement: string,
  registrationCode: string
): Promise<void> {
  const configPath = join(
    process.cwd(),
    'source/themes/config/theme.config.ts'
  );

  try {
    await access(configPath);
  } catch {
    throw new Error(
      `theme.config.ts not found at ${configPath}\nMake sure you are in the project root directory.`
    );
  }

  let content = await readFile(configPath, 'utf-8');

  // Check if plugin is already registered
  if (content.includes(`'${pluginId}'`) || content.includes(`"${pluginId}"`)) {
    throw new Error(
      `Plugin "${pluginId}" appears to already be registered in theme.config.ts`
    );
  }

  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex === -1) {
    throw new Error(
      'Could not find import statements in theme.config.ts\nPlease add the plugin import manually.'
    );
  }

  // Insert import after last import
  lines.splice(lastImportIndex + 1, 0, importStatement);

  // Find the ThemeBuilder chain
  let builderIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('new ThemeBuilder()')) {
      builderIndex = i;
      break;
    }
  }

  if (builderIndex === -1) {
    throw new Error(
      'Could not find ThemeBuilder in theme.config.ts\nPlease add the plugin registration manually:\n' +
        registrationCode
    );
  }

  // Find the last .use() call
  let lastUseIndex = builderIndex;
  for (let i = builderIndex; i < lines.length; i++) {
    if (lines[i].trim().startsWith('.use(')) {
      lastUseIndex = i;
    }
    // Stop at semicolon or export
    if (
      lines[i].includes(';') ||
      lines[i].includes('export') ||
      lines[i].includes('const')
    ) {
      if (i > builderIndex) break;
    }
  }

  // Insert registration after last .use()
  const indent = lines[lastUseIndex].match(/^\s*/)?.[0] || '  ';
  lines.splice(lastUseIndex + 1, 0, `${indent}${registrationCode}`);

  // Write back
  content = lines.join('\n');
  await writeFile(configPath, content, 'utf-8');
}

/**
 * Get list of all installed plugins
 */
export async function listInstalledPlugins(
  pluginsDir?: string
): Promise<string[]> {
  const dir = pluginsDir || join(process.cwd(), 'source/themes/plugins');

  try {
    await access(dir);
  } catch {
    return [];
  }

  const { readdir } = await import('fs/promises');
  const entries = await readdir(dir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('.') && !name.startsWith('_'));
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if plugin ID is valid (kebab-case)
 */
function isValidPluginId(id: string): boolean {
  return PLUGIN_ID_REGEX.test(id);
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Convert kebab-case to CONSTANT_CASE
 */
function toConstName(str: string): string {
  return toPascalCase(str)
    .replace(/([A-Z])/g, (_match, p1, offset) => {
      return offset > 0 ? '_' + p1 : p1;
    })
    .toUpperCase()
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Convert string to Title Case
 */
function toTitleCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Replace template variables in content
 */
function replaceTemplateVars(
  content: string,
  vars: Record<string, string>
): string {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}
