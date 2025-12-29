# Blueprint CLI Design Document

## Overview

This document explores options for creating a unified CLI tool (`bp`) that consolidates all Blueprint developer tools into a single, cohesive command-line interface.

## Current State

### Existing Tools

We have 6 independent developer tools, each with its own npm script:

1. `npm run scaffold <component-name>` - Create component stub files
2. `npm run validate:component <component-name>` - Validate component completeness
3. `npm run validate:tokens <component-name>` - Check for hardcoded values
4. `npm run extract-api <component-name>` - Generate API documentation
5. `npm run generate-stories <component-name>` - Auto-generate Storybook stories
6. `npm run add-to-demo <component-name>` - Add component to demo page

### Problems with Current Approach

**Verbosity:**

```bash
npm run scaffold button
npm run validate:tokens button
npm run generate-stories button
npm run extract-api button
npm run validate:component button
npm run add-to-demo button
```

**Inconsistency:**

- Some scripts use `:` separator (`validate:component`)
- Others use `-` separator (`add-to-demo`)
- No unified help system
- No command discovery mechanism

**Developer Experience:**

- Must remember 6+ different npm script names
- No tab completion
- No unified error handling
- Each tool outputs in different formats

## Goals

### Primary Goals

1. **Simplicity** - Reduce cognitive load with intuitive command structure
2. **Discoverability** - Make it easy to find and learn available commands
3. **Consistency** - Unified help, error handling, and output formatting
4. **Workflow Support** - Support common workflows (e.g., create full component)

### Secondary Goals

1. **Tab Completion** - Shell completion for commands and component names
2. **Interactive Mode** - Prompts for missing arguments
3. **Batch Operations** - Run multiple operations on multiple components
4. **Configuration** - Allow customization via config file

## Option 1: Bash/PowerShell Script

**Approach:** Create a simple shell script wrapper.

**Pros:**

- Zero dependencies
- Simple to implement
- Works anywhere Node.js works
- Easy to understand

**Cons:**

- Platform-specific (need separate Windows/Unix versions)
- Limited argument parsing
- No TypeScript/type safety
- Hard to test
- No interactive prompts

**Example:**

```bash
#!/bin/bash
# bp.sh

case "$1" in
  scaffold)
    npm run scaffold "$2"
    ;;
  validate)
    npm run validate:component "$2"
    ;;
  *)
    echo "Unknown command: $1"
    exit 1
    ;;
esac
```

**Verdict:** ❌ Too limited for our needs

## Option 2: Node.js Script with Commander.js

**Approach:** Create a TypeScript CLI using Commander.js library.

**Pros:**

- Excellent argument parsing
- Built-in help generation
- Subcommand support
- TypeScript support
- Well-documented, popular library (40M+ weekly downloads)
- Interactive prompts with plugins
- Minimal dependencies

**Cons:**

- Adds dependency (~100KB)
- Requires compilation step

**Example:**

```typescript
import { Command } from 'commander';

const program = new Command();

program
  .name('bp')
  .description('Blueprint component development toolkit')
  .version('0.1.0');

program
  .command('scaffold <component-name>')
  .description('Create component stub files')
  .action((name) => {
    // Call existing scaffold function
  });

program.parse();
```

**Verdict:** ✅ Best balance of features and simplicity

## Option 3: Minimalist Node.js Script (No Dependencies)

**Approach:** Custom argument parser with no external dependencies.

**Pros:**

- Zero dependencies
- Full control over behavior
- TypeScript support
- Works with existing tools

**Cons:**

- Must implement argument parsing
- Must implement help system
- More code to maintain
- Reinventing the wheel

**Example:**

```typescript
// bp.ts
const command = process.argv[2];
const componentName = process.argv[3];

switch (command) {
  case 'scaffold':
    scaffold(componentName);
    break;
  case 'validate':
    validateComponent(componentName);
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
```

**Verdict:** ⚠️ Possible but not recommended (too much work for little benefit)

