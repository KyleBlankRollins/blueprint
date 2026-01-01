# ThemeBuilder API Reference

Complete API documentation for Blueprint's theme system.

## Table of Contents

- [ThemeBuilder Class](#themebuilder-class)
- [Static Methods](#static-methods)
- [Instance Properties](#instance-properties)
- [Plugin Management](#plugin-management)
- [Color Management](#color-management)
- [Theme Variant Management](#theme-variant-management)
- [Validation](#validation)
- [Build & Generation](#build--generation)
- [Introspection](#introspection)
- [Resource Management](#resource-management)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)

---

## ThemeBuilder Class

Main class for building themes from plugins.

### Constructor

```typescript
new ThemeBuilder();
```

Creates a new ThemeBuilder instance with primitive colors (white, black) pre-registered.

**Example:**

```typescript
const builder = new ThemeBuilder();
```

---

## Static Methods

### ThemeBuilder.withDefaults()

```typescript
static withDefaults(): ThemeBuilder
```

Creates a ThemeBuilder pre-loaded with Blueprint's default theme plugins.

**Includes:**

- `blueprint-core` - Core color palette with light/dark variants
- `wada-sanzo` - Japanese traditional colors with wada-light/wada-dark variants

**Returns:** `ThemeBuilder` - Instance with default plugins loaded

**Example:**

```typescript
// Build theme with defaults
const theme = ThemeBuilder.withDefaults().build();

// Or add more plugins
const theme = ThemeBuilder.withDefaults().use(oceanPlugin).build();
```

---

## Instance Properties

### colors

```typescript
readonly colors: Record<string, ColorRef>
```

Typed color registry for accessing color references. Updated dynamically as colors are registered.

**Access Pattern:** `builder.colors.{colorName}{step}`

**Example:**

```typescript
builder.addColor('oceanBlue', {
  source: { l: 0.5, c: 0.15, h: 220 },
  scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
});

// Access color refs
const bg = builder.colors.oceanBlue50;
const primary = builder.colors.oceanBlue600;
const text = builder.colors.gray900;
```

---

## Plugin Management

### use()

```typescript
use(plugin: ThemePlugin): this
```

Registers a plugin synchronously.

**Parameters:**

- `plugin` - ThemePlugin to register

**Returns:** `this` - For method chaining

**Throws:**

- Error if plugin is missing required fields (id, version, register)
- Error if plugin.register() is async (use `useAsync()` instead)

**Example:**

```typescript
import oceanPlugin from './plugins/ocean/index.js';

builder.use(oceanPlugin);

// Chain multiple plugins
builder.use(primitivesPlugin).use(blueprintCorePlugin).use(oceanPlugin);
```

**Notes:**

- Plugins with duplicate IDs will replace existing plugins with a warning
- Plugin's `register()` function is called immediately
- ThemeBase plugins have their design tokens merged

---

### useAsync()

```typescript
async useAsync(plugin: ThemePlugin): Promise<this>
```

Registers a plugin asynchronously.

**Parameters:**

- `plugin` - ThemePlugin to register

**Returns:** `Promise<this>` - For method chaining

**Throws:**

- Error if plugin is missing required fields

**Example:**

```typescript
import dynamicPlugin from './plugins/dynamic/index.js';

await builder.useAsync(dynamicPlugin);

// Chain with await
await builder.useAsync(asyncPlugin1).then((b) => b.useAsync(asyncPlugin2));
```

---

## Color Management

### addColor()

```typescript
addColor(name: string, config: ColorDefinition): this
```

Adds a color scale to the theme. Automatically creates typed color refs for all steps.

**Parameters:**

- `name` - Color name (alphanumeric, must start with letter)
- `config` - Color definition object

**Returns:** `this` - For method chaining

**Throws:**

- Error if name is invalid (must start with letter, alphanumeric only)
- Error if config is missing source or scale

**Example:**

```typescript
builder.addColor('oceanBlue', {
  source: { l: 0.5, c: 0.15, h: 220 },
  scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  metadata: {
    name: 'Ocean Blue',
    description: 'Primary brand color inspired by ocean waters',
    tags: ['primary', 'ocean', 'blue'],
  },
});

// Now available: builder.colors.oceanBlue50 through oceanBlue950
```

**ColorDefinition Interface:**

```typescript
interface ColorDefinition {
  source: OKLCHColor; // Base color
  scale: readonly number[]; // Steps to generate
  metadata?: {
    name?: string; // Display name
    description?: string; // Description
    tags?: string[]; // Categorization tags
  };
}

interface OKLCHColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4 typical)
  h: number; // Hue (0-360)
}
```

---

### getColor()

```typescript
getColor(name: string): ColorDefinition | undefined
```

Retrieves a color definition by name.

**Parameters:**

- `name` - Color name

**Returns:** `ColorDefinition | undefined` - Color definition or undefined if not found

**Example:**

```typescript
const blue = builder.getColor('oceanBlue');
if (blue) {
  console.log(`Lightness: ${blue.source.l}`);
  console.log(`Scale: ${blue.scale.join(', ')}`);
}
```

---

### hasColor()

```typescript
hasColor(name: string): boolean
```

Checks if a color exists in the registry.

**Parameters:**

- `name` - Color name

**Returns:** `boolean` - true if color exists

**Example:**

```typescript
if (builder.hasColor('oceanBlue')) {
  // Use the color
  const primary = builder.colors.oceanBlue600;
}
```

---

## Theme Variant Management

### addThemeVariant()

```typescript
addThemeVariant(name: string, tokens: SemanticTokens<ColorRef>): this
```

Adds a theme variant (e.g., 'light', 'dark', 'ocean-light').

**Parameters:**

- `name` - Variant name (alphanumeric + hyphens, must start with letter)
- `tokens` - Complete semantic token mapping

**Returns:** `this` - For method chaining

**Throws:**

- Error if name is invalid
- Error if any required semantic tokens are missing

**Example:**

```typescript
builder.addThemeVariant('ocean-light', {
  // Backgrounds
  background: builder.colors.white,
  surface: builder.colors.oceanBlue50,
  surfaceElevated: builder.colors.white,
  surfaceSubdued: builder.colors.oceanBlue100,

  // Text
  text: builder.colors.oceanBlue900,
  textMuted: builder.colors.oceanBlue600,
  textInverse: builder.colors.white,

  // Primary brand
  primary: builder.colors.oceanBlue600,
  primaryHover: builder.colors.oceanBlue700,
  primaryActive: builder.colors.oceanBlue800,

  // Semantic states
  success: builder.colors.green600,
  warning: builder.colors.yellow600,
  error: builder.colors.red600,
  info: builder.colors.oceanBlue500,

  // UI elements
  border: builder.colors.oceanBlue200,
  borderStrong: builder.colors.oceanBlue300,
  focus: builder.colors.oceanBlue500,
});
```

**SemanticTokens Interface:**

```typescript
interface SemanticTokens<TColorRef = ColorRef> {
  // Backgrounds
  background: TColorRef;
  surface: TColorRef;
  surfaceElevated: TColorRef;
  surfaceSubdued: TColorRef;

  // Text
  text: TColorRef;
  textMuted: TColorRef;
  textInverse: TColorRef;

  // Primary brand
  primary: TColorRef;
  primaryHover: TColorRef;
  primaryActive: TColorRef;

  // Semantic states
  success: TColorRef;
  warning: TColorRef;
  error: TColorRef;
  info: TColorRef;

  // UI elements
  border: TColorRef;
  borderStrong: TColorRef;
  focus: TColorRef;
}
```

---

### extendThemeVariant()

```typescript
extendThemeVariant(
  baseName: string,
  newName: string,
  overrides: Partial<SemanticTokens<ColorRef>>
): this
```

Creates a new variant by extending an existing one with partial overrides.

**Parameters:**

- `baseName` - Name of base variant to extend
- `newName` - Name for new variant
- `overrides` - Partial token overrides

**Returns:** `this` - For method chaining

**Throws:**

- Error if base variant doesn't exist

**Example:**

```typescript
// Create base variant
builder.addThemeVariant('ocean-light', {
  /* ... */
});

// Extend it for high contrast
builder.extendThemeVariant('ocean-light', 'ocean-high-contrast', {
  text: builder.colors.black,
  primary: builder.colors.oceanBlue700,
  border: builder.colors.oceanBlue400,
});
```

---

### getThemeVariant()

```typescript
getThemeVariant(name: string): SemanticTokens<ColorRef> | undefined
```

Retrieves a theme variant by name.

**Parameters:**

- `name` - Variant name

**Returns:** `SemanticTokens<ColorRef> | undefined` - Variant tokens or undefined

**Example:**

```typescript
const lightTheme = builder.getThemeVariant('light');
if (lightTheme) {
  console.log('Primary color:', lightTheme.primary);
}
```

---

## Validation

### validate()

```typescript
validate(): ValidationResult
```

Validates the current theme configuration.

**Returns:** `ValidationResult` - Validation errors and warnings

**Example:**

```typescript
const result = builder.validate();

if (!result.valid) {
  console.error('Validation errors:');
  result.errors.forEach((error) => {
    console.error(`  - ${error.message}`);
  });
}

if (result.warnings.length > 0) {
  console.warn('Validation warnings:');
  result.warnings.forEach((warning) => {
    console.warn(`  - ${warning.message}`);
  });
}
```

**ValidationResult Interface:**

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  plugin?: string;
  type:
    | 'missing_color'
    | 'invalid_ref'
    | 'contrast_violation'
    | 'duplicate_id'
    | 'dependency_missing'
    | 'accessibility'
    | 'missing_token';
  message: string;
  context?: Record<string, unknown>;
}

interface ValidationWarning {
  plugin?: string;
  type: 'low_contrast' | 'similar_colors' | 'deprecated_api';
  message: string;
  suggestion?: string;
}
```

**Validation Checks:**

- ✅ All semantic tokens defined
- ✅ Color references are valid
- ✅ WCAG contrast ratios (4.5:1 for text, 3:1 for UI)
- ✅ Plugin dependencies exist
- ✅ Light and dark variants present
- ✅ Design tokens present (from ThemeBase plugins)

---

## Build & Generation

### build()

```typescript
build(): ThemeConfig
```

Builds the final theme configuration.

**Returns:** `ThemeConfig` - Complete theme configuration

**Throws:**

- Error if validation fails
- Error if light or dark variants missing
- Error if no ThemeBase plugin registered

**Example:**

```typescript
const builder = ThemeBuilder.withDefaults().use(oceanPlugin);

try {
  const theme = builder.build();
  console.log('Theme built successfully!');
  console.log('Colors:', Object.keys(theme.colors));
  console.log('Variants:', Object.keys(theme.themes));
} catch (error) {
  console.error('Build failed:', error.message);
}
```

**Build Process:**

1. Runs `beforeBuild()` hooks on all plugins
2. Validates theme configuration
3. Converts color refs to strings
4. Merges design tokens from ThemeBase plugins
5. Runs `afterBuild()` hooks on all plugins
6. Returns final ThemeConfig

**ThemeConfig Interface:**

```typescript
interface ThemeConfig {
  colors: Record<string, ColorScale>;
  themes: Record<ThemeVariant, Record<string, string>>;
  themeMetadata?: Record<string, { pluginId?: string }>;

  // Design tokens from ThemeBase plugins
  spacing: SpacingConfig;
  radius: Record<string, number>;
  motion: MotionConfig;
  typography: TypographyConfig;
  focus?: FocusConfig;
  zIndex?: Record<string, number>;
  opacity?: Record<string, number>;
  breakpoints?: Record<string, string>;
  accessibility?: AccessibilityConfig;
}
```

---

### generateTypes()

```typescript
async generateTypes(config: TypeGenerationConfig): Promise<void>
```

Generates TypeScript declaration file for registered colors and variants.

**Parameters:**

- `config` - Type generation configuration

**Returns:** `Promise<void>` - Resolves when file is written

**Example:**

```typescript
await builder.generateTypes({
  outputPath: 'source/themes/generated/theme.d.ts',
  includeJSDoc: true,
});
```

**TypeGenerationConfig Interface:**

```typescript
interface TypeGenerationConfig {
  outputPath: string; // Path to write .d.ts file
  includeJSDoc?: boolean; // Include JSDoc comments (default: true)
}
```

**Generated Types Include:**

- `ColorName` - Union of all color names
- Individual color scale interfaces (e.g., `GrayColorScale`)
- `ColorRegistry` - Complete colors type
- `ThemeVariantName` - Union of all variant names
- Module augmentation for `builder.colors`

---

### generateTypesString()

```typescript
generateTypesString(
  config?: Omit<TypeGenerationConfig, 'outputPath'>
): string
```

Generates TypeScript types as a string without writing to file.

**Parameters:**

- `config` - Optional configuration (excludes outputPath)

**Returns:** `string` - Generated TypeScript declaration content

**Example:**

```typescript
const types = builder.generateTypesString({
  includeJSDoc: true,
});

console.log(types);
// Or use programmatically
fs.writeFileSync('custom-path.d.ts', types);
```

---

## Introspection

### getPlugins()

```typescript
getPlugins(): ThemePlugin[]
```

Returns all registered plugins.

**Returns:** `ThemePlugin[]` - Array of registered plugins

**Example:**

```typescript
const plugins = builder.getPlugins();
console.log(`Registered plugins: ${plugins.length}`);
plugins.forEach((p) => {
  console.log(`  - ${p.name || p.id} v${p.version}`);
});
```

---

### getColorNames()

```typescript
getColorNames(): string[]
```

Returns all registered color names.

**Returns:** `string[]` - Array of color names

**Example:**

```typescript
const colors = builder.getColorNames();
console.log('Available colors:', colors.join(', '));
// Output: Available colors: white, black, gray, blue, red, oceanBlue
```

---

### getThemeVariantNames()

```typescript
getThemeVariantNames(): string[]
```

Returns all theme variant names.

**Returns:** `string[]` - Array of variant names

**Example:**

```typescript
const variants = builder.getThemeVariantNames();
console.log('Available themes:', variants.join(', '));
// Output: Available themes: light, dark, ocean-light, ocean-dark
```

---

### getDesignTokens()

```typescript
getDesignTokens(): DesignTokens | null
```

Returns merged design tokens from all ThemeBase plugins.

**Returns:** `DesignTokens | null` - Merged tokens or null if no ThemeBase plugins

**Example:**

```typescript
const tokens = builder.getDesignTokens();
if (tokens) {
  console.log('Base spacing:', tokens.spacing.base);
  console.log('Font family:', tokens.typography.fontFamilies.sans);
  console.log('Border radius:', tokens.radius.md);
}
```

**DesignTokens Interface:**

```typescript
interface DesignTokens {
  spacing: SpacingConfig;
  radius: Record<string, number>;
  motion: MotionConfig;
  typography: TypographyConfig;
  focus?: FocusConfig;
  zIndex?: Record<string, number>;
  opacity?: Record<string, number>;
  breakpoints?: Record<string, string>;
  accessibility?: AccessibilityConfig;
}
```

---

### getThemeVariantsByPlugin()

```typescript
getThemeVariantsByPlugin(): Map<string, string[]>
```

Returns theme variants grouped by the plugin that registered them.

**Returns:** `Map<string, string[]>` - Map of plugin ID to variant names

**Example:**

```typescript
const byPlugin = builder.getThemeVariantsByPlugin();

for (const [pluginId, variants] of byPlugin) {
  console.log(`${pluginId}:`);
  variants.forEach((v) => console.log(`  - ${v}`));
}

// Output:
// blueprint-core:
//   - light
//   - dark
// ocean:
//   - ocean-light
//   - ocean-dark
```

---

## Resource Management

### onDispose()

```typescript
onDispose(cleanup: () => void): void
```

Registers a cleanup function to be called when builder is disposed.

**Parameters:**

- `cleanup` - Function to call during disposal

**Example:**

```typescript
const watcher = startFileWatcher();

builder.onDispose(() => {
  console.log('Cleaning up file watcher...');
  watcher.close();
});
```

---

### dispose()

```typescript
dispose(): void
```

Cleans up all resources and registered cleanup handlers.

**Example:**

```typescript
const builder = new ThemeBuilder().use(plugin1).use(plugin2);

builder.onDispose(() => console.log('Cleanup 1'));
builder.onDispose(() => console.log('Cleanup 2'));

// Later, when done with builder
builder.dispose();
// Output:
// Cleanup 1
// Cleanup 2
```

**Cleanup Actions:**

- Calls all registered cleanup functions
- Clears color registry
- Clears theme variants
- Clears plugins array
- Resets design tokens

**Note:** Call this when the builder is no longer needed to prevent memory leaks.

---

## Type Definitions

### ColorRef

```typescript
type ColorRef = {
  readonly __colorRef: unique symbol;
  readonly colorName: string;
  readonly step: number;
};
```

Opaque type for type-safe color references. Cannot be created manually; use `builder.colors.*` instead.

---

### ThemePlugin

```typescript
interface ThemePlugin {
  // Required
  id: string;
  version: string;
  register(builder: ThemeBuilderInterface): void | Promise<void>;

  // Optional metadata
  name?: string;
  description?: string;
  author?: string;
  license?: string;
  homepage?: string;
  tags?: string[];

  // Dependencies
  dependencies?: PluginDependency[];
  peerPlugins?: string[];

  // Lifecycle hooks
  beforeBuild?(config: Partial<ThemeConfig>): void;
  afterBuild?(config: ThemeConfig): void;
  validate?(config: ThemeConfig): ValidationError[];
}
```

---

### PluginDependency

```typescript
interface PluginDependency {
  id: string; // Plugin ID
  version?: string; // Semver version range (optional)
  optional?: boolean; // Whether dependency is optional
}
```

---

### ThemeVariant

```typescript
type ThemeVariant = 'light' | 'dark';
```

Standard theme variant names. Custom variants can be any string.

---

## Error Handling

### Common Errors

#### Missing Required Plugin Fields

```typescript
// ❌ Error: Plugin must have an id
builder.use({
  version: '1.0.0',
  register(builder) {},
});

// ✅ Correct
builder.use({
  id: 'my-plugin',
  version: '1.0.0',
  register(builder) {},
});
```

#### Invalid Color Name

```typescript
// ❌ Error: Color name must start with a letter
builder.addColor('500blue', {
  /* ... */
});

// ❌ Error: Color name must be alphanumeric
builder.addColor('ocean-blue', {
  /* ... */
});

// ✅ Correct
builder.addColor('oceanBlue', {
  /* ... */
});
```

#### Missing Semantic Tokens

```typescript
// ❌ Error: Missing required tokens
builder.addThemeVariant('incomplete', {
  background: builder.colors.white,
  text: builder.colors.black,
  // Missing other required tokens!
});

// ✅ Correct - All 17 tokens defined
builder.addThemeVariant('complete', {
  background: builder.colors.white,
  surface: builder.colors.gray50,
  // ... all other tokens
});
```

#### Validation Failures

```typescript
try {
  const theme = builder.build();
} catch (error) {
  if (error.message.includes('validation failed')) {
    // Handle validation errors
    const validation = builder.validate();
    validation.errors.forEach((err) => {
      console.error(err.message);
    });
  }
}
```

#### Missing Required Variants

```typescript
// ❌ Error: Theme must include "light" and "dark" variants
const theme = builder.build();

// ✅ Correct
builder.addThemeVariant('light', {
  /* ... */
});
builder.addThemeVariant('dark', {
  /* ... */
});
const theme = builder.build();
```

---

## Usage Patterns

### Basic Theme

```typescript
const builder = new ThemeBuilder();

// Add colors
builder.addColor('brand', {
  source: { l: 0.5, c: 0.2, h: 220 },
  scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
});

// Create variants
builder.addThemeVariant('light', {
  /* ... */
});
builder.addThemeVariant('dark', {
  /* ... */
});

// Build
const theme = builder.build();
```

### Plugin-Based Theme

```typescript
import { ThemeBuilder } from './builder/ThemeBuilder.js';
import myPlugin from './plugins/my-plugin/index.js';

const theme = ThemeBuilder.withDefaults().use(myPlugin).build();
```

### Validated Build

```typescript
const builder = new ThemeBuilder().use(oceanPlugin);

const validation = builder.validate();

if (validation.valid) {
  const theme = builder.build();
} else {
  console.error('Validation failed:');
  validation.errors.forEach((e) => console.error(e.message));
  process.exit(1);
}
```

### Type Generation Workflow

```typescript
const builder = ThemeBuilder.withDefaults().use(oceanPlugin);

// Generate types
await builder.generateTypes({
  outputPath: 'source/themes/generated/theme.d.ts',
  includeJSDoc: true,
});

// Build theme
const theme = builder.build();
```

---

## See Also

- [Plugin Authoring Guide](./PLUGIN-AUTHORING-GUIDE.md) - Learn to create theme plugins
- [Best Practices](./BEST-PRACTICES.md) - Theme development best practices
- [Type Generation](./TYPE-GENERATION.md) - TypeScript type generation details
- [Example Plugins](../plugins/) - Reference implementations
