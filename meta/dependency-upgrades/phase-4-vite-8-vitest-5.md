# Phase 4 — Vite 8 + Vitest 5 (together)

These must land in one phase: Vitest 5 requires Vite ≥ 6.4 as a peer, and
Vitest 4 does not support Vite 8. Do both, then gate.

## Version targets

| Package               | From    | To     | Notes                                                                   |
| --------------------- | ------- | ------ | ----------------------------------------------------------------------- |
| `vite`                | ^7.3.0  | ^8.3.3 |                                                                         |
| `vitest`              | ^4.0.16 | ^5.0.3 |                                                                         |
| `@vitest/ui`          | ^4.0.16 | ^5.0.3 |                                                                         |
| `@vitest/coverage-v8` | —       | ^5.0.3 | new explicit dep — `coverage.provider: 'v8'` was resolving transitively |

## Vite 8 (Rolldown) — config changes

`vite.config.ts` (lib mode, ~475 entry points: index + 44 components + ~430 icon
entries + icon resolver):

- Rename `build.rollupOptions` → `build.rolldownOptions` (auto-converted by a
  compat layer, but renaming silences the deprecation). `external` regexes
  (`/^lit(\/.*)?$/`, `/^@lit\//`), `entryFileNames`, `chunkFileNames`,
  `cssFileName: 'index'` all carry over.
- **Verify dist layout byte-structurally** after build (Rolldown replaces
  Rollup). Snapshot `dist/` before upgrading (`cp -R dist /tmp/dist-v7`), then
  diff file _paths_ post-upgrade. Must still produce: `dist/index.js`,
  `dist/index.css`, `dist/components/<name>.js`, `dist/icons/<name>.js`,
  `dist/icons/resolver.js`, `dist/shared/*-[hash].js`, sourcemaps.
- **Oxc + legacy decorators:** Oxc (replacing esbuild for transforms) supports
  `experimentalDecorators` legacy transform (it only lacks TC39-_native_
  decorator lowering, which we don't use). Tests + build prove it. Vite's docs
  confirm the Oxc transformer reads `experimentalDecorators` and
  `useDefineForClassFields` from `tsconfig.json`, so the repo's
  `experimentalDecorators: true` / `useDefineForClassFields: false` carry over.
  Oxc ignores tsconfig `target` (it uses `build.target`), and
  `emitDecoratorMetadata` has only partial support (not used here).
- Lightning CSS replaces esbuild for CSS minification — cosmetic diffs in
  `dist/index.css` are acceptable; structural loss is not.
- Node ≥ 20.19/22.12 required — we're on 24. ✓

## Vitest 5 — breaking changes that apply here

- **`clearMocks: true` is now default** (auto `vi.clearAllMocks()` before each
  test). The suite uses `vi.fn()`/`vi.spyOn()` heavily; watch for tests relying
  on mock call history leaking across tests. Fix offending tests properly;
  `clearMocks: false` in `vitest.config.ts` is a documented escape hatch but a
  last resort.
- **`vi.mock` must be top-level** — verified: only usage is
  `source/cli/commands/__tests__/generate-types.test.ts:14`, already top-level. ✓
- **Unawaited async assertions now fail** — review grep found zero unawaited
  `.resolves`/`.rejects` usages in `source/`. ✓ (pre-checked) Re-grep after the
  Phase 1 test edits to confirm none were introduced.
- **Coverage include/exclude matching** is now root-relative without `contains`
  semantics — ours (`source/**/*.ts`, exclusions) are already root-relative. ✓
- Removed `test.sequential`/`describe.sequential` — grep to confirm unused. ✓
  (pre-checked: none found)
- Artifacts move under `.vitest/` — only matters if blob/json reporters are
  added later; add `.vitest/` to `.gitignore` defensively.
- Vitest 5 requires Node ≥ 22.12 — we're on 24. ✓ `@vitest/ui` now requires
  token auth for its HTML page — cosmetic for local `npm run test:ui`.
- `environment: 'happy-dom'` unchanged; `happy-dom` 20.14.5 supports Vitest 5.

## Steps

```bash
cp -R dist /tmp/dist-v7   # pre-upgrade snapshot (after npm run build)
npm install -D vite@^8.3.3 vitest@^5.0.3 @vitest/ui@^5.0.3 @vitest/coverage-v8@^5.0.3
# edit vite.config.ts: rollupOptions → rolldownOptions
npm run build && diff <(cd /tmp/dist-v7 && find . -type f | sort) \
                      <(cd dist && find . -type f | sort)
npm run test:run
```

## Gates

- [ ] `npm run build` + dist path diff shows no unexpected changes
- [ ] `npm run test:run` — all pass (investigate any `clearMocks` fallout)
- [ ] `npm run test:coverage` — works with the new explicit coverage package
- [ ] `npm run lint`
- [ ] `npm run build-storybook` — Storybook 10.6.1 against Vite 8
- [ ] `npm pack --dry-run` — tarball contains expected files
