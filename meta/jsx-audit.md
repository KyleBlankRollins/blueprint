# JSX Type Definitions Audit

Audit of `source/jsx.d.ts` against actual component `@property()` declarations. The goal is to ensure every JSX interface accurately reflects the component's public API.

## Summary

| Status                         | Count            |
| ------------------------------ | ---------------- |
| ✅ Match                       | 8                |
| ⚠️ Issues found                | 36               |
| Missing from jsx.d.ts entirely | 3 sub-components |

**Issue breakdown:**

- **~100 props missing** from jsx.d.ts that exist on components
- **~25 ghost props** in jsx.d.ts that don't exist on their components
- **~6 wrong prop names** (e.g. `activeStep` vs `currentStep`)
- **~5 type mismatches** (e.g. wrong variant union values)

---

## Issue Categories

### Category A: Ghost Props (exist in jsx.d.ts but NOT on component)

These cause the worst user experience — autocomplete suggests props that silently do nothing.

### Category B: Missing Props (exist on component but NOT in jsx.d.ts)

Users don't get autocomplete for valid props.

### Category C: Wrong Names (prop exists under a different name)

Users write the wrong attribute and it silently fails.

### Category D: Type Mismatches (prop exists but type is wrong)

Autocomplete suggests wrong values.

---

## Per-Component Checklist

### ✅ Components That Match (no changes needed)

- [x] `bp-breadcrumb-item` — `href`, `current`
- [x] `bp-card` — `variant`, `hoverable`, `clickable`, `noPadding`, `direction`
- [x] `bp-divider` — `orientation`, `spacing`, `variant`, `color`, `weight`
- [x] `bp-heading` — `level`, `size`, `weight`
- [x] `bp-link` — `href`, `target`, `rel`, `variant`, `underline`, `size`, `disabled`
- [x] `bp-menu` — `size`
- [x] `bp-pagination` — `currentPage`, `totalPages`, `siblingCount`, `boundaryCount`, `showFirstLast`, `showPrevNext`, `showInfo`, `disabled`, `size`
- [x] `bp-select` — `value`, `name`, `label`, `placeholder`, `disabled`, `required`, `size`
- [x] `bp-text` — `as`, `size`, `weight`, `variant`, `align`, `transform`, `tracking`, `line-height`, `clamp`, `italic`, `truncate`

### ⚠️ Components With Issues

---

#### bp-accordion

- [ ] **Add missing:** `variant` (AccordionVariant), `expandedItems` (string[]), `disabled` (boolean)
- [ ] **Remove ghost:** `bordered`

---

#### bp-accordion-item _(missing entirely)_

- [ ] **Add to BlueprintElements map** with interface:
  - `itemId` / `item-id` (string)
  - `header` (string)
  - `expanded` (boolean)
  - `disabled` (boolean)

---

#### bp-alert

- [ ] **Add missing:** `showIcon` (boolean)
- [ ] **Remove ghost:** `icon` (string)
- [ ] Note: jsx has `icon` (string) but component has `showIcon` (boolean) — different name AND type

---

#### bp-avatar

- [ ] **Add missing:** `clickable` (boolean), `name` (string)

---

#### bp-badge

- [ ] **Fix variant type:** component has `'neutral'`, jsx has `'secondary'` — update to match component
- [ ] **Remove ghost:** `pill`

---

#### bp-breadcrumb

- [ ] **Add missing:** `items` (BreadcrumbItem[]), `ariaLabel` / `aria-label` (string), `collapseOnMobile` / `collapse-on-mobile` (boolean), `maxItems` / `max-items` (number)

---

#### bp-button

- [ ] **Remove ghost:** `loading`, `fullWidth`

---

#### bp-checkbox

- [ ] **Add missing:** `size` (CheckboxSize), `error` (boolean)
- [ ] **Remove ghost:** `label`

---

#### bp-color-picker

- [ ] **Add missing:** `alpha` (boolean), `swatches` (string[]), `inline` (boolean), `readonly` (boolean), `size` (ColorPickerSize), `label` (string), `name` (string), `placeholder` (string)

---

#### bp-combobox

- [ ] **Add missing:** `name` (string), `required` (boolean), `allowCustomValue` (boolean)
- [ ] **Remove ghost:** `options` (ComboboxOption[]), `multiple`

