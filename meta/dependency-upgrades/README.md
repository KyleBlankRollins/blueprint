# Dependency Upgrade Plan — Overview

Planned: 2026-10-06. Goal: bring **all** dependencies in this repo (root library
package + `docs/` sub-project) to their latest versions, including major versions.

This directory contains one file per execution phase. Execute phases in order;
each has its own verification gates. **Do not proceed to the next phase until the
current phase's gates pass.**

## Context

`@krollins/blueprint` is a Lit 3 web component library (~44 components, ~2100
tests, Storybook) with an internal Node CLI (`source/cli` → `dist/cli`, not
published) and a codegen-based theme system (`source/themes`, culori-driven,
generated files committed and guard-tested). `docs/` is an independent Astro site
(own lockfile, consumes the _published_ npm package — not an npm workspace).

Environment: Node v24.21.0, npm 11.19.0. No CI, no `engines` field, no `.nvmrc`.

## Pre-existing state (baseline)

Captured on commit `270c420` with clean deps:

- `npm run lint` fails: **15 errors** (`preserve-caught-error` ×9,
  `no-useless-assignment` ×6).
- `npm run test:run` fails: **4 tests** in `breadcrumb` (separator ×2) and
  `select` (placeholder/label ×2).
- `@vitest/coverage-v8` is used (`coverage.provider: 'v8'`) but not declared.
- `@types/chokidar` is a stub; chokidar 5 bundles its own types.
- `@types/culori` **is still needed** (culori 4 ships no types — verified).
- Working tree (uncommitted, **keep all three**):
  - `package.json`: stray self-dependency `@krollins/blueprint` removed — correct.
  - `package-lock.json`: root version bump accompanying the above — keep.
  - `source/themes/generated/theme.d.ts`: regenerated as **raw generator output
    with the Prettier step skipped** (lines > 80 cols). The `generated-sync`
    test does **not** cover this file, so nothing catches it. Phase 1 restores
    it (revert or rerun `npm run theme:generate-types`).

## Decisions (confirmed with repo owner)

1. **TypeScript 7.0.2 side-by-side with typescript6** for the root package. TS 7
   (native/Go port) ships no stable compiler API; typescript-eslint requires it.
   Plan: `"@typescript/native": "npm:typescript@^7.0.2"` provides `tsc` (TS 7),
   while the `typescript` name is aliased to `npm:@typescript/typescript6@^6` so
   typescript-eslint gets the 6.0 API. The npm `overrides` alias approach was
   tested and fails `npm install` with ERESOLVE. Fallback if the layout
   misbehaves: root on TS 6.0.x alone.
2. **Docs site is in scope** (Astro 5 → 7, MDX 4 → 8).
3. **Fix the pre-existing lint errors and failing tests** as part of this work.
4. **Cleanup approved**: remove `@types/chokidar`, add `@vitest/coverage-v8`,
   `@types/node` → ^26.

## Phase index

| Phase | File                                                         | Scope                                                                      |
| ----- | ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| 1     | [phase-1-baseline-fixes.md](phase-1-baseline-fixes.md)       | Fix 4 failing tests + 15 lint errors on current deps                       |
| 2     | [phase-2-minor-patch-bumps.md](phase-2-minor-patch-bumps.md) | Root minor/patch bumps (lit, prettier, eslint, storybook)                  |
| 3     | [phase-3-typescript-7.md](phase-3-typescript-7.md)           | typescript 5.9 → 7.0.2 (`@typescript/native`) + typescript6 API for eslint |
| 4     | [phase-4-vite-8-vitest-5.md](phase-4-vite-8-vitest-5.md)     | vite 7 → 8 (Rolldown) **and** vitest 4 → 5, together                       |
| 5     | [phase-5-remaining-majors.md](phase-5-remaining-majors.md)   | changesets 3, commander 15, @types/node 26, cleanup                        |
| 6     | [phase-6-docs-astro-7.md](phase-6-docs-astro-7.md)           | docs/: astro 5 → 7, @astrojs/mdx 4 → 8, sharp, TS 6                        |
| 7     | [phase-7-final-gates.md](phase-7-final-gates.md)             | Full verification + pack inspection + report                               |

## Global rules

- **Gate between phases:** `npm run build`, `npm run test:run`, `npm run lint`
  must all pass (repo is green after Phase 1) unless a phase file says otherwise.
- Never downgrade a failure signal silently — if a gate fails, fix or document.
- `package-lock.json` is committed; keep it in sync (run `npm install`, not just
  `package.json` edits).
- Do not commit; the owner handles git.
- The `overrides.minimatch: ^10.2.1` entry predates this work; re-evaluate in
  Phase 5, keep unless it blocks resolution.

## Risk register (watch items)

| Risk                                                                                                        | Where it bites          | Mitigation                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Dual-alias layout: `.bin/tsc` resolves to the wrong package, or `npm ls typescript` shows `invalid` entries | Phase 3 install         | Keep the TS 7 alias scoped as `@typescript/native`; verify `npx tsc --version` (7.x) and `npm ls typescript`; fallback root TS 6.0.x |
| TS 6/7 `rootDir` default change makes `tsc -p tsconfig.build.json` fail with hard error TS5011              | Phase 3 build           | Explicit `"rootDir": "source"` in `tsconfig.build.json`                                                                              |
| Rolldown emits different dist layout (entries, chunks, CSS)                                                 | Phase 4 build/pack      | Diff `dist/` + `npm pack --dry-run` against pre-upgrade                                                                              |
| Oxc mishandles Lit legacy decorators (`experimentalDecorators`)                                             | Phase 4 build/tests     | Build + full test run; Oxc only lacks _TC39-native_ decorator lowering                                                               |
| Vitest 5 `clearMocks: true` default breaks mock-history coupling                                            | Phase 4 tests           | Fix offending tests; last resort `clearMocks: false` in config                                                                       |
| Storybook 10.6.1 vs Vite 8 incompatibility                                                                  | Phase 4 storybook build | `build-storybook` gate; check storybook release notes                                                                                |
| Prettier 3.9 formatting drift breaks `generated-sync.test.ts`                                               | Phase 2 tests           | Regenerate theme files via `npm run theme:generate`                                                                                  |
| Astro 7 Rust compiler rejects templates (strict, unclosed tags)                                             | Phase 6 docs build      | Fix templates; see Astro v7 upgrade guide                                                                                            |
| `@astrojs/mdx@8` requires new peer deps                                                                     | Phase 6 install         | Add `@astrojs/markdown-remark` + `@astrojs/markdown-satteri`                                                                         |
| `@astrojs/check` caps TypeScript at ^6                                                                      | Phase 6                 | docs/ uses `typescript@^6.0.x`, not 7                                                                                                |
| `@astrojs/lit` deprecated/unmaintained, unverified on Astro 6/7 renderer API                                | Phase 6 install/build   | Drop the integration if docs build + smoke pass without it (no `client:` directives); else community fork `@semantic-ui/astro-lit`   |
