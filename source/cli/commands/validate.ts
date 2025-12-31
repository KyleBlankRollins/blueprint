import { Command } from 'commander';
import {
  validateComponent,
  isValidComponentName as isValidComponentNameValidate,
} from '../lib/validation/component.js';
import {
  checkTokenUsage,
  isValidComponentName as isValidComponentNameTokens,
} from '../lib/validation/tokens.js';
import { error } from '../utils/logger.js';

export function validateCommand(program: Command): void {
  const validate = program
    .command('validate')
    .description('Validate component structure and code quality');

  // Subcommand: validate component
  validate
    .command('component <name>')
    .description('Validate component structure, tests, and code quality')
    .action((name: string) => {
      // Validate name
      if (!isValidComponentNameValidate(name)) {
        error(
          'Invalid component name. Must be kebab-case (e.g., "button", "icon-button")'
        );
        console.log(`
Valid examples:
  ✓ button
  ✓ icon-button
  ✓ data-table

Invalid examples:
  ✗ Button (use: button)
  ✗ iconButton (use: icon-button)
  ✗ Icon_Button (use: icon-button)`);
        process.exit(1);
      }

      const result = validateComponent(name);

      // Format output
      const icon = result.success ? '✅' : '❌';
      console.log(`${icon} Component validation: bp-${name}\n`);

      if (result.info.length > 0) {
        for (const item of result.info) {
          if (item.startsWith('✓')) {
            console.log(`  ✅ ${item.substring(2)}`);
          } else if (!item.includes('Running') && !item.includes('Checking')) {
            console.log(`  ${item}`);
          }
        }
      }

      if (result.errors.length > 0) {
        console.log('\nIssues found:');
        for (const err of result.errors) {
          console.log(`  ❌ ${err}`);
        }
      }

      if (result.warnings.length > 0) {
        console.log('\nWarnings:');
        for (const warning of result.warnings) {
          console.log(`  ⚠️  ${warning}`);
        }
      }

      if (result.success) {
        console.log('\nComponent is ready! 🎉');
      }

      process.exit(result.success ? 0 : 1);
    });

  // Subcommand: validate tokens
  validate
    .command('tokens <name>')
    .description('Validate design token usage in component styles')
    .action((name: string) => {
      // Validate name
      if (!isValidComponentNameTokens(name)) {
        error('Invalid component name. Must be kebab-case.');
        console.log('\n  Valid:   button, icon-button, avatar');
        console.log('  Invalid: Button, iconButton, Icon_Button\n');
        process.exit(1);
      }

      const result = checkTokenUsage(name);

      // Format output
      const icon = result.success ? '✅' : '❌';
      console.log(`${icon} Token usage check: bp-${name}\n`);

      // Show tokens used
      if (result.tokensUsed.size > 0) {
        console.log('Design tokens found:');
        const sortedTokens = Array.from(result.tokensUsed.entries()).sort(
          (a, b) => a[0].localeCompare(b[0])
        );
        for (const [token, count] of sortedTokens) {
          console.log(`  - ${token} (${count} use${count !== 1 ? 's' : ''})`);
        }
        console.log('');
      }

      // Show violations
      if (result.violations.length > 0) {
        if (result.violations[0]?.type === 'File not found') {
          console.log(`❌ ${result.violations[0].suggestion}`);
        } else {
          console.log(`${name}.style.ts:\n`);
          for (const violation of result.violations) {
            console.log(`  Line ${violation.line}: ${violation.type}`);
            console.log(`    > ${violation.code}`);
            console.log(`    Fix: ${violation.suggestion}\n`);
          }
          console.log(
            `${result.violations.length} violation${result.violations.length !== 1 ? 's' : ''} found.`
          );
          console.log('\nCommon issues:');
          console.log('  • Hardcoded colors - Use var(--bp-color-*)');
          console.log('  • Fixed spacing - Use var(--bp-spacing-*)');
          console.log(
            '  • Magic numbers - Use design tokens from themes/generated/'
          );
        }
      } else {
        console.log('No violations found! All design values use tokens.');
      }

      process.exit(result.success ? 0 : 1);
    });
}
