# Theme Plugin System Implementation Plan

**Status:** Planning  
**Date:** December 30, 2025  
**Architecture:** Plugin-based theme system with builder API  
**Reference:** See [theme-modularity-design.md](./theme-modularity-design.md) Option 5

## Overview

Implement a plugin-based architecture that allows themes to be:

- Defined as standalone modules/packages
- Distributed independently (npm, git, filesystem)
- Composed and extended dynamically
- Type-safe with full IDE support
- Validated automatically

## Architecture Vision

```typescript
// User creates a theme plugin with typed colors
export const oceanTheme: ThemePlugin = {
  id: 'ocean',
  version: '1.0.0',
  author: 'Blueprint Team',

  register(builder) {
    // Define colors - automatically generates all step properties
    builder.addColor('oceanBlue', {
      l: 0.5,
      c: 0.15,
      h: 220,
    });

    // TypeScript knows about the color and its scale steps
    // builder.colors.oceanBlue50, .oceanBlue100, ..., .oceanBlue950 are all typed

    // Define theme variants with typed color refs
    builder.addThemeVariant('ocean-light', {
      background: builder.colors.gray50,
      primary: builder.colors.oceanBlue700,
      text: builder.colors.gray900,
    });

    builder.addThemeVariant('ocean-dark', {
      background: builder.colors.gray950,
      primary: builder.colors.oceanBlue300,
      text: builder.colors.gray50,
    });
  },
};

// System uses plugins
const builder = new ThemeBuilder();
builder.use(blueprintCorePlugin);
builder.use(oceanTheme);
builder.use(forestTheme);

export const allThemes = builder.build();
```

## Core Components

### 1. ThemeBuilder Class

**Purpose:** Fluent API for building themes from plugins.

**Interface:**

```typescript
// Typed color reference (opaque type)
type ColorRef = {
  readonly __colorRef: unique symbol;
  readonly colorName: string;
  readonly step: number;
};

// Dynamic color registry type that includes all registered colors
// Example: { gray50: ColorRef, gray100: ColorRef, ..., oceanBlue700: ColorRef }
type ColorRegistry = Record<string, ColorRef>;

class ThemeBuilder {
  // Typed color registry - updated as colors are added
  // Access like: builder.colors.gray50, builder.colors.blue500
  readonly colors: ColorRegistry;

  // Plugin registration
  use(plugin: ThemePlugin): this;

  // Color management - adds color and all its steps to registry
  addColor(name: string, config: ColorDefinition): this;
  getColor(name: string): ColorDefinition | undefined;
  hasColor(name: string): boolean;

  // Theme variant management - accepts typed color refs
  addThemeVariant(name: string, tokens: SemanticTokens<ColorRef>): this;
  getThemeVariant(name: string): SemanticTokens | undefined;
  extendThemeVariant(
    base: string,
    name: string,
    overrides: Partial<SemanticTokens<ColorRef>>
  ): this;

  // Validation
  validate(): ValidationResult;

  // Build
  build(): ThemeConfig;

  // Introspection
  getPlugins(): ThemePlugin[];
  getColorNames(): string[];
  getThemeVariantNames(): string[];
}
```

### 2. ThemePlugin Interface

**Purpose:** Contract for all theme plugins.

**Interface:**

```typescript
interface ThemePlugin {
  // Required metadata
  id: string;
  version: string;

  // Optional metadata
  name?: string;
  description?: string;
  author?: string;
  license?: string;
  homepage?: string;
  tags?: string[];

  // Dependencies
  dependencies?: PluginDependency[];
  peerPlugins?: string[]; // Other plugins this works with

  // Lifecycle hook
  register(builder: ThemeBuilder): void | Promise<void>;

  // Optional hooks
  beforeBuild?(config: Partial<ThemeConfig>): void;
  afterBuild?(config: ThemeConfig): void;
  validate?(config: ThemeConfig): ValidationError[];
}

interface PluginDependency {
  id: string;
  version?: string; // Semver range
  optional?: boolean;
}
```

### 3. Color Definition Types

**Purpose:** Strongly typed color definitions.

