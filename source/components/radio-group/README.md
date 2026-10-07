# Radio Group

Groups `bp-radio` elements into a single choice with one value, one form field, a visible label, and the keyboard model of a native radio group.

Use it whenever radios answer one question. Put `name`, `value`, `required` and `disabled` on the group, not on the radios.

## Features

- `role="radiogroup"` labelled by `label`, with description and error linked by `aria-describedby`
- Roving tab stop: Tab enters at the selected radio (or the first enabled one), arrow keys move and select, wrapping and skipping disabled radios
- Takes part in native forms: submits the selected value under `name`, blocks submission when `required` and empty, and resets with the form
- One `bp-change` event per selection, from the group

## Usage

```html
<bp-radio-group label="Delivery speed" name="delivery" value="standard">
  <bp-radio value="standard">Standard (3-5 days)</bp-radio>
  <bp-radio value="express">Express (1-2 days)</bp-radio>
  <bp-radio value="overnight">Overnight</bp-radio>
</bp-radio-group>

<!-- Horizontal, required, with an error -->
<bp-radio-group
  label="Plan"
  name="plan"
  orientation="horizontal"
  required
  errorMessage="Choose a plan to continue."
>
  <bp-radio value="free">Free</bp-radio>
  <bp-radio value="team">Team</bp-radio>
</bp-radio-group>
```

```javascript
document.querySelector('bp-radio-group').addEventListener('bp-change', (e) => {
  console.log('Selected:', e.detail.value);
});
```

## API

### Properties

| Property       | Type                         | Default      | Description                                                                                                                                        |
| -------------- | ---------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`        | `string`                     | `''`         | Visible group label                                                                                                                                |
| `description`  | `string`                     | `''`         | **Deprecated.** Use `helperText`                                                                                                                   |
| `helperText`   | `string`                     | `''`         | Helper text below the group, linked with `aria-describedby`                                                                                        |
| `errorMessage` | `string`                     | `''`         | Error text. When set, the group is invalid: the message replaces the helper text, is announced (`role="alert"`), and the group gets `aria-invalid` |
| `name`         | `string`                     | `''`         | Name submitted with the form                                                                                                                       |
| `value`        | `string`                     | `''`         | Value of the selected radio (`''` when none)                                                                                                       |
| `required`     | `boolean`                    | `false`      | Requires a selection before the form can submit                                                                                                    |
| `disabled`     | `boolean`                    | `false`      | Disables every radio; ones already disabled stay disabled when re-enabled                                                                          |
| `orientation`  | `'vertical' \| 'horizontal'` | `'vertical'` | Stack the radios, or lay them out in a wrapping row                                                                                                |

### Events

| Event       | Detail              | Description                      |
| ----------- | ------------------- | -------------------------------- |
| `bp-change` | `{ value: string }` | Fired when the selection changes |

The radios' own `bp-change` events stop at the group.

### Slots

| Slot      | Description            |
| --------- | ---------------------- |
| (default) | The `bp-radio` options |

### CSS Parts

| Part            | Description                          |
| --------------- | ------------------------------------ |
| `group`         | The element with `role="radiogroup"` |
| `label`         | The group label                      |
| `helper-text`   | The helper text                      |
| `options`       | The wrapper around the radios        |
| `error-message` | The error message                    |

## Design Tokens Used

- `--bp-color-text`, `--bp-color-text-muted`, `--bp-color-error`
- `--bp-font-family`, `--bp-font-size-sm`, `--bp-font-weight-medium`, `--bp-line-height-normal`
- `--bp-spacing-xs`, `--bp-spacing-sm`, `--bp-spacing-lg`

## Accessibility

- Follows the WAI-ARIA radio group pattern: one tab stop, arrow keys to move, Space to select
- The group clears `name` on its radios so the value is submitted once, by the group
- `required` sets `aria-required="true"`; the asterisk itself is hidden from assistive technology
