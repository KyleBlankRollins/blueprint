import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './accordion.js';
import type { BpAccordion, BpAccordionItem } from './accordion.js';

describe('bp-accordion', () => {
  let element: BpAccordion;

  beforeEach(() => {
    element = document.createElement('bp-accordion');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-accordion');
    expect(constructor).toBeDefined();
  });

  it('should register bp-accordion-item as a custom element', () => {
    const constructor = customElements.get('bp-accordion-item');
    expect(constructor).toBeDefined();
  });

  // Rendering tests
  it('should render accordion element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const accordion = element.shadowRoot?.querySelector('.accordion');
    expect(accordion).toBeTruthy();
  });

  // Default values tests
  it('should have correct default property values', () => {
    expect(element.variant).toBe('default');
    expect(element.multiple).toBe(false);
    expect(element.expandedItems).toEqual([]);
    expect(element.disabled).toBe(false);
  });

  // Property tests
  it('should set property: variant', async () => {
    element.variant = 'bordered';
    await element.updateComplete;
    expect(element.variant).toBe('bordered');
    const accordion = element.shadowRoot?.querySelector('.accordion');
    expect(accordion?.classList.contains('accordion--bordered')).toBe(true);
  });

  it('should set property: multiple', async () => {
    element.multiple = true;
    await element.updateComplete;
    expect(element.multiple).toBe(true);
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const accordion = element.shadowRoot?.querySelector('.accordion');
    expect(accordion?.classList.contains('accordion--disabled')).toBe(true);
  });

  it('should set property: expandedItems', async () => {
    element.expandedItems = ['item-1', 'item-2'];
    await element.updateComplete;
    expect(element.expandedItems).toEqual(['item-1', 'item-2']);
  });

  // Attribute tests
  it('should reflect variant attribute when property changes', async () => {
    element.variant = 'separated';
    await element.updateComplete;
    expect(element.getAttribute('variant')).toBe('separated');
  });

  it('should reflect multiple attribute when property changes', async () => {
    element.multiple = true;
    await element.updateComplete;
    expect(element.hasAttribute('multiple')).toBe(true);
  });

  it('should reflect disabled attribute when property changes', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  // CSS Parts tests
  it('should expose accordion part for styling', async () => {
    await element.updateComplete;
    const part = element.shadowRoot?.querySelector('[part="accordion"]');
    expect(part).toBeTruthy();
  });

  // Event tests
  it('should emit bp-expand event when item is expanded', async () => {
    element.innerHTML =
      '<bp-accordion-item item-id="test-item" header="Test"></bp-accordion-item>';
    await element.updateComplete;

    const expandHandler = vi.fn();
    element.addEventListener('bp-expand', expandHandler);

    const item = element.querySelector('bp-accordion-item') as BpAccordionItem;
    await item.updateComplete;

    const header = item.shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;
    header.click();
    await element.updateComplete;

    expect(expandHandler).toHaveBeenCalled();
    expect(expandHandler.mock.calls[0][0].detail.id).toBe('test-item');
  });

  it('should emit bp-collapse event when item is collapsed', async () => {
    element.expandedItems = ['test-item'];
    element.innerHTML =
      '<bp-accordion-item item-id="test-item" header="Test"></bp-accordion-item>';
    await element.updateComplete;

    const collapseHandler = vi.fn();
    element.addEventListener('bp-collapse', collapseHandler);

    const item = element.querySelector('bp-accordion-item') as BpAccordionItem;
    await item.updateComplete;
    await element.updateComplete;

    const header = item.shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;
    header.click();
    await element.updateComplete;

    expect(collapseHandler).toHaveBeenCalled();
  });

  // Slot tests
  it('should render slotted accordion items', async () => {
    element.innerHTML = `
      <bp-accordion-item item-id="item-1" header="Item 1">Content 1</bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Item 2">Content 2</bp-accordion-item>
    `;
    await element.updateComplete;

    const items = element.querySelectorAll('bp-accordion-item');
    expect(items.length).toBe(2);
  });

  // Interaction tests
  it('should expand only one item at a time in single mode', async () => {
    element.innerHTML = `
      <bp-accordion-item item-id="item-1" header="Item 1">Content 1</bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Item 2">Content 2</bp-accordion-item>
    `;
    await element.updateComplete;

    const items = Array.from(
      element.querySelectorAll('bp-accordion-item')
    ) as BpAccordionItem[];
    await items[0].updateComplete;
    await items[1].updateComplete;

    // Click first item
    const header1 = items[0].shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;
    header1.click();
    await element.updateComplete;

    expect(element.expandedItems).toEqual(['item-1']);

    // Click second item
    const header2 = items[1].shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;
    header2.click();
    await element.updateComplete;

    expect(element.expandedItems).toEqual(['item-2']);
  });

  it('should expand multiple items when multiple is true', async () => {
    element.multiple = true;
    element.innerHTML = `
      <bp-accordion-item item-id="item-1" header="Item 1">Content 1</bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Item 2">Content 2</bp-accordion-item>
    `;
    await element.updateComplete;

    const items = Array.from(
      element.querySelectorAll('bp-accordion-item')
    ) as BpAccordionItem[];
    await items[0].updateComplete;
    await items[1].updateComplete;

    // Click first item
    const header1 = items[0].shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;
    header1.click();
    await element.updateComplete;

    // Click second item
    const header2 = items[1].shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;
    header2.click();
    await element.updateComplete;

    expect(element.expandedItems).toContain('item-1');
    expect(element.expandedItems).toContain('item-2');
  });

  // Public method tests
  it('should expand item with expand() method', async () => {
    element.innerHTML =
      '<bp-accordion-item item-id="test-item" header="Test">Content</bp-accordion-item>';
    await element.updateComplete;

    element.expand('test-item');
    await element.updateComplete;

    expect(element.expandedItems).toContain('test-item');
  });

  it('should collapse item with collapse() method', async () => {
    element.expandedItems = ['test-item'];
    element.innerHTML =
      '<bp-accordion-item item-id="test-item" header="Test">Content</bp-accordion-item>';
    await element.updateComplete;

    element.collapse('test-item');
    await element.updateComplete;

    expect(element.expandedItems).not.toContain('test-item');
  });

  it('should expand all items with expandAll() method when multiple is true', async () => {
    element.multiple = true;
    element.innerHTML = `
      <bp-accordion-item item-id="item-1" header="Item 1">Content 1</bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Item 2">Content 2</bp-accordion-item>
    `;
    await element.updateComplete;

    element.expandAll();
    await element.updateComplete;

    expect(element.expandedItems).toContain('item-1');
    expect(element.expandedItems).toContain('item-2');
  });

  it('should collapse all items with collapseAll() method', async () => {
    element.expandedItems = ['item-1', 'item-2'];
    element.innerHTML = `
      <bp-accordion-item item-id="item-1" header="Item 1">Content 1</bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Item 2">Content 2</bp-accordion-item>
    `;
    await element.updateComplete;

    element.collapseAll();
    await element.updateComplete;

    expect(element.expandedItems).toEqual([]);
  });

  // Validation tests
  it('should fallback to default variant when invalid variant attribute provided', async () => {
    element.setAttribute('variant', 'invalid-variant');
    await element.updateComplete;
    expect(element.variant).toBe('default');
  });

  it('should handle expandedItems with IDs that do not match any items', async () => {
    element.expandedItems = ['non-existent-id'];
    element.innerHTML =
      '<bp-accordion-item item-id="real-item" header="Test">Content</bp-accordion-item>';
    await element.updateComplete;

    const item = element.querySelector('bp-accordion-item') as BpAccordionItem;
    await item.updateComplete;

    // Item should not be expanded
    expect(item.expanded).toBe(false);
  });

  it('should disable all items when accordion is disabled', async () => {
    element.innerHTML = `
      <bp-accordion-item item-id="item-1" header="Item 1">Content 1</bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Item 2">Content 2</bp-accordion-item>
    `;
    await element.updateComplete;

    element.disabled = true;
    await element.updateComplete;

    const items = Array.from(
      element.querySelectorAll('bp-accordion-item')
    ) as BpAccordionItem[];

    items.forEach((item) => {
      expect(item.disabled).toBe(true);
    });
  });

  // Accessibility tests
  it('should have role="presentation" on accordion container', async () => {
    await element.updateComplete;
    const accordion = element.shadowRoot?.querySelector('.accordion');
    expect(accordion?.getAttribute('role')).toBe('presentation');
  });
});