---

#### bp-date-picker

- [ ] **Add missing:** `name` (string), `label` (string), `required` (boolean), `firstDayOfWeek` / `first-day-of-week` (number)
- [ ] **Remove ghost:** `format`

---

#### bp-drawer

- [ ] **Add missing:** `showClose` (boolean), `closeOnBackdrop` (boolean), `closeOnEscape` (boolean), `showBackdrop` (boolean), `label` (string), `inline` (boolean)
- [ ] **Remove ghost:** `header`, `closable`, `modal`
- [ ] Note: `closable` → `showClose`, `header` → `label`

---

#### bp-dropdown

- [ ] **Add missing:** `closeOnClickOutside` (boolean), `closeOnEscape` (boolean), `closeOnSelect` (boolean), `distance` (number), `arrow` (boolean), `panelRole` (string)
- [ ] **Remove ghost:** `trigger`

---

#### bp-file-upload

- [ ] **Add missing:** `name` (string), `label` (string), `description` (string), `required` (boolean), `variant` (string), `message` (string), `showPreviews` (boolean)

---

#### bp-icon

- [ ] **Fix prop name:** `label` → should reference `ariaLabel` (attribute: `aria-label`). Decide: keep as `label` mapping to `aria-label`, or use the HTML attribute name directly.

---

#### bp-input

- [ ] **Add missing:** `variant` (InputVariant), `label` (string), `helperText` (string), `errorMessage` (string), `inputmode` (string)
- [ ] **Fix types:** `min`, `max`, `step` — component uses `number`, jsx declares `string`

---

#### bp-menu-item _(missing entirely)_

- [ ] **Add to BlueprintElements map** with interface:
  - `value` (string)
  - `disabled` (boolean)
  - `selected` (boolean)
  - `hasSubmenu` (boolean)
  - `size` (MenuSize)
  - `shortcut` (string)

---

#### bp-menu-divider _(missing entirely)_

- [ ] **Add to BlueprintElements map** (no props, just `BaseHTMLAttributes`)

---

#### bp-modal

- [ ] **Add missing:** `ariaLabelledby` / `aria-labelledby` (string)
- [ ] **Remove ghost:** `header`, `closable`, `closeOnOverlayClick`, `closeOnEscape`

---

#### bp-multi-select

- [ ] **Add missing:** `name` (string), `required` (boolean), `maxSelections` (number), `clearable` (boolean)
- [ ] **Remove ghost:** `options` (MultiSelectOption[])

---

#### bp-notification

- [ ] **Add missing:** `open` (boolean), `closable` (boolean), `position` (string)
- [ ] **Remove ghost:** `dismissible`
- [ ] Note: `dismissible` → `closable`

---

#### bp-number-input

- [ ] **Add missing:** `name` (string), `label` (string), `required` (boolean), `variant` (NumberInputVariant), `message` (string), `precision` (number), `hideButtons` (boolean)

---

#### bp-popover

- [ ] **Add missing:** `arrow` (boolean), `showClose` (boolean), `closeOnOutsideClick` (boolean), `closeOnEscape` (boolean), `distance` (number), `showDelay` (number), `hideDelay` (number), `disabled` (boolean), `label` (string)
- [ ] **Remove ghost:** `offset`
- [ ] Note: `offset` → `distance`

---

#### bp-progress

- [ ] **Add missing:** `label` (string)

---

#### bp-radio

- [ ] **Add missing:** `size` (RadioSize), `error` (boolean)
- [ ] **Remove ghost:** `label`

---

#### bp-skeleton

- [ ] **Fix variant type:** add `'rounded'` to the union
- [ ] **Add missing:** `animated` (boolean), `lines` (number)
- [ ] **Remove ghost:** `animation`
- [ ] Note: jsx has `animation` (string enum), component has `animated` (boolean) — different name AND type

---

#### bp-slider

- [ ] **Add missing:** `name` (string), `label` (string), `showTicks` (boolean)
- [ ] Note: `formatValue` has `attribute: false`, omission is correct

---

#### bp-spinner

- [ ] **Add missing:** `label` (string)

---

#### bp-stepper

