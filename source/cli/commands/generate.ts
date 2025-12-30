import { Command } from 'commander';
import {
  extractAPI,
  formatMarkdownTable,
  isValidComponentName,
} from '../lib/extractAPI.js';
import {
  generateStories,
  isValidComponentName as isValidComponentNameStories,
} from '../lib/generateStories.js';
import { error } from '../utils/logger.js';

export function generateCommand(program: Command): void {
  const generate = program
    .command('generate')
    .description('Generate documentation and stories');

  // Subcommand: generate api
  generate
    .command('api <name>')
    .description('Extract and generate API documentation from component')
    .action((name: string) => {
      if (!isValidComponentName(name)) {
        error(
          'Invalid component name. Must be kebab-case (e.g., "button", "icon-button")'
        );
        process.exit(1);
      }

      const result = extractAPI(name);

      if (!result.success) {
        error(result.errors.join('\n'));
        process.exit(1);
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
      } else {
        console.log(
          'Copy this to README.md or enhance with additional details.'
        );
      }

      process.exit(0);
    });

  // Subcommand: generate stories
  generate
    .command('stories <name>')
    .description('Auto-generate Storybook stories from component properties')
    .action((name: string) => {
      if (!isValidComponentNameStories(name)) {
        error(
          'Invalid component name. Must be kebab-case (e.g., "button", "icon-button")'
        );
        process.exit(1);
      }

      const result = generateStories(name);

      if (!result.success) {
        error(`Story generation failed for bp-${name}`);
        if (result.errors.length > 0) {
          console.log('\nErrors:');
          result.errors.forEach((err: string) => console.log(`  ❌ ${err}`));
        }
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
}
