# Blueprint CLI (`bp`)

The Blueprint CLI is a unified command-line tool for managing and developing Blueprint web components.

## Installation

The CLI is built and available after running:

```bash
npm install
npm run build:cli
```

## Setup Shell Alias (Optional)

For convenience, you can set up a shell alias to use `bp` instead of typing the full command path.

### PowerShell (Windows)

1. Find your profile location:

   ```powershell
   $PROFILE
   ```

2. Create the profile if it doesn't exist:

   ```powershell
   if (!(Test-Path $PROFILE)) {
       New-Item -Path $PROFILE -ItemType File -Force
   }
   ```

3. Edit your profile:

   ```powershell
   code $PROFILE
   # or
   notepad $PROFILE
   ```

4. Add this function (use your actual path to the blueprint directory):

   ```powershell
   function bp { node "D:\github\blueprint\dist\cli\index.js" $args }
   ```

5. Reload your profile:
   ```powershell
   . $PROFILE
   ```

### ZSH (macOS/Linux)

1. Edit your `~/.zshrc` file:

   ```bash
   code ~/.zshrc
   # or
   nano ~/.zshrc
   ```

2. Add this alias (use your actual path to the blueprint directory):

   ```bash
   alias bp='node /path/to/blueprint/dist/cli/index.js'
   ```

3. Reload your shell configuration:
   ```bash
   source ~/.zshrc
   ```

### Bash (macOS/Linux)

1. Edit your `~/.bashrc` or `~/.bash_profile`:

   ```bash
   nano ~/.bashrc
   ```

2. Add this alias:

   ```bash
   alias bp='node /path/to/blueprint/dist/cli/index.js'
   ```

3. Reload your shell:
   ```bash
   source ~/.bashrc
   ```

**Without an alias**, invoke commands directly:

```bash
node dist/cli/index.js <command> [options]
```

## Usage

```bash
bp <command> [options]
```

## Available Commands

### Component Scaffolding

**`bp scaffold <component-name>`**

Creates a new component with all required files (component, styles, tests, stories, and README).

```bash
bp scaffold my-button
```

Creates:

- `source/components/my-button/my-button.ts` - Component logic
- `source/components/my-button/my-button.style.ts` - Component styles
- `source/components/my-button/my-button.test.ts` - Unit tests
- `source/components/my-button/my-button.stories.ts` - Storybook documentation
- `source/components/my-button/README.md` - API documentation

### Validation

**`bp validate component <component-name>`**

Validates that a component has all required files and exports.

```bash
bp validate component button
```

Checks for:

- Component file exists
- Style file exists
- Test file exists
- Stories file exists
- README exists
- Proper exports in `source/components/index.ts`

**`bp validate tokens <component-name>`**

Checks for hardcoded design values (colors, spacing, etc.) that should use design tokens.

```bash
bp validate tokens button
```

Scans for:

- Hardcoded colors (`#hex`, `rgb()`, color names)
- Hardcoded spacing values (`px`, `rem`, `em`)
- Hardcoded border-radius values
- Other magic numbers that should use CSS custom properties

### Code Generation

**`bp generate api <component-name>`**

Extracts component properties and events to generate API documentation in the README.

```bash
bp generate api button
```

Updates the README with:

- Properties table (name, type, default, description)
- Events table (name, detail, description)

**`bp generate stories <component-name>`**

Auto-generates Storybook stories based on component properties.

```bash
bp generate stories button
```

Creates stories for:

- Default state
- All variants (if `variant` property exists)
- All sizes (if `size` property exists)
- Disabled state (if `disabled` property exists)

### Demo Management

**`bp demo add <component-name>`**

Adds a component example to the demo page (`demo/index.html`).

```bash
bp demo add button
```

Generates HTML example based on component properties and inserts it into the demo page.

### Workflow Commands

**`bp create <component-name>`**

Creates a complete component with one command. This runs the full workflow: scaffold → generate stories → generate API docs → add to demo.

```bash
bp create my-button
```

This is equivalent to running:

```bash
bp scaffold my-button
bp generate stories my-button
bp generate api my-button
bp demo add my-button
```

Options:

- `--skip-demo` - Skip adding the component to the demo page

**`bp check <component-name>`**

Runs all validation checks on a component. This validates both component structure and design token usage.

```bash
bp check button
```

This is equivalent to running:

```bash
bp validate component button
bp validate tokens button
```

### Utility Commands

**`bp list`**

Lists all components in the Blueprint library.

```bash
bp list
```

Options:

- `--detailed` - Show detailed information including file completeness for each component

```bash
bp list --detailed
```

## Command Reference

