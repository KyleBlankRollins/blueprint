---
name: manage-changesets
description: Creates changeset files to document changes for npm releases of the Blueprint package. Use when completing work on Blueprint components, themes, utilities, or any code that affects the published package, or when the user asks to add a changeset, version, or publish.
---

# Managing Changesets

## Overview

Blueprint uses [Changesets](https://github.com/changesets/changesets) to track changes, generate changelogs, and manage npm releases of the `@krollins/blueprint` package. This is a **single-package repository** — there is no monorepo package selection step.

Changesets live in `.changeset/` as markdown files with YAML front matter. Each file captures an intent to release: a semver bump type and a human-readable summary of what changed.

## When to create a changeset

Create a changeset for any change that affects the published package (`dist/`):

- New or modified components
- Design token changes in `source/themes/`
- Bug fixes in component behavior or styles
- New or changed public API (properties, events, slots, CSS parts)
- Utility changes in `source/utilities/`
- Changes to `source/index.ts` exports

**Do NOT create a changeset for:**

- Documentation-only changes (`docs/`, `README.md`, meta files)
- Test-only changes (`*.test.ts`)
- Storybook stories (`*.stories.ts`)
- CI/config changes (`.github/`, `eslint.config.js`, etc.)
- Dev tooling (`source/cli/`, build scripts)

## Adding a changeset

Create a markdown file in `.changeset/` with a short descriptive kebab-case name (e.g., `fix-button-focus.md`). The file has YAML front matter specifying the package name and bump type, followed by a markdown summary.

> **Why not `npx changeset`?** The CLI uses interactive prompts (`enquirer`) that require arrow-key navigation and sequential stdin input. Agents cannot drive these prompts — the readline crashes when stdin closes. Writing the file directly is explicitly supported by Changesets and produces identical results.

### File format

```markdown
---
'@krollins/blueprint': patch
---

Fix button focus ring not appearing in Safari
```

The YAML key is always `"@krollins/blueprint"`. The value is one of `patch`, `minor`, or `major`.

### Choosing the bump type

| Bump    | When to use                                                        | Examples                                            |
| ------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| `patch` | Bug fixes, style tweaks, internal refactors with no API change     | Fix checkbox alignment, adjust token value          |
| `minor` | New features, new components, new props/events/slots added         | Add `bp-tree` component, add `size="xs"` to button  |
| `major` | Breaking changes — removed props, renamed events, changed behavior | Remove deprecated `variant`, rename `bp-tag` events |

This project has **zero users and no backwards compatibility concerns**, so don't hesitate to use `major` when making breaking changes. Don't deprecate — just remove and bump major.

### Reviewing changes before writing the summary

Before writing the changeset summary, inspect what actually changed using git:

```bash
# See which files changed vs main
git diff main --name-only

# See full diff of source changes (excludes tests, stories, docs)
git diff main -- source/components/ source/themes/ source/utilities/ source/index.ts

# If already committed, compare the branch to main
git log main..HEAD --oneline
git diff main..HEAD -- source/
```

Focus on changes to **public API surface** — new/changed properties, events, slots, CSS parts, design tokens — and any **behavioral changes** to existing components. Ignore internal refactors that don't affect consumers unless they fix a bug.

### Writing the summary

The summary becomes the CHANGELOG entry. Write it for someone scanning release notes:

- **WHAT** changed
- **WHY** it changed (if not obvious)
- **HOW** consumers should update (for breaking changes)

Good examples:

```markdown
---
'@krollins/blueprint': minor
---

Add `inline` property to bp-drawer for embedding drawers within page layout instead of overlaying
```

```markdown
---
'@krollins/blueprint': major
---

Remove `variant="ghost"` from bp-button

The ghost variant is replaced by `variant="secondary"` with `appearance="text"`. Update any usage of `<bp-button variant="ghost">` to `<bp-button variant="secondary" appearance="text">`.
```

```markdown
---
'@krollins/blueprint': patch
---

Fix bp-modal not trapping focus when opened programmatically via the `open` property
```

### Multiple changesets per branch

You can add multiple changeset files to a single branch if you made several independent changes that should each have their own changelog entry. Use distinct filenames:

```
.changeset/
  add-tree-component.md
  fix-button-focus.md
```

## Release workflow

Releasing has two steps. Both are run from the Blueprint repo root.

### Step 1: Version

```bash
npx changeset version
```

This command:

1. Reads all changeset files in `.changeset/`
2. Determines the highest bump type across all changesets
3. Updates `version` in `package.json`
4. Writes entries to `CHANGELOG.md`
5. Deletes the consumed changeset files

Review the resulting `package.json` version bump and `CHANGELOG.md` entries. Edit `CHANGELOG.md` if any entries need polish.

### Step 2: Publish

```bash
npx changeset publish
```

This command:

1. Checks if the current version in `package.json` is already published on npm
2. Runs `npm publish` if it is not
3. Creates a git tag (`v{version}`)

After publishing, push the tag:

```bash
git push --follow-tags
```

### Full release checklist

```
Release Progress:
- [ ] All changes committed and pushed
- [ ] Run `npm run build` to verify clean build
- [ ] Run `npm run test:run` to verify tests pass
- [ ] Run `npx changeset version` to bump version + generate changelog
- [ ] Review CHANGELOG.md entries
- [ ] Commit the version bump: `git add . && git commit -m "chore: version package"`
- [ ] Run `npx changeset publish` to publish to npm
- [ ] Push with tags: `git push --follow-tags`
```

## Project configuration

The config lives at `.changeset/config.json`:

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

Key settings:

- **`access: "public"`** — publishes to the public npm registry (package is `@krollins/blueprint`)
- **`commit: false`** — changeset commands don't auto-commit; you commit manually
- **`baseBranch: "main"`** — comparisons and status checks run against `main`
