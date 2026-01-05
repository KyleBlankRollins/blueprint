# Progress

A progress bar component for displaying task completion status or loading indicators.

## Features

- Determinate and indeterminate modes
- Multiple visual variants (primary, success, warning, error, info)
- Three size options (sm, md, lg)
- Optional label and percentage display
- Completion event when progress reaches 100%
- Smooth animations and transitions
- Accessible with proper ARIA attributes
- Customizable via CSS parts

## Usage

```html
<!-- Basic progress bar -->
<bp-progress value="50" max="100"></bp-progress>

<!-- With label and percentage -->
<bp-progress value="75" label="Uploading file" show-value></bp-progress>

<!-- Success variant -->
<bp-progress value="100" variant="success"></bp-progress>

<!-- Indeterminate loading state -->
<bp-progress indeterminate></bp-progress>

<!-- Custom max value -->
<bp-progress value="25" max="50"></bp-progress>

<!-- Large size with error variant -->
<bp-progress value="30" size="lg" variant="error"></bp-progress>
```

## API

### Properties

| Property        | Type              | Default     | Description                                                 |
| --------------- | ----------------- | ----------- | ----------------------------------------------------------- |
| `value`         | `number`          | `0`         | Current progress value                                      |
| `max`           | `number`          | `100`       | Maximum value for progress (value will be clamped to 0-max) |
| `variant`       | `ProgressVariant` | `'primary'` | Visual variant of the progress bar                          |
| `size`          | `ProgressSize`    | `'md'`      | Size of the progress bar                                    |
| `label`         | `string`          | `''`        | Optional label text displayed above the progress bar        |
| `showValue`     | `boolean`         | `false`     | Whether to show percentage text                             |
| `indeterminate` | `boolean`         | `false`     | Whether the progress bar is indeterminate (loading state)   |

**ProgressVariant**: `'primary' | 'success' | 'warning' | 'error' | 'info'`

**ProgressSize**: `'sm' | 'md' | 'lg'`

### Events

| Event         | Detail | Description                      |
| ------------- | ------ | -------------------------------- |
| `bp-complete` | -      | Fired when progress reaches 100% |

### CSS Parts

| Part     | Description                              |
| -------- | ---------------------------------------- |
| `track`  | The background track of the progress bar |
| `bar`    | The filled portion of the progress bar   |
| `header` | The label/value header (when visible)    |

## Design Tokens Used

- `--bp-color-primary` - Primary variant bar color
- `--bp-color-success` - Success variant bar color
- `--bp-color-warning` - Warning variant bar color
- `--bp-color-error` - Error variant bar color
- `--bp-color-info` - Info variant bar color
- `--bp-color-surface` - Track background color
- `--bp-color-text` - Label text color
- `--bp-color-text-muted` - Percentage text color
- `--bp-border-radius-full` - Fully rounded corners
- `--bp-font-family-sans` - Font family for labels
- `--bp-font-size-sm` - Label and value font size
- `--bp-font-weight-medium` - Label font weight
- `--bp-spacing-xs` - Header bottom margin
- `--bp-spacing-1` - Small bar height
- `--bp-spacing-2` - Medium bar height
- `--bp-spacing-3` - Large bar height
- `--bp-transition-normal` - Bar width transition
- `--bp-transition-slow` - Indeterminate animation speed

## Accessibility

- Uses `role="progressbar"` for proper semantic meaning
- Sets `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` attributes
- Provides `aria-label` using the label prop or default text
- Omits `aria-valuenow` when in indeterminate state (per ARIA spec)
- Visual progress is reinforced with optional percentage display
