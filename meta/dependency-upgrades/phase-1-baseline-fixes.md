# Phase 1 — Green Baseline (no version changes)

Fix the pre-existing failures **on the current dependency set** so that every
later phase has a clean signal: anything red afterward is an upgrade regression.

## 1a. Fix 4 failing tests

Failing as of baseline (`npm run test:run`):

1. `source/components/breadcrumb/breadcrumb.test.ts`
   - `bp-breadcrumb > Default Values > should have default separator class applied`
   - `bp-breadcrumb > Properties > should set property: separator`
   - **Not** fallout from commit `270c420`. These assertions (lines ~100-104 and
     ~129-135) date from commit `f4085a0` (2026-01-23). The component
     (`source/components/breadcrumb/breadcrumb.ts`, ~line 267) applies
     `breadcrumb--separator-${this.separator}` to the `<nav>` (e.g.
     `breadcrumb--separator-slash`, `breadcrumb--separator-chevron`), but the
     tests assert `breadcrumb--slash` / `breadcrumb--chevron`.
   - Fix: update the tests to the `breadcrumb--separator-*` class names. The
     component's naming is intentional and consistent with its other
     `breadcrumb--*` modifiers.
2. `source/components/select/select.test.ts`
   - `bp-select > should display placeholder when no value selected`
   - `bp-select > should display selected option label`
   - Cause: these assertions (lines ~471-472 and ~493-494) date from commit
     `141a5ff8` (2026-01-05). `source/components/select/select.ts` (lines
     358-362) renders `.select-value` as a wrapper with two children:
     `<span class="select-value__sizer" aria-hidden="true">` (sizer text) and
     `<span class="select-value__display">` (the actual label). The tests read
     `.select-value` textContent and so get both strings plus whitespace. No
     option-registration timing issue is involved.
   - Fix: query `.select-value__display` and compare its trimmed textContent.

## 1b. Fix 15 lint errors

`npm run lint` baseline (all in `eslint:recommended` rules that are new in
ESLint 10):

**`preserve-caught-error` ×9** — rethrown errors missing `{ cause: err }`:

- `source/cli/commands/generate-theme.ts:182`
- `source/cli/commands/generate-types.ts:73`
- `source/cli/lib/theme/pluginMetadata.ts:103,113`
- `source/cli/lib/theme/registerPlugin.ts:90`
- `source/cli/lib/theme/themeIntegration.ts:125`
- `source/themes/builder/ThemeBuilder.ts:239,302`
- `source/themes/builder/index.ts:239`

Fix pattern: when wrapping a caught error, pass
`throw new Error('...', { cause: err })`. Do **not** disable the rule.

**`no-useless-assignment` ×6** — assigned values never read:

- `source/cli/lib/component/addToDocs.ts:43`
- `source/components/color-picker/color-picker.utils.ts:198,199,200`
- `source/components/slider/slider.ts:282`
- `source/components/table/table.ts:226`

Fix pattern: remove the dead assignment or restructure so the value is used.
Read surrounding code carefully — some may indicate a real logic bug (value
computed but the stale variable used instead).

## 1c. Restore `source/themes/generated/theme.d.ts`

The working tree has an uncommitted diff on `source/themes/generated/theme.d.ts`.
It is raw generator output with the Prettier step skipped (lines exceed the
repo's 80-column `printWidth`), not an intended change. Restore it with either:

- `git checkout -- source/themes/generated/theme.d.ts`, or
- `npm run theme:generate-types` (runs Prettier after generating).

The `generated-sync` test does **not** cover this file, so a green test run
proves nothing here. Verify manually: `git diff --stat source/themes/generated/theme.d.ts`
should show no changes (or only intended ones), and
`npx prettier --check source/themes/generated/theme.d.ts` should pass.

## Gates

- [ ] `npm run test:run` — 2094/2094 pass
- [ ] `npm run lint` — 0 errors
- [ ] `npm run build` — still succeeds (touches cli/themes/components code)
- [ ] `npx prettier --check source/themes/generated/theme.d.ts` — passes
