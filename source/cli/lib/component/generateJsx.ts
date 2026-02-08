import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { discoverComponents, parseComponentFile } from './jsxParser.js';
import { emitJsxDeclarations } from './jsxEmitter.js';

export interface GenerateJsxOptions {
  rootDir?: string;
  check?: boolean;
}

export interface GenerateJsxResult {
  success: boolean;
  outputPath: string;
  componentCount: number;
  changed: boolean;
  errors: string[];
}

/**
 * Format content with Prettier using the project config.
 */
function formatWithPrettier(content: string, filePath: string): string {
  try {
    return execSync(`npx prettier --stdin-filepath "${filePath}"`, {
      input: content,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch {
    // If Prettier fails, return unformatted content
    return content;
  }
}

export function generateJsxDeclarations(
  options?: GenerateJsxOptions
): GenerateJsxResult {
  const rootDir = options?.rootDir ?? process.cwd();
  const outputPath = join(rootDir, 'source', 'jsx.d.ts');
  const errors: string[] = [];

  try {
    const componentNames = discoverComponents(rootDir);
    const allComponents = componentNames.flatMap((name) =>
      parseComponentFile(rootDir, name)
    );
    const rawContent = emitJsxDeclarations(allComponents);
    const content = formatWithPrettier(rawContent, outputPath);

    if (options?.check) {
      const existing = readFileSync(outputPath, 'utf-8');
      return {
        success: true,
        outputPath,
        componentCount: allComponents.length,
        changed: content !== existing,
        errors: [],
      };
    }

    writeFileSync(outputPath, content, 'utf-8');
    return {
      success: true,
      outputPath,
      componentCount: allComponents.length,
      changed: true,
      errors: [],
    };
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
    return {
      success: false,
      outputPath,
      componentCount: 0,
      changed: false,
      errors,
    };
  }
}
