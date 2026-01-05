import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { tooltipStyles } from './tooltip.style.js';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * A tooltip component that displays contextual information on hover or focus.
 *
 * @slot - The trigger element that shows the tooltip on hover/focus
 *
 * @cssprop --bp-tooltip-max-width - Maximum width of the tooltip content
 *
 * @fires bp-show - Fired when tooltip becomes visible
 * @fires bp-hide - Fired when tooltip becomes hidden
 */
@customElement('bp-tooltip')
export class BpTooltip extends LitElement {
  /**
   * The text content to display in the tooltip
   */
  @property({ type: String }) declare content: string;

  /**
   * Placement of the tooltip relative to the trigger
   */
  @property({ type: String }) declare placement: TooltipPlacement;

  /**
   * Whether the tooltip is disabled
   */
  @property({ type: Boolean }) declare disabled: boolean;

  /**
   * Delay in milliseconds before showing the tooltip
   */
  @property({ type: Number }) declare delay: number;

  /**
   * Internal state tracking whether tooltip is visible
   */
  @state() private isVisible = false;

  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;
  private tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  static styles = [tooltipStyles];

  constructor() {
    super();
    this.content = '';
    this.placement = 'top';
    this.disabled = false;
    this.delay = 200;
  }

  private handleMouseEnter() {
    if (this.disabled) return;

    this.clearTimeouts();
    this.showTimeout = window.setTimeout(() => {
      this.isVisible = true;
      this.dispatchEvent(
        new CustomEvent('bp-show', {
          detail: {
            placement: this.placement,
            content: this.content,
          },
          bubbles: true,
          composed: true,
        })
      );
    }, this.delay);
  }

  private handleMouseLeave() {
    this.clearTimeouts();
    this.hideTimeout = window.setTimeout(() => {
      this.isVisible = false;
      this.dispatchEvent(
        new CustomEvent('bp-hide', {
          detail: {
            placement: this.placement,
            content: this.content,
          },
          bubbles: true,
          composed: true,
        })
      );
    }, 100);
  }

  private handleFocus() {
    if (this.disabled) return;
    this.isVisible = true;
    this.dispatchEvent(
      new CustomEvent('bp-show', {
        detail: {
          placement: this.placement,
          content: this.content,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur() {
    this.isVisible = false;
    this.dispatchEvent(
      new CustomEvent('bp-hide', {
        detail: {
          placement: this.placement,
          content: this.content,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private clearTimeouts() {
    if (this.showTimeout !== null) {
      window.clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout !== null) {
      window.clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearTimeouts();
  }

  render() {
    return html`
      <div
        class="tooltip-wrapper"
        aria-describedby=${this.isVisible ? this.tooltipId : ''}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
      >
        <div class="tooltip-trigger" part="trigger">
          <slot></slot>
        </div>
        ${this.isVisible && !this.disabled
          ? html`
              <div
                id=${this.tooltipId}
                class="tooltip-content tooltip-content--${this.placement}"
                part="content"
                role="tooltip"
                aria-hidden="false"
              >
                ${this.content}
              </div>
            `
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-tooltip': BpTooltip;
  }
}
