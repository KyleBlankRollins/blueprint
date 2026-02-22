# @krollins/blueprint

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
