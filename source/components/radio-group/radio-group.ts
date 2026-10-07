import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { radioGroupStyles } from './radio-group.style.js';
import { FormControlMixin } from '../../utilities/form-control.js';
import {
  fieldMessageState,
  renderFieldMessage,
  fieldMessageStyles,
} from '../../utilities/field-message.js';
import type { BpRadio } from '../radio/radio.js';

export type RadioGroupOrientation = 'vertical' | 'horizontal';

const NEXT_KEYS = ['ArrowDown', 'ArrowRight'];
const PREV_KEYS = ['ArrowUp', 'ArrowLeft'];

/**
 * Groups `<bp-radio>` elements into a single choice: one `value`, one
 * `name` for form submission, a visible label, and the keyboard model of a
 * native radio group (Tab enters at the selected radio, arrow keys move and
 * select).
 *
 * Put `name`, `value`, `required` and `disabled` on the group, not on the
 * radios: the group submits the selected value itself, so it clears `name`
 * on its radios to avoid submitting the value twice.
 *
 * @element bp-radio-group
 *
 * @slot - The `<bp-radio>` options
 *
 * @fires bp-change - When the selection changes. Detail: `{ value: string }`
 *
 * @csspart group - The element with role="radiogroup"
 * @csspart label - The group label
 * @csspart helper-text - The helper text
 * @csspart options - The wrapper around the radios
 * @csspart error-message - The error message
 */
@customElement('bp-radio-group')
export class BpRadioGroup extends FormControlMixin(LitElement) {
  /** Visible group label */
  @property({ type: String }) declare label: string;

  /** Helper text displayed below the options */
  @property({ type: String }) declare helperText: string;

  /**
   * Error text. When set, the group is invalid: the message replaces the
   * helper text and is announced.
   */
  @property({ type: String }) declare errorMessage: string;

  /** @deprecated Use `helperText`. */
  @property({ type: String }) declare description: string;

  /** Name submitted with the form */
  @property({ type: String, reflect: true }) declare name: string;

  /** Value of the selected radio ('' when none is selected) */
  @property({ type: String, reflect: true }) declare value: string;

  /** Requires a selection before the form can submit */
  @property({ type: Boolean, reflect: true }) declare required: boolean;

  /** Disables every radio in the group */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /** Stack the radios vertically or lay them out in a wrapping row */
  @property({ type: String, reflect: true })
  declare orientation: RadioGroupOrientation;

  /** Radios this group disabled, so re-enabling leaves the rest alone */
  private disabledByGroup = new Set<BpRadio>();

  static styles = [fieldMessageStyles, radioGroupStyles];

  constructor() {
    super();
    this.label = '';
    this.description = '';
    this.helperText = '';
    this.errorMessage = '';
    this.name = '';
    this.value = '';
    this.required = false;
    this.disabled = false;
    this.orientation = 'vertical';
    this.addEventListener('bp-change', this.handleRadioChange);
    this.addEventListener('keydown', this.handleKeyDown);
  }

  /** The `<bp-radio>` elements in the group, in document order */
  get radios(): BpRadio[] {
    const slot = this.renderRoot?.querySelector<HTMLSlotElement>('slot');
    if (!slot) return [];
    const radios: BpRadio[] = [];
    for (const el of slot.assignedElements({ flatten: true })) {
      if (el.localName === 'bp-radio') radios.push(el as BpRadio);
      radios.push(
        ...(Array.from(el.querySelectorAll('bp-radio')) as BpRadio[])
      );
    }
    return radios;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('disabled')) this.syncDisabled();
    this.syncRadios();
  }

  private syncDisabled(): void {
    if (this.disabled) {
      for (const radio of this.radios) {
        if (!radio.disabled) {
          radio.disabled = true;
          this.disabledByGroup.add(radio);
        }
      }
    } else {
      for (const radio of this.disabledByGroup) radio.disabled = false;
      this.disabledByGroup.clear();
    }
  }

  /** Mirror `value` onto the radios and keep exactly one in the tab order */
  private syncRadios(): void {
    const radios = this.radios;
    for (const radio of radios) {
      if (radio.name) radio.name = '';
      radio.checked = this.value !== '' && radio.value === this.value;
    }
    const enabled = radios.filter((r) => !r.disabled);
    const tabbable = enabled.find((r) => r.checked) ?? enabled[0];
    for (const radio of radios) {
      radio.tabIndex = radio === tabbable ? 0 : -1;
    }
  }

  private handleSlotChange(): void {
    if (this.disabled) this.syncDisabled();
    this.syncRadios();
  }

  private handleRadioChange = (event: Event): void => {
    // A radio's own bp-change becomes the group's bp-change.
    if (event.target === this) return;
    const radio = event.target as BpRadio;
    if (radio.localName !== 'bp-radio') return;
    // Registered in the constructor, so this runs before any listener added
    // later on the group: they only ever see the group's own event.
    event.stopImmediatePropagation();
    if (!radio.checked || radio.value === this.value) {
      this.syncRadios();
      return;
    }
    this.value = radio.value;
    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    const forward = NEXT_KEYS.includes(event.key);
    if (!forward && !PREV_KEYS.includes(event.key)) return;
    const enabled = this.radios.filter((r) => !r.disabled);
    if (enabled.length === 0) return;
    const current = enabled.findIndex((r) => r === event.target);
    const step = forward ? 1 : -1;
    const next =
      enabled[(current + step + enabled.length) % enabled.length] ?? enabled[0];
    event.preventDefault();
    next.focus();
    next.select();
  };

  /** Like a native radio group, submit nothing until a radio is selected */
  getFormValue(): string | null {
    return this.value || null;
  }

  getFormValidity() {
    if (this.required && !this.value) {
      return {
        flags: { valueMissing: true },
        message: 'Please select one of these options.',
      };
    }
    return { flags: {}, message: '' };
  }

  /** Point the browser's "please select" bubble at the group's tab stop */
  getValidityAnchor(): HTMLElement | null {
    return this.radios.find((r) => r.tabIndex === 0) ?? null;
  }

  render() {
    const message = {
      helperText: this.helperText || this.description,
      errorMessage: this.errorMessage,
    };
    const { invalid, describedBy } = fieldMessageState(message);

    return html`
      <div
        class=${classMap({
          'radio-group': true,
          [`radio-group--${this.orientation}`]: true,
          'radio-group--invalid': invalid,
        })}
        part="group"
        role="radiogroup"
        aria-labelledby=${this.label ? 'label' : nothing}
        aria-describedby=${describedBy ?? nothing}
        aria-required=${this.required ? 'true' : nothing}
        aria-invalid=${invalid ? 'true' : nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
      >
        ${
          this.label
            ? html`<div id="label" class="radio-group__label" part="label">
                ${this.label}
                ${
                  this.required
                    ? html`<span
                        class="radio-group__required"
                        aria-hidden="true"
                        >*</span
                      >`
                    : nothing
                }
              </div>`
            : nothing
        }
        <div class="radio-group__options" part="options">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
        ${renderFieldMessage(message)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-radio-group': BpRadioGroup;
  }
}
