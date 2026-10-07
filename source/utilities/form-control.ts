import type { LitElement, PropertyValues } from 'lit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T;

/** A value `ElementInternals.setFormValue()` accepts. */
export type FormValue = string | File | FormData | null;

/** Validity flags plus the message the browser shows for them. */
export interface FormValidity {
  flags: ValidityStateFlags;
  message: string;
}

const VALIDITY_KEYS = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'tooLong',
  'tooShort',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
  'badInput',
  'customError',
] as const satisfies ReadonlyArray<keyof ValidityStateFlags>;

/** The shape a form control element needs for the mixin to read it. */
interface FormControlHost extends LitElement {
  name?: string | null;
  value?: unknown;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string | null;
}

/**
 * Public API added by {@link FormControlMixin}.
 *
 * Declared separately so the mixin's return type can be expressed in .d.ts
 * output (TypeScript cannot emit anonymous classes with non-public members).
 */
export declare class FormControlInterface {
  static formAssociated: boolean;
  /** The `<form>` this control belongs to, if any. */
  readonly form: HTMLFormElement | null;
  /** Labels associated with the control (e.g. `<label for>` in light DOM). */
  readonly labels: NodeList | null;
  /** Current validity state, as on native form controls. */
  readonly validity: ValidityState | null;
  /** Message describing why the control is invalid ('' when valid). */
  readonly validationMessage: string;
  /** Whether the control takes part in constraint validation. */
  readonly willValidate: boolean;
  /** Returns true when the control is valid; fires `invalid` otherwise. */
  checkValidity(): boolean;
  /** Like checkValidity(), and shows the browser's validation message. */
  reportValidity(): boolean;
  /** Restores the value the control had when it first rendered. */
  formResetCallback(): void;
  /** Restores a value the browser saved (back/forward navigation, autofill). */
  formStateRestoreCallback(state: string | File | FormData | null): void;
  /**
   * The value submitted with the form. Defaults to `value` as a string;
   * arrays submit one entry per item. Override for other value shapes.
   */
  getFormValue(): FormValue;
  /**
   * Validity to report. Defaults to mirroring `getValidityTarget()` when it
   * returns a native input, else to `valueMissing` when `required` and empty.
   */
  getFormValidity(): FormValidity;
  /**
   * App-set error that marks the control invalid for its form, like a
   * native `setCustomValidity()`. Defaults to `errorMessage`. While it is
   * non-empty the control reports `customError` with this message, taking
   * precedence over `getFormValidity()`.
   */
  getCustomValidityMessage(): string;
  /** A native input/textarea whose constraint validation is mirrored. */
  getValidityTarget(): HTMLInputElement | HTMLTextAreaElement | null;
  /** The focusable element the browser's validation bubble points at. */
  getValidityAnchor(): HTMLElement | null;
  /** Pushes value and validity to the form. Runs after every update. */
  syncFormState(): void;
}

const isEmpty = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);

/** Validity for an app-set error message, like `setCustomValidity()`. */
export const customErrorValidity = (message: string): FormValidity => ({
  flags: { customError: true },
  message,
});

/**
 * Marks a form-associated element invalid while `message` is non-empty
 * (and it is not disabled), else clears its validity. For controls that
 * manage their own `ElementInternals` instead of using
 * {@link FormControlMixin}.
 */
export const syncCustomValidity = (
  internals: ElementInternals | null,
  message: string | null | undefined,
  disabled: boolean,
  anchor?: HTMLElement | null
): void => {
  if (!internals) return;
  if (message && !disabled) {
    const { flags } = customErrorValidity(message);
    internals.setValidity(flags, message, anchor ?? undefined);
  } else {
    internals.setValidity({});
  }
};

const cloneValue = (value: unknown): unknown =>
  Array.isArray(value) ? [...value] : value;

/**
 * Makes a Lit element a form-associated custom element: its `name` and
 * `value` are submitted with an enclosing `<form>`, `required` takes part in
 * constraint validation, and form reset restores the initial value.
 *
 * The host must expose `name`, `value`, `required` and `disabled` properties.
 * Components that override `updated()` must call `super.updated()`.
 *
 * @example
 * ```ts
 * @customElement('bp-input')
 * export class BpInput extends FormControlMixin(LitElement) { ... }
 * ```
 */