describe('bp-accordion-item', () => {
  let element: BpAccordionItem;

  beforeEach(() => {
    element = document.createElement('bp-accordion-item') as BpAccordionItem;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Default values tests
  it('should have correct default property values for accordion item', () => {
    expect(element.header).toBe('');
    expect(element.expanded).toBe(false);
    expect(element.disabled).toBe(false);
  });

  // Property tests
  it('should set property: header', async () => {
    element.header = 'Test Header';
    await element.updateComplete;
    expect(element.header).toBe('Test Header');
  });

  it('should set property: expanded', async () => {
    element.expanded = true;
    await element.updateComplete;
    expect(element.expanded).toBe(true);
    const item = element.shadowRoot?.querySelector('.item');
    expect(item?.classList.contains('item--expanded')).toBe(true);
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const item = element.shadowRoot?.querySelector('.item');
    expect(item?.classList.contains('item--disabled')).toBe(true);
  });

  // Attribute tests
  it('should reflect expanded attribute when property changes', async () => {
    element.expanded = true;
    await element.updateComplete;
    expect(element.hasAttribute('expanded')).toBe(true);
  });

  it('should reflect disabled attribute when property changes', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  // CSS Parts tests
  it('should expose all CSS parts for styling', async () => {
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('[part="item"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="header"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="icon"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="content"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="body"]')).toBeTruthy();
  });

  // Slot tests
  it('should render slotted content in body', async () => {
    element.innerHTML = '<p>Test content</p>';
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('.item__body slot');
    expect(slot).toBeTruthy();
  });

  it('should render slotted header content', async () => {
    element.innerHTML = '<span slot="header">Custom Header</span>';
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('slot[name="header"]');
    expect(slot).toBeTruthy();
  });

  it('should render slotted icon content', async () => {
    element.innerHTML = '<svg slot="icon"></svg>';
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('slot[name="icon"]');
    expect(slot).toBeTruthy();
  });

  // Event tests
  it('should emit bp-item-toggle event when header is clicked', async () => {
    element.itemId = 'test-item';
    await element.updateComplete;

    const toggleHandler = vi.fn();
    element.addEventListener('bp-item-toggle', toggleHandler);

    const header = element.shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;
    header.click();

    expect(toggleHandler).toHaveBeenCalled();
    expect(toggleHandler.mock.calls[0][0].detail).toEqual({
      id: 'test-item',
      expanded: true,
    });
  });

  // Interaction tests
  it('should not toggle when disabled', async () => {
    element.itemId = 'test-item';
    element.disabled = true;
    await element.updateComplete;

    const toggleHandler = vi.fn();
    element.addEventListener('bp-item-toggle', toggleHandler);

    const header = element.shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;
    header.click();

    expect(toggleHandler).not.toHaveBeenCalled();
  });

  it('should toggle on Enter key press', async () => {
    element.itemId = 'test-item';
    await element.updateComplete;

    const toggleHandler = vi.fn();
    element.addEventListener('bp-item-toggle', toggleHandler);

    const header = element.shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;
    header.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );

    expect(toggleHandler).toHaveBeenCalled();
  });

  it('should toggle on Space key press', async () => {
    element.itemId = 'test-item';
    await element.updateComplete;

    const toggleHandler = vi.fn();
    element.addEventListener('bp-item-toggle', toggleHandler);

    const header = element.shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;
    header.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );

    expect(toggleHandler).toHaveBeenCalled();
  });

  // Accessibility tests
  it('should have aria-expanded attribute on header button', async () => {
    await element.updateComplete;
    const header = element.shadowRoot?.querySelector('.item__header');
    expect(header?.hasAttribute('aria-expanded')).toBe(true);
  });

  it('should update aria-expanded when expanded changes', async () => {
    await element.updateComplete;
    const header = element.shadowRoot?.querySelector('.item__header');
    expect(header?.getAttribute('aria-expanded')).toBe('false');

    element.expanded = true;
    await element.updateComplete;
    expect(header?.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have aria-controls on header linking to content', async () => {
    element.itemId = 'test-item';
    await element.updateComplete;
    const header = element.shadowRoot?.querySelector('.item__header');
    expect(header?.getAttribute('aria-controls')).toBe('test-item-content');
  });

  it('should have role="region" on content panel', async () => {
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('.item__content');
    expect(content?.getAttribute('role')).toBe('region');
  });

  it('should have aria-labelledby on content linking to header', async () => {
    element.itemId = 'test-item';
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('.item__content');
    expect(content?.getAttribute('aria-labelledby')).toBe('test-item-header');
  });

  it('should have aria-hidden on chevron icon', async () => {
    await element.updateComplete;
    const icon = element.shadowRoot?.querySelector('.item__icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  // Focus management tests
  it('should focus header button after toggle completes', async () => {
    element.itemId = 'test-item';
    await element.updateComplete;

    const header = element.shadowRoot?.querySelector(
      '.item__header'
    ) as HTMLButtonElement;

    // Spy on focus method
    const focusSpy = vi.spyOn(header, 'focus');

    header.click();
    await element.updateComplete;

    expect(focusSpy).toHaveBeenCalled();
  });

  // Auto-generated ID test
  it('should auto-generate itemId if not provided', async () => {
    await element.updateComplete;
    expect(element.itemId).toBeTruthy();
    expect(element.itemId.startsWith('accordion-item-')).toBe(true);
  });
});
