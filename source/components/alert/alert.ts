import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { alertStyles } from './alert.style.js';
import { ALERT_ICONS } from './alert-icons.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * An alert component for displaying notification messages to users.
 *
 * @slot - Message content
 * @slot title - Optional title/heading for the alert
 * @slot icon - Optional custom icon (replaces default icon)
 *
 * @fires bp-close - Fired when the alert is dismissed (cancelable)
 */
@customElement('bp-alert')
export class BpAlert extends LitElement {
  /**
   * Visual variant indicating the type of alert
   */
  @property({ type: String, reflect: true }) declare variant: AlertVariant;

  /**
   * Whether the alert can be dismissed by the user
   */
  @property({ type: Boolean, reflect: true }) declare dismissible: boolean;

  /**
   * Whether to show a default icon for the variant
   */
  @property({ type: Boolean, reflect: true }) declare showIcon: boolean;

  static styles = [alertStyles];

  constructor() {
    super();
    this.variant = 'info';
    this.dismissible = false;
    this.showIcon = false;
  }

  private handleClose() {
    const event = new CustomEvent('bp-close', {
      detail: {
        variant: this.variant,
        timestamp: Date.now(),
      },
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    this.dispatchEvent(event);

    // Only remove if event wasn't prevented
    if (!event.defaultPrevented) {
      this.remove();
    }
  }

  private renderIcon() {
    if (!this.showIcon) return null;
    return ALERT_ICONS[this.variant];
  }

  render() {
    return html`
      <div
        class="alert alert--${this.variant}"
        part="alert"
        role="alert"
        aria-live="polite"
      >
        <div class="alert-content">
          ${this.showIcon
            ? html`
                <div class="alert-icon" part="icon">
                  <slot name="icon">${this.renderIcon()}</slot>
                </div>
              `
            : null}
          <div class="alert-message" part="message">
            <slot name="title"></slot>
            <slot></slot>
          </div>
        </div>
        ${this.dismissible
          ? html`
              <button
                class="alert-close"
                part="close-button"
                @click=${this.handleClose}
                aria-label="Close alert"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            `
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-alert': BpAlert;
  }
}
