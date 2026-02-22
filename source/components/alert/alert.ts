import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { alertStyles } from './alert.style.js';
import { infoCircleSvg } from '../icon/icons/entries/info-circle.js';
import { checkCircleSvg } from '../icon/icons/entries/check-circle.js';
import { warningCircleSvg } from '../icon/icons/entries/warning-circle.js';
import { crossCircleSvg } from '../icon/icons/entries/cross-circle.js';
import { crossSvg } from '../icon/icons/entries/cross.js';
import '../icon/icon.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const VARIANT_ICONS: Record<AlertVariant, string> = {
  info: infoCircleSvg,
  success: checkCircleSvg,
  warning: warningCircleSvg,
  error: crossCircleSvg,
};

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

  private getVariantIconSvg(): string {
    return VARIANT_ICONS[this.variant];
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
                  <slot name="icon">
                    <bp-icon .svg=${this.getVariantIconSvg()}></bp-icon>
                  </slot>
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
                <bp-icon .svg=${crossSvg}></bp-icon>
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
