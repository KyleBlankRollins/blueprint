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

## Command Reference

| Command                        | Description                         |
| ------------------------------ | ----------------------------------- |
| `bp scaffold <name>`           | Create new component with all files |
| `bp validate component <name>` | Validate component completeness     |
| `bp validate tokens <name>`    | Check for hardcoded values          |
| `bp generate api <name>`       | Generate API documentation          |
| `bp generate stories <name>`   | Generate Storybook stories          |
| `bp demo add <name>`           | Add component to demo page          |
| `bp --help`                    | Show help information               |
| `bp <command> --help`          | Show command-specific help          |

## Component Naming

All component names must be in **kebab-case** (lowercase with hyphens):

✅ Valid: `button`, `my-component`, `data-table`  
❌ Invalid: `Button`, `myComponent`, `MyButton`

Component names are used to generate:

- Custom element tag: `bp-<component-name>`
- File names: `<component-name>.ts`, `<component-name>.style.ts`, etc.
- Class name: `Bp<ComponentName>` (PascalCase)

## Common Workflows

### Creating a New Component

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
bp validate component my-button
bp validate tokens my-button
```

### Updating Component Documentation

```bash
# After adding/changing properties or events
bp generate api button
bp generate stories button
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
