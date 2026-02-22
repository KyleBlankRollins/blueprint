import { existsSync } from 'fs';
import { join } from 'path';
import { error, info, success, warn } from '../../utils/logger.js';
import type { ComponentSession } from './types.js';
import { getComponentFeature, updateComponentFeature } from './features.js';
import {
  getAgentState,
  getComponentSession,
  logProgress,
  logFeatureSection,
  updateAgentState,
  completeComponentSession,
} from './state.js';
import { checkUnmetDependencies } from './status.js';
import { displayQualityGateSummary, runQualityGates } from './quality-gates.js';
import { openVSCodeWithContext } from './vscode.js';

/**
 * Start component creation workflow
 */
export function startComponentCreation(componentName: string): void {
  info(`🏗️ Starting component creation for: bp-${componentName}`);

  // Validate component name
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(componentName)) {
    error('Component name must be kebab-case (e.g., modal, date-picker)');
    process.exit(1);
  }

  // Check if component already exists
  const componentPath = join('source', 'components', componentName);
  if (existsSync(componentPath)) {
    error(`Component ${componentName} already exists at ${componentPath}`);
    process.exit(1);
  }

  // Load component feature definition
  const feature = getComponentFeature(componentName);
  if (!feature) {
    warn(`Component not found in features.toml - proceeding with defaults`);
  } else {
    info(`📋 Feature: ${feature.description}`);
    info(
      `📊 Category: ${feature.category} | Complexity: ${feature.complexity} | Priority: ${feature.priority}`
    );
    if (feature.depends_on.length > 0) {
      info(`🔗 Dependencies: ${feature.depends_on.join(', ')}`);
    }
  }

  // Update agent state
  const session: ComponentSession = {
    id: componentName,
    name: componentName,
    phase: 'create',
    status: 'in-progress',
    files: [],
    lastSession: new Date().toISOString(),
    iterations_taken: feature?.iterations_taken || 0,
    depends_on: feature?.depends_on || [],
    estimated_complexity: feature?.complexity || 'medium',
    blocked_reason: null,
  };

  updateAgentState(componentName, session);
  logProgress(`Started component-creator phase for ${componentName}`);

  // Open VS Code with component-creator context
  openVSCodeWithContext('component-creator', componentName, feature);

  info('💡 Instructions sent to VS Code Copilot:');
  console.log(`   Acting as component-creator agent for bp-${componentName}`);
  console.log('   Follow Blueprint scaffold reference pattern');
  console.log(
    '   Required files: .ts, .style.ts, .test.ts, .stories.ts, README.md'
  );
  console.log('\n   When complete, run: bp agent review ' + componentName);
}

/**
 * Start code or design review workflow
 */
export function startReview(
  componentName: string,
  reviewType: 'code' | 'design'
): void {
  const agentType = reviewType === 'code' ? 'code-review' : 'designer';
  const session = getComponentSession(componentName);

  if (!session) {
    error(
      `Component ${componentName} not found. Start with: bp agent create ${componentName}`
    );
    process.exit(1);
  }

  // Verify component files exist
  const componentPath = join('source', 'components', componentName);
  if (!existsSync(componentPath)) {
    error(`Component directory not found: ${componentPath}`);
    process.exit(1);
  }

  info(`🔍 Starting ${reviewType} review for: bp-${componentName}`);

  // Update session
  session.phase = reviewType === 'code' ? 'code-review' : 'design-review';
  session.status = 'in-progress';
  session.lastSession = new Date().toISOString();
  session.iterations_taken = (session.iterations_taken || 0) + 1;

  updateAgentState(componentName, session);
  logProgress(`Started ${agentType} phase for ${componentName}\n`);

  // Open VS Code with review context
  openVSCodeWithContext(agentType, componentName);

  info(`💡 Instructions sent to VS Code Copilot:`);
  console.log(`   Acting as ${agentType} agent for bp-${componentName}`);
  console.log(
    '   Review all component files and suggest specific improvements'
  );
  console.log('   Focus on: Blueprint standards, accessibility, code quality');
  console.log(`\n   When complete, run: bp agent next`);
}

