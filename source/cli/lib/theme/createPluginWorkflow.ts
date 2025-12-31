/**
 * Plugin creation workflow
 * Separates interactive prompts from core business logic
 */

import { input, confirm } from '@inquirer/prompts';
import { generateThemePlugin } from './pluginGenerator.js';
import { generateTheme } from '../../commands/generate-theme.js';
import { startPreviewServerWithCleanup } from './previewServer.js';
import { GENERATED_THEMES_DIR, PLUGIN_ID_REGEX } from '../constants.js';

export interface PluginConfig {
  /** Plugin ID (kebab-case) */
  id: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Primary color (hex, oklch, etc.) */
  primaryColor: string;
  /** Author name */
  author: string;
  /** Include dark variant */
  includeDark: boolean;
}

export interface WorkflowOptions {
  /** Skip registration prompt (auto-register if true) */
  autoRegister?: boolean;
  /** Skip CSS generation prompt (auto-generate if true) */
  autoGenerate?: boolean;
  /** Skip preview prompt (auto-preview if true) */
  autoPreview?: boolean;
}

/**
 * Gather plugin configuration interactively or from options
 * Prompts for missing values with validation
 *
 * @param options - Partial configuration from CLI flags
 * @returns Complete plugin configuration
 * @example
 * const config = await gatherPluginConfig({ id: 'ocean' });
 * // Prompts for: name, description, color, author, includeDark
 */
export async function gatherPluginConfig(
  options: Partial<PluginConfig>
): Promise<PluginConfig> {
  const id =
    options.id ||
    (await input({
      message: 'Plugin ID (kebab-case):',
      validate: (value) => {
        if (!PLUGIN_ID_REGEX.test(value)) {
          return 'Must be kebab-case (lowercase, hyphens only)';
        }
        return true;
      },
    }));

  const name =
    options.name ||
    (await input({
      message: 'Display name:',
      default: id
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    }));

  const description =
    options.description ||
    (await input({
      message: 'Description:',
      default: `${name} theme plugin`,
    }));

  const primaryColor =
    options.primaryColor ||
    (await input({
      message: 'Primary color (hex, oklch, etc.):',
      default: '#0ea5e9',
    }));

  const author =
    options.author ||
    (await input({
      message: 'Author:',
      default: 'Blueprint Team',
    }));

  const includeDark =
    options.includeDark !== undefined
      ? options.includeDark
      : await confirm({
          message: 'Include dark variant?',
          default: true,
        });

  return {
    id,
    name,
    description,
    primaryColor,
    author,
    includeDark,
  };
}

/**
 * Execute plugin creation workflow
 * Separated from CLI interaction for testability
 *
 * @param config - Complete plugin configuration
 * @param workflowOptions - Workflow behavior options
 * @returns Promise that resolves when workflow completes
 * @example
 * const config = await gatherPluginConfig({});
 * await createPluginWorkflow(config);
 */
export async function createPluginWorkflow(
  config: PluginConfig,
  workflowOptions: WorkflowOptions = {}
): Promise<void> {
  console.log('\n📦 Generating plugin files...\n');

  // Generate plugin files
  const result = await generateThemePlugin({
    id: config.id,
    name: config.name,
    description: config.description,
    primaryColor: config.primaryColor,
    author: config.author,
    includeDark: config.includeDark,
  });

  console.log(`✅ Created plugin at: ${result.directory}`);
  console.log(`   • ${result.pluginFile}`);
  console.log(`   • ${result.readmeFile}\n`);

  // Provide manual integration instructions
  console.log('📋 To use your new plugin:\n');
  console.log(
    '  1. Update ThemeBuilder.withDefaults() in source/themes/builder/ThemeBuilder.ts'
  );
  console.log(
    `     Add: ${result.importStatement.replace('../plugins', '../../plugins')}`
  );
  console.log(
    `     Then add .use(${config.id
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')}Theme) to the builder chain\n`
  );
  console.log('  2. Generate CSS: npm run theme:generate\n');

  // Determine if we should generate CSS
  const shouldGenerate =
    workflowOptions.autoGenerate !== undefined
      ? workflowOptions.autoGenerate
      : await confirm({
          message: 'Generate CSS files now?',
          default: true,
        });

  if (shouldGenerate) {
    await generateTheme({ validate: false });
    console.log('\n✅ Plugin registered and CSS generated!\n');

    // Determine if we should preview
    const shouldPreview =
      workflowOptions.autoPreview !== undefined
        ? workflowOptions.autoPreview
        : await confirm({
            message: 'Preview in browser?',
            default: true,
          });

    if (shouldPreview) {
      await startPreviewServerWithCleanup({
        theme: `${config.id}-light`,
        openBrowser: true,
        generatedDir: GENERATED_THEMES_DIR,
      });
    }
  }
}

/**
 * Complete plugin creation workflow with prompts
 * Convenience function that combines gathering config and executing workflow
 *
 * @param options - Partial configuration from CLI flags
 * @param workflowOptions - Workflow behavior options
 * @example
 * // Fully interactive
 * await createPluginInteractive({});
 *
 * // With some values pre-filled
 * await createPluginInteractive({ id: 'ocean', author: 'Ocean Team' });
 *
 * // Non-interactive CI mode
 * await createPluginInteractive(
 *   { id: 'ocean', name: 'Ocean', description: 'Ocean theme', primaryColor: '#0ea5e9', author: 'Team', includeDark: true },
 *   { autoRegister: true, autoGenerate: true, autoPreview: false }
 * );
 */
export async function createPluginInteractive(
  options: Partial<PluginConfig> = {},
  workflowOptions: WorkflowOptions = {}
): Promise<void> {
  console.log('🎨 Creating new theme plugin...\n');

  const config = await gatherPluginConfig(options);
  await createPluginWorkflow(config, workflowOptions);
}
