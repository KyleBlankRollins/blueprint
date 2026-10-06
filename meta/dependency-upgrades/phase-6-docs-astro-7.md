# Phase 6 — Docs Site: Astro 5 → 7

`docs/` is a separate package (own lockfile; consumes the **published**
`@krollins/blueprint` from npm, so it does not depend on the root build).
Astro 5 → 7 is two majors; the intermediate (Astro 6: Vite 7, Zod 4, Node 22+)
matters only as context — we jump straight to 7.

## Version targets (docs/package.json)

| Package                     | From    | To      | Notes                                                                                                                                                     |
| --------------------------- | ------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `astro`                     | ^5.6.1  | ^7.3.6  | Node ≥22.12 ✓; Vite 8 internally                                                                                                                          |
| `@astrojs/mdx`              | ^4.3.13 | ^8.0.3  | peers: `astro ^7.2.10`, plus NEW required peers below                                                                                                     |
| `@astrojs/markdown-remark`  | —       | ^7.3.0  | new explicit peer of mdx 8                                                                                                                                |
| `@astrojs/markdown-satteri` | —       | ^0.4.0  | new explicit peer of mdx 8                                                                                                                                |
| `@astrojs/lit`              | ^4.3.0  | below   | **deprecated**, removed from Astro core in v5 cycle; unmaintained since 2025-09; no `astro` peer so npm stays silent; unverified on Astro 6/7 — see below |
| `@astrojs/check`            | ^0.9.2  | ^0.9.10 | peers `typescript ^5 \|\| ^6` → docs stays on TS 6                                                                                                        |
| `typescript`                | ^5.9.3  | ^6.0.x  | **not** 7 — `@astrojs/check` needs the classic API                                                                                                        |
| `sharp`                     | ^0.34.2 | ^0.35.5 | Node ≥20.9 ✓                                                                                                                                              |
| `lit`                       | ^3.3.0  | ^3.3.3  |                                                                                                                                                           |
| `@krollins/blueprint`       | ^0.2.2  | ^0.2.3  | latest published                                                                                                                                          |

## @astrojs/lit decision (resolve before gating)

`@astrojs/lit` 4.3.0 is the latest release, last published September 2025. It
was deprecated and removed from Astro core during the Astro 5 cycle (official
reason: ~1% usage, Lit SSR is a Labs project, maintenance cost). It declares
peers only on `lit` and `@webcomponents/template-shadowroot`, with no `astro`
peer range, so npm will not warn when it is installed next to Astro 7. The npm
registry does not set a `deprecated` flag on it, so `npm install` will be
silent. It has not been verified against the Astro 6/7 renderer/integration API.

The docs don't appear to need it: `docs/src/**` has no `client:*` directives, no
`import ... from 'lit'`, and no imports of `@astrojs/lit`. Every component page
(`docs/src/content/docs/components/*.mdx`) just side-effect-imports
`@krollins/blueprint/<component>`, which registers the `<bp-*>` custom elements
client-side. The only usage is `integrations: [lit(), mdx()]` in
`docs/astro.config.mjs`.

Decision procedure, in order:

1. **Preferred — remove it.** Drop `@astrojs/lit` from `docs/package.json` and
   `lit()` from `integrations` in `docs/astro.config.mjs`; then run
   `npx astro check`, `npm run build`, and the dev-server smoke test. If `<bp-*>`
   elements render and style correctly, keep it removed and record this in the
   Phase 7 report.
2. **If removal breaks SSR/hydration of any page** — try the community fork
   `@semantic-ui/astro-lit` as a drop-in (`npm install @semantic-ui/astro-lit`,
   `import lit from '@semantic-ui/astro-lit'`). It supports Astro 5+; verify its
   Astro 7 support in its README before installing.
3. **Last resort** — keep `@astrojs/lit@4.3.0` only if it demonstrably works
   under Astro 7, and record it as a leftover exception.

The `lit` dependency in `docs/package.json` may become unnecessary if the
integration is removed (blueprint already depends on lit); keep it unless the
build proves otherwise.

## Astro 6 breaking changes that apply

- **Zod 4 / content collections:** `docs/src/content.config.ts` imports
  `z` from `astro:content` (deprecated in 6, removed in 8). Migrate to
  `import { z } from 'astro/zod'`. Schema uses basic `z.string()`/`z.enum()` —
  Zod-4 compatible, but check error messages at build time.
- Content Layer API — already in use (`loader: glob(...)`, `await render(doc)`
  in `[...slug].astro`). ✓ No legacy-collections migration needed.
- Shiki 4 — `markdown.shikiConfig.theme: 'github-dark'` is core config; verify
  highlighting still renders.
- **TS 6 and the root JSX declarations:** `docs/tsconfig.json` includes
  `../source/jsx.d.ts`, so `astro check` on TS 6 also type-checks the root JSX
  declarations. TS 6 defaults (`rootDir` to the config directory, `types` to
  `[]`) are handled by Astro's `strict.json` preset — if `astro check` reports
  errors in `../source/jsx.d.ts`, they are TS 6 strictness changes, not Astro
  ones.

## Astro 7 breaking changes that apply

- **Rust compiler is the only compiler** and is strict: unclosed tags now error;
  invalid HTML nesting is passed through (not auto-corrected). Audit
  `docs/src/**/*.astro` and MDX-embedded markup if the build errors — fix
  templates, don't downgrade.
- **Sätteri is the default Markdown/MDX pipeline** (replaces unified/remark by
  default; `@astrojs/markdown-remark` no longer installed by default — hence the
  new explicit peers for mdx 8). No custom remark/rehype plugins in config. ✓
- **`compressHTML` default changed to `'jsx'`** — whitespace around inline
  elements collapses. Visual check of rendered pages (especially
  `ComponentPreview` blocks); set `compressHTML: true` in `astro.config.mjs` if
  the old behavior is preferred.
- **Reserved `src/fetch.ts`** (advanced routing) — confirm no such file exists
  in `docs/src/`. ✓ (checked: none)
- Vite 8 inside Astro — the `vite.optimizeDeps.include` /
  `vite.ssr.noExternal` passthrough for `@krollins/blueprint` in
  `astro.config.mjs` should carry over; watch for deprecation warnings.
- Experimental-flag removals (`rustCompiler`, `queuedRendering`, `cache`,
  `advancedRouting`, `logger`) — none are set in `astro.config.mjs`. ✓

## Steps

```bash
cd docs
npm install astro@^7.3.6 @astrojs/mdx@^8.0.3 @astrojs/markdown-remark@^7.3.0 \
  @astrojs/markdown-satteri@^0.4.0 @astrojs/check@^0.9.10 typescript@^6 \
  sharp@^0.35.5 lit@^3.3.3 @krollins/blueprint@^0.2.3
# edit src/content.config.ts: z from 'astro/zod'
# path (a) of the @astrojs/lit decision (preferred):
#   npm uninstall @astrojs/lit
#   edit astro.config.mjs: drop the lit import and `lit()` from integrations
npx astro check
npm run build
npm run dev   # smoke: load a component page, confirm <bp-*> elements register
```

Note: `docs/node_modules/@krollins/blueprint` is currently **missing** (pruned);
this install restores it at 0.2.3.

## Gates

- [ ] @astrojs/lit decision recorded (removed / replaced / kept-with-evidence)
- [ ] `npx astro check` — 0 errors
- [ ] `npm run build` (docs)
- [ ] Dev-server smoke test: a component doc page renders with working `<bp-*>`
      elements and correct styles (`@krollins/blueprint/dist/index.css` loads)
- [ ] No new deprecation warnings in build output (or documented)
