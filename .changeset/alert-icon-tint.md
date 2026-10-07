---
'@krollins/blueprint': patch
---

Alert icons now take their variant's color

The default icon in `<bp-alert>` (with `showIcon`) is now colored with `--bp-color-info`, `--bp-color-success`, `--bp-color-warning` or `--bp-color-error`, matching the alert's left border and how `<bp-notification>` icons already look. Custom icons in the `icon` slot that use `currentColor` pick up the same color. The dismiss button keeps the body text color.
