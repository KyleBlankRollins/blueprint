---
'@krollins/blueprint': minor
---

Add lazy-loading for `<bp-icon name="...">` consumer API

When consumers use the `name` attribute (e.g., `<bp-icon name="check">`), the component now dynamically imports the icon module at runtime. This eliminates the need for consumers to pre-register icons or import a barrel file.

- Icons loaded by name are cached in the registry so subsequent renders are instant
- Internal components continue using the tree-shake-safe `.svg` property directly
- Icon entry modules now include a `default` export alongside the named export
