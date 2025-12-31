# Theme Type Generation

Automatically generate TypeScript declaration files for type-safe theme development.

## Overview

The theme system generates TypeScript declaration files that provide:

- **Auto-complete** for all registered colors and steps
- **Compile-time validation** of color references
- **IDE support** with intelligent suggestions
- **Type safety** throughout your theme configuration

## Quick Start

### Generate Types

```bash
# Generate types once
npm run theme:generate-types

# Or via CLI
bp theme generate-types
```

### Watch Mode

```bash
# Automatically regenerate on changes
npm run theme:watch-types

# Or via CLI
bp theme generate-types --watch
```

## Generated Types

The type generator creates a `source/themes/generated/theme.d.ts` file with:

### 1. ColorName Union

All available color names in your theme:

```typescript
export type ColorName =
  | 'gray'
  | 'blue'
  | 'red'
  | 'green'
  | 'yellow'
  | 'oceanBlue'
  | ...;
```

### 2. Individual Color Scales

Type-safe interfaces for each color:

```typescript
export interface GrayColorScale {
  gray50: ColorRef;
  gray100: ColorRef;
  gray200: ColorRef;
  // ... all steps
  gray950: ColorRef;
}
```

### 3. Complete ColorRegistry

Combines all color scales for the builder:

```typescript
export interface ColorRegistry
  extends GrayColorScale, BlueColorScale, RedColorScale {
  // ... all colors
}
```

### 4. Theme Variant Names

Union of all registered theme variants:

```typescript
export type ThemeVariantName = 'light' | 'dark' | 'ocean-light' | 'ocean-dark';
```

### 5. Module Augmentation

Adds types to the ThemeBuilder:

```typescript
declare module '../builder/ThemeBuilder.js' {
  interface ThemeBuilder {
    readonly colors: ColorRegistry;
  }
}
```

## Usage in Plugins

With generated types, you get full IDE support:

```typescript
import { createPlugin } from '@blueprint/themes';

export const oceanTheme = createPlugin({
  id: 'ocean',
  version: '1.0.0',

  register(builder) {
    // Add a color
    builder.addColor('oceanBlue', {
      source: { l: 0.5, c: 0.15, h: 220 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    });

    // TypeScript knows about builder.colors.oceanBlue50, .oceanBlue100, etc!
    builder.addThemeVariant('ocean-light', {
      background: builder.colors.gray50, // ✓ Auto-complete works!
      primary: builder.colors.oceanBlue700, // ✓ Type-safe
      text: builder.colors.gray900,
      // builder.colors.oceanBlue1000  ❌ Error: Invalid step
      // builder.colors.fakeColor500   ❌ Error: Color doesn't exist
    });
  },
});
```

## CLI Options

```bash
bp theme generate-types [options]

Options:
  -o, --output <path>     Output file path (default: source/themes/generated/theme.d.ts)
  --no-jsdoc              Exclude JSDoc comments from generated types
  -m, --module <name>     Module name for imports (e.g., '@blueprint/themes')
  -w, --watch             Watch for changes and regenerate types
  -h, --help              Display help
```

### Examples

```bash
# Generate to custom path
bp theme generate-types --output ./types/theme.d.ts

# Generate without JSDoc comments
bp theme generate-types --no-jsdoc

# Use custom module name for imports
bp theme generate-types --module '@my-org/themes'

# Watch mode for development
bp theme generate-types --watch
```

## Programmatic Usage

Use the type generator in your own scripts:

```typescript
import { ThemeBuilder } from '@blueprint/themes';
import { primitivesPlugin } from './plugins/primitives';

const builder = new ThemeBuilder().use(primitivesPlugin);

// Generate types to a file
await builder.generateTypes({
  outputPath: 'source/themes/generated/theme.d.ts',
  includeJSDoc: true,
  moduleName: '@blueprint/themes',
});

// Or get the types as a string
const typeContent = builder.generateTypesString({
  includeJSDoc: false,
});

console.log(typeContent);
```

## Integration with Build Process

Type generation is automatically included in the build process:

```json
{
  "scripts": {
    "build": "npm run theme:generate-types && tsc && vite build"
  }
}
```

This ensures types are always up-to-date when building your project.

## Benefits

### 1. Type Safety

```typescript
// ✓ Type-safe color references
primary: builder.colors.blue500;

// ❌ Compile error - invalid step
primary: builder.colors.blue1000;

// ❌ Compile error - color doesn't exist
primary: builder.colors.purple500;
```

### 2. Auto-complete

Your IDE will suggest:

- All available colors (gray, blue, red, etc.)
- Valid steps for each color (50, 100, 200, ..., 950)
- Semantic token properties

### 3. Refactoring Support

- Rename a color - all references update
- Remove a color - immediate feedback on broken references
- Change scale steps - invalid references highlighted

### 4. Documentation

JSDoc comments provide inline documentation:

```typescript
/**
 * Color scale for gray
 * Neutral gray scale for text, borders, and backgrounds
 */
export interface GrayColorScale {
  /** gray at 50 lightness step */
  gray50: ColorRef;
  // ...
}
```

## Troubleshooting

### Types not updating

Run type generation manually:

```bash
npm run theme:generate-types
```

### Invalid color references

1. Check if the color is registered in a plugin
2. Verify the step number is in the color's scale
3. Regenerate types after adding new colors

### IDE not showing auto-complete

1. Restart TypeScript server (VS Code: Cmd/Ctrl + Shift + P → "Restart TS Server")
2. Ensure `theme.d.ts` is included in your `tsconfig.json`
3. Check that types are generated in the correct location

## Files

- `source/themes/builder/typeGenerator.ts` - Type generation utilities
- `source/cli/commands/generate-types.ts` - CLI command
- `source/themes/generated/theme.d.ts` - Generated types (auto-generated)

## See Also

- [Theme Plugin System](../theme-plugin-implementation-plan.md)
- [ThemeBuilder API](../source/themes/builder/README.md)
- [Creating Plugins](../source/themes/plugins/README.md)
