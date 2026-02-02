import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { breadcrumbStyles } from './breadcrumb.style.js';

export type BreadcrumbSize = 'sm' | 'md' | 'lg';
export type BreadcrumbSeparator = 'slash' | 'chevron' | 'arrow' | 'dot';

/**
 * Breadcrumb item interface for programmatic configuration
 */
export interface BreadcrumbItem {
  /** Display label for the breadcrumb item */
  label: string;
  /** URL for the breadcrumb link (omit for current page) */
  href?: string;
  /** Icon name to display before the label */
  icon?: string;
  /** Whether this is the current/active page */
  current?: boolean;
}

/**
 * A breadcrumb navigation component showing the user's location in a hierarchy.
 *
 * @element bp-breadcrumb
 *
 * @property {BreadcrumbItem[]} items - Array of breadcrumb items
 * @property {BreadcrumbSize} size - The size of the breadcrumb
 * @property {BreadcrumbSeparator} separator - The separator style between items
 * @property {string} ariaLabel - Accessible label for the navigation
 * @property {boolean} collapseOnMobile - Whether to collapse middle items on small screens
 * @property {number} maxItems - Maximum visible items before collapsing (0 = no limit)
 *
 * @slot - Default slot for custom breadcrumb items
 * @slot separator - Custom separator content
 *
 * @fires bp-breadcrumb-click - Fired when a breadcrumb item is clicked
 *
 * @csspart nav - The nav element wrapper
 * @csspart list - The ordered list element
 * @csspart item - Individual breadcrumb item
 * @csspart item-current - The current/active breadcrumb item
 * @csspart link - Breadcrumb link element
 * @csspart separator - Separator between items
 * @csspart ellipsis - The ellipsis button when items are collapsed
 */
@customElement('bp-breadcrumb')
export class BpBreadcrumb extends LitElement {
  /**
   * Array of breadcrumb items
   */
  @property({ type: Array }) declare items: BreadcrumbItem[];

  /**
   * The size of the breadcrumb
   */
  @property({ type: String, reflect: true }) declare size: BreadcrumbSize;

  /**
   * The separator style between items
   */
  @property({ type: String, reflect: true })
  declare separator: BreadcrumbSeparator;

  /**
   * Accessible label for the navigation landmark
   */
  @property({ type: String, attribute: 'aria-label' })
  declare ariaLabel: string;

  /**
   * Whether to collapse middle items on small screens
   */
  @property({ type: Boolean, attribute: 'collapse-on-mobile' })
  declare collapseOnMobile: boolean;

  /**
   * Maximum visible items before collapsing (0 = no limit)
   */
  @property({ type: Number, attribute: 'max-items' }) declare maxItems: number;

  static styles = [breadcrumbStyles];

  constructor() {
    super();
    this.items = [];
    this.size = 'md';
    this.separator = 'slash';
    this.ariaLabel = 'Breadcrumb';
    this.collapseOnMobile = false;
    this.maxItems = 0;
  }

