import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { badgeStyles } from './badge.style.js';

/**
 * Badge component for displaying status indicators, counts, and labels.
 *
 * @element bp-badge
 *
 * @slot - Default slot for badge content (text or icons)
 *
 * @csspart badge - The badge container element
 *
 * @example
 * ```html
 * <bp-badge>New</bp-badge>
 * <bp-badge variant="success">Active</bp-badge>
 * <bp-badge variant="error" size="small">3</bp-badge>
 * ```
 */
@customElement('bp-badge')
export class BpBadge extends LitElement {
  /**
   * Visual variant of the badge
   * @type {'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral'}
   * @default 'primary'
   */
  @property({ type: String, reflect: true }) declare variant:
    | 'primary'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'neutral';

  /**
   * Size of the badge
   * @type {'small' | 'medium' | 'large'}
   * @default 'medium'
   */
  @property({ type: String, reflect: true }) declare size:
    | 'small'
    | 'medium'
    | 'large';

  /**
   * Whether the badge is a dot/pill shape (for count indicators)
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true }) declare dot: boolean;

  static styles = [badgeStyles];

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'medium';
    this.dot = false;
  }

  render() {
    return html`
      <span
        class="badge badge--${this.variant} badge--${this.size} ${this.dot
          ? 'badge--dot'
          : ''}"
        part="badge"
      >
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-badge': BpBadge;
  }
}
