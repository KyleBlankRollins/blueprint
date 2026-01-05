import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cardStyles } from './card.style.js';

export type CardVariant = 'default' | 'outlined' | 'elevated';

/**
 * A versatile card component for organizing and displaying content.
 *
 * @slot - Default slot for card body content
 * @slot header - Optional header section
 * @slot footer - Optional footer section
 * @slot media - Optional media section (typically at the top)
 *
 * @fires bp-click - Fired when clickable card is clicked
 */
@customElement('bp-card')
export class BpCard extends LitElement {
  /**
   * Visual variant of the card
   */
  @property({ type: String, reflect: true }) declare variant: CardVariant;

  /**
   * Whether the card should display a hover effect
   */
  @property({ type: Boolean, reflect: true }) declare hoverable: boolean;

  /**
   * Whether the card is clickable (shows pointer cursor and emits click events)
   */
  @property({ type: Boolean, reflect: true }) declare clickable: boolean;

  /**
   * Whether to remove default padding from the card body
   */
  @property({ type: Boolean, reflect: true }) declare noPadding: boolean;

  static styles = [cardStyles];

  constructor() {
    super();
    this.variant = 'default';
    this.hoverable = false;
    this.clickable = false;
    this.noPadding = false;
  }

  private handleClick(event: MouseEvent) {
    if (!this.clickable) return;

    // Only prevent default if not clicking on interactive elements
    const target = event.target as HTMLElement;
    if (!target.closest('a, button, input, select, textarea')) {
      event.preventDefault();
    }

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
      <div
        class="card card--${this.variant} ${this.hoverable || this.clickable
          ? 'card--hoverable'
          : ''} ${this.clickable ? 'card--clickable' : ''}"
        part="card"
        @click=${this.handleClick}
        role=${this.clickable ? 'button' : 'article'}
        tabindex=${this.clickable ? '0' : undefined}
        @keydown=${this.clickable ? this.handleKeydown : undefined}
      >
        <slot name="media" part="media"></slot>
        <slot name="header" part="header"></slot>
        <div
          class="card-body ${this.noPadding ? 'card-body--no-padding' : ''}"
          part="body"
        >
          <slot></slot>
        </div>
        <slot name="footer" part="footer"></slot>
      </div>
    `;
  }

  private handleKeydown(event: Event) {
    const keyboardEvent = event as typeof window.KeyboardEvent.prototype;
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
      event.preventDefault();
      this.handleClick(event as unknown as MouseEvent);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-card': BpCard;
  }
}
