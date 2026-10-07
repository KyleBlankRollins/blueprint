# Fieldset

Groups related form controls under a shared legend, with an optional description and a group-level error message.

Use it for sets of fields that belong together (an address, a payment method) and for groups of checkboxes that answer one question. For a single choice among options, use `bp-radio-group` instead.

## Features

- Native `<fieldset>` and `<legend>`, so screen readers announce the group name when focus enters it
- Description and error message linked to the group with `aria-describedby`
- `disabled` disables every control inside, and leaves controls that were already disabled alone when re-enabled
- Vertical or horizontal layout

## Usage

```html
<bp-fieldset
  legend="Shipping address"
  description="We only ship within the EU."
>
  <bp-input label="Street" name="street"></bp-input>
  <bp-input label="City" name="city"></bp-input>
</bp-fieldset>

<!-- A checkbox group answering one question -->
<bp-fieldset legend="Notifications" orientation="horizontal" required>
  <bp-checkbox name="notify" value="email">Email</bp-checkbox>
  <bp-checkbox name="notify" value="sms">SMS</bp-checkbox>
</bp-fieldset>

<!-- Group-level error -->
<bp-fieldset legend="Notifications" errorMessage="Choose at least one channel.">
  ...
</bp-fieldset>

<!-- Disable a whole section -->
<bp-fieldset legend="Billing" disabled>...</bp-fieldset>
```

## API

### Properties

| Property       | Type                         | Default      | Description                                                                   |
| -------------- | ---------------------------- | ------------ | ----------------------------------------------------------------------------- |
| `legend`       | `string`                     | `''`         | Group name, rendered as the `<legend>`                                        |
| `description`  | `string`                     | `''`         | Helper text shown under the legend and linked to the group                    |
| `errorMessage` | `string`                     | `''`         | Group-level error. Marks the group invalid and announces the message          |
| `required`     | `boolean`                    | `false`      | Adds an asterisk to the legend. Set `required` on the controls themselves too |
| `disabled`     | `boolean`                    | `false`      | Disables every control inside the group                                       |
| `orientation`  | `'vertical' \| 'horizontal'` | `'vertical'` | Stack the controls, or lay them out in a wrapping row                         |

### Slots

| Slot      | Description                                           |
| --------- | ----------------------------------------------------- |
| (default) | The grouped controls                                  |
| `legend`  | Rich legend content (overrides the `legend` property) |

### CSS Parts

| Part          | Description                             |
| ------------- | --------------------------------------- |
| `fieldset`    | The native fieldset element             |
| `legend`      | The legend                              |
| `description` | The description text                    |
| `content`     | The wrapper around the slotted controls |
| `error`       | The error message                       |

## Design Tokens Used

- `--bp-color-text`, `--bp-color-text-muted`, `--bp-color-error`
- `--bp-font-family`, `--bp-font-size-sm`, `--bp-font-weight-medium`, `--bp-line-height-normal`
- `--bp-spacing-xs`, `--bp-spacing-sm`, `--bp-spacing-lg`

## Accessibility

- Renders a native `fieldset`/`legend`, so the group has role `group` and its legend as its name
- `description` and `errorMessage` are referenced by `aria-describedby`; an error sets `aria-invalid="true"` and is announced with `role="alert"`
- The required asterisk is hidden from assistive technology; mark each required control with `required` so it is announced
