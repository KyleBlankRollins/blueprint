import { Command } from 'commander';
import {
  extractAPI,
  formatMarkdownTable,
  isValidComponentName,
} from '../lib/component/extractAPI.js';
import {
  generateStories,
  isValidComponentName as isValidComponentNameStories,
} from '../lib/component/generateStories.js';
import { generateJsxDeclarations } from '../lib/component/generateJsx.js';
import { error } from '../utils/logger.js';

export function generateCommand(program: Command): void {
  const generate = program
    .command('generate')
    .description('Generate documentation and stories');

  // Subcommand: generate api
  generate
    .command('api <name>')
    .description('Extract and generate API documentation from component')
    .option('--dry-run', 'Show what would be generated without modifying files')
    .action((name: string, options: { dryRun?: boolean }) => {
      if (!isValidComponentName(name)) {
        error(
          'Invalid component name. Must be kebab-case (e.g., "button", "icon-button")'
        );
        process.exit(1);
      }

      const result = extractAPI(name);

      if (!result.success) {
        error(result.errors.join('\n'));
        console.log(`
Common issues:
  - Component file not found
  - Missing @property decorators
  - Invalid component structure`);
        process.exit(1);
      }

      if (options.dryRun) {
        console.log('');
        console.log('ℹ️  DRY RUN: No files will be modified');
        console.log('');
      }

      const icon = '📄';
      console.log(`${icon} API documentation for bp-${name}:\n`);

      // Properties table
      if (result.properties.length > 0) {
        console.log('### Properties\n');

        const headers = ['Property', 'Type', 'Default', 'Description'];
        const rows = result.properties.map((prop) => [
          `\`${prop.name}\``,
          prop.type ? `\`${prop.type}\`` : '',
          prop.defaultValue ? `\`${prop.defaultValue}\`` : '',
          prop.description || '',
        ]);

        console.log(formatMarkdownTable(headers, rows));
      }

      // Events table
      if (result.events.length > 0) {
        console.log('### Events\n');

        const headers = ['Event', 'Detail', 'Description'];
        const rows = result.events.map((event) => [
          `\`${event.name}\``,
          event.detail !== '-' ? `\`${event.detail}\`` : '-',
          event.description,
        ]);

        console.log(formatMarkdownTable(headers, rows));
      }

      if (result.properties.length === 0 && result.events.length === 0) {
        console.log('No properties or events found in component.');
        console.log('');
        console.log(
          'Tip: Add @property decorators to your component properties'
        );
      } else {
        if (options.dryRun) {
          console.log('This would be added to the README.md file.');
        } else {
          console.log(
            'Copy this to README.md or enhance with additional details.'
          );
        }
      }

      process.exit(0);
    });

  // Subcommand: generate stories
  generate
    .command('stories <name>')
    .description('Auto-generate Storybook stories from component properties')
    .option('--dry-run', 'Show what would be generated without creating files')
    .action((name: string, options: { dryRun?: boolean }) => {
      if (!isValidComponentNameStories(name)) {
        error(
          'Invalid component name. Must be kebab-case (e.g., "button", "icon-button")'
        );
        process.exit(1);
      }

      if (options.dryRun) {
        console.log(`
ℹ️  DRY RUN: No files will be created

Would generate: source/components/${name}/${name}.stories.ts

Stories would include:
  - Default story
  - Variant stories (if variant property exists)
  - Size stories (if size property exists)
  - Disabled state (if disabled property exists)

To generate the file, run without --dry-run flag`);
        return;
      }

      const result = generateStories(name);

      if (!result.success) {
        error(`Story generation failed for bp-${name}`);
        if (result.errors.length > 0) {
          console.log('\nErrors:');
          result.errors.forEach((err: string) => console.log(`  ❌ ${err}`));
        }
        console.log(`
Common issues:
  - Component file not found
  - Template files missing
  - Invalid property definitions`);
        process.exit(1);
      }

      const icon = '📖';
      console.log(`${icon} Stories generated for bp-${name}\n`);

      console.log('Files created:');
      result.storiesGenerated.forEach((file: string) => {
        const shortPath = file.replace(process.cwd() + '\\', '');
        console.log(`  ✅ ${shortPath}`);
      });

      if (result.warnings.length > 0) {
        console.log('\nWarnings:');
        result.warnings.forEach((warning: string) =>
          console.log(`  ⚠️  ${warning}`)
        );
      }

      process.exit(0);
    });

  // Subcommand: generate jsx
  generate
    .command('jsx')
    .description(
      'Auto-generate JSX type declarations from component properties'
    )
    .option('--check', 'Verify jsx.d.ts is up to date without modifying it')
    .action((options: { check?: boolean }) => {
      const result = generateJsxDeclarations({ check: options.check });

      if (!result.success) {
        error('JSX generation failed');
        result.errors.forEach((err: string) => console.log(`  ${err}`));
        process.exit(1);
      }

      if (options.check) {
        if (result.changed) {
          error(
            'jsx.d.ts is out of date. Run `npx bp generate jsx` to regenerate.'
          );
          process.exit(1);
        }
        console.log(`jsx.d.ts is up to date (${result.componentCount} components)`);
        process.exit(0);
      }

      console.log(
        `Generated jsx.d.ts with ${result.componentCount} components`
      );
      process.exit(0);
    });
}
