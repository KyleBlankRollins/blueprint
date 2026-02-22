import { Command } from 'commander';
import { addToDocs, isValidComponentName } from '../lib/component/addToDocs.js';
import { error } from '../utils/logger.js';

export function docsCommand(program: Command): void {
  const docs = program
    .command('docs')
    .description('Manage documentation pages');

  docs
    .command('add <name>')
    .description('Add a documentation page for a component')
    .option('--dry-run', 'Show what would be added without creating files')
    .action((name: string, options: { dryRun?: boolean }) => {
      if (!isValidComponentName(name)) {
        error(
          'Invalid component name. Must be kebab-case (e.g., "button", "icon-button")'
        );
        process.exit(1);
      }

      if (options.dryRun) {
        console.log(`
ℹ️  DRY RUN: No files will be modified

Would create documentation for: bp-${name}

Files that would be created/modified:
  - docs/src/content/docs/components/${name}.mdx (new)
  - docs/src/components/Sidebar.astro (updated)

To create the docs page, run without --dry-run flag`);
        return;
      }

      const result = addToDocs(name);

      if (!result.success) {
        error(`Failed to add documentation for bp-${name}`);
        result.errors.forEach((err) => console.log(`  ❌ ${err}`));
        console.log(`
Common issues:
  - Documentation page already exists
  - Component file not found
  - Invalid component structure`);
        process.exit(1);
      }

      const icon = '📄';
      console.log(`${icon} Created documentation for bp-${name}\n`);

      console.log('Files updated:');
      console.log(`  ✅ ${result.docsPath}`);
      console.log(`  ✅ docs/src/components/Sidebar.astro`);

      if (result.errors.length > 0) {
        console.log('\nWarnings:');
        result.errors.forEach((err) => console.log(`  ⚠️  ${err}`));
      }

      console.log(
        '\n💡 View at http://localhost:4321/components/' +
          name +
          ' (run: cd docs && npm run dev)'
      );
      process.exit(0);
    });
}
