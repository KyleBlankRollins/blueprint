# Theme Base Class Refactor

**Status:** Design Phase  
**Created:** 2025-12-31  
**Author:** Architecture Review

## Problem Statement

The current theme system has an architectural flaw where non-color design tokens (spacing, typography, motion, etc.) are hardcoded in `theme.config.ts` and applied globally to ALL themes:

```typescript
// Current problem in theme.config.ts
export const blueprintTheme = {
  ...themeConfig, // Colors from plugins

  // These get applied to EVERY theme (Wada Sanzo, Forest, Benzol, etc.)
  spacing: { base: 4, scale: [...] },      // ❌ Hardcoded opinion
  typography: { fontFamilies: {...} },     // ❌ Not customizable per theme
  motion: { durations: {...} },            // ❌ Applied universally
  radius: { sm: 2, md: 4, ... },          // ❌ Can't vary by theme
  focus: { width: 2, offset: 2 },         // ❌ Same for all themes
  opacity: { disabled: 0.5, ... },        // ❌ Global override
  breakpoints: { sm: '640px', ... },      // ❌ Not theme-specific

  accessibility: {...},  // ✅ Should be global
  zIndex: {...},        // ✅ Should be global
}
```

**Impact:**

- Wada Sanzo theme uses Blueprint's spacing/typography (wrong)
- Forest theme can't define its own motion system
- Benzol theme inherits Blueprint's design language
- No way to create themes with different design philosophies

## Proposed Solution: Two-Layer Architecture

Introduce `ThemeBase` abstract class that separates concerns into two layers:

### Layer 1: Default Design Tokens

**Overrideable, provide sensible defaults**

- `spacing` - Scale and semantic values
- `typography` - Font families, sizes, weights, line heights
- `motion` - Animation durations, easings, transitions
- `opacity` - Standard opacity values
- `breakpoints` - Responsive breakpoints
- `focus` - Focus indicator styling
- `radius` - Border radius scale
- `accessibility` - WCAG rules, contrast requirements
- `zIndex` - Stacking order for UI layers

Themes can **selectively override** any Layer 1 token while inheriting the rest. This provides sensible defaults while allowing complete customization.

### Layer 2: Theme-Specific

**Required, unique per theme**

- Colors (via `builder.addColor()`)
- Theme variants (via `builder.addThemeVariant()`)
- Plugin metadata (`id`, `version`, `name`, `description`)

Each theme **must** implement these.

## Architecture Design

### ThemeBase Abstract Class

```typescript
/**
 * Base class for all Blueprint themes
 *
 * Provides:
 * - Layer 1: Overrideable design token defaults
 * - Layer 2: Abstract methods for theme-specific implementation
 */
export abstract class ThemeBase implements ThemePlugin {
  // ============================================
  // Layer 1: Default Design Tokens (protected)
  // All tokens can be overridden by child themes
  // ============================================

  /** Spacing scale - base unit in px */
  protected spacing = {
    base: 4, // Base unit in px
    scale: [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24],
    semantic: {
      xs: 1,
      sm: 2,
      md: 4,
      lg: 6,
      xl: 8,
    },
  };

  /** Typography tokens */
  protected typography = {
    fontFamilies: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Courier New", monospace',
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  };

  /** Motion/animation tokens */
  protected motion = {
    durations: {
      instant: 0,
      fast: 150, // Hover states, tooltips
      normal: 300, // Modals, dropdowns
      slow: 500, // Page transitions, complex animations
    },
    easings: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    transitions: {
      fast: '150ms cubic-bezier(0, 0, 0.2, 1)',
      base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  };

  /** Border radius scale */
  protected radius = {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
  };

  /** Opacity scale */
  protected opacity = {
    disabled: 0.5,
    hover: 0.8,
    overlay: 0.6,
    subtle: 0.4,
  };

  /** Responsive breakpoints */
  protected breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  };

  /** Focus indicator styling */
  protected focus = {
    width: 2,
    offset: 2,
    style: 'solid' as const,
  };

  /** Accessibility validation rules */
  protected accessibility = {
    enforceWCAG: false,
    minimumContrast: {
      text: 4.5, // WCAG AA for normal text
      textLarge: 3.0, // WCAG AA for large text (18px+)
      ui: 3.0, // WCAG AA for UI components
      interactive: 3.0, // For hover/active states
      focus: 3.0, // Focus indicators
    },
    colorBlindSafe: true,
    minHueDifference: 60, // Minimum degrees between semantic colors
    highContrast: true, // Support prefers-contrast: more
  };

  /** Z-index stacking order */
  protected zIndex = {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    overlay: 1030,
    modal: 1040,
    popover: 1060,
    tooltip: 1080,
  };

  // ============================================
  // Layer 2: Theme-Specific (abstract)
  // Must be implemented by child themes
  // ============================================

  abstract id: string;
  abstract version: string;
  abstract name: string;
  abstract description: string;
  abstract author: string;
  abstract license: string;
  abstract tags: string[];
  abstract homepage?: string;
  abstract dependencies?: Array<{ id: string; version?: string }>;

  /**
   * Register theme colors and variants
   * Called by ThemeBuilder during theme composition
   */
  abstract register(builder: ThemeBuilder): void;

  /**
   * Optional validation logic for theme configuration
   * Returns array of validation errors
   */
  validate?(config: ThemeConfig): ValidationError[];

  // ============================================
  // Public API
  // ============================================

  /**
   * Get all design tokens for this theme
   * Returns Layer 1 (defaults/overrides)
   */
  getDesignTokens() {
    return {
      spacing: this.spacing,
      typography: this.typography,
      motion: this.motion,
      radius: this.radius,
      opacity: this.opacity,
      breakpoints: this.breakpoints,
      focus: this.focus,
      accessibility: this.accessibility,
      zIndex: this.zIndex,
    };
  }
}
```