```typescript
interface ColorDefinition {
  source: OKLCHColor;
  scale: readonly number[];
  metadata?: {
    name?: string;
    description?: string;
    tags?: string[];
  };
}

interface OKLCHColor {
  l: number; // 0-1
  c: number; // 0-0.4 typically
  h: number; // 0-360
}
```

### 4. Semantic Tokens Types

**Purpose:** Theme variant token definitions with generic typing.

```typescript
// Generic over color reference type for flexibility
interface SemanticTokens<TColorRef = ColorRef | string> {
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

// Typed color reference (opaque type)
type ColorRef = {
  readonly __colorRef: unique symbol;
  readonly colorName: string;
  readonly step: number;
};

// For backward compatibility and serialization
type ColorRefString = `${string}.${number}`; // Format: "colorName.step" e.g., "blue.500"
```

### 5. Validation System

**Purpose:** Validate theme configuration and plugin compatibility.

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
    | 'dependency_missing';
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

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1)

**Goal:** Build the ThemeBuilder and plugin system foundation.

#### Tasks

1. **Create ThemeBuilder class** (`source/themes/builder/ThemeBuilder.ts`)
   - [ ] Implement plugin registration (`use()`)
   - [ ] Implement typed color management methods
   - [ ] Create `ColorRef` opaque type
   - [ ] Build typed `colors` registry that updates dynamically
   - [ ] Implement theme variant management with type safety
   - [ ] Add validation logic
   - [ ] Implement `build()` method with type serialization
   - [ ] Add comprehensive JSDoc
   - [ ] Write unit tests (50+ tests)

2. **Define TypeScript interfaces** (`source/themes/builder/types.ts`)
   - [ ] `ThemePlugin` interface
   - [ ] `ColorDefinition` interface
   - [ ] `SemanticTokens` interface
   - [ ] `ValidationResult` interfaces
   - [ ] Export all types from index

3. **Create plugin utilities** (`source/themes/builder/pluginUtils.ts`)
   - [ ] `createPlugin()` helper for type safety
   - [ ] `validatePlugin()` for metadata validation
   - [ ] `createColorRef()` factory for typed color refs
   - [ ] `resolveColorRef()` for parsing color references
   - [ ] `serializeColorRef()` to convert ColorRef to string
   - [ ] `checkPluginDependencies()` for dependency resolution
   - [ ] `generateColorTypes()` for TypeScript declaration generation

4. **Update defineTheme()** (`source/themes/builder/defineTheme.ts`)
   - [ ] Accept ThemeBuilder output
   - [ ] Maintain backward compatibility
   - [ ] Add deprecation warnings for old API

5. **Testing infrastructure**
   - [ ] Create test fixtures for plugins
   - [ ] Mock builder for testing
   - [ ] Integration tests for build process

**Deliverable:** Working ThemeBuilder that can accept plugins and generate theme config.

---

### Phase 2: Core Plugins (Week 1-2)

**Goal:** Migrate existing themes to plugin format.

#### Tasks

1. **Create Blueprint core plugin** (`source/themes/plugins/blueprint-core/index.ts`)
   - [ ] Extract current colors (gray, blue, red, green, yellow)
   - [ ] Define light theme variant
   - [ ] Define dark theme variant
   - [ ] Add plugin metadata
   - [ ] Include validation rules
   - [ ] Write tests
   - [ ] Add README

2. **Create Wada Sanzo plugin** (`source/themes/plugins/wada-sanzo/index.ts`)
   - [ ] Define Wada Sanzo color palette colors
   - [ ] Create accent colors (sulphurYellow, yellowOrange, vandarPoelBlue)
   - [ ] Define theme variants using these colors
   - [ ] Add historical context in metadata
   - [ ] Write tests

3. **Create shared primitives plugin** (`source/themes/plugins/primitives/index.ts`)
   - [ ] White, black constants
   - [ ] Common gray scales
   - [ ] Shared by all themes
   - [ ] Mark as core dependency

4. **Update theme.config.ts**
   - [ ] Import new plugins
   - [ ] Use ThemeBuilder
   - [ ] Remove old theme definitions
   - [ ] Add migration comments

**Deliverable:** All existing themes working as plugins.

---

### Phase 3: CLI Integration (Week 2)

