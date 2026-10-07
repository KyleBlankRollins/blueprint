import { LitElement, html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { iconButtonStyles } from './icon-button.style.js';
import { BpIcon, type IconSize } from '../icon/icon.js';
import type { IconName } from '../icon/icons/icon-name.generated.js';

export type IconButtonVariant =
  'ghost' | 'secondary' | 'primary' | 'success' | 'error' | 'warning' | 'info';
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonShape = 'square' | 'circle';

const ICON_SIZE: Record<IconButtonSize, IconSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

/**
 * A square button that shows only an icon. Because there is no visible
 * text, `label` is required: it becomes the button's accessible name.
 *
 * @element bp-icon-button
 *
 * @fires bp-click - The button was activated (not fired while disabled). `detail.originalEvent` is the click
 *
 * @slot - A custom icon (an `<svg>` or `<bp-icon>`), used when `icon` is not set
 *
 * @csspart button - The native button
 * @csspart icon - The icon
 */
@customElement('bp-icon-button')
export class BpIconButton extends LitElement {
  static dependencies = [BpIcon];

  /** Name of a built-in icon */
  @property({ type: String }) declare icon: IconName | '';

  /** Accessible name, e.g. "Close" or "Delete row". Required */
  @property({ type: String }) declare label: string;

  /** Visual style. `ghost` (the default) has no fill or border until hovered */
  @property({ type: String, reflect: true }) declare variant: IconButtonVariant;

  /** `sm` 32px, `md` 40px, `lg` 48px square */
  @property({ type: String, reflect: true }) declare size: IconButtonSize;

  /** Corner shape */
  @property({ type: String, reflect: true }) declare shape: IconButtonShape;

  /** Whether the button is disabled */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /** Native button type */
  @property({ type: String, reflect: true }) declare type:
    'button' | 'submit' | 'reset';

  static styles = [iconButtonStyles];

  private warnedMissingLabel = false;

  constructor() {
    super();
    this.icon = '';
    this.label = '';
    this.variant = 'ghost';
    this.size = 'md';
    this.shape = 'square';
    this.disabled = false;
    this.type = 'button';
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (!this.label.trim() && !this.warnedMissingLabel) {
      this.warnedMissingLabel = true;
      console.warn(
        '<bp-icon-button> needs a `label`: it is the only accessible name an icon-only button has.',
        this
      );
    }
  }

  /** Move focus to the button */
  focus(options?: FocusOptions): void {
    this.shadowRoot?.querySelector('button')?.focus(options);
  }

  /** Remove focus from the button */
  blur(): void {
    this.shadowRoot?.querySelector('button')?.blur();
  }

  private handleClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.dispatchEvent(
      new CustomEvent('bp-click', {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <button
        part="button"
        class="button button--${this.variant} button--${this.size}"
        type=${this.type}
        aria-label=${this.label}
        ?disabled=${this.disabled}
        @click=${this.handleClick}
      >
        ${
          this.icon
            ? html`<bp-icon
                part="icon"
                name=${this.icon}
                size=${ICON_SIZE[this.size] ?? 'md'}
                aria-hidden="true"
              ></bp-icon>`
            : html`<span class="icon-slot" part="icon" aria-hidden="true"
                ><slot></slot
              ></span>`
        }
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-icon-button': BpIconButton;
  }
}