/**
 * Continue to next workflow phase
 */
export async function continueNext(): Promise<void> {
  const state = getAgentState();
  const currentComponent = state.currentComponent;

  if (!currentComponent) {
    warn('No active component session. Start with: bp agent create <name>');
    process.exit(1);
  }

  const session = state.sessions[currentComponent];
  if (!session) {
    error('Invalid session state');
    process.exit(1);
  }

  // Check dependencies before advancing
  if (session.depends_on.length > 0) {
    const unmetDeps = checkUnmetDependencies(session.depends_on, state);
    if (unmetDeps.length > 0) {
      error(`Cannot advance: Unmet dependencies: ${unmetDeps.join(', ')}`);
      session.status = 'blocked';
      session.blocked_reason = `Waiting for: ${unmetDeps.join(', ')}`;
      updateAgentState(currentComponent, session);
      logProgress(
        `Component blocked: Waiting for dependencies: ${unmetDeps.join(', ')}\n`
      );
      process.exit(1);
    }
  }

  // Run quality gates when transitioning from code-review or design-review phases
  const phasesRequiringGates: ComponentSession['phase'][] = [
    'code-review',
    'design-review',
  ];
  if (phasesRequiringGates.includes(session.phase)) {
    info(
      `\n🔍 Verifying quality gates before advancing from ${session.phase}...\n`
    );
    const results = await runQualityGates(currentComponent);
    const passed = displayQualityGateSummary(results);

    if (!passed) {
      warn(
        `\n⚠️  Cannot advance: Quality gates failed for bp-${currentComponent}`
      );
      info('Fix the issues above and run: bp agent next');
      session.status = 'blocked';
      session.blocked_reason = 'Quality gates failed - see output above';
      updateAgentState(currentComponent, session);
      logProgress(
        `Quality Gates: FAILED in ${session.phase} phase - component blocked\n`
      );
      process.exit(1);
    }

    logProgress(`Quality Gates: PASSED in ${session.phase} phase`);
  }

  switch (session.phase) {
    case 'create':
      info('✅ Component creation phase complete');
      logProgress(`Phase complete: create`);
      info('🔍 Starting code review phase...');
      startReview(currentComponent, 'code');
      break;

    case 'code-review':
      info('✅ Code review phase complete');
      logProgress(`Phase complete: code-review`);
      info('🎨 Starting design review phase...');
      startReview(currentComponent, 'design');
      break;

    case 'design-review': {
      info('✅ Design review phase complete');
      logProgress(`Phase complete: design-review\\n`);

      // Increment iterations before completion
      session.iterations_taken += 1;

      // Update features.toml to mark component as complete
      updateComponentFeature(currentComponent, {
        status: 'complete',
        iterations_taken: session.iterations_taken,
      });

      // Log completion summary
      const feature = getComponentFeature(currentComponent);
      logFeatureSection(
        currentComponent,
        'Completed',
        feature?.complexity || 'unknown',
        session.iterations_taken
      );
      logProgress(`Implementation Summary:`);
      logProgress(`- Component scaffolding created`);
      logProgress(
        `- All tests passing (${session.iterations_taken} iteration${session.iterations_taken > 1 ? 's' : ''})`
      );
      logProgress(`- Storybook documentation complete`);
      logProgress(`- Design token validation passed`);
      logProgress(`- Documentation page created\\n`);
      logProgress(`Files Modified:`);
      logProgress(
        `- source/components/${currentComponent}/ (all component files)`
      );
      logProgress(`- source/components/index.ts (exported component)`);
      logProgress(
        `- docs/src/content/docs/components/${currentComponent}.mdx (documentation page)`
      );
      logProgress(`- .blueprint/features.toml (marked as complete)\\n`);

      // Remove component from active sessions now that it's complete
      completeComponentSession(currentComponent);

      success(`🎉 Component bp-${currentComponent} is complete!`);
      info('📝 Updated features.toml status');
      info('🧹 Cleared from active agent sessions');
      break;
    }

    default:
      warn('Component is already complete');
  }
}