**Goal:** Update CLI to work with plugin system.

#### Tasks

1. **Update `theme create` command** (`source/cli/commands/theme.ts`)
   - [ ] Generate plugin file instead of inline config
   - [ ] Scaffold plugin directory structure
   - [ ] Add plugin metadata prompts (author, description, etc.)
   - [ ] Generate plugin README
   - [ ] Add to theme.config.ts automatically

2. **Create plugin template** (`source/cli/templates/themePlugin.template`)
   - [ ] Full plugin scaffold with all fields
   - [ ] Example color definitions
   - [ ] Example theme variants
   - [ ] JSDoc comments explaining each part
   - [ ] Package.json if standalone

3. **Update `themeIntegration.ts`**
   - [ ] Remove old integration logic
   - [ ] Add plugin file generator
   - [ ] Add import statement generator
   - [ ] Handle plugin registration

4. **Add new CLI commands**
   - [ ] `bp theme plugin create` - Create new plugin
   - [ ] `bp theme plugin list` - List installed plugins
   - [ ] `bp theme plugin validate` - Validate a plugin
   - [ ] `bp theme plugin info <id>` - Show plugin metadata

5. **Update validation** (`source/cli/lib/validateComponent.ts`)
   - [ ] Validate plugin structure
   - [ ] Check for required fields
   - [ ] Validate color references
   - [ ] Check theme variant completeness

**Deliverable:** CLI fully supports plugin-based theme creation.

---

### Phase 4: Developer Experience (Week 3)

**Goal:** Make plugin authoring delightful.

#### Tasks

1. **Type generation**
   - [ ] Generate TypeScript declarations for registered colors
   - [ ] Generate ColorScale types with valid step numbers
   - [ ] Auto-complete for available colors via builder.colors
   - [ ] Validation in IDE for invalid color refs and steps
   - [ ] Type-safe plugin builder API
   - [ ] Export generated types for external use
   - [ ] Watch mode for type regeneration during development

2. **Documentation**
   - [ ] Plugin authoring guide
   - [ ] API reference for ThemeBuilder
   - [ ] Example plugins repository
   - [ ] Migration guide from old system
   - [ ] Best practices guide

3. **Tooling**
   - [ ] ESLint rules for plugin validation
   - [ ] Prettier config for theme files
   - [ ] VS Code snippets for common patterns
   - [ ] GitHub template repository

4. **Testing utilities**
   - [ ] `createMockBuilder()` helper
   - [ ] `testPlugin()` test harness
   - [ ] Snapshot testing for generated CSS
   - [ ] Visual regression testing setup

**Deliverable:** Comprehensive plugin authoring experience.

---

### Phase 5: Advanced Features (Week 3-4)

**Goal:** Add power features for complex use cases.

#### Tasks

1. **Plugin composition**
   - [ ] Extend existing plugins
   - [ ] Override specific tokens
   - [ ] Merge multiple plugins
   - [ ] Conflict resolution strategy

2. **Dependency management**
   - [ ] Check plugin dependencies
   - [ ] Load plugins in correct order
   - [ ] Handle optional dependencies
   - [ ] Warn about missing peer plugins

3. **Theme inheritance**
   - [ ] `extendThemeVariant()` implementation
   - [ ] Partial token overrides
   - [ ] Multiple inheritance layers
   - [ ] Inheritance chain visualization

4. **Runtime features**
   - [ ] Dynamic plugin loading
   - [ ] Hot module replacement for themes
   - [ ] Theme switching without reload
   - [ ] Preview mode for development

5. **Distribution**
   - [ ] Package plugins as npm modules
   - [ ] Plugin registry/marketplace concept
   - [ ] Plugin versioning system
   - [ ] Update/upgrade mechanisms

**Deliverable:** Production-ready plugin ecosystem.

---

### Phase 6: Migration & Cleanup (Week 4)

**Goal:** Complete migration and remove old code.

#### Tasks

1. **Migrate all themes**
   - [ ] Convert any remaining inline themes
   - [ ] Test all existing functionality
   - [ ] Update all references
   - [ ] Verify generated CSS unchanged