  private handleItemClick(
    event: MouseEvent,
    item: BreadcrumbItem,
    index: number
  ) {
    // Don't prevent default for actual navigation
    this.dispatchEvent(
      new CustomEvent('bp-breadcrumb-click', {
        detail: { item, index },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleKeyDown(
    event: KeyboardEvent,
    item: BreadcrumbItem,
    index: number
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      if (!item.href) {
        event.preventDefault();
      }
      this.dispatchEvent(
        new CustomEvent('bp-breadcrumb-click', {
          detail: { item, index },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private renderSeparator() {
    const separatorIcons = {
      slash: html`<span class="separator__icon">/</span>`,
      chevron: html`
        <svg
          class="separator__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      `,
      arrow: html`
        <svg
          class="separator__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      `,
      dot: html`<span class="separator__icon separator__icon--dot">•</span>`,
    };

    return html`
      <span class="separator" part="separator" aria-hidden="true">
        <slot name="separator">${separatorIcons[this.separator]}</slot>
      </span>
    `;
  }

  private renderItem(item: BreadcrumbItem, index: number, isLast: boolean) {
    const isCurrent = item.current || isLast;
    const itemClasses = {
      item: true,
      'item--current': isCurrent,
    };

    return html`
      <li
        class=${classMap(itemClasses)}
        part="item ${isCurrent ? 'item-current' : ''}"
      >
        ${item.href && !isCurrent
          ? html`
              <a
                class="link"
                part="link"
                href=${item.href}
                @click=${(e: MouseEvent) =>
                  this.handleItemClick(e, item, index)}
                @keydown=${(e: KeyboardEvent) =>
                  this.handleKeyDown(e, item, index)}
              >
                ${item.icon
                  ? html`<bp-icon
                      name=${item.icon}
                      class="item__icon"
                    ></bp-icon>`
                  : nothing}
                <span class="item__label">${item.label}</span>
              </a>
            `
          : html`
              <span
                class="text"
                part="text"
                aria-current=${isCurrent ? 'page' : nothing}
              >
                ${item.icon
                  ? html`<bp-icon
                      name=${item.icon}
                      class="item__icon"
                    ></bp-icon>`
                  : nothing}
                <span class="item__label">${item.label}</span>
              </span>
            `}
        ${!isLast ? this.renderSeparator() : nothing}
      </li>
    `;
  }

  private renderEllipsis(hiddenCount: number) {
    return html`
      <li class="item item--ellipsis" part="item ellipsis">
        <button
          class="ellipsis-button"
          part="ellipsis-button"
          aria-label="Show ${hiddenCount} more items"
          title="Show ${hiddenCount} more items"
        >
          <span class="ellipsis-dots">…</span>
        </button>
        ${this.renderSeparator()}
      </li>
    `;
  }

  private getVisibleItems(): {
    items: BreadcrumbItem[];
    hiddenCount: number;
    showEllipsis: boolean;
  } {
    if (this.maxItems <= 0 || this.items.length <= this.maxItems) {
      return { items: this.items, hiddenCount: 0, showEllipsis: false };
    }

    // Show first item, ellipsis, and last (maxItems - 1) items
    const firstItem = this.items[0];
    const lastItems = this.items.slice(-(this.maxItems - 1));
    const hiddenCount = this.items.length - this.maxItems;

    return {
      items: [firstItem, ...lastItems],
      hiddenCount,
      showEllipsis: true,
    };
  }

  render() {
    const containerClasses = {
      breadcrumb: true,
      [`breadcrumb--${this.size}`]: true,
      [`breadcrumb--${this.separator}`]: true,
      'breadcrumb--collapse-mobile': this.collapseOnMobile,
    };

    const {
      items: visibleItems,
      hiddenCount,
      showEllipsis,
    } = this.getVisibleItems();

    // If using programmatic items
    if (this.items.length > 0) {
      return html`
        <nav
          class=${classMap(containerClasses)}
          part="nav"
          aria-label=${this.ariaLabel}
        >
          <ol class="list" part="list">
            ${showEllipsis
              ? html`
                  ${this.renderItem(visibleItems[0], 0, false)}
                  ${this.renderEllipsis(hiddenCount)}
                  ${visibleItems
                    .slice(1)
                    .map((item, index) =>
                      this.renderItem(
                        item,
                        this.items.length - visibleItems.length + 1 + index,
                        index === visibleItems.length - 2
                      )
                    )}
                `
              : visibleItems.map((item, index) =>
                  this.renderItem(
                    item,
                    index,
                    index === visibleItems.length - 1
                  )
                )}
          </ol>
        </nav>
      `;
    }

    // Slotted content fallback
    return html`
      <nav
        class=${classMap(containerClasses)}
        part="nav"
        aria-label=${this.ariaLabel}
      >
        <ol class="list" part="list">
          <slot></slot>
        </ol>
      </nav>
    `;
  }
}

/**
 * A breadcrumb item component for use with bp-breadcrumb.
 *
 * @element bp-breadcrumb-item
 *
 * @property {string} href - URL for the breadcrumb link
 * @property {boolean} current - Whether this is the current page
 *
 * @slot - Content of the breadcrumb item
 *
 * @csspart item - The item container
 * @csspart link - The link element (when href is provided)
 */
@customElement('bp-breadcrumb-item')
export class BpBreadcrumbItem extends LitElement {
  /**
   * URL for the breadcrumb link (omit for current page)
   */
  @property({ type: String }) declare href: string;

  /**
   * Whether this is the current/active page
   */
  @property({ type: Boolean, reflect: true }) declare current: boolean;

  static styles = [breadcrumbStyles];

  constructor() {
    super();
    this.href = '';
    this.current = false;
  }

  render() {
    const itemClasses = {
      item: true,
      'item--current': this.current,
    };

    return html`
      <li
        class=${classMap(itemClasses)}
        part="item ${this.current ? 'item-current' : ''}"
      >
        ${this.href && !this.current
          ? html`
              <a class="link" part="link" href=${this.href}>
                <slot></slot>
              </a>
            `
          : html`
              <span
                class="text"
                part="text"
                aria-current=${this.current ? 'page' : nothing}
              >
                <slot></slot>
              </span>
            `}
      </li>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-breadcrumb': BpBreadcrumb;
    'bp-breadcrumb-item': BpBreadcrumbItem;
  }
}
