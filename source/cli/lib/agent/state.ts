import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { error, warn } from '../../utils/logger.js';
import type { AgentState, ComponentSession } from './types.js';
import { AGENT_STATE_FILE, PROGRESS_LOG_FILE } from './constants.js';

/**
 * Ensure .blueprint directory exists
 */
export function ensureBlueprintDir(): void {
  const dir = dirname(AGENT_STATE_FILE);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Read agent state from disk
 */
export function getAgentState(): AgentState {
  if (!existsSync(AGENT_STATE_FILE)) {
    return {
      sessions: {},
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    return JSON.parse(readFileSync(AGENT_STATE_FILE, 'utf8'));
  } catch (err: unknown) {
    if (err instanceof Error) {
      error(`Failed to read agent state: ${err.message}`);
    }
    // Return default state if file is corrupted or unreadable
    return {
      sessions: {},
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Update agent state on disk
 */
export function updateAgentState(
  componentName: string,
  session: ComponentSession
): void {
  ensureBlueprintDir();
  const state = getAgentState();
  state.sessions[componentName] = session;
  state.currentComponent = componentName;
  state.lastUpdated = new Date().toISOString();

  writeFileSync(AGENT_STATE_FILE, JSON.stringify(state, null, 2));
}

/**
 * Get a specific component session
 */
export function getComponentSession(
  componentName: string
): ComponentSession | null {
  const state = getAgentState();
  return state.sessions[componentName] || null;
}

/**
 * Append entry to progress log
 */
export function logProgress(message: string): void {
  const entry = `${message}\n`;

  try {
    ensureBlueprintDir();
    const existing = existsSync(PROGRESS_LOG_FILE)
      ? readFileSync(PROGRESS_LOG_FILE, 'utf8')
      : '=== Blueprint Component Library Progress Log ===\n\n';

    writeFileSync(PROGRESS_LOG_FILE, existing + entry);
  } catch (error: unknown) {
    warn('Could not write to progress log');
    if (error instanceof Error) {
      warn(`Reason: ${error.message}`);
    }
  }
}

/**
 * Log feature section header
 */
export function logFeatureSection(
  componentName: string,
  status: 'Started' | 'Completed',
  complexity: string,
  iterations: number
): void {
  const date = new Date().toISOString().split('T')[0];
  const header = `\n--- ${date} ---\nComponent: ${componentName}\nStatus: ${status}\nComplexity: ${complexity}\nIterations: ${iterations}\n\n`;

  try {
    ensureBlueprintDir();
    const existing = existsSync(PROGRESS_LOG_FILE)
      ? readFileSync(PROGRESS_LOG_FILE, 'utf8')
      : '=== Blueprint Component Library Progress Log ===\n\n';

    writeFileSync(PROGRESS_LOG_FILE, existing + header);
  } catch (error: unknown) {
    warn('Could not write to progress log');
    if (error instanceof Error) {
      warn(`Reason: ${error.message}`);
    }
  }
}
