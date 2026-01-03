import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { linkStyles } from './link.style.js';

export type LinkVariant = 'default' | 'primary' | 'muted';
export type LinkUnderline = 'always' | 'hover' | 'none';
export type LinkSize = 'sm' | 'md' | 'lg';

/**
 * A link component that provides styled anchor elements with variants.
 * Supports internal and external links with accessibility features.
 */
@customElement('bp-link')
export class BpLink extends LitElement {
  /**
   * The URL the link points to.
   * @type {string}
   * @default ''
   */
  @property({ type: String, reflect: true }) declare href: string;

  /**
   * Where to display the linked URL (same semantics as anchor target).
   * @type {string}
   * @default ''
   */
  @property({ type: String, reflect: true }) declare target: string;

  /**
   * Relationship of the linked URL (same semantics as anchor rel).
   * @type {string}
   * @default ''
   */
  @property({ type: String, reflect: true }) declare rel: string;

  /**
   * Visual variant of the link.
   * @type {'default' | 'primary' | 'muted'}
   * @default 'default'
   */
  @property({ type: String, reflect: true }) declare variant: LinkVariant;

  /**
   * Underline style for the link.
   * @type {'always' | 'hover' | 'none'}
   * @default 'hover'
   */
  @property({ type: String, reflect: true }) declare underline: LinkUnderline;

  /**
   * Size of the link text.
   * @type {'sm' | 'md' | 'lg'}
   * @default 'md'
   */
  @property({ type: String, reflect: true }) declare size: LinkSize;

  /**
   * Whether the link is disabled.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  static styles = [linkStyles];

  constructor() {
    super();
    this.href = '';
    this.target = '';
    this.rel = '';
    this.variant = 'default';
    this.underline = 'hover';
    this.size = 'md';
    this.disabled = false;
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
    }
  }

  render() {
    const isExternal = this.target === '_blank';
    const computedRel =
      this.rel || (isExternal ? 'noopener noreferrer' : undefined);

    return html`
      <a
        class="link link--${this.variant} link--underline-${this
          .underline} link--size-${this.size}"
        href=${ifDefined(this.disabled ? undefined : this.href || undefined)}
        target=${ifDefined(this.target || undefined)}
        rel=${ifDefined(computedRel)}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        @click=${this.handleClick}
        part="link"
      >
        <slot></slot>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-link': BpLink;
  }
}
