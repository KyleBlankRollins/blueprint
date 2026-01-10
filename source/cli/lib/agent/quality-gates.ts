import { execSync } from 'child_process';
import { error, info, success, warn } from '../../utils/logger.js';
import type { QualityGateResult } from './types.js';
import { getAgentState } from './state.js';
import { validateComponent } from '../validation/component.js';
import { checkTokenUsage } from '../validation/tokens.js';

/**
 * Run quality gates (validation, linting, formatting, type checking, tests)
 * Returns array of results for each gate
 */
export async function runQualityGates(
  componentName?: string
): Promise<QualityGateResult[]> {
  const results: QualityGateResult[] = [];
  const state = getAgentState();
  const targetComponent = componentName || state.currentComponent;

  info('🔍 Running quality gates...\n');

  // Gate 1: Component Structure Validation
  if (targetComponent) {
    try {
      info('  📦 Quality Gate 1/6: Component Structure');
      const result = validateComponent(targetComponent);
      results.push({ name: 'Component Structure', passed: result.success });
      if (result.success) {
        success('     ✅ Component structure valid');
      } else {
        error('     ❌ Component structure invalid');
        if (result.errors.length > 0) {
          result.errors.forEach((err) => console.log(`       • ${err}`));
        }
      }
    } catch {
      results.push({ name: 'Component Structure', passed: false });
      error('     ❌ Component validation failed');
    }
  } else {
    results.push({ name: 'Component Structure', passed: true, skipped: true });
    info('  📦 Quality Gate 1/6: Component Structure (skipped)');
  }

  // Gate 2: Design Token Usage
  if (targetComponent) {
    try {
      info('  🎨 Quality Gate 2/6: Design Token Usage');
      const result = checkTokenUsage(targetComponent);
      results.push({ name: 'Token Usage', passed: result.success });
      if (result.success) {
        success('     ✅ All design tokens valid');
      } else {
        error('     ❌ Token usage violations found');
        if (result.violations.length > 0) {
          console.log(`       Found ${result.violations.length} violations`);
          result.violations.slice(0, 3).forEach((v) => {
            console.log(`       • Line ${v.line}: ${v.type}`);
          });
          if (result.violations.length > 3) {
            console.log(`       ... and ${result.violations.length - 3} more`);
          }
        }
      }
    } catch {
      results.push({ name: 'Token Usage', passed: false });
      error('     ❌ Token validation failed');
    }
  } else {
    results.push({ name: 'Token Usage', passed: true, skipped: true });
    info('  🎨 Quality Gate 2/6: Design Token Usage (skipped)');
  }

  // Gate 3: Code Formatting
  try {
    info('  📐 Quality Gate 3/6: Code Formatting');
    execSync('npm run format:check', { stdio: 'inherit' });
    results.push({ name: 'Formatting', passed: true });
    success('     ✅ Formatting check passed');
  } catch {
    results.push({ name: 'Formatting', passed: false });
    warn('     ❌ Formatting check failed - run npm run format');
  }

  // Gate 4: Linting (BLOCKING)
  try {
    info('  🔎 Quality Gate 4/6: Linting (BLOCKING)');
    execSync('npm run lint', { stdio: 'inherit' });
    results.push({ name: 'Linting', passed: true });
    success('     ✅ Linting passed');
  } catch {
    results.push({ name: 'Linting', passed: false });
    error('     ❌ Linting failed - BLOCKS advancement');
  }

  // Gate 5: Type Checking (BLOCKING)
  try {
    info('  🔤 Quality Gate 5/6: Type Checking (BLOCKING)');
    // Try npm run typecheck first (suppress error if script doesn't exist)
    execSync('npm run typecheck', { stdio: 'ignore' });
    results.push({ name: 'Type Checking', passed: true });
    success('     ✅ Type checking passed');
  } catch {
    try {
      // Fallback: Some projects may not have npm run typecheck configured
      execSync('npx tsc --noEmit', { stdio: 'inherit' });
      results.push({ name: 'Type Checking', passed: true });
      success('     ✅ Type checking passed');
    } catch {
      results.push({ name: 'Type Checking', passed: false });
      error('     ❌ Type checking failed - BLOCKS advancement');
    }
  }

  // Gate 6: Test Suite (BLOCKING)
  try {
    info('  🧪 Quality Gate 6/6: Test Suite (BLOCKING)');

    // Run component-specific tests if component is specified, otherwise run all tests
    const testCommand = targetComponent
      ? `npm test -- source/components/${targetComponent}/${targetComponent}.test.ts`
      : 'npm test';

    execSync(testCommand, { stdio: 'inherit' });
    results.push({ name: 'Tests', passed: true });

    if (targetComponent) {
      success(`     ✅ Component tests passed (bp-${targetComponent})`);
    } else {
      success('     ✅ All tests passed');
    }
  } catch {
    results.push({ name: 'Tests', passed: false });
    error('     ❌ Tests failed - BLOCKS advancement');
  }

  return results;
}

/**
 * Display quality gate summary
 */
export function displayQualityGateSummary(
  results: QualityGateResult[]
): boolean {
  console.log('\n' + '='.repeat(50));
  info('Quality Gate Summary:');
  console.log('='.repeat(50));

  results.forEach((result) => {
    const icon = result.skipped ? '⊘' : result.passed ? '✅' : '❌';
    const status = result.skipped
      ? '(not configured)'
      : result.passed
        ? 'PASSED'
        : 'FAILED';
    console.log(`  ${icon} ${result.name}: ${status}`);
  });

  console.log('='.repeat(50));

  const allPassed = results.every((r) => r.passed || r.skipped);

  if (allPassed) {
    success('\n✅ ALL QUALITY GATES PASSED');
    info('Component is ready to advance to the next phase\n');
  } else {
    error('\n❌ QUALITY GATES FAILED');
    warn('Fix the issues above before advancing phases\n');
  }

  return allPassed;
}

/**
 * Verify command - run quality gates explicitly
 */
export async function verifyComponent(componentName?: string): Promise<void> {
  const state = getAgentState();
  const targetComponent = componentName || state.currentComponent;

  if (!targetComponent) {
    warn(
      'No component specified and no active component. Usage: bp agent verify <name>'
    );
    process.exit(1);
  }

  const session = state.sessions[targetComponent];
  if (!session) {
    error(`Component ${targetComponent} not found in agent state`);
    process.exit(1);
  }

  info(`🔍 Verifying bp-${targetComponent} (${session.phase} phase)\n`);

  const results = await runQualityGates(targetComponent);
  const passed = displayQualityGateSummary(results);

  if (!passed) {
    warn(`\n⚠️  Component bp-${targetComponent} has failing quality gates`);
    info('Fix the issues and run verification again');
    process.exit(1);
  }

  success(`\n✅ Component bp-${targetComponent} passed all quality gates!`);
  info(`Current phase: ${session.phase}`);
  info('Ready to advance with: bp agent next');
}
