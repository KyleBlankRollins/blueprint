# Icon Entries

This directory contains auto-generated per-icon entry modules and supporting files for the Blueprint Icon component.

## Contents

- **`entries/`** — 430 per-icon modules, each exporting a raw SVG string (named + default export)
- **`all.ts`** — Barrel that imports every entry and registers them in the runtime cache (Storybook / dev tools only)
- **`icon-name.generated.ts`** — TypeScript union type of all icon names for autocomplete

All files are auto-generated. To regenerate after adding or removing SVG source files:

```bash
npm run generate:icons
```

## How It Works

1. SVG files live in `source/assets/icons/` (430 icons from System UI Icons)
2. `generate-icon-entries.js` reads each SVG and writes a per-icon TypeScript module to `entries/`
3. Each entry exports the SVG string as both a named export and a default export

Example entry (`entries/check.ts`):

```typescript
export const checkSvg = '<svg ...>...</svg>';
export default checkSvg;
```

### Named exports

Used by internal Blueprint components that import SVG data directly and pass it to `<bp-icon>` via the `.svg` property. This pattern is tree-shake safe because the import is a concrete value binding.

### Default exports

Used by the `<bp-icon>` lazy loader. When a consumer writes `<bp-icon name="check">`, the component dynamically imports the entry module at runtime and reads `.default`.

## Adding New Icons

1. Add `.svg` files to `source/assets/icons/`
2. Run `npm run generate:icons`
3. New entry modules, the `IconName` type, and `all.ts` barrel are regenerated automatically
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
