# @krollins/blueprint

## 0.3.0

### Minor Changes

- ab210ca: `errorMessage` now makes a form control invalid for its form

  Setting `errorMessage` on Input, Textarea, Select, Combobox, Multi-select, Number Input, Date Picker, Time Picker, Slider, Color Picker, Radio Group, Checkbox or Switch now works like a native `setCustomValidity()`: the control reports `customError` with the message as its `validationMessage`, `form.checkValidity()`/`reportValidity()` return false, and the form won't submit. The message takes precedence over the control's own validation (`required`, `min`/`max`, `pattern`, ...); disabled controls are still excluded from validation. On Number Input the deprecated `message` shown as the error with `variant="error"` counts too.

  - **Behavior change:** apps must clear `errorMessage` (set it to `''`) once the problem is fixed, or the form stays blocked. A server-side error left on a field after the user corrects it will now stop the next submit.
  - Form controls built on `FormControlMixin` can override the new `getCustomValidityMessage()` to change which message blocks submission. `syncCustomValidity()` and `customErrorValidity()` are exported for controls that manage their own `ElementInternals`.
  - File Upload is not form-associated, so its `errorMessage` stays visual only.

- b2858f0: One way to show help and error text on every form control

  Input, Textarea, Select, Combobox, Multi-select, Number Input, Date Picker, Time Picker, Slider, Color Picker, File Upload, Checkbox, Switch and Radio Group now all take `helperText` and `errorMessage`. Help text sits under the control; an error message replaces it, is announced with `role="alert"`, sets `aria-invalid="true"` on the control and turns its border (or track, thumb, box) to the error color. Both are linked to the control with `aria-describedby` and exposed as the `helper-text` and `error-message` CSS parts. The shared helper is exported from `utilities` as `renderFieldMessage`, `fieldMessageState` and `fieldMessageStyles`.

  - **Behavior change (Input, Textarea):** `errorMessage` now shows whenever it is set. It used to show only with `variant="error"`, which still works.
  - **Deprecated:** `message` on Number Input and File Upload (shown as the error when `variant="error"`, otherwise as helper text) and `description` on Radio Group (shown as helper text). Radio Group's `description` and `error` parts are now `helper-text` and `error-message`.
  - **Date Picker** now shows its `label` above the input, like the other fields, instead of using it only as an accessible name.
  - **Number Input**'s label is now associated with its input.

- New components, and form controls that work with `<form>`

  - **Form-associated controls:** Input, Textarea, Select, Combobox, Multi-select, Number Input, Date Picker, Time Picker, Slider and Color Picker now submit their value under `name`, take part in `checkValidity()`/`reportValidity()` through `required` and their own constraints, and restore their value on form reset. Disabled controls are not submitted. The behavior comes from `FormControlMixin`, which you can apply to your own Lit elements.
  - **`<bp-fieldset>`:** groups controls with a legend, description and group error. Its `disabled` disables the controls inside it.
  - **`<bp-radio-group>`:** `role="radiogroup"` with a label, description and error. It owns `name`, `value`, `required` and `disabled`, submits the selected value and emits one `bp-change`. Arrow keys move and wrap, skipping disabled radios.
  - **`<bp-radio>`:** radios are now reachable by keyboard. A standalone radio is a tab stop and Space selects it. Inside a group, the group manages the tab stop. Focus lands on the `bp-radio` host, not the inner input.
  - **`<bp-stack>`, `<bp-grid>`, `<bp-container>`:** layout primitives built on the spacing and breakpoint scales.
  - **`<bp-notification-stack>` and `notify()`:** a fixed region that stacks notifications at one of six positions, shows up to `max` (default 3) and queues the rest. `notify()` creates a toast from an options object or a string, and the standalone `notify()` finds or creates the page's stack. `<bp-notification>` gains a `stacked` mode, uses `role="status"` (or `role="alert"` for errors), resumes with the remaining time after a pause, and no longer fires `bp-hide` on first render.
  - **`<bp-icon-button>`:** a square, icon-only button. The required `label` becomes its accessible name. It comes in seven variants, three sizes and square or circle shapes, and takes a built-in `icon` or a custom one in the slot.

### Patch Changes

- a6ae89c: Alert icons now take their variant's color

  The default icon in `<bp-alert>` (with `showIcon`) is now colored with `--bp-color-info`, `--bp-color-success`, `--bp-color-warning` or `--bp-color-error`, matching the alert's left border and how `<bp-notification>` icons already look. Custom icons in the `icon` slot that use `currentColor` pick up the same color. The dismiss button keeps the body text color.

