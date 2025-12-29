import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { buttonStyles } from './button.style.js';

@customElement('bp-button')
export class BpButton extends LitElement {
  /**
   * Visual style variant of the button
   */
  @property({ type: String }) variant: 'primary' | 'secondary' = 'primary';

  /**
   * Size of the button
   */
  @property({ type: String }) size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Whether the button is disabled
   */
  @property({ type: Boolean }) disabled: boolean = false;

  static styles = [buttonStyles];

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    /**
     * Fired when the button is clicked
     */
    this.dispatchEvent(
      new CustomEvent('bp-click', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <button
        class="button button--${this.variant} button--${this.size}"
        ?disabled=${this.disabled}
        @click=${this.handleClick}
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
