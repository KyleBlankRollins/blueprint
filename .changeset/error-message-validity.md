---
'@krollins/blueprint': minor
---

`errorMessage` now makes a form control invalid for its form

Setting `errorMessage` on Input, Textarea, Select, Combobox, Multi-select, Number Input, Date Picker, Time Picker, Slider, Color Picker, Radio Group, Checkbox or Switch now works like a native `setCustomValidity()`: the control reports `customError` with the message as its `validationMessage`, `form.checkValidity()`/`reportValidity()` return false, and the form won't submit. The message takes precedence over the control's own validation (`required`, `min`/`max`, `pattern`, ...); disabled controls are still excluded from validation. On Number Input the deprecated `message` shown as the error with `variant="error"` counts too.

- **Behavior change:** apps must clear `errorMessage` (set it to `''`) once the problem is fixed, or the form stays blocked. A server-side error left on a field after the user corrects it will now stop the next submit.
- Form controls built on `FormControlMixin` can override the new `getCustomValidityMessage()` to change which message blocks submission. `syncCustomValidity()` and `customErrorValidity()` are exported for controls that manage their own `ElementInternals`.
- File Upload is not form-associated, so its `errorMessage` stays visual only.
