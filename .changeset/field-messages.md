---
'@krollins/blueprint': minor
---

One way to show help and error text on every form control

Input, Textarea, Select, Combobox, Multi-select, Number Input, Date Picker, Time Picker, Slider, Color Picker, File Upload, Checkbox, Switch and Radio Group now all take `helperText` and `errorMessage`. Help text sits under the control; an error message replaces it, is announced with `role="alert"`, sets `aria-invalid="true"` on the control and turns its border (or track, thumb, box) to the error color. Both are linked to the control with `aria-describedby` and exposed as the `helper-text` and `error-message` CSS parts. The shared helper is exported from `utilities` as `renderFieldMessage`, `fieldMessageState` and `fieldMessageStyles`.

- **Behavior change (Input, Textarea):** `errorMessage` now shows whenever it is set. It used to show only with `variant="error"`, which still works.
- **Deprecated:** `message` on Number Input and File Upload (shown as the error when `variant="error"`, otherwise as helper text) and `description` on Radio Group (shown as helper text). Radio Group's `description` and `error` parts are now `helper-text` and `error-message`.
- **Date Picker** now shows its `label` above the input, like the other fields, instead of using it only as an accessible name.
- **Number Input**'s label is now associated with its input.
