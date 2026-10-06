# Phase 2 — Root Minor/Patch Bumps

Low-risk bumps first. All in the root package; one `npm install` batch.

## Version targets

| Package                          | From     | To       | Notes                                                               |
| -------------------------------- | -------- | -------- | ------------------------------------------------------------------- |
| `lit` (dependency)               | ^3.3.2   | ^3.3.3   | patch                                                               |
| `prettier`                       | ^3.7.4   | ^3.9.9   | minor — see formatting watch item                                   |
| `happy-dom`                      | ^20.0.11 | ^20.14.5 | minor — test environment behavior                                   |
| `@inquirer/prompts`              | ^8.1.0   | ^8.7.3   | minor — CLI prompts                                                 |
| `eslint`                         | ^10.0.1  | ^10.12.0 | minor — may surface NEW rule errors                                 |
| `typescript-eslint`              | ^8.56.0  | ^8.71.1  | minor — still peers `typescript <6.1.0` (fine on TS 5.9 this phase) |
| `storybook`                      | ^10.1.11 | ^10.6.1  | minor                                                               |
| `@storybook/web-components-vite` | ^10.1.11 | ^10.6.1  | keep in lockstep with `storybook`                                   |
| `eslint-plugin-storybook`        | ^10.2.10 | ^10.6.1  | keep in lockstep                                                    |

`@eslint/js` latest is 10.0.1 (no 10.12.x line) — leave as-is.
`@types/culori`, `@types/iarna__toml`, `chokidar`, `culori`,
`eslint-config-prettier` are already at latest — no change.

## Steps

```bash
npm install lit@^3.3.3
npm install -D prettier@^3.9.9 happy-dom@^20.14.5 @inquirer/prompts@^8.7.3 \
  eslint@^10.12.0 typescript-eslint@^8.71.1 \
  storybook@^10.6.1 @storybook/web-components-vite@^10.6.1 \
  eslint-plugin-storybook@^10.6.1
```

## Watch items

- **Prettier 3.9 formatting drift.** `source/themes/__tests__/generated-sync.test.ts`
  compares committed generated theme files against freshly generated +
  prettier-formatted output. If prettier 3.9 formats differently, regenerate:
  `npm run theme:generate && npm run theme:generate-types`, then commit the
  regenerated files (owner commits).
- **ESLint 10.12** may add recommended rules beyond 10.0.1. Any new errors are
  in scope to fix (same approach as Phase 1b).
- **happy-dom 20.14.5** — full component test suite exercises real custom
  elements/shadow DOM in happy-dom; watch for environment behavior changes.

## Gates

- [ ] `npm run build`
- [ ] `npm run test:run`
- [ ] `npm run lint`
- [ ] `npm run build-storybook`
- [ ] `npm run format:check` (after any regeneration)
