/**
 * Automatically register a theme plugin in ThemeBuilder.withDefaults()
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { THEME_BUILDER_FILE } from '../constants.js';

const CONFIG_PATH = THEME_BUILDER_FILE;

/**
 * Register a plugin in ThemeBuilder.withDefaults()
 * Adds import statement and .use() call
 */
export async function registerPlugin(pluginId: string): Promise<void> {
  const configPath = join(process.cwd(), CONFIG_PATH);

  try {
    let content = await readFile(configPath, 'utf-8');

    // Check if already registered
    const pluginVarName = `${pluginId.replace(/-/g, '')}Theme`;
    if (content.includes(`use(${pluginVarName})`)) {
      console.log(`   ℹ️  Plugin "${pluginId}" is already registered`);
      return;
    }

    // Find the import statements section at the top of the file
    // Look for the last import before the class definition
    const classDefMatch = content.match(/^export class ThemeBuilder/m);
    if (!classDefMatch || !classDefMatch.index) {
      throw new Error('Could not find ThemeBuilder class definition');
    }

    // Find all imports before the class
    const importsSection = content.slice(0, classDefMatch.index);
    const lastImportMatch = importsSection.match(/^import .+;$/gm);
    if (!lastImportMatch) {
      throw new Error('Could not find import statements in ThemeBuilder.ts');
    }

    // Find the position right after the last import
    const lastImport = lastImportMatch[lastImportMatch.length - 1];
    const lastImportIndex = content.lastIndexOf(
      lastImport,
      classDefMatch.index
    );
    const lastImportEnd = lastImportIndex + lastImport.length;

    // Add import after last import
    const importStatement = `\nimport { ${pluginVarName} } from '../plugins/${pluginId}/index.js';`;
    content =
      content.slice(0, lastImportEnd) +
      importStatement +
      content.slice(lastImportEnd);

    // Find the withDefaults() method and add .use() call
    const withDefaultsMatch = content.match(
      /static withDefaults\(\): ThemeBuilder \{[\s\S]*?return new ThemeBuilder\(\)([\s\S]*?);/
    );
    if (!withDefaultsMatch) {
      throw new Error(
        'Could not find withDefaults() method in ThemeBuilder.ts'
      );
    }

    // Find the position of the last .use() call
    const fullMatch = withDefaultsMatch[0];
    const matchStart = content.indexOf(fullMatch);
    const builderChain = withDefaultsMatch[1];
    const lastUseMatches = builderChain.match(/\.use\([^)]+\)/g);
    if (!lastUseMatches) {
      throw new Error('Could not find .use() calls in withDefaults()');
    }

    const lastUse = lastUseMatches[lastUseMatches.length - 1];
    const lastUseIndex = fullMatch.lastIndexOf(lastUse);
    const absoluteLastUseEnd = matchStart + lastUseIndex + lastUse.length;

    // Add new .use() call after the last one
    const useCall = `\n      .use(${pluginVarName})`;
    content =
      content.slice(0, absoluteLastUseEnd) +
      useCall +
      content.slice(absoluteLastUseEnd);

    await writeFile(configPath, content, 'utf-8');
    console.log(`   ✓ Registered plugin in ThemeBuilder.withDefaults()`);
  } catch (error) {
    throw new Error(
      `Failed to register plugin: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
