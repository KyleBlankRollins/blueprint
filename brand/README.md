# Blueprint brand assets

The Blueprint mark is a lowercase **b** on a sheet of paper with one folded corner. The b is drawn with the same 4-unit, round-cap stroke as the System UI icons, so the mark belongs to the icon family. The folded corner makes the tile a drafting sheet.

| File                        | Use                                                |
| --------------------------- | -------------------------------------------------- |
| `blueprint-mark.svg`        | Mark on light grounds                              |
| `blueprint-mark-dark.svg`   | Mark on dark grounds                               |
| `blueprint-lockup.svg`      | Mark and wordmark on light grounds                 |
| `blueprint-lockup-dark.svg` | Mark and wordmark on dark grounds                  |
| `favicon.svg`               | Browser icon. Switches with `prefers-color-scheme` |

## Construction

- 48 × 48 canvas on a 4-unit grid.
- Sheet: 10-unit corner radius, with the top-right corner cut 14 units and folded (4-unit inner radius).
- Letter: stem from (16, 10) to (16, 38); bowl 16 units tall with an 8-unit radius. Stroke 4, round caps and joins.
- Lockup: 14-unit gap, then "Blueprint" in Figtree Bold at 32 units with −0.02em tracking, converted to outlines and centered on the mark's cap height.

## Color

| Part   | Light                              | Dark                                  |
| ------ | ---------------------------------- | ------------------------------------- |
| Sheet  | `#074e6c` (`--bp-color-primary`)   | `#49b1e4` (`--bp-color-primary`)      |
| Fold   | `#3d7a96` (primary, lightened)     | `#9ad3ef` (primary, lightened)        |
| Letter | `#f0ebdc` (Sulphur Yellow surface) | `#1d2226` (`--bp-color-text-inverse`) |
| Word   | `#1d2226` (`--bp-color-text`)      | `#dddbd3` (`--bp-color-text`)         |

In a themed page, draw the mark inline with `--bp-color-primary` for the sheet, `color-mix(in oklch, var(--bp-color-primary) 70%, white)` for the fold and `--bp-color-text-inverse` for the letter, so it follows the theme. The docs header does this.

## Rules

- Keep clear space of at least 12 units (a quarter of the mark) on every side.
- Don't use the mark below 16px. Below 24px, use the mark alone, not the lockup.
- Don't recolor, outline, rotate or add effects. Don't put the light mark on a dark ground or the reverse.
- Don't retype the wordmark. Use the outlined lockup files.