### Usage Examples

#### Example 1: Blueprint Core (Uses Defaults)

```typescript
import { ThemeBase } from '../../builder/ThemeBase.js';
import type { ThemeBuilder } from '../../builder/ThemeBuilder.js';

export class BlueprintCoreTheme extends ThemeBase {
  // Layer 2: Required metadata
  id = 'blueprint-core';
  version = '1.0.0';
  name = 'Blueprint Core Theme';
  description = 'Default Blueprint theme with light and dark variants';
  author = 'Blueprint Team';
  license = 'MIT';
  tags = ['core', 'theme', 'light', 'dark'];
  homepage = 'https://github.com/blueprint/blueprint';
  dependencies = [{ id: 'primitives' }];

  // Layer 2: Use all defaults (no overrides needed)

  // Layer 3: Define colors and variants
  register(builder: ThemeBuilder) {
    builder.addColor('gray', {
      source: { l: 0.55, c: 0.02, h: 240 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Gray',
        description: 'Neutral gray scale',
        tags: ['neutral', 'semantic'],
      },
    });

    builder.addColor('blue', {...});
    builder.addColor('green', {...});
    builder.addColor('red', {...});
    builder.addColor('yellow', {...});

    builder.addThemeVariant('light', {...});
    builder.addThemeVariant('dark', {...});
  }

  validate(config) {
    const errors = [];
    const requiredColors = ['gray', 'blue', 'green', 'red', 'yellow'];
    for (const colorName of requiredColors) {
      if (!config.colors[colorName]) {
        errors.push({
          plugin: 'blueprint-core',
          type: 'missing_color' as const,
          message: `Required color '${colorName}' is missing`,
          context: { colorName },
        });
      }1
    }
    return errors;
  }
}

export const blueprintCoreTheme = new BlueprintCoreTheme();
export default blueprintCoreTheme;
```

#### Example 2: Wada Sanzo (Overrides Spacing)

```typescript
import { Th1meBase } from '../../builder/ThemeBase.js';
import type { ThemeBuilder } from '../../builder/ThemeBuilder.js';

export class WadaSanzoTheme extends ThemeBase {
  id = 'wada-sanzo';
  version = '1.0.0';
  name = 'Wada Sanzo Collection';
  description = 'Japanese traditional color palette';
  author = 'Blueprint Team';
  license = 'MIT';
  tags = ['japanese', 'traditional', 'artistic'];
  dependencies = [{ id: 'primitives' }];

  // Layer 2: Override spacing for tighter, more refined feel
  protected spacing = {
    base: 3, // Smaller base unit
    scale: [0, 0.33, 0.67, 1, 1.33, 1.67, 2, 2.67, 3.33, 4, 5.33, 6.67, 8, 10.67, 13.33, 16],
    semantic: {
      xs: 0.67,
      sm: 1.33,
      md: 2.67,
      lg: 4,
      xl: 5.33,
    },
  };

  // Layer 2: Override radius for softer edges
  protected radius = {
    none: 0,
    sm: 3,
    md: 6,
    lg: 12,
    xl: 18,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  };

  register(builder: ThemeBuilder) {
    builder.addColor('asagiiro', {...}); // 浅葱色
    builder.addColor('uguisuiro', {...}); // 鶯色
    builder.addColor('kinariiro', {...}); // 生成り色
    // ... more Japanese colors

    builder.addThemeVariant('wada-light', {...});
    builder.addThemeVariant('wada-dark', {...});
  }
}

export const wadaSanzoTheme = new WadaSanzoTheme();
export default wadaSanzoTheme;
```