- [ ] **Fix prop name:** `activeStep` → `currentStep`
- [ ] **Add missing:** `steps` (Step[]), `size` (StepperSize), `disabled` (boolean), `hideLabels` (boolean), `clickable` (boolean), `showNavigation` (boolean)

---

#### bp-switch

- [ ] **Add missing:** `error` (boolean)
- [ ] **Remove ghost:** `label`

---

#### bp-table

- [ ] **Complete rewrite needed.** jsx.d.ts describes an entirely different/older version.
- [ ] **Add missing:** `columns`, `rows`, `variant` (TableVariant), `size` (TableSize), `selectable` (boolean), `multiSelect` (boolean), `selectedRows`, `sortState`, `stickyHeader` (boolean), `hoverable` (boolean), `loading` (boolean)
- [ ] **Remove ghost:** `striped`, `bordered`, `compact`

---

#### bp-tabs

- [ ] **Add missing:** `disabled` (boolean), `manual` (boolean)

---

#### bp-tab-panel

- [ ] **Complete rewrite needed.** All 4 current props are ghost props.
- [ ] **Add:** `tabId` / `tab-id` (string)
- [ ] **Remove ghost:** `value`, `label`, `disabled`, `icon`

---

#### bp-tag

- [ ] **Fix variant type:** component uses `'solid' | 'outlined'`, jsx has color values — these are completely wrong
- [ ] **Add missing:** `color` ('primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral'), `disabled` (boolean)
- [ ] Note: the current jsx `variant` values actually correspond to the component's `color` prop

---

#### bp-textarea

- [ ] **Add missing:** `variant` (TextareaVariant), `size` (TextareaSize), `label` (string), `helperText` (string), `errorMessage` (string), `autocomplete` (string), `spellcheck` (boolean), `wrap` (string)

---

#### bp-time-picker

- [ ] **Add missing:** `name` (string), `label` (string), `required` (boolean)

---

#### bp-tooltip

- [ ] **Add missing:** `disabled` (boolean)
- [ ] **Remove ghost:** `trigger`

---

#### bp-tree

- [ ] **Add missing:** `nodes` (TreeNode[]), `selectedId` (string), `expandedIds` (string[]), `showLines` (boolean), `size` (string)
- [ ] **Remove ghost:** `checkable`, `expandOnClick`

---

## Worst Offenders (by issue count)

| Component           | Missing | Ghost | Wrong Name | Type Mismatch | Priority |
| ------------------- | ------- | ----- | ---------- | ------------- | -------- |
| **bp-table**        | 10      | 3     | —          | —             | 🔴 High  |
| **bp-popover**      | 9       | 1     | 1          | —             | 🔴 High  |
| **bp-color-picker** | 8       | —     | —          | —             | 🔴 High  |
| **bp-textarea**     | 8       | —     | —          | —             | 🔴 High  |
| **bp-number-input** | 7       | —     | —          | —             | 🔴 High  |
| **bp-file-upload**  | 7       | —     | —          | —             | 🟡 Med   |
| **bp-drawer**       | 6       | 3     | 2          | —             | 🔴 High  |
| **bp-stepper**      | 6       | —     | 1          | —             | 🔴 High  |
| **bp-dropdown**     | 6       | 1     | —          | —             | 🟡 Med   |
| **bp-input**        | 5       | —     | —          | 3             | 🔴 High  |
| **bp-tree**         | 5       | 2     | —          | —             | 🟡 Med   |
| **bp-tab-panel**    | 1       | 4     | —          | —             | 🔴 High  |
| **bp-modal**        | 1       | 4     | —          | —             | 🟡 Med   |
| **bp-tag**          | 2       | —     | —          | 1             | 🟡 Med   |

## Implementation Notes

- When a component property uses `attribute: 'kebab-case'`, the JSX interface should use the **camelCase** property name (since JSX sets properties, not attributes).
- Props with `attribute: false` should be omitted from the JSX interface since they can only be set via JavaScript property access, not HTML attributes. However, JSX typically sets properties, so they could be included depending on framework behavior.
- Import component-specific types (e.g., `TableVariant`, `StepperSize`) at the top of jsx.d.ts rather than inlining union strings, for consistency and maintainability.
