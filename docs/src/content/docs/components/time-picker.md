---
title: Time Picker
description: Dropdown time selection component
---

The `bp-time-picker` component provides a dropdown interface for selecting times. It supports both 12-hour and 24-hour formats with configurable step intervals.

## Import

```javascript
import 'blueprint/components/time-picker';
```

## Examples

### Default

<div class="component-preview">
  <bp-time-picker placeholder="Select time..."></bp-time-picker>
</div>

```html
<bp-time-picker placeholder="Select time..."></bp-time-picker>
```

### With Label

<div class="component-preview">
  <bp-time-picker label="Meeting Time" placeholder="Select time..."></bp-time-picker>
</div>

```html
<bp-time-picker
  label="Meeting Time"
  placeholder="Select time..."
></bp-time-picker>
```

### With Initial Value

<div class="component-preview">
  <bp-time-picker label="Alarm" value="9:30 AM"></bp-time-picker>
</div>

```html
<bp-time-picker label="Alarm" value="9:30 AM"></bp-time-picker>
```

### 24-Hour Format

<div class="component-preview">
  <bp-time-picker format="24" value="14:30" label="24-hour format"></bp-time-picker>
</div>

```html
<bp-time-picker format="24" value="14:30"></bp-time-picker>
```

### Step Intervals

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <bp-time-picker step="15" label="15 minute intervals" placeholder="Select time..."></bp-time-picker>
    <bp-time-picker step="30" label="30 minute intervals" placeholder="Select time..."></bp-time-picker>
    <bp-time-picker step="60" label="1 hour intervals" placeholder="Select time..."></bp-time-picker>
  </div>
</div>

```html
<bp-time-picker step="15" label="15 minute intervals"></bp-time-picker>
<bp-time-picker step="30" label="30 minute intervals"></bp-time-picker>
<bp-time-picker step="60" label="1 hour intervals"></bp-time-picker>
```

### Sizes

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <bp-time-picker size="small" placeholder="Small"></bp-time-picker>
    <bp-time-picker size="medium" placeholder="Medium"></bp-time-picker>
    <bp-time-picker size="large" placeholder="Large"></bp-time-picker>
  </div>
</div>

```html
<bp-time-picker size="small" placeholder="Small"></bp-time-picker>
<bp-time-picker size="medium" placeholder="Medium"></bp-time-picker>
<bp-time-picker size="large" placeholder="Large"></bp-time-picker>
```

### Disabled

<div class="component-preview">
  <bp-time-picker disabled label="Disabled" value="2:00 PM"></bp-time-picker>
</div>

```html
<bp-time-picker disabled label="Disabled" value="2:00 PM"></bp-time-picker>
```

### Required

<div class="component-preview">
  <bp-time-picker required label="Appointment Time" placeholder="Select time..."></bp-time-picker>
</div>

```html
<bp-time-picker required label="Appointment Time"></bp-time-picker>
```

## API Reference

### Properties

| Property      | Type                             | Default         | Description                    |
| ------------- | -------------------------------- | --------------- | ------------------------------ |
| `value`       | `string`                         | `''`            | Selected time value            |
| `name`        | `string`                         | `''`            | Name for form submission       |
| `label`       | `string`                         | `''`            | Label text                     |
| `placeholder` | `string`                         | `'Select time'` | Placeholder text               |
| `disabled`    | `boolean`                        | `false`         | Whether the picker is disabled |
| `required`    | `boolean`                        | `false`         | Whether selection is required  |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'`      | Size of the picker             |
| `format`      | `'12' \| '24'`                   | `'12'`          | Time format (12 or 24-hour)    |
| `step`        | `number`                         | `15`            | Minute intervals in dropdown   |

### Events

| Event       | Detail                     | Description                       |
| ----------- | -------------------------- | --------------------------------- |
| `bp-change` | `{ value, previousValue }` | Fired when time selection changes |

### CSS Parts

| Part            | Description                 |
| --------------- | --------------------------- |
| `input-wrapper` | The input wrapper container |
| `input`         | The text input field        |
| `icon`          | The clock icon indicator    |
| `clear-button`  | The clear button            |
| `dropdown`      | The time options dropdown   |
| `time-option`   | Individual time option      |

### Time Formats

**12-hour format:**

- Input: `9:30 AM`, `2:15 PM`, `12:00 AM`
- Displayed with AM/PM suffix

**24-hour format:**

- Input: `09:30`, `14:15`, `00:00`
- Displayed without suffix

### Keyboard Navigation

- **Arrow Down/Up**: Navigate through time options
- **Enter**: Select focused time
- **Escape**: Close dropdown
- **Tab**: Move to next element

### Accessibility

- Dropdown menu with proper ARIA attributes
- Keyboard navigation support
- Screen reader announces time selection
