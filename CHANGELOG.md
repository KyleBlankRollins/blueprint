# @krollins/blueprint

## 0.2.2

### Patch Changes

- ade8182: Fix icon lazy-loading in consumer bundler environments (Astro/Vite)

  The previous approach used `import.meta.url` + `new Function('url', 'return import(url)')` to compute icon module URLs at runtime. This broke in consumer builds because `import.meta.url` points to the consumer's bundled chunk location, not the original package layout.

  Replaced with a generated resolver module (`resolver.generated.ts`) containing static `import()` paths for all 430 icons. Static paths let the consumer's bundler (Vite, Rollup, esbuild) analyse and rewrite them at build time, so code-splitting works correctly in both dev and production.

- Updated dependencies [ade8182]
  - @krollins/blueprint@0.2.2

## 0.2.1

### Patch Changes

- bc44fe0: Add lazy-loading for `<bp-icon name="...">` consumer API

  When consumers use the `name` attribute (e.g., `<bp-icon name="check">`), the component now dynamically imports the icon module at runtime. This eliminates the need for consumers to pre-register icons or import a barrel file.
  - Icons loaded by name are cached in the registry so subsequent renders are instant
  - Internal components continue using the tree-shake-safe `.svg` property directly
  - Icon entry modules now include a `default` export alongside the named export

- Updated dependencies [bc44fe0]
  - @krollins/blueprint@0.2.1

## 0.2.0

### Minor Changes

- Add `svg` property to bp-icon for direct SVG string rendering

  The `bp-icon` component now accepts a `svg` property containing a raw SVG string. When set, it takes priority over the `name` property (registry lookup) and the default slot. This enables internal components to pass icon data as value bindings that survive bundler tree-shaking.

  Internal components (accordion, alert, avatar, drawer, notification, popover, table, tag, tree) now import icon SVG data as named value exports instead of relying on side-effect-only registry calls. This fixes icons not rendering when the library is consumed by Astro/Vite sites, because Rollup was stripping the side-effect-only imports during the library build.

  Icon entry modules now export their SVG string (`export const searchSvg = '...'`) instead of calling `registerIcon()` as a side effect. The `all.ts` barrel still registers all icons into the runtime registry for Storybook and consumer use with `name=`.

### Patch Changes

- Updated dependencies
  - @krollins/blueprint@0.2.0

## 0.1.16

### Patch Changes

- 55350af: Refactor bp-icon to use a shared runtime registry with tree-shakeable per-icon entry modules

  Icons are no longer bundled in a single generated registry file. Each icon is now a separate entry module (`source/components/icon/icons/entries/*.ts`) that self-registers via `registerIcon()` at import time. This enables tree-shaking — consumers can import only the icons they need instead of the entire icon set.

  Breaking changes:
  - `getIcon()` from `icons/registry.generated.js` is removed. Use `getIconSvg()` from `icon-registry.js` instead.
  - The `IconName` type is now exported from `icon-name.generated.js` and re-exported from the package index.
