---
'@krollins/blueprint': patch
---

Add per-component imports for the newer components

`@krollins/blueprint/stack`, `/grid`, `/container`, `/fieldset`, `/radio-group`, `/notification-stack`, `/icon-button` and `/code-block` can now be imported on their own, like the other components. The build already produced these files, but `package.json` didn't export them, so the imports failed.
