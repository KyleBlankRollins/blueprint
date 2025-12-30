#!/usr/bin/env node

// Mark that we're running from the CLI
process.env.BP_CLI = '1';

import { Command } from 'commander';
import { scaffoldCommand } from './commands/scaffold.js';
import { validateCommand } from './commands/validate.js';

const program = new Command();

program
  .name('bp')
  .description('Blueprint component development toolkit')
  .version('0.1.0');

// Register commands
scaffoldCommand(program);
validateCommand(program);

program.parse();
