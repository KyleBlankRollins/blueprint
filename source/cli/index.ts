#!/usr/bin/env node

// Mark that we're running from the CLI
process.env.BP_CLI = '1';

import { Command } from 'commander';
import { scaffoldCommand } from './commands/scaffold.js';
import { validateCommand } from './commands/validate.js';
import { generateCommand } from './commands/generate.js';
import { demoCommand } from './commands/demo.js';
import { createCommand } from './commands/create.js';
import { checkCommand } from './commands/check.js';
import { listCommand } from './commands/list.js';
import { themeCommand } from './commands/theme.js';

const program = new Command();

program
  .name('bp')
  .description('Blueprint component development toolkit')
  .version('0.1.0');

// Register core commands
scaffoldCommand(program);
validateCommand(program);
generateCommand(program);
demoCommand(program);

// Register theme commands
themeCommand(program);

// Register workflow commands
createCommand(program);
checkCommand(program);

// Register utility commands
listCommand(program);

program.parse();
