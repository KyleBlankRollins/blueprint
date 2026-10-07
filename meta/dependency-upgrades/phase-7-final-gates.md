# Phase 7 — Final Gates & Report

Run after all phases land. Everything must pass in one sitting, in a clean tree
(`rm -rf node_modules docs/node_modules && npm install && (cd docs && npm install)`
first for a cold-cache validation).

## Root package

- [ ] `npm run build` — theme types → vite → declarations
- [ ] `npm run test:run` — all tests pass
- [ ] `npm run test:coverage` — coverage providers resolves from explicit dep
- [ ] `npm run lint` — 0 errors
- [ ] `npm run format:check`
- [ ] `npm run build-storybook`
- [ ] `npm pack --dry-run` — inspect tarball: `dist/` present, `dist/cli`
      excluded, `dist/index.css` included, `README.npm.md` swap works
      (`prepack`/`postpack` scripts intact)
- [ ] `npm ls typescript` — root resolves to
      `typescript@npm:@typescript/typescript6@6.x`, no `invalid` entries
- [ ] `npx tsc --version` — reports 7.x (from `@typescript/native`)
- [ ] `npm outdated` — everything at latest (or documented exceptions)

## Docs site

- [ ] `(cd docs && npx astro check)`
- [ ] `(cd docs && npm run build)`

## Final report contents

Summarize for the owner:

1. Final version table (old → new) for both packages.
2. Whether the `@typescript/native` + `typescript6` side-by-side layout held, or
   the TS 6-only fallback was used.
3. Dist layout diff result (Vite 7 → 8).
4. Any tests fixed for Vitest 5 `clearMocks` semantics.
5. Prettier-driven regeneration of theme files, if any.
6. Astro 7 template/config changes made, and the `@astrojs/lit` outcome (kept,
   removed, or replaced with `@semantic-ui/astro-lit`).
7. Remaining exceptions and follow-ups (e.g. typescript-eslint native TS 7
   support when it lands — likely TS 7.1-era — so the `@typescript/native` alias
   can collapse back to plain `typescript@^7`).

## Expected leftover exceptions

- `@eslint/js` pinned at 10.0.1 (no newer release line exists despite eslint
  10.12).
- docs `typescript` capped at ^6 until `@astrojs/check` supports TS 7.
- Root `typescript` stays aliased to `@typescript/typescript6` (TS 7 lives under
  `@typescript/native`) until typescript-eslint ships native TS 7 support.
- docs `@astrojs/lit` is deprecated upstream — either removed or replaced by
  `@semantic-ui/astro-lit`; record which.