- cb4618f: Add per-component imports for the newer components

  `@krollins/blueprint/stack`, `/grid`, `/container`, `/fieldset`, `/radio-group`, `/notification-stack`, `/icon-button` and `/code-block` can now be imported on their own, like the other components. The build already produced these files, but `package.json` didn't export them, so the imports failed.

- 6a76f86: `<bp-icon>` takes the surrounding text color by default

  The `default` color painted `--bp-color-text`, so icons ignored the color around them. They now inherit it, which lets component tints show: notification icons take their variant color, and the avatar fallback icon reads on its fill. Set `color` for an explicit variant as before.

- 58fe542: Neutral Tag and Badge text now meets WCAG AA

  The solid neutral `<bp-tag>` and the neutral `<bp-badge>` set body text on `--bp-color-border-strong` (3.2:1 in light, 2.2:1 in dark). They now use `--bp-color-secondary` with `--bp-color-text-inverse` (4.7:1 and 5.0:1). A new test checks every text-on-fill pair in the component styles against both themes.

## 0.2.3

### Patch Changes

- Fix `<bp-icon>` not rendering inside composed components when imported individually

  Components that internally use `<bp-icon>` (accordion, alert, avatar, breadcrumb, drawer, notification, popover, table, tabs, tag, tree) relied on a bare side-effect import (`import '../icon/icon.js'`) to register the `<bp-icon>` custom element. Rollup's tree-shaking removed these imports during the library build, so consumers importing individual components (e.g., `@krollins/blueprint/tree`) never got the `<bp-icon>` definition.

  Changed all 11 components to use value imports (`import { BpIcon } from '../icon/icon.js'`) with a `static dependencies` class property referencing the import. This prevents tree-shaking while keeping the dependency explicit.

- Updated dependencies
  - @krollins/blueprint@0.2.3

## 0.2.2

### Patch Changes

- ade8182: Fix icon lazy-loading in consumer bundler environments (Astro/Vite)

  The previous approach used `import.meta.url` + `new Function('url', 'return import(url)')` to compute icon module URLs at runtime. This broke in consumer builds because `import.meta.url` points to the consumer's bundled chunk location, not the original package layout.

  Replaced with a generated resolver module (`resolver.generated.ts`) containing static `import()` paths for all 430 icons. Static paths let the consumer's bundler (Vite, Rollup, esbuild) analyse and rewrite them at build time, so code-splitting works correctly in both dev and production.

- Updated dependencies [ade8182]
  - @krollins/blueprint@0.2.2

## 0.2.1

### Patch Changes

- bc44fe0: Add lazy-loading for `<bp-icon name="...">` consumer API

  When consumers use the `name` attribute (e.g., `<bp-icon name="check">`), the component now dynamically imports the icon module at runtime. This eliminates the need for consumers to pre-register icons or import a barrel file.
  - Icons loaded by name are cached in the registry so subsequent renders are instant
  - Internal components continue using the tree-shake-safe `.svg` property directly
  - Icon entry modules now include a `default` export alongside the named export

- Updated dependencies [bc44fe0]
  - @krollins/blueprint@0.2.1

## 0.2.0

### Minor Changes

- Add `svg` property to bp-icon for direct SVG string rendering

  The `bp-icon` component now accepts a `svg` property containing a raw SVG string. When set, it takes priority over the `name` property (registry lookup) and the default slot. This enables internal components to pass icon data as value bindings that survive bundler tree-shaking.

  Internal components (accordion, alert, avatar, drawer, notification, popover, table, tag, tree) now import icon SVG data as named value exports instead of relying on side-effect-only registry calls. This fixes icons not rendering when the library is consumed by Astro/Vite sites, because Rollup was stripping the side-effect-only imports during the library build.

  Icon entry modules now export their SVG string (`export const searchSvg = '...'`) instead of calling `registerIcon()` as a side effect. The `all.ts` barrel still registers all icons into the runtime registry for Storybook and consumer use with `name=`.

### Patch Changes

- Updated dependencies
  - @krollins/blueprint@0.2.0

## 0.1.16

### Patch Changes

- 55350af: Refactor bp-icon to use a shared runtime registry with tree-shakeable per-icon entry modules

  Icons are no longer bundled in a single generated registry file. Each icon is now a separate entry module (`source/components/icon/icons/entries/*.ts`) that self-registers via `registerIcon()` at import time. This enables tree-shaking — consumers can import only the icons they need instead of the entire icon set.

  Breaking changes:
  - `getIcon()` from `icons/registry.generated.js` is removed. Use `getIconSvg()` from `icon-registry.js` instead.
  - The `IconName` type is now exported from `icon-name.generated.js` and re-exported from the package index.
