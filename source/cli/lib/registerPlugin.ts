/**
 * Automatically register a theme plugin in theme.config.ts
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { THEME_CONFIG_FILE } from './constants.js';

const CONFIG_PATH = THEME_CONFIG_FILE;

/**
 * Register a plugin in theme.config.ts
 * Adds import statement and .use() call
 */
export async function registerPlugin(pluginId: string): Promise<void> {
  const configPath = join(process.cwd(), CONFIG_PATH);

  try {
    let content = await readFile(configPath, 'utf-8');

    // Check if already registered
    const pluginName = `${pluginId}Plugin`;
    if (content.includes(pluginName)) {
      console.log(`   ℹ️  Plugin "${pluginId}" is already registered`);
      return;
    }

    // Find the last import statement
    const importMatches = Array.from(
      content.matchAll(/^import .+ from '.+';$/gm)
    );
    if (importMatches.length === 0) {
      throw new Error('Could not find import statements in theme.config.ts');
    }

    const lastImport = importMatches[importMatches.length - 1];
    const lastImportEnd = lastImport.index! + lastImport[0].length;

    // Add import after last import
    const importStatement = `\nimport ${pluginName} from '../plugins/${pluginId}/index.js';`;
    content =
      content.slice(0, lastImportEnd) +
      importStatement +
      content.slice(lastImportEnd);

    // Find the last .use() call in the builder chain
    const useMatches = Array.from(content.matchAll(/\.use\([^)]+\)/g));
    if (useMatches.length === 0) {
      throw new Error('Could not find .use() calls in theme.config.ts');
    }

    const lastUse = useMatches[useMatches.length - 1];
    const lastUseEnd = lastUse.index! + lastUse[0].length;

    // Find if there's a comment after the last .use()
    const afterLastUse = content.slice(lastUseEnd);
    const commentMatch = afterLastUse.match(/^(\s*\/\/[^\n]*)?/);
    const commentEnd = commentMatch ? commentMatch[0].length : 0;

    // Add .use() call after the last one
    const useStatement = `\n  .use(${pluginName})`;
    const insertPos = lastUseEnd + commentEnd;
    content =
      content.slice(0, insertPos) + useStatement + content.slice(insertPos);

    // Write back
    await writeFile(configPath, content, 'utf-8');
    console.log(`   ✓ Registered plugin in theme.config.ts`);
  } catch (error) {
    throw new Error(
      `Failed to register plugin: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
