# Stack

Lays its children out in a single column or row with a gap from the spacing scale. Use it for the space between siblings instead of margins on the children: a vertical stack for form fields and page sections, a horizontal one (with `wrap`) for button groups, tags and toolbars.

## Usage

```html
<!-- Form fields, 16px apart -->
<bp-stack gap="md">
  <bp-input label="Name"></bp-input>
  <bp-input label="Email" type="email"></bp-input>
</bp-stack>

<!-- Right-aligned button group -->
<bp-stack direction="horizontal" gap="xs" justify="end">
  <bp-button variant="secondary">Cancel</bp-button>
  <bp-button>Save</bp-button>
</bp-stack>

<!-- Tags that wrap onto new lines -->
<bp-stack direction="horizontal" gap="xs" wrap>
  <bp-tag>Design</bp-tag>
  <bp-tag>Tokens</bp-tag>
</bp-stack>
```

## API

### Properties

| Property    | Type                                                                | Default      | Description                                              |
| ----------- | ------------------------------------------------------------------- | ------------ | -------------------------------------------------------- |
| `direction` | `'vertical' \| 'horizontal'`                                        | `'vertical'` | Main axis: a column or a row.                            |
| `gap`       | `'none' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`  | `'md'`       | Space between items, from `--bp-spacing-*`.              |
| `align`     | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`           | `'stretch'`  | Cross-axis alignment of the items.                       |
| `justify`   | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'`    | Main-axis distribution of the items.                     |
| `wrap`      | `boolean`                                                           | `false`      | Let items wrap onto new lines when they run out of room. |

All properties reflect to attributes, so the layout is styled from attribute selectors.

### Events

This component does not emit any events.

### Slots

| Slot      | Description          |
| --------- | -------------------- |
| (default) | The items to lay out |

### CSS Parts

None. The host is the flex container, so style it directly.

## Design Tokens Used

- `--bp-spacing-2xs` … `--bp-spacing-2xl` - Gap between items

## Accessibility

Stack is purely presentational: it adds no role and does not change reading or focus order, which follow the source order of the children. Avoid `justify` or `direction` choices that make the visual order differ from the source order.
