import { Command } from 'commander';
import {
  startComponentCreation,
  startReview,
  showStatus,
  verifyComponent,
  continueNext,
} from '../lib/agent/index.js';

/**
 * Registers the agent command and all its subcommands with Commander.js.
 * Provides multi-phase component development workflow orchestration.
 *
 * @param program - Commander.js program instance
 */
export function agentCommand(program: Command): void {
  const agent = program
    .command('agent')
    .description('Multi-agent component development workflow');

  // bp agent create <component-name>
  agent
    .command('create <name>')
    .description('Start component creation phase with component-creator agent')
    .action((name: string) => {
      startComponentCreation(name);
    });

  // bp agent review <component-name>
  agent
    .command('review <name>')
    .description('Start code review phase with code-review agent')
    .option('--type <type>', 'Review type: code or design', 'code')
    .action((name: string, options: { type: 'code' | 'design' }) => {
      startReview(name, options.type);
    });

  // bp agent status [component-name]
  agent
    .command('status [name]')
    .description('Show component development status')
    .action((name?: string) => {
      showStatus(name);
    });

  // bp agent verify [component-name]
  agent
    .command('verify [name]')
    .description('Run quality gates and verify component is ready to advance')
    .action(async (name?: string) => {
      await verifyComponent(name);
    });

  // bp agent next
  agent
    .command('next')
    .description('Continue with the next phase of current component')
    .action(async () => {
      await continueNext();
    });
}
