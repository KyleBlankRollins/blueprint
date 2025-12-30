import { Command } from 'commander';
import { scaffoldComponent, validateComponentName } from '../lib/scaffold.js';
import { success, error, info } from '../utils/logger.js';

export function scaffoldCommand(program: Command): void {
  program
    .command('scaffold <name>')
    .description('Create a new component with all required files')
    .option(
      '--dry-run',
      'Show what would be created without actually creating files'
    )
    .action((name: string, options: { dryRun?: boolean }) => {
      // Validate name format
      if (!validateComponentName(name)) {
        error(
          `Invalid component name: "${name}". Must be kebab-case (e.g., "my-component")`
        );
        info('Valid examples:');
        console.log(`  - button
  - icon-button
  - data-table
`);
        info('Invalid examples:');
        console.log(`  - Button (use: button)
  - iconButton (use: icon-button)
  - Icon_Button (use: icon-button)`);
        process.exit(1);
      }

      if (options.dryRun) {
        info('DRY RUN: No files will be created');
        info(`Would create component: bp-${name}`);
        info('Files that would be created:');
        console.log(`  - source/components/${name}/
  - source/components/${name}/${name}.ts
  - source/components/${name}/${name}.style.ts
  - source/components/${name}/${name}.test.ts
  - source/components/${name}/${name}.stories.ts
  - source/components/${name}/README.md
  - Update: source/components/index.ts
`);
        info('To create these files, run without --dry-run flag');
        return;
      }

      // Run scaffolding
      const result = scaffoldComponent(name);

      if (!result.success) {
        error(result.error || 'Failed to scaffold component');
        info('Common issues:');
        console.log(`  - Component already exists
  - Permission denied
  - Invalid directory structure`);
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
      console.log(`  1. Implement component logic
  2. Write tests (minimum 10)
  3. Run: bp generate stories ${name}
  4. Run: bp generate api ${name}
  5. Run: bp check ${name}`);
    });
}
