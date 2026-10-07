# Phase 5 — Remaining Root Majors + Cleanup

## Version targets

| Package           | From    | To      | Notes                                                                                                                                                                                                                                                    |
| ----------------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@changesets/cli` | ^2.29.8 | ^3.0.3  | ESM-only; Node ^22.11/^24/≥26 ✓                                                                                                                                                                                                                          |
| `commander`       | ^14.0.2 | ^15.0.0 | ESM-only; Node ≥22.12 ✓                                                                                                                                                                                                                                  |
| `@types/node`     | ^25.0.3 | ^26.6.4 | approved (runtime here is Node 24 — types-only risk is minimal)                                                                                                                                                                                          |
| `@types/chokidar` | ^1.7.5  | —       | **remove** — stub; chokidar 5 bundles types (`source/cli/commands/generate-types.ts` imports chokidar dynamically; it picks up chokidar's own types). Although `@types/chokidar` 2.1.7 exists on the registry, it is still a stub and the removal stands |

## Changesets v3 notes

- All packages ESM-only — repo is `"type": "module"`. ✓
- `.changeset/config.json` needs **no changes** (no removed `prettier` key;
  `$schema` already points at 3.1.2; consider refreshing to
  `https://unpkg.com/@changesets/config@4.0.1/schema.json` if convenient —
  cosmetic).
- `changeset version` now exits 1 with no pending changesets — only affects CI
  (none exists). Interactive `changeset add` now uses @clack/prompts — cosmetic.
- Verify: `npx changeset status` runs clean.

## Commander 15 notes

- ESM-only — CLI is ESM. ✓
- `--no-*` behavior change only affects options defined as _both_ positive and
  negative forms. CLI uses four **lone** `--no-*` flags
  (`source/cli/commands/theme.ts`: `--no-open`, `--no-validate`, `--no-jsdoc`,
  `--no-dark`) — still default to `true` under v15. ✓
- Verify at runtime (commander issues surface at parse time, not install):
  ```bash
  npm run build:cli
  node dist/cli/index.js --help
  node dist/cli/index.js theme --help
  node dist/cli/index.js list
  ```
- CLI test suite: `npm run test:cli`.

## Cleanup

- Remove `@types/chokidar`; confirm `npm run build:cli` still type-checks.
- Re-evaluate `overrides.minimatch: ^10.2.1` (predates this work). Try removing
  it; if `npm install` resolves cleanly and nothing pins an ancient minimatch,
  drop the override. Otherwise restore and note why.

## Gates

- [ ] `npm run build` (includes CLI build via `theme:generate-types`)
- [ ] `npm run test:run` and `npm run test:cli`
- [ ] `npm run lint`
- [ ] `npx changeset status`
- [ ] CLI smoke commands above