| Command                        | Description                                                     |
| ------------------------------ | --------------------------------------------------------------- |
| **Core Commands**              |                                                                 |
| `bp scaffold <name>`           | Create new component with all files                             |
| `bp validate component <name>` | Validate component completeness                                 |
| `bp validate tokens <name>`    | Check for hardcoded values                                      |
| `bp generate api <name>`       | Generate API documentation                                      |
| `bp generate stories <name>`   | Generate Storybook stories                                      |
| `bp demo add <name>`           | Add component to demo page                                      |
| **Workflow Commands**          |                                                                 |
| `bp create <name>`             | Create complete component (scaffold + stories + API + demo)     |
| `bp check <name>`              | Run all validation checks (component structure + design tokens) |
| **Utility Commands**           |                                                                 |
| `bp list`                      | List all components                                             |
| `bp list --detailed`           | List components with detailed info                              |
| **Help**                       |                                                                 |
| `bp --help`                    | Show help information                                           |
| `bp <command> --help`          | Show command-specific help                                      |

## Component Naming

All component names must be in **kebab-case** (lowercase with hyphens):

✅ Valid: `button`, `my-component`, `data-table`  
❌ Invalid: `Button`, `myComponent`, `MyButton`

Component names are used to generate:

- Custom element tag: `bp-<component-name>`
- File names: `<component-name>.ts`, `<component-name>.style.ts`, etc.
- Class name: `Bp<ComponentName>` (PascalCase)

## Dry Run Mode

Many commands support a `--dry-run` flag that shows what would happen without actually making changes. This is useful for previewing operations before executing them.

**Commands with --dry-run support:**

- `bp scaffold <name> --dry-run` - Preview files that would be created
- `bp create <name> --dry-run` - Preview the full component creation workflow
- `bp generate api <name> --dry-run` - Preview API documentation changes
- `bp generate stories <name> --dry-run` - Preview story file changes
- `bp demo add <name> --dry-run` - Preview demo page additions

**Example:**

```bash
# Preview what files will be created
bp scaffold my-button --dry-run

# Output:
# [DRY RUN] Would create the following files:
#   ✓ source/components/my-button/my-button.ts
#   ✓ source/components/my-button/my-button.style.ts
#   ✓ source/components/my-button/my-button.test.ts
#   ✓ source/components/my-button/my-button.stories.ts
#   ✓ source/components/my-button/README.md
#
# Run without --dry-run to create these files.

# Actually create the files
bp scaffold my-button
```

## Common Workflows

### Creating a New Component (Quick)

The fastest way to create a new component:

```bash
# Create complete component with one command
bp create my-button

# Implement the component logic, styles, and tests
# ... edit files ...

# Verify everything is correct
bp check my-button
```

### Creating a New Component (Step-by-step)

For more control over each step:

```bash
# 1. Scaffold the component
bp scaffold my-button

# 2. Implement the component logic, styles, and tests
# ... edit files ...

# 3. Generate API documentation
bp generate api my-button

# 4. Generate stories
bp generate stories my-button

# 5. Add to demo page
bp demo add my-button

# 6. Validate everything is complete
bp check my-button
```

### Validating a Component

```bash
# Quick check (runs all validations)
bp check button

# Or run individual validations
bp validate component button
bp validate tokens button
```

### Updating Component Documentation

```bash
# After adding/changing properties or events
bp generate api button
bp generate stories button
```

### Listing All Components

```bash
# Simple list
bp list

# Detailed view with file completeness
bp list --detailed
```

## Architecture

The CLI is built with:

- **Commander.js** - Command-line argument parsing
- **TypeScript** - Type safety and modern JavaScript features
- **ES Modules** - Native module system

Structure:

```
source/cli/
├── index.ts              # Main CLI entry point
├── commands/             # Command implementations
│   ├── scaffold.ts
│   ├── validate.ts
│   ├── generate.ts
│   └── demo.ts
├── lib/                  # Reusable logic
│   ├── scaffold.ts
│   ├── validateComponent.ts
│   ├── validateTokens.ts
│   ├── extractAPI.ts
│   ├── generateStories.ts
│   └── addToDemo.ts
├── templates/            # File templates
│   ├── baseComponent.template
│   ├── baseComponent.style.template
│   ├── baseComponent.test.template
│   ├── baseComponent.stories.template
│   └── baseComponent.README.md
└── utils/
    └── logger.ts         # Formatted console output
```

## Development

Build the CLI:

```bash
npm run build:cli
```

The compiled output is in `dist/cli/`.

Run directly:

```bash
node dist/cli/index.js <command> [options]
```
