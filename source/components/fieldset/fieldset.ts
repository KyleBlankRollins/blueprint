import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { fieldsetStyles } from './fieldset.style.js';

export type FieldsetOrientation = 'vertical' | 'horizontal';

type Disableable = Element & { disabled: boolean };

const isDisableable = (el: Element): el is Disableable =>
  'disabled' in el && typeof (el as Disableable).disabled === 'boolean';

/**
 * Groups related form controls under a shared legend, with an optional
 * description and a group-level error message. Renders a native
 * `<fieldset>`/`<legend>`, so assistive technology announces the group name
 * when focus enters any control inside it.
 *
 * @element bp-fieldset
 *
 * @slot - The grouped controls
 * @slot legend - Rich legend content (overrides the `legend` property)
 *
 * @csspart fieldset - The native fieldset element
 * @csspart legend - The legend
 * @csspart description - The description text
 * @csspart content - The wrapper around the slotted controls
 * @csspart error - The error message
 */
@customElement('bp-fieldset')
export class BpFieldset extends LitElement {
  /** Group name, rendered as the `<legend>` */
  @property({ type: String }) declare legend: string;

  /** Helper text shown under the legend and linked to the group */
  @property({ type: String }) declare description: string;

  /** Group-level error. When set, the group is marked invalid and the message is announced */
  @property({ type: String }) declare errorMessage: string;

  /** Marks the group as required (adds an asterisk to the legend) */
  @property({ type: Boolean, reflect: true }) declare required: boolean;

  /**
   * Disables every control inside the group. Controls that were already
   * disabled stay disabled when the group is re-enabled.
   */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /** Stack the controls vertically or lay them out in a wrapping row */
  @property({ type: String, reflect: true })
  declare orientation: FieldsetOrientation;

  @state() private hasLegendSlot = false;

  /** Controls this fieldset disabled, so re-enabling leaves the rest alone */
  private disabledByFieldset = new Set<Disableable>();

  static styles = [fieldsetStyles];

  constructor() {
    super();
    this.legend = '';
    this.description = '';
    this.errorMessage = '';
    this.required = false;
    this.disabled = false;
    this.orientation = 'vertical';
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('disabled')) {
      this.syncDisabled();
    }
  }

  /** Every element with a boolean `disabled` property inside the group */
  private getControls(): Disableable[] {
    const slot =
      this.renderRoot.querySelector<HTMLSlotElement>('slot:not([name])');
    if (!slot) return [];
    const controls: Disableable[] = [];
    for (const node of slot.assignedElements({ flatten: true })) {
      for (const el of [node, ...Array.from(node.querySelectorAll('*'))]) {
        if (isDisableable(el)) controls.push(el);
      }
    }
    return controls;
  }

  private syncDisabled(): void {
    if (this.disabled) {
      for (const control of this.getControls()) {
        if (!control.disabled) {
          control.disabled = true;
          this.disabledByFieldset.add(control);
        }
      }
    } else {
      for (const control of this.disabledByFieldset) {
        control.disabled = false;
      }
      this.disabledByFieldset.clear();
    }
  }

  private handleSlotChange(): void {
    if (this.disabled) this.syncDisabled();
  }

  private handleLegendSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement;
    this.hasLegendSlot = slot.assignedNodes({ flatten: true }).length > 0;
  }

  render() {
    const hasError = Boolean(this.errorMessage);
    const describedBy =
      [this.description ? 'description' : '', hasError ? 'error-message' : '']
        .filter(Boolean)
        .join(' ') || nothing;

    return html`
      <fieldset
        class=${classMap({
          fieldset: true,
          [`fieldset--${this.orientation}`]: true,
          'fieldset--invalid': hasError,
          'fieldset--disabled': this.disabled,
        })}
        part="fieldset"
        aria-describedby=${describedBy}
        aria-invalid=${hasError ? 'true' : nothing}
      >
        <legend
          class="fieldset__legend"
          part="legend"
          ?hidden=${!this.legend && !this.hasLegendSlot}
        >
          <slot name="legend" @slotchange=${this.handleLegendSlotChange}
            >${this.legend}</slot
          >
          ${
            this.required
              ? html`<span class="fieldset__required" aria-hidden="true"
                  >*</span
                >`
              : nothing
          }
        </legend>
        ${
          this.description
            ? html`<p
                id="description"
                class="fieldset__description"
                part="description"
              >
                ${this.description}
              </p>`
            : nothing
        }
        <div class="fieldset__content" part="content">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
        ${
          hasError
            ? html`<p
                id="error-message"
                class="fieldset__error"
                part="error"
                role="alert"
              >
                ${this.errorMessage}
              </p>`
            : nothing
        }
      </fieldset>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-fieldset': BpFieldset;
  }
}