## Option 4: Use Existing Package.json Scripts with npx

**Approach:** Keep current approach but improve with `npx` wrapper.

**Pros:**

- No new tooling needed
- Leverages existing infrastructure
- Simple

**Cons:**

- Still verbose (`npx bp scaffold button` vs `bp scaffold button`)
- No unified help
- No workflow improvements
- Doesn't solve discoverability

**Verdict:** ❌ Doesn't address core problems

## Option 5: Bun/Deno Native Scripts

**Approach:** Use Bun or Deno for better TypeScript DX.

**Pros:**

- Native TypeScript execution (no build step)
- Modern runtime features
- Fast execution

**Cons:**

- Requires Bun/Deno installation
- Not standard Node.js
- Adds platform requirement
- Project uses Node.js ecosystem

**Verdict:** ❌ Too much friction for contributors

## Recommended Approach: Commander.js CLI

### Why Commander.js?

1. **Industry Standard** - Used by Vue CLI, Create React App, Angular CLI, etc.
2. **Minimal Dependency** - Only adds ~100KB (acceptable for dev dependency)
3. **TypeScript-First** - Excellent TypeScript support
4. **Feature Complete** - Arguments, options, help, subcommands all built-in
5. **Extensible** - Can add interactive prompts with `inquirer` if needed later

### Architecture

```
source/cli/
  ├── index.ts          # Main CLI entry point
  ├── commands/
  │   ├── scaffold.ts   # Scaffold command
  │   ├── validate.ts   # Validation commands
  │   ├── generate.ts   # Generation commands
  │   ├── demo.ts       # Demo-related commands
  │   └── create.ts     # Workflow command (optional)
  └── utils/
      ├── logger.ts     # Consistent logging/formatting
      └── component.ts  # Shared component utilities
```

### Command Structure

```bash
bp <command> [subcommand] <component-name> [options]

# Core commands (map 1:1 to existing tools)
bp scaffold <name>              # npm run scaffold
bp validate component <name>    # npm run validate:component
bp validate tokens <name>       # npm run validate:tokens
bp generate api <name>          # npm run extract-api
bp generate stories <name>      # npm run generate-stories
bp demo add <name>              # npm run add-to-demo

# Workflow commands (composite operations)
bp create <name>                # Full workflow: scaffold → generate stories → add to demo
bp check <name>                 # Validate both tokens and component

# Utility commands
bp list                         # List all components
bp help [command]               # Show help
bp --version                    # Show version
```

### Build Steps

1. Install Commander.js: `npm install -D commander`
2. Create `source/cli/` directory structure
3. Create `source/cli/index.ts` with basic structure
4. Add `bin` entry to package.json: `"bp": "./dist/cli/index.js"`
5. Create tsconfig for CLI compilation
6. Implement all command modules
7. Refactor existing scripts to export reusable functions
8. Test all commands
9. Update agent instructions

### Example Implementation

```typescript
// source/cli/index.ts
#!/usr/bin/env node
import { Command } from 'commander';
import { scaffoldCommand } from './commands/scaffold.js';
import { validateCommand } from './commands/validate.js';
import { generateCommand } from './commands/generate.js';
import { demoCommand } from './commands/demo.js';

const program = new Command();

program
  .name('bp')
  .description('Blueprint component development toolkit')
  .version('0.1.0');

// Register commands
scaffoldCommand(program);
validateCommand(program);
generateCommand(program);
demoCommand(program);

program.parse();
```

```typescript
// source/cli/commands/scaffold.ts
import { Command } from 'commander';
import { scaffoldComponent } from '../../scripts/scaffoldComponent.js';

export function scaffoldCommand(program: Command) {
  program
    .command('scaffold <component-name>')
    .description('Create component stub files')
    .action((componentName: string) => {
      const result = scaffoldComponent(componentName);

      if (!result.success) {
        console.error(`❌ Scaffold failed: ${result.errors.join(', ')}`);
        process.exit(1);
      }

      console.log(`✅ Scaffolded ${componentName}`);
      result.filesCreated.forEach((file) => {
        console.log(`   Created: ${file}`);
      });
    });
}
```