2. **Remove deprecated code**
   - [ ] Delete old theme integration code
   - [ ] Remove unused utilities
   - [ ] Clean up type definitions
   - [ ] Update imports throughout codebase

3. **Update documentation**
   - [ ] Main README
   - [ ] Architecture docs
   - [ ] API references
   - [ ] Example updates

4. **Performance optimization**
   - [ ] Benchmark build times
   - [ ] Optimize plugin loading
   - [ ] Cache generated scales
   - [ ] Lazy load plugins

**Deliverable:** Clean, optimized plugin system in production.

---

## File Structure

```
source/themes/
├── builder/
│   ├── ThemeBuilder.ts          # NEW: Main builder class
│   ├── pluginUtils.ts           # NEW: Plugin helpers
│   ├── types.ts                 # UPDATED: Add plugin types
│   ├── colorRefs.ts             # KEEP: Color reference utils
│   ├── colorUtils.ts            # KEEP: Color manipulation
│   ├── defineTheme.ts           # UPDATED: Accept builder output
│   ├── generateColorScale.ts    # KEEP: Scale generation
│   ├── generateCSS.ts           # KEEP: CSS output
│   ├── validateContrast.ts      # KEEP: Validation
│   └── index.ts                 # UPDATED: Export new APIs
├── plugins/
│   ├── blueprint-core/
│   │   ├── index.ts             # NEW: Core blueprint plugin
│   │   ├── README.md
│   │   └── package.json         # Optional for distribution
│   ├── primitives/
│   │   ├── index.ts             # NEW: Shared primitives
│   │   └── README.md
│   ├── wada-sanzo/
│   │   ├── index.ts             # NEW: Wada Sanzo colors
│   │   └── README.md
│   └── index.ts                 # NEW: Export all core plugins
├── config/
│   └── theme.config.ts          # UPDATED: Use ThemeBuilder
└── generated/                   # KEEP: Generated CSS output
    ├── primitives.css
    ├── light.css
    ├── dark.css
    └── index.css

source/cli/
├── templates/
│   └── themePlugin.template     # NEW: Plugin scaffold
├── lib/
│   └── pluginGenerator.ts       # NEW: Generate plugin files
└── commands/
    └── theme.ts                 # UPDATED: Plugin-aware commands
```

## API Examples

### Creating a Simple Plugin

```typescript
import { createPlugin } from '@blueprint/themes';

export default createPlugin({
  id: 'ocean',
  version: '1.0.0',
  name: 'Ocean Theme',
  author: 'Your Name',

  register(builder) {
    // Add a custom color - automatically creates all step properties
    builder.addColor('oceanBlue', {
      source: { l: 0.5, c: 0.15, h: 220 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    });

    // Create a light variant with typed color refs
    // Access colors via builder.colors with dot notation
    builder.addThemeVariant('ocean', {
      background: builder.colors.gray50,
      surface: builder.colors.gray100,
      surfaceElevated: builder.colors.white,
      surfaceSubdued: builder.colors.gray200,

      text: builder.colors.gray900,
      textMuted: builder.colors.gray600,
      textInverse: builder.colors.white,

      // TypeScript autocomplete works here!
      primary: builder.colors.oceanBlue700,
      primaryHover: builder.colors.oceanBlue800,
      primaryActive: builder.colors.oceanBlue900,

      success: builder.colors.green600,
      warning: builder.colors.yellow600,
      error: builder.colors.red600,
      info: builder.colors.oceanBlue500,

      border: builder.colors.gray200,
      borderStrong: builder.colors.gray300,
      focus: builder.colors.oceanBlue500,
    });
  },
});
```

### Extending an Existing Theme

```typescript
import { createPlugin } from '@blueprint/themes';

export default createPlugin({
  id: 'ocean-dark',
  version: '1.0.0',
  dependencies: [{ id: 'ocean' }],

  register(builder) {
    // Extend the ocean theme for dark mode with typed refs
    builder.extendThemeVariant('ocean', 'ocean-dark', {
      background: builder.colors.gray950,
      surface: builder.colors.gray900,
      text: builder.colors.gray50,
      primary: builder.colors.oceanBlue400, // Lighter for dark background - type-checked!
    });
  },
});
```

