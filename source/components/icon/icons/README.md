# Icon Registry

This directory contains the auto-generated icon registry for the Blueprint Icon component.

## Overview

The icon registry uses **Vite's raw import feature** to dynamically load all SVG files from `source/assets/icons/`. This approach:

- **Eliminates manual work** - No need to create TypeScript files for each icon
- **Tree-shakeable** - Only bundle icons you actually use in your app
- **Type-safe** - Full TypeScript autocomplete for all 430+ icon names
- **Easy to extend** - Just add SVG files and regenerate

## How It Works

1. **SVG files** are stored in `source/assets/icons/` (430+ icons from System UI Icons)
2. **Generator script** (`generate-icon-registry.js`) scans the directory and creates `registry.generated.ts`
3. **Vite's `?raw` import** loads SVG files as strings at build time
4. **Registry exports** `getIcon(name)` function and `IconName` type for the component

## Files

- **`registry.generated.ts`** - Auto-generated icon registry (DO NOT EDIT MANUALLY)
- **`README.md`** - This file

## Adding New Icons

To add icons to the registry:

1. Add `.svg` files to `source/assets/icons/`
2. Run the generator:
   ```bash
   node source/components/icon/generate-icon-registry.js
   ```
3. The registry will be automatically regenerated with all icons

## Generator Features

The generator automatically:

- Imports all `.svg` files using Vite's `?raw` import
- Converts filenames to kebab-case icon names (e.g., `arrow_down.svg` → `arrow-down`)
- Handles JavaScript reserved keywords (e.g., `import.svg` → `_import`)
- Generates TypeScript union type for autocomplete (`IconName`)
- Creates lookup function (`getIcon(name)`)

## Example Usage

```typescript
import { getIcon, type IconName } from './icons/registry.generated.js';

// Type-safe icon name
const iconName: IconName = 'arrow-down';

// Get icon template
const iconTemplate = getIcon('arrow-down');
// Returns: html`<svg>...</svg>` or null if not found
```

## TypeScript Autocomplete

The `IconName` type provides autocomplete for all 430+ icon names:

```typescript
// Your IDE will suggest all available icons
<bp-icon name="arrow-down"></bp-icon>
```

## Why Use `?raw` Imports?

Vite's `?raw` import loads file contents as strings at build time:

```typescript
import arrowDown from '../../../assets/icons/arrow_down.svg?raw';
// arrowDown = '<svg>...</svg>' (string)
```

Benefits:

- **No runtime file loading** - SVG content is bundled
- **Tree-shaking works** - Unused icons are not bundled
- **Fast** - No HTTP requests or file system reads at runtime
- **Type-safe** - Import errors caught at build time

## Why Auto-Generate?

Manual approach (what we replaced):

```typescript
// 430 files like this... 😱
import { html } from 'lit';
export const arrowDown = html`<svg>...</svg>`;
```

Auto-generated approach:

```typescript
// Just add SVG file and run generator ✨
// generator creates all imports automatically
```

Benefits:

- **No duplication** - Single source of truth (SVG files)
- **Easy maintenance** - Add/remove/update icons by adding/removing files
- **Always in sync** - Generator ensures registry matches SVG files
- **Less code** - No manual TypeScript files for each icon
