import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './menu.js';
import type { BpMenu, BpMenuItem, BpMenuDivider } from './menu.js';

describe('bp-menu', () => {
  let element: BpMenu;

  beforeEach(() => {
    element = document.createElement('bp-menu');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-menu');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render menu element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const menu = element.shadowRoot!.querySelector('[role="menu"]');
    expect(menu).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.size).toBe('medium');
  });

  // Sizes
  it('should apply small size styles', async () => {
    element.size = 'small';
    await element.updateComplete;
    const menu = element.shadowRoot!.querySelector('.menu');
    expect(menu?.classList.contains('menu--small')).toBe(true);
  });

  it('should apply large size styles', async () => {
    element.size = 'large';
    await element.updateComplete;
    const menu = element.shadowRoot!.querySelector('.menu');
    expect(menu?.classList.contains('menu--large')).toBe(true);
  });

  // CSS Parts
  it('should expose container part for styling', async () => {
    await element.updateComplete;
    const container = element.shadowRoot!.querySelector('[part="container"]');
    expect(container).toBeTruthy();
  });

  // Accessibility
  it('should have role menu on container', async () => {
    await element.updateComplete;
    const menu = element.shadowRoot!.querySelector('.menu');
    expect(menu?.getAttribute('role')).toBe('menu');
  });

  // Slots
  it('should render slotted menu items', async () => {
    const item = document.createElement('bp-menu-item');
    item.textContent = 'Test Item';
    element.appendChild(item);
    await element.updateComplete;

    const slot = element.shadowRoot!.querySelector('slot');
    expect(slot).toBeTruthy();
    expect(slot?.assignedElements().length).toBe(1);

    item.remove();
  });

  // Keyboard Navigation
  it('should navigate through items with ArrowDown and ArrowUp', async () => {
    const item1 = document.createElement('bp-menu-item') as BpMenuItem;
    const item2 = document.createElement('bp-menu-item') as BpMenuItem;
    const item3 = document.createElement('bp-menu-item') as BpMenuItem;
    item1.value = 'item1';
    item2.value = 'item2';
    item3.value = 'item3';
    element.appendChild(item1);
    element.appendChild(item2);
    element.appendChild(item3);
    await element.updateComplete;
    await item1.updateComplete;
    await item2.updateComplete;
    await item3.updateComplete;

    const menu = element.shadowRoot!.querySelector('.menu') as HTMLElement;
    const focusSpy1 = vi.fn();
    const focusSpy2 = vi.fn();
    const focusSpy3 = vi.fn();

    item1.focus = focusSpy1;
    item2.focus = focusSpy2;
    item3.focus = focusSpy3;

    // First arrow down should call focus on first item
    menu.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    expect(focusSpy1).toHaveBeenCalledOnce();

    // Second arrow down should call focus on second item
    menu.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    expect(focusSpy2).toHaveBeenCalledOnce();

    // Arrow up should go back to first item
    menu.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
    );
    expect(focusSpy1).toHaveBeenCalledTimes(2);

    item1.remove();
    item2.remove();
    item3.remove();
  });

  it('should focus first item on Home key', async () => {
    const item1 = document.createElement('bp-menu-item') as BpMenuItem;
    const item2 = document.createElement('bp-menu-item') as BpMenuItem;
    const item3 = document.createElement('bp-menu-item') as BpMenuItem;
    item1.value = 'item1';
    item2.value = 'item2';
    item3.value = 'item3';
    element.appendChild(item1);
    element.appendChild(item2);
    element.appendChild(item3);
    await element.updateComplete;
    await item1.updateComplete;
    await item2.updateComplete;
    await item3.updateComplete;

    const menu = element.shadowRoot!.querySelector('.menu') as HTMLElement;
    const focusSpy = vi.spyOn(item1, 'focus');

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));

    expect(focusSpy).toHaveBeenCalled();

    item1.remove();
    item2.remove();
    item3.remove();
  });

  it('should focus last item on End key', async () => {
    const item1 = document.createElement('bp-menu-item') as BpMenuItem;
    const item2 = document.createElement('bp-menu-item') as BpMenuItem;
    const item3 = document.createElement('bp-menu-item') as BpMenuItem;
    item1.value = 'item1';
    item2.value = 'item2';
    item3.value = 'item3';
    element.appendChild(item1);
    element.appendChild(item2);
    element.appendChild(item3);
    await element.updateComplete;
    await item1.updateComplete;
    await item2.updateComplete;
    await item3.updateComplete;

    const menu = element.shadowRoot!.querySelector('.menu') as HTMLElement;
    const focusSpy = vi.spyOn(item3, 'focus');

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

    expect(focusSpy).toHaveBeenCalled();

    item1.remove();
    item2.remove();
    item3.remove();
  });

  it('should skip disabled items during keyboard navigation', async () => {
    const item1 = document.createElement('bp-menu-item') as BpMenuItem;
    const item2 = document.createElement('bp-menu-item') as BpMenuItem;
    const item3 = document.createElement('bp-menu-item') as BpMenuItem;
    item1.value = 'item1';
    item2.value = 'item2';
    item2.disabled = true;
    item3.value = 'item3';
    element.appendChild(item1);
    element.appendChild(item2);
    element.appendChild(item3);
    await element.updateComplete;
    await item1.updateComplete;
    await item2.updateComplete;
    await item3.updateComplete;

    const menu = element.shadowRoot!.querySelector('.menu') as HTMLElement;
    const focusSpy1 = vi.fn();
    const focusSpy2 = vi.fn();
    const focusSpy3 = vi.fn();

    item1.focus = focusSpy1;
    item2.focus = focusSpy2;
    item3.focus = focusSpy3;

    // First arrow down should focus item1 (first enabled item)
    menu.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    expect(focusSpy1).toHaveBeenCalledOnce();

    // Second arrow down should skip disabled item2 and focus item3
    menu.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    expect(focusSpy3).toHaveBeenCalledOnce();

    // item2 should never have been focused (disabled items are filtered out)
    expect(focusSpy2).not.toHaveBeenCalled();

    item1.remove();
    item2.remove();
    item3.remove();
  });
});

