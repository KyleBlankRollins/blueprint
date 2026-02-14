import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './card.js';
import type { BpCard } from './card.js';

describe('bp-card', () => {
  let element: BpCard;

  beforeEach(() => {
    element = document.createElement('bp-card');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-card');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render card container to DOM', async () => {
    await element.updateComplete;
    const card = element.shadowRoot?.querySelector('.card');
    expect(card).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.variant).toBe('default');
    expect(element.hoverable).toBe(false);
    expect(element.clickable).toBe(false);
    expect(element.noPadding).toBe(false);
    expect(element.direction).toBe('vertical');
  });

  // Properties
  it('should set property: variant', async () => {
    element.variant = 'elevated';
    await element.updateComplete;
    expect(element.variant).toBe('elevated');
  });

  it('should set property: hoverable', async () => {
    element.hoverable = true;
    await element.updateComplete;
    expect(element.hoverable).toBe(true);
  });

  it('should set property: clickable', async () => {
    element.clickable = true;
    await element.updateComplete;
    expect(element.clickable).toBe(true);
  });

  it('should set property: noPadding', async () => {
    element.noPadding = true;
    await element.updateComplete;
    expect(element.noPadding).toBe(true);
  });

  it('should set property: direction', async () => {
    element.direction = 'horizontal';
    await element.updateComplete;
    expect(element.direction).toBe('horizontal');
  });

  // Attributes
  it('should reflect variant attribute to DOM', async () => {
    element.variant = 'outlined';
    await element.updateComplete;
    expect(element.getAttribute('variant')).toBe('outlined');
  });

  it('should reflect hoverable attribute to DOM', async () => {
    element.hoverable = true;
    await element.updateComplete;
    expect(element.hasAttribute('hoverable')).toBe(true);
  });

  it('should reflect clickable attribute to DOM', async () => {
    element.clickable = true;
    await element.updateComplete;
    expect(element.hasAttribute('clickable')).toBe(true);
  });

  it('should reflect noPadding attribute to DOM', async () => {
    element.noPadding = true;
    await element.updateComplete;
    expect(element.hasAttribute('nopadding')).toBe(true);
  });

  it('should reflect direction attribute to DOM', async () => {
    element.direction = 'horizontal';
    await element.updateComplete;
    expect(element.getAttribute('direction')).toBe('horizontal');
  });

  // Events
  it('should emit bp-click event when clickable card is clicked', async () => {
    element.clickable = true;
    await element.updateComplete;

    const clickHandler = vi.fn();
    element.addEventListener('bp-click', clickHandler);

    const card = element.shadowRoot?.querySelector('.card');
    card?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(clickHandler).toHaveBeenCalled();
  });

  it('should not emit bp-click when card is not clickable', async () => {
    element.clickable = false;
    await element.updateComplete;

    const clickHandler = vi.fn();
    element.addEventListener('bp-click', clickHandler);

    const card = element.shadowRoot?.querySelector('.card');
    card?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(clickHandler).not.toHaveBeenCalled();
  });

  it('should emit bp-click on Enter key press when clickable', async () => {
    element.clickable = true;
    await element.updateComplete;

    const clickHandler = vi.fn();
    element.addEventListener('bp-click', clickHandler);

    const card = element.shadowRoot?.querySelector('.card');
    card?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );

    expect(clickHandler).toHaveBeenCalled();
  });

  it('should emit bp-click on Space key press when clickable', async () => {
    element.clickable = true;
    await element.updateComplete;

    const clickHandler = vi.fn();
    element.addEventListener('bp-click', clickHandler);

    const card = element.shadowRoot?.querySelector('.card');
    card?.dispatchEvent(
      new window.KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );

    expect(clickHandler).toHaveBeenCalled();
  });

  // Slots
  it('should render slotted default content', async () => {
    const content = document.createElement('p');
    content.textContent = 'Card content';
    element.appendChild(content);

    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector('slot:not([name])');
    expect(slot).toBeTruthy();
  });

  it('should render slotted header content', async () => {
    const header = document.createElement('div');
    header.slot = 'header';
    header.textContent = 'Card Header';
    element.appendChild(header);

    await element.updateComplete;

    const headerSlot = element.shadowRoot?.querySelector('slot[name="header"]');
    expect(headerSlot).toBeTruthy();
  });

  it('should render slotted footer content', async () => {
    const footer = document.createElement('div');
    footer.slot = 'footer';
    footer.textContent = 'Card Footer';
    element.appendChild(footer);

    await element.updateComplete;

    const footerSlot = element.shadowRoot?.querySelector('slot[name="footer"]');
    expect(footerSlot).toBeTruthy();
  });

  it('should render slotted media content', async () => {
    const media = document.createElement('img');
    media.slot = 'media';
    media.src = 'test.jpg';
    element.appendChild(media);

    await element.updateComplete;

    const mediaSlot = element.shadowRoot?.querySelector('slot[name="media"]');
    expect(mediaSlot).toBeTruthy();
  });

  // CSS Parts
  it('should expose card part for styling', async () => {
    await element.updateComplete;
    const card = element.shadowRoot?.querySelector('[part="card"]');
    expect(card).toBeTruthy();
  });

  it('should expose body part for styling', async () => {
    await element.updateComplete;
    const body = element.shadowRoot?.querySelector('[part="body"]');
    expect(body).toBeTruthy();
  });

  it('should expose header part for styling', async () => {
    const header = document.createElement('div');
    header.slot = 'header';
    header.textContent = 'Header';
    element.appendChild(header);
    await element.updateComplete;
    const headerPart = element.shadowRoot?.querySelector('[part="header"]');
    expect(headerPart).toBeTruthy();
  });

  it('should expose footer part for styling', async () => {
    const footer = document.createElement('div');
    footer.slot = 'footer';
    footer.textContent = 'Footer';
    element.appendChild(footer);
    await element.updateComplete;
    const footerPart = element.shadowRoot?.querySelector('[part="footer"]');
    expect(footerPart).toBeTruthy();
  });

  it('should expose media part for styling', async () => {
    await element.updateComplete;
    const media = element.shadowRoot?.querySelector('[part="media"]');
    expect(media).toBeTruthy();
  });

  it('should expose content part for styling', async () => {
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('[part="content"]');
    expect(content).toBeTruthy();
  });

  // Variants
  it('should apply default variant styles', async () => {
    element.variant = 'default';
    await element.updateComplete;

    const card = element.shadowRoot?.querySelector('.card--default');
    expect(card).toBeTruthy();
  });

  it('should apply outlined variant styles', async () => {
    element.variant = 'outlined';
    await element.updateComplete;

    const card = element.shadowRoot?.querySelector('.card--outlined');
    expect(card).toBeTruthy();
  });

  it('should apply elevated variant styles', async () => {
    element.variant = 'elevated';
    await element.updateComplete;

    const card = element.shadowRoot?.querySelector('.card--elevated');
    expect(card).toBeTruthy();
  });

  // Interactive states
  it('should apply hoverable class when hoverable is true', async () => {
    element.hoverable = true;
    await element.updateComplete;

    const card = element.shadowRoot?.querySelector('.card--hoverable');
    expect(card).toBeTruthy();
  });

  it('should apply clickable class when clickable is true', async () => {
    element.clickable = true;
    await element.updateComplete;

    const card = element.shadowRoot?.querySelector('.card--clickable');
    expect(card).toBeTruthy();
  });

  it('should apply both hoverable and clickable classes when clickable', async () => {
    element.clickable = true;
    await element.updateComplete;

    const card = element.shadowRoot?.querySelector('.card');
    expect(card?.classList.contains('card--hoverable')).toBe(true);
    expect(card?.classList.contains('card--clickable')).toBe(true);
  });

  // No padding state
  it('should apply no-padding class to body when noPadding is true', async () => {
    element.noPadding = true;
    await element.updateComplete;

    const body = element.shadowRoot?.querySelector('.card-body--no-padding');
    expect(body).toBeTruthy();
  });

  // Direction / horizontal layout
  it('should render card-content wrapper', async () => {
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('.card-content');
    expect(content).toBeTruthy();
  });

  it('should not apply horizontal class when direction is vertical', async () => {
    element.direction = 'vertical';
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector(
      '.card-content--horizontal'
    );
    expect(content).toBeFalsy();
  });

  it('should apply horizontal class when direction is horizontal', async () => {
    element.direction = 'horizontal';
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector(
      '.card-content--horizontal'
    );
    expect(content).toBeTruthy();
  });

  it('should contain media slot inside card-content', async () => {
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('.card-content');
    const mediaSlot = content?.querySelector('slot[name="media"]');
    expect(mediaSlot).toBeTruthy();
  });

  it('should contain card-body inside card-content', async () => {
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('.card-content');
    const body = content?.querySelector('.card-body');
    expect(body).toBeTruthy();
  });

  it('should keep header slot outside card-content', async () => {
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('.card-content');
    const headerSlot = content?.querySelector('slot[name="header"]');
    expect(headerSlot).toBeFalsy();
  });

  it('should keep footer slot outside card-content', async () => {
    await element.updateComplete;
    const content = element.shadowRoot?.querySelector('.card-content');
    const footerSlot = content?.querySelector('slot[name="footer"]');
    expect(footerSlot).toBeFalsy();
  });

  // Accessibility
  it('should have role article by default', async () => {
    await element.updateComplete;
    const card = element.shadowRoot?.querySelector('.card');
    expect(card?.getAttribute('role')).toBe('article');
  });

  it('should have role button when clickable', async () => {
    element.clickable = true;
    await element.updateComplete;
    const card = element.shadowRoot?.querySelector('.card');
    expect(card?.getAttribute('role')).toBe('button');
  });

  it('should have tabindex 0 when clickable', async () => {
    element.clickable = true;
    await element.updateComplete;
    const card = element.shadowRoot?.querySelector('.card');
    expect(card?.getAttribute('tabindex')).toBe('0');
  });

  it('should not have tabindex when not clickable', async () => {
    element.clickable = false;
    await element.updateComplete;
    const card = element.shadowRoot?.querySelector('.card');
    // When undefined, the attribute is not set (returns null)
    expect(card?.getAttribute('tabindex')).toBeNull();
  });

  it('should support keyboard navigation with Enter when clickable', async () => {
    element.clickable = true;
    await element.updateComplete;

    const clickHandler = vi.fn();
    element.addEventListener('bp-click', clickHandler);

    const card = element.shadowRoot?.querySelector('.card');
    const event = new window.KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    card?.dispatchEvent(event);

    expect(clickHandler).toHaveBeenCalled();
  });

  it('should support keyboard navigation with Space when clickable', async () => {
    element.clickable = true;
    await element.updateComplete;

    const clickHandler = vi.fn();
    element.addEventListener('bp-click', clickHandler);

    const card = element.shadowRoot?.querySelector('.card');
    const event = new window.KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    card?.dispatchEvent(event);

    expect(clickHandler).toHaveBeenCalled();
  });
});
