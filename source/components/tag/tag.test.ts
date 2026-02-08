import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './tag.js';
import type { BpTag } from './tag.js';

describe('bp-tag', () => {
  let element: BpTag;

  beforeEach(() => {
    element = document.createElement('bp-tag');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-tag');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render tag container to DOM', async () => {
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.variant).toBe('solid');
    expect(element.size).toBe('md');
    expect(element.color).toBe('neutral');
    expect(element.removable).toBe(false);
    expect(element.disabled).toBe(false);
  });

  // Properties
  it('should set property: variant', async () => {
    element.variant = 'outlined';
    await element.updateComplete;
    expect(element.variant).toBe('outlined');
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.classList.contains('tag--outlined')).toBe(true);
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.classList.contains('tag--lg')).toBe(true);
  });

  it('should set property: color', async () => {
    element.color = 'primary';
    await element.updateComplete;
    expect(element.color).toBe('primary');
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.classList.contains('tag--primary')).toBe(true);
  });

  it('should set property: removable', async () => {
    element.removable = true;
    await element.updateComplete;
    expect(element.removable).toBe(true);
    const closeButton = element.shadowRoot?.querySelector('.tag__close');
    expect(closeButton).toBeTruthy();
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.classList.contains('tag--disabled')).toBe(true);
  });

  // Attribute Reflection
  it('should reflect variant attribute to DOM', async () => {
    element.variant = 'outlined';
    await element.updateComplete;
    expect(element.getAttribute('variant')).toBe('outlined');
  });

  it('should reflect size attribute to DOM', async () => {
    element.size = 'sm';
    await element.updateComplete;
    expect(element.getAttribute('size')).toBe('sm');
  });

  it('should reflect color attribute to DOM', async () => {
    element.color = 'success';
    await element.updateComplete;
    expect(element.getAttribute('color')).toBe('success');
  });

  it('should reflect removable attribute to DOM', async () => {
    element.removable = true;
    await element.updateComplete;
    expect(element.hasAttribute('removable')).toBe(true);
  });

  it('should reflect disabled attribute to DOM', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).toBe(true);
  });

  // Events
  it('should emit bp-remove event when close button is clicked', async () => {
    element.removable = true;
    await element.updateComplete;

    const removeHandler = vi.fn();
    element.addEventListener('bp-remove', removeHandler);

    const closeButton = element.shadowRoot?.querySelector('.tag__close');
    (closeButton as unknown as { click: () => void })?.click();

    expect(removeHandler).toHaveBeenCalled();
  });

  it('should remove element from DOM when close button is clicked', async () => {
    element.removable = true;
    await element.updateComplete;

    expect(document.body.contains(element)).toBe(true);

    const closeButton = element.shadowRoot?.querySelector('.tag__close');
    (closeButton as unknown as { click: () => void })?.click();

    expect(document.body.contains(element)).toBe(false);
  });

  it('should not remove element if event is prevented', async () => {
    element.removable = true;
    await element.updateComplete;

    element.addEventListener('bp-remove', (e) => e.preventDefault());

    const closeButton = element.shadowRoot?.querySelector('.tag__close');
    (closeButton as unknown as { click: () => void })?.click();

    expect(document.body.contains(element)).toBe(true);
  });

  it('should not emit bp-remove event when disabled', async () => {
    element.removable = true;
    element.disabled = true;
    await element.updateComplete;

    const removeHandler = vi.fn();
    element.addEventListener('bp-remove', removeHandler);

    const closeButton = element.shadowRoot?.querySelector('.tag__close');
    (closeButton as unknown as { click: () => void })?.click();

    expect(removeHandler).not.toHaveBeenCalled();
  });

  // Keyboard Navigation
  it('should support Delete key for removal when focused and removable', async () => {
    element.removable = true;
    await element.updateComplete;

    const removeHandler = vi.fn();
    element.addEventListener('bp-remove', removeHandler);

    const tag = element.shadowRoot?.querySelector('.tag');
    const keyEvent = new Event('keydown');
    Object.defineProperty(keyEvent, 'key', { value: 'Delete' });
    tag?.dispatchEvent(keyEvent);

    expect(removeHandler).toHaveBeenCalled();
  });

  it('should support Backspace key for removal when focused and removable', async () => {
    element.removable = true;
    await element.updateComplete;

    const removeHandler = vi.fn();
    element.addEventListener('bp-remove', removeHandler);

    const tag = element.shadowRoot?.querySelector('.tag');
    const keyEvent = new Event('keydown');
    Object.defineProperty(keyEvent, 'key', { value: 'Backspace' });
    tag?.dispatchEvent(keyEvent);

    expect(removeHandler).toHaveBeenCalled();
  });

  it('should not handle keyboard events when disabled', async () => {
    element.removable = true;
    element.disabled = true;
    await element.updateComplete;

    const removeHandler = vi.fn();
    element.addEventListener('bp-remove', removeHandler);

    const tag = element.shadowRoot?.querySelector('.tag');
    const keyEvent = new Event('keydown');
    Object.defineProperty(keyEvent, 'key', { value: 'Delete' });
    tag?.dispatchEvent(keyEvent);

    expect(removeHandler).not.toHaveBeenCalled();
  });

  // CSS Parts
  it('should expose tag part for styling', async () => {
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('[part="tag"]');
    expect(tag).toBeTruthy();
  });

  it('should expose close-button part when removable', async () => {
    element.removable = true;
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector(
      '[part="close-button"]'
    );
    expect(closeButton).toBeTruthy();
  });

  // Accessibility
  it('should have role="status" on tag element', async () => {
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.getAttribute('role')).toBe('status');
  });

  it('should set aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should set tabindex=0 when removable and not disabled', async () => {
    element.removable = true;
    element.disabled = false;
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.getAttribute('tabindex')).toBe('0');
  });

  it('should set tabindex=-1 when not removable', async () => {
    element.removable = false;
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.getAttribute('tabindex')).toBe('-1');
  });

  it('should have aria-label on close button', async () => {
    element.removable = true;
    await element.updateComplete;
    const closeButton = element.shadowRoot?.querySelector('.tag__close');
    expect(closeButton?.getAttribute('aria-label')).toBe('Remove');
  });

  // Variant Tests
  it('should apply solid variant with primary color', async () => {
    element.variant = 'solid';
    element.color = 'primary';
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.classList.contains('tag--solid')).toBe(true);
    expect(tag?.classList.contains('tag--primary')).toBe(true);
  });

  it('should apply outlined variant with success color', async () => {
    element.variant = 'outlined';
    element.color = 'success';
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.classList.contains('tag--outlined')).toBe(true);
    expect(tag?.classList.contains('tag--success')).toBe(true);
  });

  // Size Tests
  it('should apply small size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.classList.contains('tag--sm')).toBe(true);
  });

  it('should apply medium size styles', async () => {
    element.size = 'md';
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.classList.contains('tag--md')).toBe(true);
  });

  it('should apply large size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;
    const tag = element.shadowRoot?.querySelector('.tag');
    expect(tag?.classList.contains('tag--lg')).toBe(true);
  });

  // Content Slot
  it('should render slotted content', async () => {
    const content = document.createTextNode('Design');
    element.appendChild(content);
    await element.updateComplete;
    const slot = element.shadowRoot?.querySelector('.tag__content slot');
    expect(slot).toBeTruthy();
  });
});