```typescript
// source/cli/commands/validate.ts
import { Command } from 'commander';
import { validateComponent } from '../../scripts/validateComponent.js';
import { validateTokens } from '../../scripts/validateTokens.js';

export function validateCommand(program: Command) {
  const validate = program
    .command('validate')
    .description('Validate component code and design tokens');

  validate
    .command('component <component-name>')
    .description('Validate component completeness')
    .action((componentName: string) => {
      const result = validateComponent(componentName);
      // ... handle result
    });

  validate
    .command('tokens <component-name>')
    .description('Check for hardcoded design values')
    .action((componentName: string) => {
      const result = validateTokens(componentName);
      // ... handle result
    });
}
```

### Package.json Changes

```json
{
  "bin": {
    "bp": "./dist/cli/index.js"
  },
  "scripts": {
    "build:cli": "tsc -p tsconfig.cli.json"
  },
  "devDependencies": {
    "commander": "^12.1.0"
  }
}
```

### Usage Examples

```bash
# Install globally (optional)
npm install -g .

# Or use with npx
npx bp scaffold button

# Or after local install
./node_modules/.bin/bp scaffold button

# Full workflow
bp scaffold button
bp validate tokens button
bp generate stories button
bp generate api button
bp validate component button
bp demo add button

# Or use workflow command (future)
bp create button
```

## Alternative: Workflow Commands Only

A simpler approach would be to **not** create 1:1 command mappings, but instead create high-level workflow commands:

```bash
bp create <name>     # scaffold + generate stories + add to demo
bp validate <name>   # validate tokens + validate component
bp update <name>     # regenerate stories + api docs
```

**Pros:**

- Simpler CLI with fewer commands
- Focuses on common workflows
- Less code to maintain

**Cons:**

- Less granular control
- Forces specific workflow
- Harder to debug individual steps

**Verdict:** Start with 1:1 commands, add workflow commands in Phase 3

## Implementation Plan

### Phase 1: Core Infrastructure (Day 1)

- Install Commander.js
- Create basic CLI structure
- Implement `scaffold` and `validate component` commands
- Test with existing button component

### Phase 2: Complete Core Commands (Day 2)

- Implement all remaining 1:1 commands
- Refactor existing tools to export functions
- Add consistent error handling and output formatting

### Phase 3: Workflow Commands (Day 3)

- Add `bp create` workflow command
- Add `bp check` validation workflow
- Add `bp list` utility
- Polish help text and documentation

### Phase 4: Quality of Life (Optional)

- Add `--dry-run` flags
- Add input validation
- Improve error messages

## Risks and Mitigations

| Risk                        | Mitigation                                   |
| --------------------------- | -------------------------------------------- |
| Commander.js adds bloat     | It's a dev dependency, not shipped to users  |
| Learning curve for new CLI  | Extensive help text and examples             |
| Build step complexity       | Simple tsc build, similar to current scripts |
| Tool refactoring complexity | Export functions from existing scripts       |

## Success Metrics

1. **Reduced Command Length** - `bp scaffold button` vs `npm run scaffold button`
2. **Improved Discoverability** - `bp --help` shows all commands
3. **Workflow Efficiency** - `bp create button` runs full workflow
4. **Consistent Output** - All commands use unified formatting

## Recommendation

**Implement Option 2: Commander.js CLI**

### Why?

1. Proven, industry-standard solution
2. Minimal dependencies (just Commander.js)
3. TypeScript-first with excellent DX
4. Extensible for future enhancements
5. Built-in help and argument parsing

### Next Steps

1. Install Commander.js
2. Create CLI structure
3. Implement all core commands
4. Add workflow commands
5. Update agent instructions to use `bp` CLI
