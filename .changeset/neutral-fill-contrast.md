---
'@krollins/blueprint': patch
---

Neutral Tag and Badge text now meets WCAG AA

The solid neutral `<bp-tag>` and the neutral `<bp-badge>` set body text on `--bp-color-border-strong` (3.2:1 in light, 2.2:1 in dark). They now use `--bp-color-secondary` with `--bp-color-text-inverse` (4.7:1 and 5.0:1). A new test checks every text-on-fill pair in the component styles against both themes.
