import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { accordionStyles } from './accordion.style.js';
import { chevronDownSvg } from '../icon/icons/entries/chevron-down.js';
import { BpIcon } from '../icon/icon.js';

/**
 * A container component that groups accordion items.
 * Controls single or multiple expansion behavior.
 *
 * @element bp-accordion
 *
 * @property {boolean} multiple - Whether multiple items can be expanded simultaneously
 * @property {string[]} expandedItems - Array of expanded item IDs
 * @property {boolean} disabled - Whether all items are disabled
 *
 * @fires bp-expand - Fired when an item is expanded
 * @fires bp-collapse - Fired when an item is collapsed
 *
 * @slot - Default slot for bp-accordion-item elements
 *
 * @csspart accordion - The main accordion container
 */
@customElement('bp-accordion')
export class BpAccordion extends LitElement {
  /**
   * Child components that self-register as custom elements on import.
   * Value imports prevent bundler tree-shaking of the registration side effect.
   */
  static dependencies = [BpIcon];

  /** Whether multiple items can be expanded simultaneously */
  @property({ type: Boolean, reflect: true }) declare multiple: boolean;

  /** Array of expanded item IDs */
  @property({ type: Array }) declare expandedItems: string[];

  /** Whether all items are disabled */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  static styles = [accordionStyles];

  constructor() {
    super();
    this.multiple = false;
    this.expandedItems = [];
    this.disabled = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('bp-item-toggle', this.handleItemToggle);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('bp-item-toggle', this.handleItemToggle);
  }