#### Example 3: Forest (Overrides Motion & Typography)

```typescript
import { ThemeBase } from '../../builder/ThemeBase.js';
import type { ThemeBuilder } from '../../builder/ThemeBuilder.js';

export class ForestTheme extends ThemeBase {
  id = 'forest';
  version = '1.0.0';
  name = 'Forest Theme';
  description = 'Organic, natural color palette inspired by forests';
  author = 'Blueprint Team';
  license = 'MIT';
  tags = ['nature', 'organic', 'calm'];
  dependencies = [{ id: 'primitives' }];

  // Layer 1: Slower, more organic motion
  protected motion = {
    durations: {
      instant: 0,
      fast: 200,   // Slightly slower
      normal: 400, // More deliberate
      slow: 600,   // Gentle transitions
    },
    easings: {
      linear: 'linear',
      in: 'cubic-bezier(0.32, 0, 0.67, 0)',    // Softer ease-in
      out: 'cubic-bezier(0.33, 1, 0.68, 1)',   // Softer ease-out
      inOut: 'cubic-bezier(0.65, 0, 0.35, 1)', // Smooth S-curve
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    transitions: {
      fast: '200ms cubic-bezier(0.33, 1, 0.68, 1)',
      base: '400ms cubic-bezier(0.65, 0, 0.35, 1)',
      slow: '600ms cubic-bezier(0.65, 0, 0.35, 1)',
      bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  };

  // Layer 1: Different typography for organic feel
  protected typography = {
    ...this.typography, // Start with defaults
    fontFamilies: {
      sans: 'Georgia, "Times New Roman", serif', // Serif for organic feel
      mono: '"Courier New", monospace',
    },
    lineHeights: {
      none: 1,
      tight: 1.3,
      snug: 1.45,
      normal: 1.6,  // More breathing room
      relaxed: 1.75,
      loose: 2.2,
    },
  };

  register(builder: ThemeBuilder) {
    builder.addColor('moss', {...});
    builder.addColor('bark', {...});
    builder.addColor('leaf', {...});
    builder.addColor('stone', {...});

    builder.addThemeVariant('forest-light', {...});
    builder.addThemeVariant('forest-dark', {...});
  }
}

export const forestTheme = new ForestTheme();
export default forestTheme;
```

## Implementation Plan

### Phase 1: Create ThemeBase Class

**Files to create:**

- `source/themes/builder/ThemeBase.ts` - Abstract base class
- `source/themes/builder/__tests__/ThemeBase.test.ts` - Unit tests

**Changes needed:**

- Export `ThemeBase` from `source/themes/builder/index.ts`
- Update `ThemePlugin` type to support class-based themes

### Phase 2: Refactor Existing Themes

**Files to modify:**

