import { Command } from 'commander';
import { addToDemo, isValidComponentName } from '../lib/addToDemo.js';
import { error } from '../utils/logger.js';

export function demoCommand(program: Command): void {
  const demo = program.command('demo').description('Manage demo page');

  demo
    .command('add <name>')
    .description('Add component examples to the demo page')
    .action((name: string) => {
      if (!isValidComponentName(name)) {
        error(
          'Invalid component name. Must be kebab-case (e.g., "button", "icon-button")'
        );
        process.exit(1);
      }

      const result = addToDemo(name);

      if (!result.success) {
        error(`Failed to add bp-${name} to demo`);
        result.errors.forEach((err) => console.log(`  ❌ ${err}`));
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
