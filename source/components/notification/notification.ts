import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { notificationStyles } from './notification.style.js';
import { booleanConverter } from '../../utilities/boolean-converter.js';
import { checkSvg } from '../icon/icons/entries/check.js';
import { warningCircleSvg } from '../icon/icons/entries/warning-circle.js';
import { crossSvg } from '../icon/icons/entries/cross.js';
import { infoCircleSvg } from '../icon/icons/entries/info-circle.js';
import { BpIcon } from '../icon/icon.js';

/**
 * A notification/toast component for displaying non-blocking messages.
 * Notifications can be dismissed manually or auto-close after a duration.
 *
 * @fires bp-close - Dispatched when the notification is closed
 * @fires bp-show - Dispatched when the notification becomes visible
 * @fires bp-hide - Dispatched when the notification is hidden
 *
 * @slot - Default slot for notification content
 * @slot icon - Custom icon to display
 * @slot action - Action buttons or links
 *
 * @csspart base - The notification container
 * @csspart icon - The icon container
 * @csspart content - The content area
 * @csspart message - The message text container
 * @csspart action - The action slot container
 * @csspart close-button - The close button
 */
@customElement('bp-notification')
export class BpNotification extends LitElement {
  /**
   * Child components that self-register as custom elements on import.
   * Value imports prevent bundler tree-shaking of the registration side effect.
   */
  static dependencies = [BpIcon];

  /** The notification variant */
  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) => {
        const valid = ['info', 'success', 'warning', 'error'];
        return value && valid.includes(value) ? value : 'info';
      },
    },
  })
  declare variant: 'info' | 'success' | 'warning' | 'error';

  /** Whether the notification is visible */
  @property({ type: Boolean, reflect: true }) declare open: boolean;

  /** Whether the notification can be dismissed */
  @property({ converter: booleanConverter, reflect: true })
  declare closable: boolean;

  /** Duration in milliseconds before auto-close (0 = no auto-close) */
  @property({ type: Number }) declare duration: number;

  /** Title of the notification */
  @property({ type: String }) declare title: string;

  /** Message content of the notification */
  @property({ type: String }) declare message: string;

  /**
   * Position of the notification on screen.
   * Note: For multiple notifications, consider using a container component.
   */
  @property({
    type: String,
    converter: {
      fromAttribute: (value: string | null) => {
        const valid = [
          'top-left',
          'top-center',
          'top-right',
          'bottom-left',
          'bottom-center',
          'bottom-right',
        ];
        return value && valid.includes(value) ? value : 'top-right';
      },
    },
  })
  declare position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

  @state() private autoCloseTimer: number | null = null;
  @state() private remainingTime: number = 0;
  @state() private timerPaused: boolean = false;
  @state() private isExiting: boolean = false;

  static styles = [notificationStyles];

  constructor() {
    super();
    this.variant = 'info';
    this.open = false;
    this.closable = true;
    this.duration = 0;
    this.title = '';
    this.message = '';
    this.position = 'top-right';
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }

    if (changedProperties.has('duration') && this.open) {
      this.startAutoCloseTimer();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearAutoCloseTimer();
  }

  /** Show the notification */
  show() {
    if (this.open) return;
    this.open = true;
  }

  /** Hide the notification */
  hide() {
    if (!this.open) return;
    this.open = false;
  }

  /**
   * Handles the notification opening.
   * Dispatches bp-show event, starts auto-close timer, and manages focus.
   */
  private handleOpen() {
    this.isExiting = false;
    this.dispatchEvent(
      new CustomEvent('bp-show', { bubbles: true, composed: true })
    );
    this.startAutoCloseTimer();

    // Focus close button for accessibility
    this.updateComplete.then(() => {
      if (this.closable) {
        const closeButton = this.shadowRoot?.querySelector(
          '.notification__close'
        ) as HTMLElement;
        closeButton?.focus();
      }
    });
  }

  /**
   * Handles the notification closing.
   * Clears auto-close timer and dispatches bp-hide event.
   */
  private handleClose() {
    this.clearAutoCloseTimer();
    this.dispatchEvent(
      new CustomEvent('bp-hide', { bubbles: true, composed: true })
    );
  }

  /**
   * Starts the auto-close timer based on the duration property.
   * Timer can be paused/resumed with pauseAutoCloseTimer/resumeAutoCloseTimer.
   */
  private startAutoCloseTimer() {
    this.clearAutoCloseTimer();

    if (this.duration > 0 && !this.timerPaused) {
      this.remainingTime = this.duration;
      this.autoCloseTimer = window.setTimeout(() => {
        this.hide();
      }, this.duration);
    }
  }

  /**
   * Clears the auto-close timer if it exists.
   */
  private clearAutoCloseTimer() {
    if (this.autoCloseTimer) {
      window.clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  /**
   * Pauses the auto-close timer when user hovers or focuses.
   * Allows users to read content or interact with actions.
   */
  private pauseAutoCloseTimer() {
    if (this.autoCloseTimer && this.duration > 0) {
      this.timerPaused = true;
      window.clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  /**
   * Resumes the auto-close timer with remaining time.
   */
  private resumeAutoCloseTimer() {
    if (this.timerPaused && this.duration > 0) {
      this.timerPaused = false;
      this.autoCloseTimer = window.setTimeout(() => {
        this.hide();
      }, this.remainingTime);
    }
  }

  /**
   * Handles close button click.
   * Hides notification and dispatches bp-close event.
   */
  private handleCloseClick() {
    this.hide();
    this.dispatchEvent(
      new CustomEvent('bp-close', { bubbles: true, composed: true })
    );
  }

  /**
   * Handles keyboard events.
   * Closes notification on Escape key if closable.
   */
  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.closable) {
      this.handleCloseClick();
    }
  }

  /**
   * Returns the default icon for the notification variant.
   * Uses the bp-icon component for consistency with the design system.
   */
  private getDefaultIcon() {
    const variantIconSvg: Record<string, string> = {
      success: checkSvg,
      warning: warningCircleSvg,
      error: crossSvg,
      info: infoCircleSvg,
    };
    return html`<bp-icon
      .svg=${variantIconSvg[this.variant]}
      size="md"
    ></bp-icon>`;
  }

  render() {
    if (!this.open) {
      return nothing;
    }

    return html`
      <div
        class="notification notification--${this.variant} notification--${this
          .position} ${this.isExiting
          ? 'notification--exiting'
          : 'notification--entering'}"
        part="base"
        role="alert"
        aria-live=${this.variant === 'error' ? 'assertive' : 'polite'}
        @keydown=${this.handleKeydown}
        @mouseenter=${this.pauseAutoCloseTimer}
        @mouseleave=${this.resumeAutoCloseTimer}
        @focusin=${this.pauseAutoCloseTimer}
        @focusout=${this.resumeAutoCloseTimer}
      >
        <div class="notification__icon" part="icon">
          <slot name="icon">${this.getDefaultIcon()}</slot>
        </div>

        <div class="notification__content" part="content">
          ${this.title
            ? html`<div class="notification__title">${this.title}</div>`
            : nothing}
          <div class="notification__message" part="message">
            ${this.message || html`<slot></slot>`}
          </div>
        </div>

        <div class="notification__action" part="action">
          <slot name="action"></slot>
        </div>

        ${this.closable
          ? html`
              <button
                type="button"
                class="notification__close"
                part="close-button"
                aria-label="Close notification"
                @click=${this.handleCloseClick}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-notification': BpNotification;
  }
}
