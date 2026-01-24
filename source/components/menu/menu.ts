import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { menuStyles } from './menu.style.js';

/**
 * A menu container component for displaying a list of actions or options.
 *
 * @fires bp-menu-select - Dispatched when a menu item is selected
 *
 * @slot - Menu items (bp-menu-item, bp-menu-divider)
 *
 * @csspart container - The menu container element
 */
@customElement('bp-menu')
export class BpMenu extends LitElement {
  /** Size variant for all menu items */
  @property({ type: String }) declare size: 'small' | 'medium' | 'large';

  /** Current focused item index for keyboard navigation */
  @state() private focusedIndex = -1;

  static styles = [menuStyles];

  constructor() {
    super();
    this.size = 'medium';
  }

  private handleFocusIn = (event: FocusEvent) => {
    const target = event.target as BpMenuItem;
    const items = this.menuItems;
    this.focusedIndex = items.indexOf(target);
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('focusin', this.handleFocusIn);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focusin', this.handleFocusIn);
  }

  /**
   * Gets all non-divider menu items from the default slot.
   * @returns Array of bp-menu-item elements
   */
  private get menuItems(): BpMenuItem[] {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return [];
    return slot
      .assignedElements()
      .filter((el): el is BpMenuItem => el.tagName === 'BP-MENU-ITEM');
  }

  /**
   * Handles keyboard navigation within the menu.
   * Supports ArrowDown, ArrowUp, Home, and End keys.
   */
  private handleKeyDown(event: KeyboardEvent) {
    const items = this.menuItems.filter((item) => !item.disabled);
    if (items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = Math.min(this.focusedIndex + 1, items.length - 1);
        items[this.focusedIndex]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        items[this.focusedIndex]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        this.focusedIndex = 0;
        items[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        this.focusedIndex = items.length - 1;
        items[items.length - 1]?.focus();
        break;
    }
  }

  private handleSlotChange() {
    // Update size on all menu items
    this.menuItems.forEach((item) => {
      item.size = this.size;
    });
  }

  render() {
    return html`
      <div
        class="menu menu--${this.size}"
        part="container"
        role="menu"
        @keydown=${this.handleKeyDown}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
}

/**
 * A menu item component for use within bp-menu.
 *
 * @fires bp-select - Dispatched when the item is selected
 *
 * @slot - Item label content
 * @slot prefix - Content before the label (typically an icon)
 * @slot suffix - Content after the label (typically a shortcut or arrow)
 *
 * @csspart base - The menu item container
 * @csspart prefix - The prefix slot container
 * @csspart label - The label container
 * @csspart suffix - The suffix slot container
 */
@customElement('bp-menu-item')
export class BpMenuItem extends LitElement {
  /** The value associated with this menu item */
  @property({ type: String }) declare value: string;

  /** Whether the item is disabled */
  @property({ type: Boolean }) declare disabled: boolean;

  /** Whether the item is selected/active */
  @property({ type: Boolean }) declare selected: boolean;

  /** Whether the item has a submenu */
  @property({ type: Boolean }) declare hasSubmenu: boolean;

  /** Size variant (inherited from parent menu) */
  @property({ type: String }) declare size: 'small' | 'medium' | 'large';

  /** Keyboard shortcut hint to display */
  @property({ type: String }) declare shortcut: string;

  static styles = [menuStyles];

  constructor() {
    super();
    this.value = '';
    this.disabled = false;
    this.selected = false;
    this.hasSubmenu = false;
    this.size = 'medium';
    this.shortcut = '';
  }

  focus() {
    const button = this.shadowRoot?.querySelector('.menu-item') as HTMLElement;
    button?.focus();
  }

  private handleActivate() {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('bp-menu-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.handleActivate();
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleActivate();
    }
  }

  render() {
    return html`
      <div
        class="menu-item menu-item--${this.size} ${this.disabled
          ? 'menu-item--disabled'
          : ''} ${this.selected ? 'menu-item--selected' : ''}"
        part="base"
        role="menuitem"
        tabindex=${this.disabled ? -1 : 0}
        aria-disabled=${this.disabled}
        aria-current=${this.selected ? 'page' : 'false'}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <span class="menu-item__prefix" part="prefix">
          <slot name="prefix"></slot>
        </span>
        <span class="menu-item__label" part="label">
          <slot></slot>
        </span>
        <span class="menu-item__suffix" part="suffix">
          ${this.shortcut
            ? html`<span class="menu-item__shortcut">${this.shortcut}</span>`
            : nothing}
          <slot name="suffix"></slot>
          ${this.hasSubmenu
            ? html`<span class="menu-item__arrow">›</span>`
            : nothing}
        </span>
      </div>
    `;
  }
}

/**
 * A divider for visually separating menu items.
 *
 * @csspart divider - The divider element
 */
@customElement('bp-menu-divider')
export class BpMenuDivider extends LitElement {
  static styles = [menuStyles];

  render() {
    return html`<div
      class="menu-divider"
      part="divider"
      role="separator"
    ></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-menu': BpMenu;
    'bp-menu-item': BpMenuItem;
    'bp-menu-divider': BpMenuDivider;
  }
}