### Using Plugins in Config

```typescript
// source/themes/config/theme.config.ts
import { ThemeBuilder } from '../builder/ThemeBuilder.js';
import blueprintCore from '../plugins/blueprint-core/index.js';
import primitives from '../plugins/primitives/index.js';
import oceanTheme from '../plugins/ocean/index.js';

const builder = new ThemeBuilder()
  .use(primitives) // Load shared primitives first
  .use(blueprintCore) // Load core blueprint theme
  .use(oceanTheme); // Load ocean theme

// Validate before building
const validation = builder.validate();
if (!validation.valid) {
  console.error('Theme validation failed:', validation.errors);
  process.exit(1);
}

// Build and export
export const blueprintTheme = builder.build();
```

### CLI Usage

```bash
# Create a new theme plugin
bp theme plugin create

# Create with options
bp theme plugin create --id ocean --color "#0ea5e9" --author "John Doe"

# List all plugins
bp theme plugin list

# Validate a plugin
bp theme plugin validate ocean

# Show plugin info
bp theme plugin info ocean

# Generate CSS from all plugins
bp theme generate
```

## Decision Points

### 1. Color Reference Resolution

**Question:** How should color references be resolved?

**Decision:** Use typed ColorRef objects with dot notation (matching current API).

```typescript
// Typed color references via dot notation
background: builder.colors.gray50; // Type-safe!
primary: builder.colors.oceanBlue700; // Autocomplete works
textColor: builder.colors.gray1000; // ❌ TypeScript error - invalid step

// ColorRef is an opaque type:
type ColorRef = {
  readonly __colorRef: unique symbol;
  readonly colorName: string;
  readonly step: number;
};

// Builder.colors is dynamically typed based on registered colors:
// { gray50: ColorRef, gray100: ColorRef, ..., oceanBlue700: ColorRef, ... }

// Serializes to string for CSS generation:
// builder.colors.gray50 → "gray.50"
// builder.colors.oceanBlue700 → "oceanBlue.700"
```

**Rationale:**

- **Matches existing API** - Same pattern as current `createColorRefs()`
- **Full type safety** - Invalid colors/steps caught at compile time
- **IDE autocomplete** - All valid color+step combos
- **Prevents typos** - Can't reference non-existent colors
- **Clean API** - Natural dot notation
- **Serializable** - Converts to strings for CSS generation
- **No magic strings** - All references are type-checked

### 2. Plugin Load Order

**Question:** In what order should plugins be loaded?

**Decision:** Dependency-based topological sort.

1. Plugins with no dependencies first
2. Plugins with dependencies after their deps
3. Error if circular dependencies detected

**Implementation:**

```typescript
class ThemeBuilder {
  private sortPluginsByDependencies(plugins: ThemePlugin[]): ThemePlugin[] {
    // Topological sort implementation
  }
}
```

### 3. Conflict Resolution

**Question:** What happens when two plugins define the same color?

**Decision:** Last plugin wins, with warning.

```typescript
builder.use(plugin1); // Defines 'blue'
builder.use(plugin2); // Also defines 'blue' - overwrites with warning
```

**Options for users:**

- Use namespaced colors: `plugin1_blue`, `plugin2_blue`
- Check conflicts before `build()`
- Explicit conflict resolution API

### 4. Type Safety

**Question:** How to maintain type safety with dynamic plugins?

**Decision:** Generate types from builder state.

```typescript
// Auto-generated from plugins
type AvailableColors = 'gray' | 'blue' | 'oceanBlue' | ...;
type ColorRef = `${AvailableColors}.${number}`;

// Builder methods use generated types
builder.addThemeVariant('name', {
  background: ColorRef, // Type-safe!
});
```

### 5. Distribution Model

**Question:** How should plugins be distributed?

**Decision:** Support multiple models:

1. **Local files** - In project's `source/themes/plugins/`
2. **npm packages** - Published to npm registry
3. **Git repos** - Loaded from git URLs
4. **URLs** - Loaded from remote URLs (future)

## Testing Strategy

### Unit Tests

