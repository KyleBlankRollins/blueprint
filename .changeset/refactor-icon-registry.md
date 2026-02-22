---
'@krollins/blueprint': patch
---

Refactor bp-icon to use a shared runtime registry with tree-shakeable per-icon entry modules

Icons are no longer bundled in a single generated registry file. Each icon is now a separate entry module (`source/components/icon/icons/entries/*.ts`) that self-registers via `registerIcon()` at import time. This enables tree-shaking — consumers can import only the icons they need instead of the entire icon set.

Breaking changes:

- `getIcon()` from `icons/registry.generated.js` is removed. Use `getIconSvg()` from `icon-registry.js` instead.
- The `IconName` type is now exported from `icon-name.generated.js` and re-exported from the package index.