- `source/themes/plugins/blueprint-core/index.ts` - Convert to class extending ThemeBase
- `source/themes/plugins/wada-sanzo/index.ts` - Convert to class extending ThemeBase
- `source/themes/plugins/primitives/index.ts` - Keep as-is (special case, doesn't need design tokens)

**Pattern for each conversion:**

```typescript
// Before (object-based plugin)
export const myThemePlugin: ThemePlugin = {
  id: 'my-theme',
  register(builder) {...}
}

// After (class-based plugin)
export class MyTheme extends ThemeBase {
  id = 'my-theme';
  register(builder) {...}
}
export const myTheme = new MyTheme();
export default myTheme;
```

### Phase 3: Update ThemeBuilder

**Files to modify:**

- `source/themes/builder/ThemeBuilder.ts`
  - Implement **deep merge** for design tokens (based on Decision #2)
  - Add `getGlobalDesignTokens()` method to collect tokens from all plugins
  - Merge design tokens from all loaded themes (later plugins override earlier)
  - Update `build()` to include merged design tokens in output
  - Add method for runtime theme switching (based on Decision #1)

**Example builder changes:**

```typescript
class ThemeBuilder {
  use(plugin: ThemePlugin | ThemeBase) {
    this.plugins.push(plugin);

    // If plugin extends ThemeBase, collect its design tokens
    if (plugin instanceof ThemeBase) {
      const tokens = plugin.getDesignTokens();
      this.designTokens = deepMerge(this.designTokens, tokens);
    }

    plugin.register(this);
    return this;
  }

  build() {
    return {
      colors: this.colors,
      themes: this.themes,
      designTokens: this.designTokens, // ← Now includes merged tokens
    };
  }
}
```

### Phase 4: Update theme.config.ts

**File to modify:**

- `source/themes/config/theme.config.ts`

**Changes:**

```typescript
// Before
const builder = new ThemeBuilder()
  .use(primitivesPlugin)
  .use(blueprintCorePlugin)
  .use(wadaSanzoPlugin)
  .use(forestPlugin)
  .use(benzolPlugin);

const themeConfig = builder.build();

export const blueprintTheme = {
  ...themeConfig,
  spacing: {...}, // ❌ Remove hardcoded tokens
  typography: {...}, // ❌ Remove
  // etc.
};

// After
const builder = new ThemeBuilder()
  .use(primitivesPlugin)
  .use(blueprintCoreTheme) // ← Now class instances
  .use(wadaSanzoTheme)
  .use(forestTheme)
  .use(benzolTheme);

// Build includes merged design tokens from all themes
export const blueprintTheme = builder.build();
```

### Phase 5: Update Consumers

**Files to verify/update:**

- `source/cli/commands/generate-theme.ts` - Should work without changes (uses `blueprintTheme` export)
- `source/cli/commands/theme.ts` - Should work without changes
- Any other files importing `blueprintTheme`

### Phase 6: Documentation & Tests

**Tasks:**

- Update README files for each plugin
- Add JSDoc examples showing how to extend ThemeBase
- Create integration tests for multi-theme loading
- Create optional validation utilities (based on Decision #5):
  - `validateThemeAccessibility(theme)` - Check WCAG contrast ratios
  - `validateThemeTokens(theme)` - Check for missing/invalid tokens
  - Add examples of using validation in theme `validate()` methods

## Benefits

### For Theme Authors

✅ **Clear contract:** ThemeBase shows exactly what needs to be implemented  
✅ **Selective overrides:** Only override what you need, inherit sensible defaults  
✅ **Type safety:** Abstract properties enforce required metadata  
✅ **Consistency:** Global constants ensure accessibility/zIndex alignment

### For Component Authors

✅ **Predictable tokens:** Every theme has spacing, typography, etc.  
✅ **Better DX:** IntelliSense for design tokens regardless of theme  
✅ **Fewer bugs:** Type-safe token access prevents runtime errors

### For System Maintainers

✅ **Centralized defaults:** One place to update default design tokens  
✅ **Easier refactors:** Change ThemeBase, all themes get the update  
✅ **Better testing:** Can test base class behavior in isolation

## Breaking Changes

- We DO NOT care about breaking changes

## Backward Compatibility

- DO NOT implement backward compatibility. Remove old code.

## Design Decisions

### 1. Runtime Theme Switching

**Decision:** Support runtime theme switching with different design tokens

**Rationale:** Users should be able to switch themes dynamically (e.g., light/dark mode toggle, user preferences). This requires regenerating CSS variables when the active theme changes.

**Implementation Impact:**

- ThemeBuilder must expose a method to rebuild CSS from a different theme
- CSS custom properties will be updated via JavaScript when theme changes
- Components must be designed to react to CSS variable changes

2. **How should design token merging work when multiple themes are loaded?**

   **Context:** When you do `.use(blueprintCoreTheme).use(wadaSanzoTheme)`, how should Wada Sanzo's tokens combine with Blueprint Core's?

   **Option A: Deep Merge** (can partially override nested objects)

   ```typescript
   // Blueprint Core defines:
   typography = {
     fontFamilies: { sans: 'Arial', mono: 'Monaco' },
     fontSizes: { sm: 14, md: 16, lg: 18 },
     lineHeights: { normal: 1.5, relaxed: 1.625 },
   };

   // Wada Sanzo only overrides fontFamilies.sans:
   typography = {
     fontFamilies: { sans: 'Georgia' }, // Only override this one property
   };

   // Result after deep merge:
   typography = {
     fontFamilies: { sans: 'Georgia', mono: 'Monaco' }, // ✅ Merged
     fontSizes: { sm: 14, md: 16, lg: 18 }, // ✅ Inherited
     lineHeights: { normal: 1.5, relaxed: 1.625 }, // ✅ Inherited
   };
   ```

   **Pros:** Surgical overrides, minimal code duplication  
   **Cons:** Can be confusing what's overridden vs inherited, hard to debug

   **Option B: Shallow Merge** (override entire token groups)

   ```typescript
   // Blueprint Core defines:
   typography = {
     fontFamilies: { sans: 'Arial', mono: 'Monaco' },
     fontSizes: { sm: 14, md: 16, lg: 18 },
     lineHeights: { normal: 1.5, relaxed: 1.625 },
   };

   // Wada Sanzo overrides fontFamilies:
   typography = {
     fontFamilies: { sans: 'Georgia' }, // Must provide complete fontFamilies object
   };

   // Result after shallow merge:
   typography = {
     fontFamilies: { sans: 'Georgia' }, // ⚠️ mono is LOST (not merged)
     fontSizes: { sm: 14, md: 16, lg: 18 },
     lineHeights: { normal: 1.5, relaxed: 1.625 },
   };
   ```

   **Pros:** Explicit and predictable, clear what you're replacing  
   **Cons:** Forces theme authors to duplicate entire token groups even for small changes

   **Option C: Explicit Merge Strategy** (per token type)

   ```typescript
   // In ThemeBase, define merge behavior per token:
   protected spacing = {
     base: 4,
     scale: [0, 0.5, 1, ...],
     __merge: 'shallow' // Override spacing entirely or not at all
   }

   protected typography = {
     fontFamilies: { sans: '...', mono: '...' },
     fontSizes: { ... },
     __merge: 'deep' // Can partially override nested properties
   }

   // Or even more granular:
   protected typography = {
     fontFamilies: {
       sans: '...',
       mono: '...',
       __merge: 'shallow' // Must override all font families together
     },
     fontSizes: {
       ...,
       __merge: 'deep' // Can add/override individual sizes
     }
   }
   ```

   **Pros:** Maximum control, each token declares its intent  
   **Cons:** Most complex, requires metadata, potentially overengineered

   **Decision:** Option A - Deep Merge

   **Rationale:** Theme authors should be able to make surgical overrides without duplicating entire token groups. For example, changing just `fontFamilies.sans` while inheriting everything else reduces boilerplate and makes theme code more maintainable. The tradeoff of slightly harder debugging is acceptable given the improved developer experience.

### 3. ThemeBase: Abstract vs Concrete

**Decision:** Keep ThemeBase as an abstract class

**Rationale:** Enforcing explicit theme definitions prevents incomplete or poorly-defined themes from entering production. The small amount of required boilerplate ensures every theme has proper metadata (id, name, version, etc.) and implements the `register()` method. For quick prototyping, developers can create minimal themes that extend ThemeBase without overriding design tokens.

**Implementation Impact:**

- All themes must extend ThemeBase and implement required abstract properties
- Cannot instantiate ThemeBase directly
- TypeScript will enforce complete theme definitions at compile time

### 4. Theme Composition Pattern

**Decision:** Only allow `extends ThemeBase`, not extending other themes

**Rationale:** Keeping a flat inheritance hierarchy (all themes extend ThemeBase) makes the system more predictable and maintainable. Theme composition should happen via the ThemeBuilder's `.use()` chaining, not through class inheritance. This prevents deep inheritance chains and keeps each theme's behavior isolated and understandable.

**Implementation Impact:**

- All themes extend ThemeBase directly: `class MyTheme extends ThemeBase`
- Themes cannot extend other themes: `class MyTheme extends WadaSanzoTheme` is not allowed
- Theme composition happens via builder: `.use(wadaSanzoTheme).use(forestTheme)`
- Design tokens merge via ThemeBuilder, not class inheritance

### 5. Design Token Validation

**Decision:** Do not enforce validation, but provide opt-in validation tools

**Rationale:** Theme authors should have complete freedom to define their design system, including the ability to lower accessibility standards if needed for specific use cases. However, we should provide validation utilities they can use during development to check their tokens against WCAG standards or other best practices.

**Implementation Impact:**

- No automatic warnings when accessibility.minimumContrast is lowered
- Create validation utilities (e.g., `validateThemeAccessibility(theme)`) that themes can call in their `validate()` method
- CLI command `bp theme validate` runs optional checks
- Documentation should guide theme authors on when to use validation

## Success Criteria

- [ ] All existing themes converted to ThemeBase pattern
- [ ] All tests passing
- [ ] No hardcoded design tokens in theme.config.ts
- [ ] Each theme can define its own spacing/typography/motion
- [ ] Type checking passes with strict mode
- [ ] CLI commands work without modification

## References

- Current theme system: `source/themes/plugins/blueprint-core/index.ts`
- Plugin interface: `source/themes/core/types.ts`
- ThemeBuilder: `source/themes/builder/ThemeBuilder.ts`
- Theme config: `source/themes/config/theme.config.ts`