describe('bp-menu-item', () => {
  let element: BpMenuItem;

  beforeEach(() => {
    element = document.createElement('bp-menu-item') as BpMenuItem;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-menu-item');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render menu-item element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const menuItem = element.shadowRoot!.querySelector('[role="menuitem"]');
    expect(menuItem).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.value).toBe('');
    expect(element.disabled).toBe(false);
    expect(element.selected).toBe(false);
    expect(element.hasSubmenu).toBe(false);
    expect(element.size).toBe('medium');
    expect(element.shortcut).toBe('');
  });

  // Events
  it('should emit bp-menu-select event when clicked', async () => {
    element.value = 'test-value';
    await element.updateComplete;

    const eventSpy = vi.fn();
    element.addEventListener('bp-menu-select', eventSpy);

    const menuItem = element.shadowRoot!.querySelector(
      '.menu-item'
    ) as HTMLElement;
    menuItem.click();
    await element.updateComplete;

    expect(eventSpy).toHaveBeenCalled();
    expect(eventSpy.mock.calls[0][0].detail.value).toBe('test-value');
  });

  it('should not emit event when disabled', async () => {
    element.disabled = true;
    element.value = 'test';
    await element.updateComplete;

    const eventSpy = vi.fn();
    element.addEventListener('bp-menu-select', eventSpy);

    const menuItem = element.shadowRoot!.querySelector(
      '.menu-item'
    ) as HTMLElement;
    menuItem.click();
    await element.updateComplete;

    expect(eventSpy).not.toHaveBeenCalled();
  });

  // Sizes
  it('should apply small size class', async () => {
    element.size = 'small';
    await element.updateComplete;
    const menuItem = element.shadowRoot!.querySelector('.menu-item');
    expect(menuItem?.classList.contains('menu-item--small')).toBe(true);
  });

  it('should apply large size class', async () => {
    element.size = 'large';
    await element.updateComplete;
    const menuItem = element.shadowRoot!.querySelector('.menu-item');
    expect(menuItem?.classList.contains('menu-item--large')).toBe(true);
  });

  // CSS Parts
  it('should expose base part for styling', async () => {
    await element.updateComplete;
    const base = element.shadowRoot!.querySelector('[part="base"]');
    expect(base).toBeTruthy();
  });

  it('should expose label part for styling', async () => {
    await element.updateComplete;
    const label = element.shadowRoot!.querySelector('[part="label"]');
    expect(label).toBeTruthy();
  });

  it('should expose prefix part for styling', async () => {
    await element.updateComplete;
    const prefix = element.shadowRoot!.querySelector('[part="prefix"]');
    expect(prefix).toBeTruthy();
  });

  it('should expose suffix part for styling', async () => {
    await element.updateComplete;
    const suffix = element.shadowRoot!.querySelector('[part="suffix"]');
    expect(suffix).toBeTruthy();
  });

  // Accessibility
  it('should have role menuitem', async () => {
    await element.updateComplete;
    const menuItem = element.shadowRoot!.querySelector('.menu-item');
    expect(menuItem?.getAttribute('role')).toBe('menuitem');
  });

  it('should have aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const menuItem = element.shadowRoot!.querySelector('.menu-item');
    expect(menuItem?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have tabindex 0 when not disabled', async () => {
    await element.updateComplete;
    const menuItem = element.shadowRoot!.querySelector('.menu-item');
    expect(menuItem?.getAttribute('tabindex')).toBe('0');
  });

  it('should have tabindex -1 when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const menuItem = element.shadowRoot!.querySelector('.menu-item');
    expect(menuItem?.getAttribute('tabindex')).toBe('-1');
  });

  it('should apply selected class when selected is true', async () => {
    element.selected = true;
    await element.updateComplete;
    const menuItem = element.shadowRoot!.querySelector('.menu-item');
    expect(menuItem?.classList.contains('menu-item--selected')).toBe(true);
  });

  it('should have aria-current when selected', async () => {
    element.selected = true;
    await element.updateComplete;
    const menuItem = element.shadowRoot!.querySelector('.menu-item');
    expect(menuItem?.getAttribute('aria-current')).toBe('page');
  });

  it('should not have aria-current when not selected', async () => {
    element.selected = false;
    await element.updateComplete;
    const menuItem = element.shadowRoot!.querySelector('.menu-item');
    expect(menuItem?.getAttribute('aria-current')).toBe('false');
  });

  // Interactions
  it('should show shortcut when provided', async () => {
    element.shortcut = 'Ctrl+S';
    await element.updateComplete;
    const shortcut = element.shadowRoot!.querySelector('.menu-item__shortcut');
    expect(shortcut?.textContent).toBe('Ctrl+S');
  });

  it('should show arrow when hasSubmenu is true', async () => {
    element.hasSubmenu = true;
    await element.updateComplete;
    const arrow = element.shadowRoot!.querySelector('.menu-item__arrow');
    expect(arrow).toBeTruthy();
  });

  it('should emit event on Enter key press', async () => {
    element.value = 'keyboard-test';
    await element.updateComplete;

    const eventSpy = vi.fn();
    element.addEventListener('bp-menu-select', eventSpy);

    const menuItem = element.shadowRoot!.querySelector(
      '.menu-item'
    ) as HTMLElement;
    menuItem.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    await element.updateComplete;

    expect(eventSpy).toHaveBeenCalled();
  });

  it('should emit event on Space key press', async () => {
    element.value = 'space-test';
    await element.updateComplete;

    const eventSpy = vi.fn();
    element.addEventListener('bp-menu-select', eventSpy);

    const menuItem = element.shadowRoot!.querySelector(
      '.menu-item'
    ) as HTMLElement;
    menuItem.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    await element.updateComplete;

    expect(eventSpy).toHaveBeenCalled();
  });

  it('should focus internal element when focus() is called', async () => {
    await element.updateComplete;
    const menuItem = element.shadowRoot!.querySelector(
      '.menu-item'
    ) as HTMLElement;
    const focusSpy = vi.spyOn(menuItem, 'focus');
    element.focus();
    expect(focusSpy).toHaveBeenCalled();
  });

  // Slots
  it('should render slotted label content', async () => {
    element.innerHTML = 'Menu Label';
    await element.updateComplete;
    const slot = element.shadowRoot!.querySelector('.menu-item__label slot');
    expect(slot).toBeTruthy();
  });
});

describe('bp-menu-divider', () => {
  let element: BpMenuDivider;

  beforeEach(() => {
    element = document.createElement('bp-menu-divider') as BpMenuDivider;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-menu-divider');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render divider element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const divider = element.shadowRoot!.querySelector('[role="separator"]');
    expect(divider).toBeTruthy();
  });

  // CSS Parts
  it('should expose divider part for styling', async () => {
    await element.updateComplete;
    const divider = element.shadowRoot!.querySelector('[part="divider"]');
    expect(divider).toBeTruthy();
  });

  // Accessibility
  it('should have role separator', async () => {
    await element.updateComplete;
    const divider = element.shadowRoot!.querySelector('.menu-divider');
    expect(divider?.getAttribute('role')).toBe('separator');
  });
});
