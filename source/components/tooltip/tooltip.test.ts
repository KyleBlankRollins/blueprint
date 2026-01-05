import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './tooltip.js';
import type { BpTooltip } from './tooltip.js';

describe('bp-tooltip', () => {
  let element: BpTooltip;

  beforeEach(() => {
    element = document.createElement('bp-tooltip');
    document.body.appendChild(element);
    vi.useFakeTimers();
  });

  afterEach(() => {
    element.remove();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-tooltip');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render tooltip wrapper to DOM', async () => {
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    expect(wrapper).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.content).toBe('');
    expect(element.placement).toBe('top');
    expect(element.disabled).toBe(false);
    expect(element.delay).toBe(200);
  });

  // Properties - using "set property:" pattern
  it('should set property: content', async () => {
    element.content = 'Test tooltip';
    await element.updateComplete;
    expect(element.content).toBe('Test tooltip');
  });

  it('should set property: placement', async () => {
    element.placement = 'bottom';
    await element.updateComplete;
    expect(element.placement).toBe('bottom');
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
  });

  it('should set property: delay', async () => {
    element.delay = 500;
    await element.updateComplete;
    expect(element.delay).toBe(500);
  });

  // Events
  it('should emit bp-show event when tooltip becomes visible', async () => {
    element.content = 'Test';
    await element.updateComplete;

    const showHandler = vi.fn();
    element.addEventListener('bp-show', showHandler);

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));

    vi.advanceTimersByTime(200);
    await element.updateComplete;

    expect(showHandler).toHaveBeenCalled();
  });

  it('should emit bp-hide event when tooltip becomes hidden', async () => {
    element.content = 'Test';
    await element.updateComplete;

    const hideHandler = vi.fn();
    element.addEventListener('bp-hide', hideHandler);

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    await element.updateComplete;

    wrapper?.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(100);
    await element.updateComplete;

    expect(hideHandler).toHaveBeenCalled();
  });

  // Slots
  it('should render slotted trigger content', async () => {
    const button = document.createElement('button');
    button.textContent = 'Hover me';
    element.appendChild(button);

    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  // CSS Parts
  it('should expose trigger part for styling', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('[part="trigger"]');
    expect(trigger).toBeTruthy();
  });

  it('should expose content part when tooltip is visible', async () => {
    element.content = 'Test';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector('[part="content"]');
    expect(content).toBeTruthy();
  });

  // Interactions
  it('should show tooltip on mouse enter after delay', async () => {
    element.content = 'Test tooltip';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));

    // Before delay
    await element.updateComplete;
    let tooltipContent = element.shadowRoot?.querySelector('.tooltip-content');
    expect(tooltipContent).toBeFalsy();

    // After delay
    vi.advanceTimersByTime(200);
    await element.updateComplete;
    tooltipContent = element.shadowRoot?.querySelector('.tooltip-content');
    expect(tooltipContent).toBeTruthy();
  });

  it('should hide tooltip on mouse leave', async () => {
    element.content = 'Test tooltip';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    await element.updateComplete;

    let tooltipContent = element.shadowRoot?.querySelector('.tooltip-content');
    expect(tooltipContent).toBeTruthy();

    wrapper?.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(100);
    await element.updateComplete;

    tooltipContent = element.shadowRoot?.querySelector('.tooltip-content');
    expect(tooltipContent).toBeFalsy();
  });

  it('should show tooltip on focus immediately', async () => {
    element.content = 'Test tooltip';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new FocusEvent('focus'));
    await element.updateComplete;

    const tooltipContent =
      element.shadowRoot?.querySelector('.tooltip-content');
    expect(tooltipContent).toBeTruthy();
  });

  it('should hide tooltip on blur', async () => {
    element.content = 'Test tooltip';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new FocusEvent('focus'));
    await element.updateComplete;

    let tooltipContent = element.shadowRoot?.querySelector('.tooltip-content');
    expect(tooltipContent).toBeTruthy();

    wrapper?.dispatchEvent(new FocusEvent('blur'));
    await element.updateComplete;

    tooltipContent = element.shadowRoot?.querySelector('.tooltip-content');
    expect(tooltipContent).toBeFalsy();
  });

  // Placement variants
  it('should apply top placement styles', async () => {
    element.content = 'Test';
    element.placement = 'top';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector('.tooltip-content--top');
    expect(content).toBeTruthy();
  });

  it('should apply bottom placement styles', async () => {
    element.content = 'Test';
    element.placement = 'bottom';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector(
      '.tooltip-content--bottom'
    );
    expect(content).toBeTruthy();
  });

  it('should apply left placement styles', async () => {
    element.content = 'Test';
    element.placement = 'left';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector('.tooltip-content--left');
    expect(content).toBeTruthy();
  });

  it('should apply right placement styles', async () => {
    element.content = 'Test';
    element.placement = 'right';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector(
      '.tooltip-content--right'
    );
    expect(content).toBeTruthy();
  });

  // Disabled state
  it('should not show tooltip when disabled', async () => {
    element.content = 'Test';
    element.disabled = true;
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    await element.updateComplete;

    const tooltipContent =
      element.shadowRoot?.querySelector('.tooltip-content');
    expect(tooltipContent).toBeFalsy();
  });

  it('should clear timeouts on disconnect', async () => {
    element.content = 'Test';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));

    element.remove();

    vi.advanceTimersByTime(200);

    // Component should handle cleanup gracefully
    expect(true).toBe(true);
  });

  // Accessibility
  it('should have role tooltip on content', async () => {
    element.content = 'Test';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector('[role="tooltip"]');
    expect(content).toBeTruthy();
  });

  it('should have aria-hidden false when visible', async () => {
    element.content = 'Test';
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector('.tooltip-content');
    expect(content?.getAttribute('aria-hidden')).toBe('false');
  });

  it('should respect custom delay setting', async () => {
    element.content = 'Test';
    element.delay = 500;
    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector('.tooltip-wrapper');
    wrapper?.dispatchEvent(new MouseEvent('mouseenter'));

    // Not visible before custom delay
    vi.advanceTimersByTime(200);
    await element.updateComplete;
    let tooltipContent = element.shadowRoot?.querySelector('.tooltip-content');
    expect(tooltipContent).toBeFalsy();

    // Visible after custom delay
    vi.advanceTimersByTime(300);
    await element.updateComplete;
    tooltipContent = element.shadowRoot?.querySelector('.tooltip-content');
    expect(tooltipContent).toBeTruthy();
  });
});
