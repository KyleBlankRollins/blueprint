# Stepper

A multi-step wizard/stepper component for guiding users through sequential processes like forms, onboarding flows, or checkout workflows.

## Features

- **Linear and Non-Linear Modes**: Enforce sequential step completion or allow free navigation
- **Horizontal and Vertical Layouts**: Adapts to different design requirements
- **Clickable Navigation**: Navigate by clicking on completed steps
- **Error State Support**: Mark steps with validation errors
- **Manual Complete/Error Control**: Programmatically set step states
- **Keyboard Navigation**: Full keyboard accessibility support
- **Step Content Slots**: Dynamic content for each step via named slots
- **Size Variants**: Small, medium, and large sizes
- **Comprehensive Events**: Track step changes, completions, and clicks

## Usage

### Basic Stepper

```html
<bp-stepper id="checkout-stepper">
  <div slot="step-shipping">
    <h3>Shipping Address</h3>
    <bp-input label="Address"></bp-input>
  </div>
  <div slot="step-payment">
    <h3>Payment Method</h3>
    <bp-input label="Card Number"></bp-input>
  </div>
  <div slot="step-review">
    <h3>Review Order</h3>
    <p>Please review your order before submitting.</p>
  </div>
  <div slot="actions">
    <bp-button variant="secondary" onclick="stepper.previous()">Back</bp-button>
    <bp-button variant="primary" onclick="stepper.next()">Next</bp-button>
  </div>
</bp-stepper>

<script>
  const stepper = document.getElementById('checkout-stepper');
  stepper.steps = [
    { id: 'shipping', label: 'Shipping', description: 'Enter address' },
    { id: 'payment', label: 'Payment', description: 'Add payment method' },
    { id: 'review', label: 'Review', description: 'Confirm order' },
  ];
</script>
```

### Vertical Layout

```html
<bp-stepper orientation="vertical">
  <!-- steps -->
</bp-stepper>
```

### Non-Linear Mode

```html
<bp-stepper linear="false">
  <!-- users can jump to any step -->
</bp-stepper>
```

### With Error Handling

```javascript
const stepper = document.querySelector('bp-stepper');

// Validate current step before advancing
stepper.addEventListener('bp-step-change', (event) => {
  const { currentStep, previousStep } = event.detail;

  // Validate previous step
  if (!validateStep(previousStep)) {
    event.preventDefault();
    stepper.setStepError(previousStep, true);
  }
});

// Clear error when step is corrected
function onStepCorrected(stepIndex) {
  stepper.setStepError(stepIndex, false);
}
```

## API

### Properties

| Property      | Type                         | Default        | Description                                            |
| ------------- | ---------------------------- | -------------- | ------------------------------------------------------ |
| `steps`       | `Step[]`                     | `[]`           | Array of step configurations                           |
| `currentStep` | `number`                     | `0`            | Zero-based index of the current step                   |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout orientation                                     |
| `size`        | `'sm' \| 'md' \| 'lg'`       | `'md'`         | Component size variant                                 |
| `linear`      | `boolean`                    | `true`         | Whether steps must be completed in order               |
| `disabled`    | `boolean`                    | `false`        | Whether the entire stepper is disabled                 |
| `hideLabels`  | `boolean`                    | `false`        | Hide step labels (show only indicators)                |
| `clickable`   | `boolean`                    | `true`         | Whether completed steps are clickable to navigate back |

### Step Interface

```typescript
interface Step {
  id: string; // Unique identifier for the step
  label: string; // Display label
  description?: string; // Optional description text
  disabled?: boolean; // Whether this step is disabled
  icon?: string; // Optional icon name
  error?: string; // Error message (sets step to error state)
}
```

### Methods

| Method                               | Description                                        |
| ------------------------------------ | -------------------------------------------------- |
| `next()`                             | Navigate to the next step                          |
| `previous()`                         | Navigate to the previous step                      |
| `goToStep(index: number)`            | Navigate to a specific step (respects linear mode) |
| `reset()`                            | Reset to the first step and clear all states       |
| `setStepError(index, hasError)`      | Mark or clear error state on a step                |
| `setStepComplete(index, isComplete)` | Mark or clear complete state on a step             |

### Getters

| Getter              | Type                | Description                   |
| ------------------- | ------------------- | ----------------------------- |
| `isFirstStep`       | `boolean`           | Whether on the first step     |
| `isLastStep`        | `boolean`           | Whether on the last step      |
| `currentStepConfig` | `Step \| undefined` | Configuration of current step |

### Events

| Event              | Detail                          | Description                    |
| ------------------ | ------------------------------- | ------------------------------ |
| `bp-step-change`   | `{ currentStep, previousStep }` | Fired when step changes        |
| `bp-step-complete` | `{ step, stepIndex }`           | Fired when a step is completed |
| `bp-step-click`    | `{ step, stepIndex, status }`   | Fired when a step is clicked   |

### Slots

| Slot        | Description                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| `step-{id}` | Content for a specific step. Replace `{id}` with the step's `id` property (e.g., `slot="step-review"`) |
| `actions`   | Navigation buttons or action controls                                                                  |

### CSS Parts

| Part               | Description                              |
| ------------------ | ---------------------------------------- |
| `stepper`          | The root container                       |
| `step-list`        | Container for all step indicators        |
| `step`             | Individual step container                |
| `step-indicator`   | The numbered/icon circle for each step   |
| `step-content`     | Container for step label and description |
| `step-label`       | Step label text                          |
| `step-description` | Step description text                    |
| `connector`        | Line connecting steps                    |
| `panel`            | Content panel for current step           |
| `actions`          | Actions container slot                   |

## Design Tokens Used

### Semantic Tokens (Theme-Specific)

- `--bp-color-surface` - Panel background
- `--bp-color-surface-raised` - Step indicator background
- `--bp-color-primary` - Current step indicator color
- `--bp-color-success` - Complete step indicator color
- `--bp-color-error` - Error step indicator color
- `--bp-color-text` - Step label text color
- `--bp-color-text-muted` - Step description text color
- `--bp-color-border` - Connector and border colors
- `--bp-font-family-sans` - Typography
- `--bp-font-size-*` - Font sizes for different size variants
- `--bp-border-radius-full` - Circular step indicators
- `--bp-border-radius-md` - Panel border radius
- `--bp-spacing-*` - Consistent spacing throughout
- `--bp-shadow-sm` - Panel shadow
- `--bp-transition-fast` - State change animations

### Universal Tokens (Infrastructure)

- `--bp-z-base` - Default stacking context

## Accessibility

- Step list has `role="list"` with `role="listitem"` on each step
- Current step marked with `aria-current="step"`
- Panel has `role="tabpanel"` with `aria-labelledby` referencing step label
- Clickable steps are focusable and support Enter/Space activation
- Disabled steps marked with `aria-disabled="true"`
- Step indicators properly hide decorative content from screen readers
