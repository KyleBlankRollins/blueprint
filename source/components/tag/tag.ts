import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { tagStyles } from './tag.style.js';
import { crossSvg } from '../icon/icons/entries/cross.js';
import '../icon/icon.js';

/**
 * Tag component for displaying removable labels, chips, or category markers.
 *
 * @element bp-tag
 *
 * @slot - Default slot for tag content (text)
 *
 * @csspart tag - The tag container element
 * @csspart close-button - The close/remove button element
 *
 * @fires bp-remove - Fired when the tag is removed (cancelable)
 *
 * @example
 * ```html
 * <bp-tag>Design</bp-tag>
 * <bp-tag variant="outlined" removable>TypeScript</bp-tag>
 * <bp-tag variant="success" size="sm">Active</bp-tag>
 * ```
 */
@customElement('bp-tag')
export class BpTag extends LitElement {
  /**
   * Visual variant of the tag
   * @type {'solid' | 'outlined'}
   * @default 'solid'
   */
  @property({ type: String, reflect: true }) declare variant:
    | 'solid'
    | 'outlined';

  /**
   * Size of the tag
   * @type {'sm' | 'md' | 'lg'}
   * @default 'md'
   */
  @property({ type: String, reflect: true }) declare size: 'sm' | 'md' | 'lg';

  /**
   * Color scheme of the tag
   * @type {'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral'}
   * @default 'neutral'
   */
  @property({ type: String, reflect: true }) declare color:
    | 'primary'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'neutral';

  /**
   * Whether the tag can be removed
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true }) declare removable: boolean;

  /**
   * Whether the tag is disabled
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  static styles = [tagStyles];

  constructor() {
    super();
    this.variant = 'solid';
    this.size = 'md';
    this.color = 'neutral';
    this.removable = false;
    this.disabled = false;
  }

  private handleRemove(event: Event) {
    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    const removeEvent = new CustomEvent('bp-remove', {
      detail: {
        color: this.color,
        timestamp: Date.now(),
      },
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    this.dispatchEvent(removeEvent);

    // Only remove if event wasn't prevented
    if (!removeEvent.defaultPrevented) {
      this.remove();
    }
  }

  private handleKeyDown(event: Event) {
    if (this.disabled) {
      return;
    }

    const keyboardEvent = event as unknown as {
      key: string;
      preventDefault: () => void;
    };

    // Allow removing with Delete or Backspace when focused
    if (
      this.removable &&
      (keyboardEvent.key === 'Delete' || keyboardEvent.key === 'Backspace')
    ) {
      keyboardEvent.preventDefault();
      this.handleRemove(event);
    }
  }

  render() {
    const classes = {
      tag: true,
      [`tag--${this.variant}`]: true,
      [`tag--${this.size}`]: true,
      [`tag--${this.color}`]: true,
      'tag--disabled': this.disabled,
      'tag--removable': this.removable,
    };

    // Map tag size to icon size (icons should be smaller)
    const iconSize =
      this.size === 'sm' ? 'xs' : this.size === 'lg' ? 'sm' : 'xs';

    return html`
      <div
        class=${classMap(classes)}
        part="tag"
        role="status"
        aria-disabled=${this.disabled}
        @keydown=${this.handleKeyDown}
        tabindex=${this.removable && !this.disabled ? '0' : '-1'}
      >
        <span class="tag__content">
          <slot></slot>
        </span>
        ${this.removable
          ? html`
              <button
                type="button"
                class="tag__close"
                part="close-button"
                aria-label="Remove"
                ?disabled=${this.disabled}
                @click=${this.handleRemove}
                tabindex="-1"
              >
                <bp-icon .svg=${crossSvg} size=${iconSize}></bp-icon>
              </button>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-tag': BpTag;
  }
}
