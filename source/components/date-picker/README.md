# bp-date-picker

A calendar-based date picker component that allows users to select dates through an interactive calendar interface with month/year navigation.

## Features

- ✅ **Calendar Interface** - Interactive grid-based calendar for intuitive date selection
- ✅ **Month/Year Navigation** - Navigate between months with previous/next buttons
- ✅ **Keyboard Navigation** - Full arrow key support for date navigation
- ✅ **Date Constraints** - Set minimum and maximum selectable dates
- ✅ **Today Highlighting** - Current date clearly indicated in calendar
- ✅ **First Day of Week** - Configurable starting day (Sunday or Monday)
- ✅ **Accessibility** - ARIA grid pattern with keyboard navigation and screen reader support
- ✅ **Form Integration** - Works seamlessly with standard HTML forms
- ✅ **Size Variants** - Small, medium (default), and large sizes
- ✅ **Design Tokens** - Fully themeable using CSS custom properties

## Usage

### Basic Date Picker

```html
<bp-date-picker placeholder="Select a date"></bp-date-picker>
```

### With Initial Value

```html
<bp-date-picker value="2024-03-15" placeholder="Select a date"></bp-date-picker>
```

### With Date Constraints

```html
<!-- Only allow dates in March 2024 -->
<bp-date-picker
  min="2024-03-01"
  max="2024-03-31"
  placeholder="Select a date in March"
>
</bp-date-picker>

<!-- Only allow future dates -->
<bp-date-picker min="2024-06-01" placeholder="Select a future date">
</bp-date-picker>
```

### Different Sizes

```html
<bp-date-picker size="small" placeholder="Small date picker"></bp-date-picker>
<bp-date-picker size="medium" placeholder="Medium date picker"></bp-date-picker>
<bp-date-picker size="large" placeholder="Large date picker"></bp-date-picker>
```

### Week Starting Monday

```html
<bp-date-picker firstDayOfWeek="1" placeholder="Select a date"></bp-date-picker>
```

### In Forms

```html
<form>
  <label for="birthdate">Birth Date</label>
  <bp-date-picker
    name="birthdate"
    required
    max="2024-12-31"
    placeholder="Select your birth date"
  >
  </bp-date-picker>

  <button type="submit">Submit</button>
</form>
```

### Handling Date Selection

```html
<bp-date-picker id="event-date"></bp-date-picker>

<script>
  const picker = document.getElementById('event-date');
  picker.addEventListener('bp-change', (e) => {
    console.log('Selected date:', e.detail.date);
    console.log('Formatted value:', e.detail.value);
  });
</script>
```

## API

### Properties

| Property         | Type                             | Default           | Description                                  |
| ---------------- | -------------------------------- | ----------------- | -------------------------------------------- |
| `value`          | `string`                         | `''`              | Selected date in YYYY-MM-DD format           |
| `name`           | `string`                         | `''`              | Form field name for form submissions         |
| `placeholder`    | `string`                         | `'Select a date'` | Placeholder text shown when no date selected |
| `disabled`       | `boolean`                        | `false`           | Disables the date picker                     |
| `required`       | `boolean`                        | `false`           | Marks the field as required for forms        |
| `size`           | `'small' \| 'medium' \| 'large'` | `'medium'`        | Visual size of the date picker               |
| `min`            | `string`                         | `''`              | Minimum selectable date in YYYY-MM-DD format |
| `max`            | `string`                         | `''`              | Maximum selectable date in YYYY-MM-DD format |
| `firstDayOfWeek` | `0 \| 1`                         | `0`               | First day of week (0 = Sunday, 1 = Monday)   |

### Events

| Event       | Detail                          | Description                                                                                |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------ |
| `bp-change` | `{ value: string, date: Date }` | Fired when a date is selected. `value` is formatted as YYYY-MM-DD, `date` is a Date object |

### CSS Parts

The following parts are exposed for custom styling:

| Part            | Description                            |
| --------------- | -------------------------------------- |
| `input-wrapper` | Container for input and dropdown       |
| `input`         | The text input element                 |
| `calendar`      | The calendar dropdown container        |
| `header`        | Calendar header with navigation        |
| `nav-button`    | Previous/next month navigation buttons |
| `month-year`    | Month and year display text            |
| `weekdays`      | Container for weekday headers          |
| `days`          | Container for calendar day cells       |

### Example: Custom Styling

```css
bp-date-picker::part(calendar) {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

bp-date-picker::part(input) {
  border-color: #3b82f6;
}

bp-date-picker::part(nav-button) {
  color: #3b82f6;
}
```

## Keyboard Shortcuts

When the calendar is open:

| Key                   | Action                                                        |
| --------------------- | ------------------------------------------------------------- |
| **Arrow Down**        | Open calendar (when closed)                                   |
| **Enter** / **Space** | Open calendar (when closed) / Select focused date (when open) |
| **Escape**            | Close calendar                                                |
| **Arrow Left**        | Move focus one day backward                                   |
| **Arrow Right**       | Move focus one day forward                                    |
| **Arrow Up**          | Move focus one week backward                                  |
| **Arrow Down**        | Move focus one week forward                                   |
| **Home**              | Move focus to first day of month                              |
| **End**               | Move focus to last day of month                               |
| **Page Up**           | Move focus one month backward                                 |
| **Page Down**         | Move focus one month forward                                  |
| **Shift + Page Up**   | Move focus one year backward                                  |
| **Shift + Page Down** | Move focus one year forward                                   |

## Design Tokens

This component uses the following design tokens for styling:

**Colors:**

- `--bp-color-text` - Primary text color
- `--bp-color-text-muted` - Muted text (weekdays, other months)
- `--bp-color-text-inverse` - Inverse text (selected dates)
- `--bp-color-border` - Border color
- `--bp-color-border-strong` - Stronger border (input focus)
- `--bp-color-surface` - Surface background
- `--bp-color-primary` - Primary brand color (selected dates)
- `--bp-color-primary-hover` - Hover state for primary elements
- `--bp-color-focus` - Focus ring color

**Spacing:**

- `--bp-spacing-xs` through `--bp-spacing-24` - Component spacing

**Typography:**

- `--bp-font-family` - Font family
- `--bp-font-size-xs` through `--bp-font-size-xl` - Font sizes
- `--bp-font-weight-semibold`, `--bp-font-weight-bold` - Font weights

**Borders:**

- `--bp-border-width` - Border width
- `--bp-border-radius-sm`, `--bp-border-radius-md` - Border radius

**Effects:**

- `--bp-shadow-md` - Dropdown shadow
- `--bp-transition-fast` - Transition duration
- `--bp-z-dropdown` - Dropdown z-index

## Accessibility

The date picker implements the [ARIA grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) for accessibility:

- **Keyboard Navigation**: Full support for arrow keys, Page Up/Down, Home/End
- **ARIA Attributes**: Proper `role="grid"`, `role="gridcell"`, `role="columnheader"` attributes
- **Focus Management**: Visible focus indicators and logical tab order
- **Screen Readers**: Announces selected dates, disabled dates, and navigation context
- **Form Integration**: Works with native form validation and submission

## Browser Support

Works in all modern browsers that support:

- Custom Elements (Web Components)
- ES2020
- CSS Grid
- CSS Custom Properties
