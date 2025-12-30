import { Command } from 'commander';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { success, error, info } from '../utils/logger.js';

/**
 * Lists all components in the Blueprint library.
 * Scans the source/components directory and displays component information.
 */
export function listCommand(program: Command): void {
  program
    .command('list')
    .description('List all components in the Blueprint library')
    .option('--detailed', 'Show detailed information for each component')
    .action((options: { detailed?: boolean }) => {
      const componentsDir = join(process.cwd(), 'source', 'components');

      if (!existsSync(componentsDir)) {
        error('Components directory not found: source/components');
        process.exit(1);
      }

      // Get all directories in components folder
      const entries = readdirSync(componentsDir, { withFileTypes: true });
      const components = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((name) => /^[a-z]+(-[a-z]+)*$/.test(name)) // Only kebab-case directories
        .sort();

      if (components.length === 0) {
        info('No components found in source/components');
        return;
      }

      success(`\nFound ${components.length} component(s):\n`);

      if (options.detailed) {
        // Detailed view - show files for each component
        components.forEach((name) => {
          const componentDir = join(componentsDir, name);
          const files = readdirSync(componentDir);

          const hasComponent = files.includes(`${name}.ts`);
          const hasStyles = files.includes(`${name}.style.ts`);
          const hasTests = files.includes(`${name}.test.ts`);
          const hasStories = files.includes(`${name}.stories.ts`);
          const hasReadme = files.includes('README.md');

          const requiredFileCount = [
            hasComponent,
            hasStyles,
            hasTests,
            hasStories,
            hasReadme,
          ].filter(Boolean).length;
          const completeness = Math.round((requiredFileCount / 5) * 100);

          console.log(`📦 bp-${name}
   ${hasComponent ? '✓' : '✗'} Component (.ts)
   ${hasStyles ? '✓' : '✗'} Styles (.style.ts)
   ${hasTests ? '✓' : '✗'} Tests (.test.ts)
   ${hasStories ? '✓' : '✗'} Stories (.stories.ts)
   ${hasReadme ? '✓' : '✗'} README.md
   Completeness: ${completeness}%
`);
        });
      } else {
        // Simple view - just list names
        components.forEach((name) => {
          console.log(`  - bp-${name}`);
        });
        info('\n\nUse --detailed flag for more information\n');
      }

      const separator = '═'.repeat(60);
      console.log(
        `${separator}\nTotal: ${components.length} component(s)\n${separator}\n`
      );
    });
}
