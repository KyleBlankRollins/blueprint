# bp-time-picker

A time picker component with dropdown time selection supporting both 12-hour and 24-hour formats with configurable time intervals.

## Features

- ✅ **12-Hour and 24-Hour Formats** - Switch between AM/PM and 24-hour time display
- ✅ **Configurable Intervals** - Set custom time steps (15, 30, 60 minutes, etc.)
- ✅ **Dropdown Selection** - Click to reveal scrollable time options
- ✅ **Keyboard Support** - Navigate with keyboard (ArrowDown, Escape, Enter)
- ✅ **Clear Functionality** - Easy-to-use clear button when value is set
- ✅ **Accessibility** - Full ARIA support with listbox pattern
- ✅ **Form Integration** - Works seamlessly with standard HTML forms
- ✅ **Size Variants** - sm, md (default), and lg sizes
- ✅ **Design Tokens** - Fully themeable using CSS custom properties

## Usage

### Basic Time Picker

```html
<bp-time-picker placeholder="Select time"></bp-time-picker>
```

### With Initial Value

```html
<bp-time-picker value="2:30 PM" placeholder="Appointment time"></bp-time-picker>
```

### 24-Hour Format

```html
<bp-time-picker format="24" value="14:30" placeholder="Time"></bp-time-picker>
```

### Different Sizes

```html
<bp-time-picker size="sm" placeholder="Small"></bp-time-picker>
<bp-time-picker size="md" placeholder="Medium"></bp-time-picker>
<bp-time-picker size="lg" placeholder="Large"></bp-time-picker>
```

### Custom Time Intervals

```html
<!-- 30-minute intervals -->
<bp-time-picker step="30" placeholder="Every 30 minutes"></bp-time-picker>

<!-- 60-minute intervals (hourly) -->
<bp-time-picker step="60" placeholder="Every hour"></bp-time-picker>
```

### In Forms

```html
<form>
  <label for="meeting-time">Meeting Time</label>
  <bp-time-picker
    name="meeting-time"
    label="Meeting time"
    required
    placeholder="Select time"
  ></bp-time-picker>

  <button type="submit">Schedule</button>
</form>
```

### Handling Time Selection

```html
<bp-time-picker id="time"></bp-time-picker>

<script>
  const picker = document.getElementById('time');
  picker.addEventListener('bp-change', (e) => {
    console.log('Selected time:', e.detail.value);
    console.log('Hours:', e.detail.hours);
    console.log('Minutes:', e.detail.minutes);
  });
</script>
```

## API

### Properties

| Property      | Type                   | Default         | Description                                      |
| ------------- | ---------------------- | --------------- | ------------------------------------------------ |
| `value`       | `string`               | `''`            | Selected time (format: "HH:MM AM/PM" or "HH:MM") |
| `name`        | `string`               | `''`            | Form field name for form submissions             |
| `label`       | `string`               | `''`            | Accessible label for screen readers              |
| `placeholder` | `string`               | `'Select time'` | Placeholder text shown when no time selected     |
| `disabled`    | `boolean`              | `false`         | Disables the time picker                         |
| `required`    | `boolean`              | `false`         | Marks the field as required for forms            |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`          | Visual size of the time picker                   |
| `format`      | `'12' \| '24'`         | `'12'`          | Time format (12-hour or 24-hour)                 |
| `step`        | `number`               | `15`            | Time interval in minutes (e.g., 15, 30, 60)      |

### Events

| Event       | Detail                                                                     | Description                                                                                 |
| ----------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `bp-change` | `{ value: string, hours: number, minutes: number, previousValue: string }` | Fired when time is selected. `value` is formatted string, `hours` and `minutes` are numbers |

### CSS Parts

The following parts are exposed for custom styling:

| Part            | Description                       |
| --------------- | --------------------------------- |
| `input-wrapper` | Container wrapping input and icon |
| `input`         | The text input element            |
| `icon`          | The clock icon indicator          |
| `clear-button`  | The clear button (when value set) |
| `dropdown`      | The time options dropdown         |
| `time-option`   | Individual time option in list    |

### Example: Custom Styling

```css
bp-time-picker::part(dropdown) {
  max-height: 300px;
}

bp-time-picker::part(input) {
  border-color: #3b82f6;
}

bp-time-picker::part(time-option) {
  padding: 12px 16px;
}
```

## Keyboard Shortcuts

| Key            | Action                                      |
| -------------- | ------------------------------------------- |
| **Arrow Down** | Open dropdown (when closed)                 |
| **Enter**      | Open dropdown (closed) / Select time (open) |
| **Space**      | Open dropdown (closed) / Select time (open) |
| **Escape**     | Close dropdown                              |

## Time Format Examples

### 12-Hour Format (Default)

```html
<bp-time-picker format="12"></bp-time-picker>
```

**Output:** 12:00 AM, 12:15 AM, 12:30 AM, ..., 11:45 PM

### 24-Hour Format

```html
<bp-time-picker format="24"></bp-time-picker>
```

**Output:** 00:00, 00:15, 00:30, ..., 23:45

## Design Tokens

This component uses the following design tokens for styling:

**Colors:**

- `--bp-color-text` - Primary text color
- `--bp-color-text-muted` - Muted text (icon, placeholder)
- `--bp-color-border` - Border color
- `--bp-color-surface` - Background color
- `--bp-color-primary` - Primary brand color (hover, selected)
- `--bp-color-focus` - Focus ring color

**Spacing:**

- `--bp-spacing-xs` through `--bp-spacing-2xl` - Component spacing
- `--bp-focus-width` - Focus outline width

**Typography:**

- `--bp-font-family` - Font family
- `--bp-font-size-sm` through `--bp-font-size-xl` - Font sizes
- `--bp-font-weight-semibold` - Font weight for selected time

**Borders:**

- `--bp-border-width` - Border width
- `--bp-border-radius-sm`, `--bp-border-radius-md` - Border radius

**Effects:**

- `--bp-shadow-md` - Dropdown shadow
- `--bp-transition-fast` - Transition duration
- `--bp-z-dropdown` - Dropdown z-index

## Accessibility

- **ARIA Roles**: Input has `aria-haspopup="listbox"`, dropdown has `role="listbox"`, options have `role="option"`
- **ARIA States**: `aria-expanded` reflects dropdown state, `aria-selected` marks selected time
- **ARIA Labels**: Clear button has descriptive `aria-label="Clear time"`
- **Keyboard Navigation**: Full keyboard support for opening, closing, and selecting times
- **Screen Readers**: Proper label support with `label` property for context