```typescript
describe('ThemeBuilder', () => {
  it('should register plugins', () => {
    const builder = new ThemeBuilder();
    builder.use(mockPlugin);
    expect(builder.getPlugins()).toHaveLength(1);
  });

  it('should add colors from plugins', () => {
    const builder = new ThemeBuilder();
    builder.use({
      id: 'test',
      version: '1.0.0',
      register: (b) => b.addColor('testBlue', {...})
    });
    expect(builder.hasColor('testBlue')).toBe(true);
  });

  it('should resolve color references', () => {
    // Test color ref resolution
  });

  it('should validate theme completeness', () => {
    // Test validation
  });
});
```

### Integration Tests

```typescript
describe('Plugin System Integration', () => {
  it('should build complete theme from plugins', () => {
    const builder = new ThemeBuilder().use(primitives).use(blueprintCore);

    const theme = builder.build();

    expect(theme.colors).toBeDefined();
    expect(theme.themes.light).toBeDefined();
    expect(theme.themes.dark).toBeDefined();
  });

  it('should handle plugin dependencies', () => {
    // Test dependency resolution
  });

  it('should generate valid CSS', () => {
    // Test CSS generation
  });
});
```

### E2E Tests

```bash
# Test CLI workflow
bp theme plugin create --id test-theme --color "#ff0000"
bp theme generate
bp theme validate

# Verify generated files
test -f source/themes/plugins/test-theme/index.ts
test -f source/themes/generated/test-theme.css
```

## Migration Path

### For Existing Code

1. **Phase 1:** Add ThemeBuilder, keep old API working

   ```typescript
   // Old API still works
   export const blueprintTheme = defineTheme({...});

   // New API available
   const builder = new ThemeBuilder().use(...);
   export const newTheme = builder.build();
   ```

2. **Phase 2:** Convert themes to plugins internally

   ```typescript
   // Internally uses plugins, external API unchanged
   export const blueprintTheme = defineTheme({
     ...convertToBuilder(oldConfig),
   });
   ```

3. **Phase 3:** Deprecate old API

   ```typescript
   // Add deprecation warnings
   export const blueprintTheme = defineTheme({...}); // [DEPRECATED]
   ```

4. **Phase 4:** Remove old API
   ```typescript
   // Only plugin API remains
   const builder = new ThemeBuilder().use(...);
   export const theme = builder.build();
   ```

### For Users Creating Themes

**Before:**

```typescript
// Edit theme.config.ts directly
export const blueprintTheme = defineTheme({
  colors: { oceanBlue: {...} },
  themes: { ocean: {...} }
});
```

**After:**

```bash
# Use CLI to create plugin
bp theme plugin create --id ocean

# Plugin file auto-generated
# Auto-registered in theme.config.ts
```

## Success Metrics

- [ ] All existing themes work as plugins
- [ ] Can create new theme in < 5 minutes
- [ ] Type safety maintained (0 `any` types)
- [ ] CLI generates valid plugins
- [ ] Generated CSS identical to before
- [ ] Build time < 2x current time
- [ ] 100% test coverage on ThemeBuilder
- [ ] Documentation covers all APIs
- [ ] Zero breaking changes for consumers

## Risks & Mitigations

| Risk                 | Impact | Mitigation                         |
| -------------------- | ------ | ---------------------------------- |
| Type safety loss     | High   | Generate types from builder state  |
| Increased complexity | Medium | Comprehensive docs & examples      |
| Build time increase  | Medium | Lazy loading, caching              |
| Breaking changes     | High   | Maintain old API during transition |
| Plugin conflicts     | Medium | Clear conflict resolution rules    |
| Dependency hell      | Medium | Strict dependency validation       |

## Timeline

**Week 1:** Core infrastructure + Core plugins  
**Week 2:** CLI integration  
**Week 3:** Developer experience + Advanced features  
**Week 4:** Migration & cleanup

**Total:** ~4 weeks for full implementation

## Next Steps

1. Review and approve this plan
2. Create GitHub issues for each phase
3. Set up project board
4. Begin Phase 1 implementation
5. Weekly check-ins on progress

---

**Approved by:** **\*\***\_**\*\***  
**Start Date:** **\*\***\_**\*\***  
**Target Completion:** **\*\***\_**\*\***