  /**
   * Handles item toggle events from child accordion items.
   * Updates expandedItems array based on multiple mode and dispatches expand/collapse events.
   */
  private handleItemToggle = (event: Event) => {
    const customEvent = event as CustomEvent<{ id: string; expanded: boolean }>;
    const { id, expanded } = customEvent.detail;

    if (expanded) {
      if (this.multiple) {
        this.expandedItems = [...this.expandedItems, id];
      } else {
        // Close other items when not in multiple mode
        this.expandedItems = [id];
      }
      this.dispatchEvent(
        new CustomEvent('bp-expand', {
          detail: { id },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this.expandedItems = this.expandedItems.filter((itemId) => itemId !== id);
      this.dispatchEvent(
        new CustomEvent('bp-collapse', {
          detail: { id },
          bubbles: true,
          composed: true,
        })
      );
    }

    this.updateChildItems();
  };

  /**
   * Synchronizes child accordion items with the expandedItems state.
   * Also applies disabled state to all items when accordion is disabled.
   */
  private updateChildItems() {
    const items = this.querySelectorAll('bp-accordion-item');
    items.forEach((item) => {
      const accordionItem = item as BpAccordionItem;
      const isExpanded = this.expandedItems.includes(accordionItem.itemId);
      accordionItem.expanded = isExpanded;
      if (this.disabled) {
        accordionItem.disabled = true;
      }
    });
  }

  /**
   * Initializes expandedItems array from children with expanded attribute.
   * Called on first render to respect items marked as expanded in HTML.
   */
  private initializeExpandedItems() {
    const items = this.querySelectorAll('bp-accordion-item');
    const expandedIds: string[] = [];

    items.forEach((item) => {
      const accordionItem = item as BpAccordionItem;
      if (accordionItem.expanded && accordionItem.itemId) {
        expandedIds.push(accordionItem.itemId);
      }
    });

    if (expandedIds.length > 0) {
      // In single mode, only keep the first expanded item
      this.expandedItems = this.multiple ? expandedIds : [expandedIds[0]];
    }
  }

  firstUpdated(): void {
    // Initialize expanded items from children on first render
    this.initializeExpandedItems();
    this.updateChildItems();
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (
      changedProperties.has('expandedItems') ||
      changedProperties.has('disabled')
    ) {
      this.updateChildItems();
    }
  }

  /** Expand an item by ID */
  expand(id: string) {
    if (!this.expandedItems.includes(id)) {
      if (this.multiple) {
        this.expandedItems = [...this.expandedItems, id];
      } else {
        this.expandedItems = [id];
      }
      this.updateChildItems();
      this.dispatchEvent(
        new CustomEvent('bp-expand', {
          detail: { id },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /** Collapse an item by ID */
  collapse(id: string) {
    if (this.expandedItems.includes(id)) {
      this.expandedItems = this.expandedItems.filter((itemId) => itemId !== id);
      this.updateChildItems();
      this.dispatchEvent(
        new CustomEvent('bp-collapse', {
          detail: { id },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /** Expand all items (only works in multiple mode) */
  expandAll() {
    if (!this.multiple) return;
    const items = this.querySelectorAll('bp-accordion-item');
    const ids: string[] = [];
    items.forEach((item) => {
      const accordionItem = item as BpAccordionItem;
      if (!accordionItem.disabled) {
        ids.push(accordionItem.itemId);
      }
    });
    this.expandedItems = ids;
    this.updateChildItems();
  }

  /** Collapse all items */
  collapseAll() {
    this.expandedItems = [];
    this.updateChildItems();
  }

  /**
   * Handles slot changes - when children are added or removed.
   * Initializes expanded state from new children.
   */
  private handleSlotChange() {
    // Only initialize from children if expandedItems is empty
    // Otherwise respect the parent's state
    if (this.expandedItems.length === 0) {
      this.initializeExpandedItems();
    }
    this.updateChildItems();
  }

  render() {
    const classes = {
      accordion: true,
      'accordion--disabled': this.disabled,
    };

    return html`
      <div class=${classMap(classes)} part="accordion" role="presentation">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
}

/**
 * An individual accordion item with header and collapsible content.
 *
 * @element bp-accordion-item
 *
 * @property {string} itemId - Unique identifier for this item
 * @property {string} header - Header text displayed in the trigger button
 * @property {boolean} expanded - Whether the content is expanded
 * @property {boolean} disabled - Whether this item is disabled
 *
 * @slot - Default slot for the collapsible content
 * @slot header - Custom header content (overrides header property)
 * @slot icon - Custom icon for the header
 *
 * @csspart item - The accordion item container
 * @csspart header - The header/trigger button
 * @csspart icon - The expand/collapse icon
 * @csspart content - The collapsible content wrapper
 * @csspart body - The inner content container
 */
@customElement('bp-accordion-item')
export class BpAccordionItem extends LitElement {
  /** Unique identifier for this item */
  @property({ type: String, attribute: 'item-id', reflect: true })
  declare itemId: string;

  /** Header text displayed in the trigger button */
  @property({ type: String }) declare header: string;

  /** Whether the content is expanded */
  @property({ type: Boolean, reflect: true }) declare expanded: boolean;

  /** Whether this item is disabled */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  static styles = [accordionStyles];

  constructor() {
    super();
    this.itemId = '';
    this.header = '';
    this.expanded = false;
    this.disabled = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Generate ID if not provided
    if (!this.itemId) {
      this.itemId = `accordion-item-${Math.random().toString(36).slice(2, 9)}`;
    }
  }

  /**
   * Handles toggle action and dispatches bp-item-toggle event.
   * Also manages focus on the header button after expansion.
   */
  private handleToggle() {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('bp-item-toggle', {
        detail: { id: this.itemId, expanded: !this.expanded },
        bubbles: true,
        composed: true,
      })
    );

    // Focus management: focus header after toggle completes
    this.updateComplete.then(() => {
      const header = this.shadowRoot?.querySelector(
        '.item__header'
      ) as HTMLElement;
      header?.focus();
    });
  }

  /**
   * Handles keyboard navigation.
   * Triggers toggle on Enter or Space key press.
   */
  private handleKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleToggle();
    }
  }

  render() {
    const itemClasses = {
      item: true,
      'item--expanded': this.expanded,
      'item--disabled': this.disabled,
    };

    const headerId = `${this.itemId}-header`;
    const contentId = `${this.itemId}-content`;

    return html`
      <div class=${classMap(itemClasses)} part="item">
        <button
          class="item__header"
          part="header"
          id=${headerId}
          aria-expanded=${this.expanded}
          aria-controls=${contentId}
          aria-disabled=${this.disabled}
          ?disabled=${this.disabled}
          @click=${this.handleToggle}
          @keydown=${this.handleKeyDown}
        >
          <span class="item__header-content">
            <slot name="icon"></slot>
            <slot name="header">${this.header}</slot>
          </span>
          <span class="item__icon" part="icon" aria-hidden="true">
            <bp-icon .svg=${chevronDownSvg} size="md"></bp-icon>
          </span>
        </button>
        <div
          class="item__content"
          part="content"
          id=${contentId}
          role="region"
          aria-labelledby=${headerId}
        >
          <div class="item__body" part="body">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-accordion': BpAccordion;
    'bp-accordion-item': BpAccordionItem;
  }
}
