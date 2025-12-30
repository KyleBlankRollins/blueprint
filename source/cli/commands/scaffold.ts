import { Command } from 'commander';
import { scaffoldComponent, validateComponentName } from '../lib/scaffold.js';
import { success, error, info } from '../utils/logger.js';

export function scaffoldCommand(program: Command): void {
  program
    .command('scaffold <name>')
    .description('Create a new component with all required files')
    .action((name: string) => {
      // Validate name format
      if (!validateComponentName(name)) {
        error(
          `Invalid component name: "${name}". Must be kebab-case (e.g., "my-component")`
        );
        process.exit(1);
      }

      // Run scaffolding
      const result = scaffoldComponent(name);

      if (!result.success) {
        error(result.error || 'Failed to scaffold component');
        process.exit(1);
      }

      // Success output
      success(`Component scaffolded: bp-${name}`);
      console.log('');
      info('Files created:');
      result.filesCreated?.forEach((file) => {
        console.log(`  - ${file}`);
      });
      console.log('');
      info('Next steps:');
      console.log('  1. Implement component logic');
      console.log('  2. Write tests (minimum 10)');
      console.log('  3. Create Storybook stories');
      console.log('  4. Complete README documentation');
      console.log('  5. Run format and lint checks');
    });
}
