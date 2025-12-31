import { Command } from 'commander';
import {
  validateComponent,
  isValidComponentName as isValidComponentNameValidate,
} from '../lib/validation/component.js';
import { checkTokenUsage } from '../lib/validation/tokens.js';
import { success, error, info, warn } from '../utils/logger.js';

/**
 * Runs both component and token validation.
 * This is a convenience command for the common validation workflow.
 */
export function checkCommand(program: Command): void {
  program
    .command('check <name>')
    .description(
      'Run all validation checks (component structure + design tokens)'
    )
    .action((name: string) => {
      console.log('');
      info(`Checking component: bp-${name}`);

      // Validate name format
      if (!isValidComponentNameValidate(name)) {
        error(
          `Invalid component name: "${name}". Must be kebab-case (e.g., "my-component")`
        );
        process.exit(1);
      }

      let allPassed = true;

      // Step 1: Component validation
      const separator = '═'.repeat(60);
      console.log(separator);
      info('Step 1/2: Validating component structure...');
      console.log(`${separator}\n`);

      const componentResult = validateComponent(name);

      if (componentResult.info.length > 0) {
        for (const item of componentResult.info) {
          if (item.startsWith('✓')) {
            console.log(`  ✅ ${item.substring(2)}`);
          } else if (!item.includes('Running') && !item.includes('Checking')) {
            console.log(`  ${item}`);
          }
        }
      }

      if (componentResult.errors.length > 0) {
        warn('\nIssues found:');
        for (const err of componentResult.errors) {
          console.log(`  ❌ ${err}`);
        }
        allPassed = false;
      }

      if (componentResult.warnings.length > 0) {
        warn('\nWarnings:');
        for (const warning of componentResult.warnings) {
          console.log(`  ⚠️  ${warning}`);
        }
      }

      if (componentResult.success) {
        success('\n✓ Component structure validation passed\n');
      } else {
        error('\n✗ Component structure validation failed\n');
      }

      // Step 2: Token validation
      console.log(separator);
      info('Step 2/2: Validating design token usage...');
      console.log(`${separator}\n`);

      const tokenResult = checkTokenUsage(name);

      if (tokenResult.violations.length === 0) {
        success('✓ No hardcoded values found');
      } else {
        warn(`Found ${tokenResult.violations.length} hardcoded value(s):\n`);

        for (const violation of tokenResult.violations) {
          const suggestion = violation.suggestion
            ? `\n  Suggestion: ${violation.suggestion}`
            : '';
          console.log(`  Line ${violation.line}: ${violation.code}
  Type: ${violation.type}${suggestion}\n`);
        }
        allPassed = false;
      }

      if (tokenResult.violations.length === 0) {
        success('\n✓ Design token validation passed');
      } else {
        error('\n✗ Design token validation failed');
      }

      // Final summary
      console.log(`\n${separator}`);
      if (allPassed) {
        success(`All checks passed for bp-${name}! 🎉`);
      } else {
        error(`Some checks failed for bp-${name}`);
      }
      console.log(`${separator}\n`);

      if (!allPassed) {
        info(`Fix the issues above and run: bp check ${name}\n`);
      }

      process.exit(allPassed ? 0 : 1);
    });
}
