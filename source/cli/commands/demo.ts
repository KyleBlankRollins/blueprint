import { Command } from 'commander';
import { addToDemo, isValidComponentName } from '../lib/component/addToDemo.js';
import { error } from '../utils/logger.js';

export function demoCommand(program: Command): void {
  const demo = program.command('demo').description('Manage demo page');

  demo
    .command('add <name>')
    .description('Add component examples to the demo page')
    .option('--dry-run', 'Show what would be added without modifying demo page')
    .action((name: string, options: { dryRun?: boolean }) => {
      if (!isValidComponentName(name)) {
        error(
          'Invalid component name. Must be kebab-case (e.g., "button", "icon-button")'
        );
        process.exit(1);
      }

      if (options.dryRun) {
        console.log(`
ℹ️  DRY RUN: demo/index.html will not be modified

Would add component examples for: bp-${name}

Examples that would be generated:
  - Default example with component properties
  - Variants (if applicable)
  - Inserted into demo/index.html

To add to demo, run without --dry-run flag`);
        return;
      }

      const result = addToDemo(name);

      if (!result.success) {
        error(`Failed to add bp-${name} to demo`);
        result.errors.forEach((err) => console.log(`  ❌ ${err}`));
        console.log(`
Common issues:
  - demo/index.html not found
  - Component file not found
  - Invalid component structure`);
        process.exit(1);
      }

      const icon = '🎨';
      console.log(`${icon} Added bp-${name} to demo page\n`);

      console.log('Examples created:');
      result.examples.forEach((example) => {
        console.log(`  ✅ ${example}`);
      });

      console.log('\n💡 View at http://localhost:5173/demo/ (run npm run dev)');
      process.exit(0);
    });
}
