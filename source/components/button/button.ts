import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { buttonStyles } from './button.style.js';

export type ButtonVariant =
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

@customElement('bp-button')
export class BpButton extends LitElement {
  @property({ type: String, reflect: true }) declare variant: ButtonVariant;
  @property({ type: String, reflect: true }) declare size: ButtonSize;
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;
  @property({ type: String, reflect: true }) declare type:
    | 'button'
    | 'submit'
    | 'reset';

  static styles = [buttonStyles];

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.disabled = false;
    this.type = 'button';
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
        ?disabled=${this.disabled}
        @click=${this.handleClick}
        aria-disabled=${this.disabled ? 'true' : 'false'}
      >
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-button': BpButton;
  }
}
