---
'@krollins/blueprint': patch
---

`<bp-icon>` takes the surrounding text color by default

The `default` color painted `--bp-color-text`, so icons ignored the color around them. They now inherit it, which lets component tints show: notification icons take their variant color, and the avatar fallback icon reads on its fill. Set `color` for an explicit variant as before.
