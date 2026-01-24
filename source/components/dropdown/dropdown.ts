import { LitElement, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { dropdownStyles } from './dropdown.style.js';

/**
 * A generic dropdown component that displays content in a floating panel.
 *
 * @fires bp-show - Dispatched when the dropdown opens
 * @fires bp-hide - Dispatched when the dropdown closes
 * @fires bp-toggle - Dispatched when the dropdown toggles
 *
 * @slot - Default slot for the dropdown trigger element
 * @slot content - Content to display in the dropdown panel
 *
 * @csspart trigger - The trigger button container
 * @csspart panel - The dropdown panel container
 */
@customElement('bp-dropdown')
export class BpDropdown extends LitElement {
  /** Whether the dropdown is open */
  @property({ type: Boolean, reflect: true }) declare open: boolean;

  /** Placement of the dropdown panel relative to the trigger */
  @property({ type: String }) declare placement:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'right';

  /** Whether the dropdown should close when clicking outside */
  @property({ type: Boolean }) declare closeOnClickOutside: boolean;

  /** Whether the dropdown should close when pressing Escape */
  @property({ type: Boolean }) declare closeOnEscape: boolean;

  /** Whether the dropdown should close when an item inside is clicked */
  @property({ type: Boolean }) declare closeOnSelect: boolean;

  /** Whether the dropdown is disabled */
  @property({ type: Boolean }) declare disabled: boolean;

  /** Distance in pixels between the trigger and the panel */
  @property({ type: Number }) declare distance: number;

  /** Whether to show an arrow pointing to the trigger */
  @property({ type: Boolean }) declare arrow: boolean;

  /** ARIA role for the dropdown panel */
  @property({ type: String }) declare panelRole: 'menu' | 'dialog' | 'listbox';

  @state() private triggerWidth = 0;

  @query('.dropdown__panel') private panel!: HTMLElement;
  @query('.dropdown__trigger') private triggerElement!: HTMLElement;

  private clickOutsideHandler = this.handleClickOutside.bind(this);
  private keydownHandler = this.handleKeydown.bind(this);

  static styles = [dropdownStyles];

  constructor() {
    super();
    this.open = false;
    this.placement = 'bottom-start';
    this.closeOnClickOutside = true;
    this.closeOnEscape = true;
    this.closeOnSelect = true;
    this.disabled = false;
    this.distance = 4;
    this.arrow = false;
    this.panelRole = 'menu';
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.clickOutsideHandler);
    document.addEventListener('keydown', this.keydownHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.clickOutsideHandler);
    document.removeEventListener('keydown', this.keydownHandler);
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('open') && this.open) {
      this.updateTriggerWidth();
    }
  }

  /** Show the dropdown */
  show() {
    if (this.disabled || this.open) return;

    this.open = true;
    this.dispatchEvent(
      new CustomEvent('bp-show', { bubbles: true, composed: true })
    );
    this.dispatchEvent(
      new CustomEvent('bp-toggle', {
        detail: { open: true },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Hide the dropdown */
  hide() {
    if (!this.open) return;

    this.open = false;
    this.dispatchEvent(
      new CustomEvent('bp-hide', { bubbles: true, composed: true })
    );
    this.dispatchEvent(
      new CustomEvent('bp-toggle', {
        detail: { open: false },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Toggle the dropdown open/closed */
  toggle() {
    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Updates the stored trigger width for positioning calculations.
   * Called automatically when dropdown opens via updated() lifecycle.
   */
  private updateTriggerWidth() {
    if (this.triggerElement) {
      this.triggerWidth = this.triggerElement.offsetWidth;
    }
  }

  /**
   * Toggles dropdown when trigger is clicked.
   * Stops propagation to prevent immediate outside click detection.
   */
  private handleTriggerClick(event: MouseEvent) {
    event.stopPropagation();
    if (!this.disabled) {
      this.toggle();
    }
  }

  /**
   * Handles keyboard interaction on the trigger.
   * Enter/Space toggle, ArrowDown opens when closed.
   */
  private handleTriggerKeydown(event: KeyboardEvent) {
    if (this.disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    } else if (event.key === 'ArrowDown' && !this.open) {
      event.preventDefault();
      this.show();
    }
  }

  /**
   * Closes the dropdown when user clicks outside the component.
   * Only runs if closeOnClickOutside is true and dropdown is open.
   */
  private handleClickOutside(event: MouseEvent) {
    if (!this.closeOnClickOutside || !this.open) return;

    const path = event.composedPath();
    if (!path.includes(this)) {
      this.hide();
    }
  }

  /**
   * Closes dropdown on Escape key and returns focus to trigger.
   * Only runs if closeOnEscape is true and dropdown is open.
   */
  private handleKeydown(event: KeyboardEvent) {
    if (!this.closeOnEscape || !this.open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.hide();
      this.triggerElement?.focus();
    }
  }

  /**
   * Handles clicks inside the panel to auto-close on item selection.
   * Detects menu items or elements with data-dropdown-close attribute.
   */
  private handlePanelClick(event: MouseEvent) {
    if (this.closeOnSelect) {
      // Check if clicked element or its parent is a menu item or similar
      const target = event.target as HTMLElement;
      const isSelectableItem =
        target.closest('bp-menu-item') ||
        target.closest('[data-dropdown-close]') ||
        target.hasAttribute('data-dropdown-close');

      if (isSelectableItem) {
        this.hide();
      }
    }
  }

  render() {
    return html`
      <div
        class="dropdown ${this.open ? 'dropdown--open' : ''} ${this.disabled
          ? 'dropdown--disabled'
          : ''}"
      >
        <div
          class="dropdown__trigger"
          part="trigger"
          tabindex=${this.disabled ? -1 : 0}
          role="button"
          aria-haspopup="true"
          aria-expanded=${this.open}
          aria-disabled=${this.disabled}
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeydown}
        >
          <slot></slot>
        </div>
        ${this.open
          ? html`
              <div
                class="dropdown__panel dropdown__panel--${this.placement} ${this
                  .open
                  ? 'dropdown__panel--open'
                  : ''}"
                part="panel"
                role=${this.panelRole}
                style="--dropdown-distance: ${this.distance}px;"
                @click=${this.handlePanelClick}
              >
                ${this.arrow
                  ? html`<div class="dropdown__arrow"></div>`
                  : nothing}
                <slot name="content"></slot>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-dropdown': BpDropdown;
  }
}
