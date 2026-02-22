import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { iconStyles } from './icon.style.js';
import { getIconSvg } from './icon-registry.js';
import type { IconName } from './icons/icon-name.generated.js';

export type IconSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | 'full';
export type IconColor =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'muted';

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
   * @type {IconSize}
   */
  @property({ type: String, reflect: true }) declare size: IconSize;

  /**
   * Color variant of the icon
   * @type {IconColor}
   */
  @property({ type: String }) declare color: IconColor;

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
    const svgContent = this.name ? getIconSvg(this.name) : null;

    return html`
      <span
        class=${classes}
        part="icon"
        role=${this.ariaLabel ? 'img' : 'presentation'}
        aria-label=${ifDefined(this.ariaLabel || undefined)}
      >
        ${svgContent ? html`${unsafeHTML(svgContent)}` : html`<slot></slot>`}
      </span>
    `;
  }
}

export type { IconName } from './icons/icon-name.generated.js';

declare global {
  interface HTMLElementTagNameMap {
    'bp-icon': BpIcon;
  }
}
