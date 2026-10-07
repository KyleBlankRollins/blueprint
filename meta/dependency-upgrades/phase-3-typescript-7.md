# Phase 3 — TypeScript 7.0.2 + typescript6 Side-by-Side (root)

TS 7.0 is the Go-native compiler. It has **no stable programmatic API** (due in
7.1), which breaks API consumers — for this repo that's **typescript-eslint**
(peers `typescript: >=4.8.4 <6.1.0`). Vite/Vitest transform TS without the API,
so they're unaffected. `tsc` (CLI: type-check + declaration emit) is fully
supported on 7.

## Strategy — dual alias layout (verified end-to-end by review)

**Do NOT use an npm `overrides` alias** (e.g.
`"typescript-eslint": { "typescript": "npm:@typescript/typescript6@^6" }`) — it
fails `npm install` with ERESOLVE: npm applies the override to
typescript-eslint's peer spec but still resolves the peer against the root's
typescript@7 and refuses. With `--legacy-peer-deps` it installs but every
`@typescript-eslint/*` package then loads typescript@7 (whose main is a version
stub with no compiler API) and eslint crashes on startup.

Use the side-by-side layout from the TypeScript 7.0 announcement instead
(**verified**: installs clean, `tsc` → 7.0.2, `tsc6` → 6.0.x,
`require('typescript')` → 6.0.x API, `npm ls typescript` shows no invalid
entries, eslint + typescript-eslint 8.71.1 lints correctly):

```json
"devDependencies": {
  "@typescript/native": "npm:typescript@^7.0.2",
  "typescript": "npm:@typescript/typescript6@^6.0.2"
}
```

- The `typescript` package name holds the **6.0 API** (via
  `@typescript/typescript6`), so typescript-eslint and anything else doing
  `require('typescript')` gets a working compiler API.
- The scoped `@typescript/native` alias holds TS 7 and provides the `tsc` binary
  used by npm scripts (`build`, `build:cli`, `theme:generate*`).
- **The TS 7 alias MUST be scoped** (`@typescript/native`). An unscoped alias
  (e.g. `typescript7`) loses the `.bin/tsc` symlink race to the nested package —
  verified failure mode. Do not rename it.
- No `overrides` entry is needed for this.
- Storybook bundles its own typescript 5.8 as a regular dependency — unaffected.

**Fallback:** if this layout misbehaves in this repo, put the root on
`typescript@^6.0.x` alone (drop `@typescript/native`). Still a major upgrade
from 5.9 and API-compatible with everything here. Document the outcome.

## tsconfig changes (required for TS 6/7 semantics)

1. **`tsconfig.build.json` — add `"rootDir": "source"`.** CRITICAL: TS 6/7
   default `rootDir` to the config directory; without this, `tsc -p
   tsconfig.build.json` fails with hard error **TS5011** (rootDir mismatch).
   (Review-verified on 7.0.2: it's a hard error, not a silent `dist/source/`
   misplacement. Also verified on 7.0.2: `declaration` + `declarationMap` emit
   works, and legacy `experimentalDecorators` emit works.)
2. Base `tsconfig.json` — already safe: `target: ES2020`, `moduleResolution:
   bundler`, explicit `types: ["node"]` (TS 6/7 default `types` to `[]`),
   `strict: true` (now the default anyway), no `baseUrl`/`paths`, no es5/amd.
3. `tsconfig.cli.json` — already has `rootDir: "source"`. Optionally drop the
   nonexistent `source/scripts/**/*` include (dead reference).
4. `noUncheckedSideEffectImports` defaults to `true` in TS 6/7 — the CSS
   side-effect import in `source/index.ts` (`./themes/generated/index.css`) is
   covered by the `*.css` ambient declaration from `vite/client` (via
   `vite-env.d.ts`, which is in `include`). Verify no new error appears.

## What stays the same

- Lit's legacy decorators (`experimentalDecorators: true`,
  `useDefineForClassFields: false`) are unaffected — TS 7 keeps legacy decorator
  support (emit verified on 7.0.2), and the repo has no enums/namespaces; the
  two constructor parameter properties (`ThemeValidator.ts:32`,
  `builder/__tests__/deepMerge.test.ts:267`) remain legal (they'd only matter
  under `erasableSyntaxOnly`, which we do not enable).

## Steps

```bash
# edit package.json devDependencies to the alias layout above, then:
npm install
npm ls typescript        # expect: typescript@6.0.x (aliased from
                         # @typescript/typescript6) at root; no invalid entries
npx tsc --version        # expect 7.x   (from @typescript/native)
npx tsc6 --version       # expect 6.x
```

## Gates

- [ ] `npm run build` — declarations land in `dist/` with unchanged layout
      (no TS5011; `dist/index.d.ts` present, no `dist/source/`)
- [ ] `npm run lint` — typescript-eslint runs on the 6.0 API
- [ ] `npm run test:run`
- [ ] `npm run theme:generate-types` (exercises `tsc -p tsconfig.cli.json` + CLI)