export const FormControlMixin = <T extends Constructor<LitElement>>(
  superClass: T
) => {
  class FormControlElement extends superClass {
    static formAssociated = true;

    /** @internal */
    _internals: ElementInternals | null = null;
    /** @internal */
    _initialValue: unknown = undefined;
    /** @internal */
    _initialValueCaptured = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      try {
        this._internals = this.attachInternals();
      } catch {
        // Environments without ElementInternals: the control still works,
        // it just does not take part in native form submission.
        this._internals = null;
      }
    }

    get form(): HTMLFormElement | null {
      return this._internals?.form ?? null;
    }

    get labels(): NodeList | null {
      return this._internals?.labels ?? null;
    }

    get validity(): ValidityState | null {
      return this._internals?.validity ?? null;
    }

    get validationMessage(): string {
      return this._internals?.validationMessage ?? '';
    }

    get willValidate(): boolean {
      return this._internals?.willValidate ?? false;
    }

    checkValidity(): boolean {
      return this._internals?.checkValidity() ?? true;
    }

    reportValidity(): boolean {
      return this._internals?.reportValidity() ?? true;
    }

    formResetCallback(): void {
      (this as unknown as FormControlHost).value = cloneValue(
        this._initialValue
      );
    }

    formStateRestoreCallback(state: string | File | FormData | null): void {
      if (typeof state === 'string') {
        (this as unknown as FormControlHost).value = state;
      }
    }

    getFormValue(): FormValue {
      const host = this as unknown as FormControlHost;
      const { value } = host;
      if (value === null || value === undefined) return null;
      if (Array.isArray(value)) {
        if (!host.name) return null;
        const data = new FormData();
        for (const item of value) data.append(host.name, String(item));
        return data;
      }
      return String(value);
    }

    getValidityTarget(): HTMLInputElement | HTMLTextAreaElement | null {
      return null;
    }

    getValidityAnchor(): HTMLElement | null {
      return (
        this.getValidityTarget() ??
        this.renderRoot?.querySelector<HTMLElement>(
          'input:not([type="hidden"]), textarea, [role="combobox"], [tabindex="0"], button'
        ) ??
        null
      );
    }

    getFormValidity(): FormValidity {
      const target = this.getValidityTarget();
      if (target) {
        const flags: ValidityStateFlags = {};
        for (const key of VALIDITY_KEYS) {
          if (target.validity[key]) flags[key] = true;
        }
        return { flags, message: target.validationMessage };
      }
      const host = this as unknown as FormControlHost;
      if (host.required && isEmpty(host.value)) {
        return {
          flags: { valueMissing: true },
          message: 'Please fill out this field.',
        };
      }
      return { flags: {}, message: '' };
    }

    getCustomValidityMessage(): string {
      return (this as unknown as FormControlHost).errorMessage ?? '';
    }

    syncFormState(): void {
      const host = this as unknown as FormControlHost;

      // Form submission uses the host's `name` attribute.
      if (host.name) {
        if (this.getAttribute('name') !== host.name) {
          this.setAttribute('name', host.name);
        }
      }

      const internals = this._internals;
      if (!internals) return;

      internals.setFormValue(host.disabled ? null : this.getFormValue());

      const customMessage = this.getCustomValidityMessage();
      const { flags, message } = customMessage
        ? customErrorValidity(customMessage)
        : this.getFormValidity();
      const invalid = Object.values(flags).some(Boolean);
      if (invalid && !host.disabled) {
        internals.setValidity(
          flags,
          message,
          this.getValidityAnchor() ?? undefined
        );
      } else {
        internals.setValidity({});
      }
    }

    protected override updated(changed: PropertyValues): void {
      super.updated(changed);
      if (!this._initialValueCaptured) {
        this._initialValue = cloneValue(
          (this as unknown as FormControlHost).value
        );
        this._initialValueCaptured = true;
      }
      this.syncFormState();
    }
  }

  return FormControlElement as unknown as Constructor<FormControlInterface> & {
    formAssociated: boolean;
  } & T;
};
