import { info, warn } from '../../utils/logger.js';
import type { AgentState, ComponentSession } from './types.js';
import { getAgentState } from './state.js';
import { getComponentFeature } from './features.js';

/**
 * Check which dependencies are not yet complete
 * Checks both agent-state.json sessions and features.toml
 */
export function checkUnmetDependencies(
  dependencies: string[],
  state: AgentState
): string[] {
  return dependencies.filter((dep) => {
    // First check agent-state sessions
    const depSession = state.sessions[dep];
    if (depSession && depSession.status === 'complete') {
      return false; // Dependency is complete in agent state
    }

    // Fall back to features.toml
    const feature = getComponentFeature(dep);
    if (feature && feature.status === 'complete') {
      return false; // Dependency is complete in features.toml
    }

    return true; // Dependency is not met
  });
}

/**
 * Display status for a single component session
 */
export function displayComponentStatus(session: ComponentSession): void {
  const phaseEmojis = {
    create: '🏗️',
    'code-review': '🔍',
    'design-review': '🎨',
    complete: '✅',
  };

  const statusColors = {
    'not-started': '⭕',
    'in-progress': '🟡',
    blocked: '🔴',
    complete: '✅',
  };

  console.log(`${phaseEmojis[session.phase]} bp-${session.name}`);
  console.log(`   Phase: ${session.phase} ${statusColors[session.status]}`);
  console.log(`   Iterations: ${session.iterations_taken || 0}`);
  console.log(`   Complexity: ${session.estimated_complexity || 'medium'}`);
  console.log(`   Last: ${new Date(session.lastSession).toLocaleDateString()}`);

  if (session.blockers?.length) {
    console.log(`   🚫 Blockers: ${session.blockers.join(', ')}`);
  }

  if (session.blocked_reason) {
    console.log(`   ⚠️  Blocked: ${session.blocked_reason}`);
  }

  if (session.notes) {
    console.log(`   📝 Notes: ${session.notes}`);
  }

  console.log('');
}

/**
 * Show status for one or all components
 */
export function showStatus(componentName?: string): void {
  const state = getAgentState();

  if (componentName) {
    const session = state.sessions[componentName];
    if (!session) {
      warn(`No session found for component: ${componentName}`);
      return;
    }
    displayComponentStatus(session);
  } else {
    info('📊 Component Development Status\n');

    const sessions = Object.values(state.sessions);
    if (sessions.length === 0) {
      info('No active component sessions');
      return;
    }

    sessions.forEach((session) => displayComponentStatus(session));

    if (state.currentComponent) {
      info(`\n🎯 Current: bp-${state.currentComponent}`);
      info('💡 Run `bp agent next` to continue');
    }
  }
}
