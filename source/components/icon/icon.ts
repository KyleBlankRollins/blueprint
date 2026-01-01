import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { iconStyles } from './icon.style.js';
import { getIcon, type IconName } from './icons/registry.generated.js';

/**
 * Icon component - SVG icon wrapper with size variants
 *
 * Supports both named icons from the System UI Icons library and custom SVG content via slot.
 *
 * @slot - Custom SVG content to display (used when `name` is not provided)
 *
 * @csspart icon - The icon container element
 *
 * @example
 * ```html
 * <!-- Using named icon from library -->
 * <bp-icon name="create" size="md" color="primary"></bp-icon>
 *
 * <!-- Using custom SVG content -->
 * <bp-icon size="md">
 *   <svg viewBox="0 0 24 24" fill="currentColor">
 *     <path d="M12 2L2 7v10c0 5.5 3.8 10.6 10 12 6.2-1.4 10-6.5 10-12V7l-10-5z"/>
 *   </svg>
 * </bp-icon>
 * ```
 */
@customElement('bp-icon')
export class BpIcon extends LitElement {
  /**
   * Name of the icon from the System UI Icons library
   * @type {IconName}
   */
  @property({ type: String }) declare name: IconName | '';

  /**
   * Size variant of the icon
   * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl'}
   */
  @property({ type: String }) declare size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Color variant of the icon
   * @type {'default' | 'primary' | 'success' | 'warning' | 'error' | 'muted'}
   */
  @property({ type: String }) declare color:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'error'
    | 'muted';

  /**
   * ARIA label for accessibility
   * @type {string}
   */
  @property({ type: String, attribute: 'aria-label' })
  declare ariaLabel: string;

  constructor() {
    super();
    this.name = '';
    this.size = 'md';
    this.color = 'default';
    this.ariaLabel = '';
  }

  static styles = [iconStyles];

  render() {
    const classes = ['icon', `icon--${this.size}`, `icon--${this.color}`].join(
      ' '
    );

    // Get icon from registry if name is provided
    const iconTemplate = this.name ? getIcon(this.name) : null;

    return html`
      <span
        class=${classes}
        part="icon"
        role=${this.ariaLabel ? 'img' : 'presentation'}
        aria-label=${ifDefined(this.ariaLabel || undefined)}
      >
        ${iconTemplate || html`<slot></slot>`}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-icon': BpIcon;
  }
}
