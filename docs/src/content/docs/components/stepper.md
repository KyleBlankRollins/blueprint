---
title: Stepper
description: Multi-step workflow progress indicator
---

The `bp-stepper` component displays progress through a multi-step workflow or wizard. It provides visual feedback on completed, current, and upcoming steps.

## Import

```javascript
import 'blueprint/components/stepper';
```

## Examples

### Default

<div class="component-preview">
  <bp-stepper id="stepper-demo" current-step="1"></bp-stepper>
</div>

```html
<bp-stepper id="stepper-demo" current-step="1"></bp-stepper>

<script>
  document.querySelector('#stepper-demo').steps = [
    { id: 'account', label: 'Account' },
    { id: 'profile', label: 'Profile' },
    { id: 'review', label: 'Review' },
    { id: 'complete', label: 'Complete' },
  ];
</script>
```

### With Descriptions

<div class="component-preview">
  <bp-stepper id="stepper-descriptions" current-step="1"></bp-stepper>
</div>

```javascript
document.querySelector('#stepper-descriptions').steps = [
  { id: 'account', label: 'Account', description: 'Create your account' },
  { id: 'profile', label: 'Profile', description: 'Add your details' },
  { id: 'review', label: 'Review', description: 'Verify information' },
];
```

### Vertical Orientation

<div class="component-preview">
  <bp-stepper orientation="vertical" id="stepper-vertical" current-step="1"></bp-stepper>
</div>

```html
<bp-stepper orientation="vertical" current-step="1">...</bp-stepper>
```

### Sizes

<div class="component-preview">
  <div style="display: flex; flex-direction: column; gap: 2rem;">
    <bp-stepper size="sm" id="stepper-sm" current-step="1"></bp-stepper>
    <bp-stepper size="md" id="stepper-md" current-step="1"></bp-stepper>
    <bp-stepper size="lg" id="stepper-lg" current-step="1"></bp-stepper>
  </div>
</div>

```html
<bp-stepper size="sm">...</bp-stepper>
<bp-stepper size="md">...</bp-stepper>
<bp-stepper size="lg">...</bp-stepper>
```

### Linear vs Non-Linear

Linear steppers require steps to be completed in order:

<div class="component-preview">
  <bp-stepper linear id="stepper-linear" current-step="1"></bp-stepper>
</div>

Non-linear steppers allow jumping to any step:

<div class="component-preview">
  <bp-stepper linear="false" clickable id="stepper-nonlinear" current-step="1"></bp-stepper>
</div>

```html
<!-- Linear (default) - must complete steps in order -->
<bp-stepper linear>...</bp-stepper>

<!-- Non-linear - can navigate to any step -->
<bp-stepper linear="false" clickable>...</bp-stepper>
```

### With Error State

<div class="component-preview">
  <bp-stepper id="stepper-error" current-step="2"></bp-stepper>
</div>

```javascript
const stepper = document.querySelector('#stepper-error');
stepper.steps = [
  { id: 'step1', label: 'Step 1' },
  { id: 'step2', label: 'Step 2', error: 'Validation failed' },
  { id: 'step3', label: 'Step 3' },
];
```

### Hide Labels

<div class="component-preview">
  <bp-stepper hide-labels id="stepper-nolabels" current-step="2"></bp-stepper>
</div>

```html
<bp-stepper hide-labels>...</bp-stepper>
```

### With Icons

<div class="component-preview">
  <bp-stepper id="stepper-icons" current-step="1"></bp-stepper>
</div>

```javascript
document.querySelector('#stepper-icons').steps = [
  { id: 'cart', label: 'Cart', icon: 'shopping-cart' },
  { id: 'shipping', label: 'Shipping', icon: 'truck' },
  { id: 'payment', label: 'Payment', icon: 'credit-card' },
  { id: 'confirm', label: 'Confirm', icon: 'check' },
];
```

## API Reference

### Properties

| Property      | Type                         | Default        | Description                      |
| ------------- | ---------------------------- | -------------- | -------------------------------- |
| `steps`       | `Step[]`                     | `[]`           | Array of step configurations     |
| `currentStep` | `number`                     | `0`            | Zero-based index of current step |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout orientation               |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`         | Component size variant           |
| `linear`      | `boolean`                    | `true`         | Steps must be completed in order |
| `disabled`    | `boolean`                    | `false`        | Disable entire stepper           |
| `hideLabels`  | `boolean`                    | `false`        | Show only step indicators        |
| `clickable`   | `boolean`                    | `true`         | Completed steps can be clicked   |

### Step Interface

```typescript
interface Step {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: string;
  error?: string;
}
```

### Events

| Event              | Detail     | Description                     |
| ------------------ | ---------- | ------------------------------- |
| `bp-step-change`   | `{ step }` | Fired when current step changes |
| `bp-step-complete` | `{ step }` | Fired when a step is completed  |
| `bp-step-click`    | `{ step }` | Fired when a step is clicked    |

### Slots

| Slot        | Description                   |
| ----------- | ----------------------------- |
| `step-{id}` | Custom content for step panel |
| `actions`   | Navigation buttons            |

### CSS Parts

| Part               | Description                  |
| ------------------ | ---------------------------- |
| `stepper`          | Main container               |
| `step-list`        | Step indicators container    |
| `step`             | Individual step container    |
| `step-indicator`   | Step number/icon circle      |
| `step-content`     | Label and description area   |
| `step-label`       | Step label text              |
| `step-description` | Step description text        |
| `connector`        | Line connecting steps        |
| `panel`            | Content panel                |
| `actions`          | Navigation actions container |

### Step Status Values

- `pending`: Step not yet reached
- `current`: Currently active step
- `complete`: Step has been completed
- `error`: Step has an error

### Accessibility

- Uses `aria-current="step"` for current step
- Step indicators have `aria-label` with status
- Disabled steps are properly marked
- Keyboard navigation between clickable steps
