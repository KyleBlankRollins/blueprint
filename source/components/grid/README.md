# Grid

Lays its children out on a CSS grid with a gap from the spacing scale. Give it a fixed number of `columns`, or a `min-column-width` to fit as many columns as the space allows, which makes the grid responsive without media queries.

## Usage

```html
<!-- Three equal columns -->
<bp-grid columns="3" gap="md">
  <bp-card>One</bp-card>
  <bp-card>Two</bp-card>
  <bp-card>Three</bp-card>
</bp-grid>

<!-- As many 14rem-or-wider columns as fit -->
<bp-grid min-column-width="14rem" gap="lg">
  <bp-card>Starter</bp-card>
  <bp-card>Team</bp-card>
  <bp-card>Business</bp-card>
</bp-grid>

<!-- Items can span columns with standard CSS -->
<bp-grid columns="12" gap="xs">
  <div style="grid-column: span 8">Main</div>
  <div style="grid-column: span 4">Aside</div>
</bp-grid>
```

## API

### Properties

| Property         | Attribute          | Type                                                               | Default     | Description                                                                     |
| ---------------- | ------------------ | ------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------- |
| `columns`        | `columns`          | `number`                                                           | `1`         | Number of equal-width columns. Ignored when `minColumnWidth` is set.            |
| `minColumnWidth` | `min-column-width` | `string`                                                           | `''`        | Minimum column width as a CSS length. Fits as many columns as the space allows. |
| `gap`            | `gap`              | `'none' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'`      | Space between rows and columns, from `--bp-spacing-*`.                          |
| `align`          | `align`            | `'start' \| 'center' \| 'end' \| 'stretch'`                        | `'stretch'` | Vertical alignment of items within their row.                                   |

A column never overflows a narrow container: `min-column-width` is capped at 100% of the grid's width.

### Events

This component does not emit any events.

### Slots

| Slot      | Description    |
| --------- | -------------- |
| (default) | The grid items |

### CSS Parts

None. The host is the grid container, so style it directly. The computed template is exposed as the private custom property `--_bp-grid-template`; don't rely on it.

## Design Tokens Used

- `--bp-spacing-2xs` … `--bp-spacing-2xl` - Row and column gap

## Accessibility

Grid is purely presentational: it adds no role, and reading and focus order follow the source order of the children. For tabular data, use `<bp-table>` instead.
