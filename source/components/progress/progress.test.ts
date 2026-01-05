import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './progress.js';
import type { BpProgress } from './progress.js';

describe('bp-progress', () => {
  let element: BpProgress;

  beforeEach(() => {
    element = document.createElement('bp-progress');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-progress');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render progress bar to DOM', async () => {
    await element.updateComplete;
    const progress = element.shadowRoot?.querySelector('.progress');
    expect(progress).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.value).toBe(0);
    expect(element.max).toBe(100);
    expect(element.variant).toBe('primary');
    expect(element.size).toBe('md');
    expect(element.label).toBe('');
    expect(element.showValue).toBe(false);
    expect(element.indeterminate).toBe(false);
  });

  // Properties
  it('should set property: value', async () => {
    element.value = 50;
    await element.updateComplete;
    expect(element.value).toBe(50);
  });

  it('should set property: max', async () => {
    element.max = 200;
    await element.updateComplete;
    expect(element.max).toBe(200);
  });

  it('should set property: variant', async () => {
    element.variant = 'success';
    await element.updateComplete;
    expect(element.variant).toBe('success');
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
  });

  it('should set property: label', async () => {
    element.label = 'Loading...';
    await element.updateComplete;
    expect(element.label).toBe('Loading...');
  });

  it('should set property: showValue', async () => {
    element.showValue = true;
    await element.updateComplete;
    expect(element.showValue).toBe(true);
  });

  it('should set property: indeterminate', async () => {
    element.indeterminate = true;
    await element.updateComplete;
    expect(element.indeterminate).toBe(true);
  });

  // Percentage calculation
  it('should calculate percentage correctly', async () => {
    element.value = 50;
    element.max = 100;
    await element.updateComplete;

    const bar = element.shadowRoot?.querySelector(
      '.progress-bar'
    ) as HTMLElement;
    expect(bar?.style.width).toBe('50%');
  });

  it('should clamp percentage to 100%', async () => {
    element.value = 150;
    element.max = 100;
    await element.updateComplete;

    const bar = element.shadowRoot?.querySelector(
      '.progress-bar'
    ) as HTMLElement;
    expect(bar?.style.width).toBe('100%');
  });

  it('should clamp percentage to 0%', async () => {
    element.value = -50;
    element.max = 100;
    await element.updateComplete;

    const bar = element.shadowRoot?.querySelector(
      '.progress-bar'
    ) as HTMLElement;
    expect(bar?.style.width).toBe('0%');
  });

  it('should handle custom max value', async () => {
    element.value = 50;
    element.max = 200;
    await element.updateComplete;

    const bar = element.shadowRoot?.querySelector(
      '.progress-bar'
    ) as HTMLElement;
    expect(bar?.style.width).toBe('25%');
  });

  // Events
  it('should emit bp-complete event when reaching 100%', async () => {
    const completeHandler = vi.fn();
    element.addEventListener('bp-complete', completeHandler);

    element.value = 100;
    await element.updateComplete;

    expect(completeHandler).toHaveBeenCalled();
  });

  it('should emit bp-complete when value exceeds max', async () => {
    const completeHandler = vi.fn();
    element.addEventListener('bp-complete', completeHandler);

    element.value = 150;
    element.max = 100;
    await element.updateComplete;

    expect(completeHandler).toHaveBeenCalled();
  });

  // Label and value display
  it('should display label when provided', async () => {
    element.label = 'Loading data';
    await element.updateComplete;

    const label = element.shadowRoot?.querySelector('.progress-label');
    expect(label?.textContent).toBe('Loading data');
  });

  it('should display percentage when showValue is true', async () => {
    element.value = 75;
    element.showValue = true;
    await element.updateComplete;

    const valueDisplay = element.shadowRoot?.querySelector('.progress-value');
    expect(valueDisplay?.textContent).toBe('75%');
  });

  it('should not display percentage when indeterminate', async () => {
    element.value = 75;
    element.showValue = true;
    element.indeterminate = true;
    await element.updateComplete;

    const valueDisplay = element.shadowRoot?.querySelector('.progress-value');
    expect(valueDisplay).toBeFalsy();
  });

  it('should not show header when no label and showValue is false', async () => {
    await element.updateComplete;

    const header = element.shadowRoot?.querySelector('.progress-header');
    expect(header).toBeFalsy();
  });

  // Variants
  it('should apply primary variant styles', async () => {
    element.variant = 'primary';
    await element.updateComplete;

    const progress = element.shadowRoot?.querySelector('.progress--primary');
    expect(progress).toBeTruthy();
  });

  it('should apply success variant styles', async () => {
    element.variant = 'success';
    await element.updateComplete;

    const progress = element.shadowRoot?.querySelector('.progress--success');
    expect(progress).toBeTruthy();
  });

  it('should apply warning variant styles', async () => {
    element.variant = 'warning';
    await element.updateComplete;

    const progress = element.shadowRoot?.querySelector('.progress--warning');
    expect(progress).toBeTruthy();
  });

  it('should apply error variant styles', async () => {
    element.variant = 'error';
    await element.updateComplete;

    const progress = element.shadowRoot?.querySelector('.progress--error');
    expect(progress).toBeTruthy();
  });

  it('should apply info variant styles', async () => {
    element.variant = 'info';
    await element.updateComplete;

    const progress = element.shadowRoot?.querySelector('.progress--info');
    expect(progress).toBeTruthy();
  });

  // Sizes
  it('should apply small size styles', async () => {
    element.size = 'sm';
    await element.updateComplete;

    const progress = element.shadowRoot?.querySelector('.progress--sm');
    expect(progress).toBeTruthy();
  });

  it('should apply medium size styles', async () => {
    element.size = 'md';
    await element.updateComplete;

    const progress = element.shadowRoot?.querySelector('.progress--md');
    expect(progress).toBeTruthy();
  });

  it('should apply large size styles', async () => {
    element.size = 'lg';
    await element.updateComplete;

    const progress = element.shadowRoot?.querySelector('.progress--lg');
    expect(progress).toBeTruthy();
  });

  // Indeterminate state
  it('should apply indeterminate class when indeterminate is true', async () => {
    element.indeterminate = true;
    await element.updateComplete;

    const progress = element.shadowRoot?.querySelector(
      '.progress--indeterminate'
    );
    expect(progress).toBeTruthy();
  });

  it('should set bar width to 100% when indeterminate', async () => {
    element.indeterminate = true;
    await element.updateComplete;

    const bar = element.shadowRoot?.querySelector(
      '.progress-bar'
    ) as HTMLElement;
    expect(bar?.style.width).toBe('100%');
  });

  // CSS Parts
  it('should expose track part for styling', async () => {
    await element.updateComplete;
    const track = element.shadowRoot?.querySelector('[part="track"]');
    expect(track).toBeTruthy();
  });

  it('should expose bar part for styling', async () => {
    await element.updateComplete;
    const bar = element.shadowRoot?.querySelector('[part="bar"]');
    expect(bar).toBeTruthy();
  });

  it('should expose header part when label or showValue is true', async () => {
    element.label = 'Test';
    await element.updateComplete;
    const header = element.shadowRoot?.querySelector('[part="header"]');
    expect(header).toBeTruthy();
  });

  // Accessibility
  it('should have role progressbar', async () => {
    await element.updateComplete;
    const progress = element.shadowRoot?.querySelector('[role="progressbar"]');
    expect(progress).toBeTruthy();
  });

  it('should have correct aria-valuemin', async () => {
    await element.updateComplete;
    const progress = element.shadowRoot?.querySelector('.progress');
    expect(progress?.getAttribute('aria-valuemin')).toBe('0');
  });

  it('should have correct aria-valuemax', async () => {
    element.max = 200;
    await element.updateComplete;
    const progress = element.shadowRoot?.querySelector('.progress');
    expect(progress?.getAttribute('aria-valuemax')).toBe('200');
  });

  it('should have correct aria-valuenow', async () => {
    element.value = 75;
    await element.updateComplete;
    const progress = element.shadowRoot?.querySelector('.progress');
    expect(progress?.getAttribute('aria-valuenow')).toBe('75');
  });

  it('should have aria-label', async () => {
    element.label = 'File upload';
    await element.updateComplete;
    const progress = element.shadowRoot?.querySelector('.progress');
    expect(progress?.getAttribute('aria-label')).toBe('File upload');
  });

  it('should use default aria-label when no label provided', async () => {
    await element.updateComplete;
    const progress = element.shadowRoot?.querySelector('.progress');
    expect(progress?.getAttribute('aria-label')).toBe('Progress');
  });

  it('should not set aria-valuenow when indeterminate', async () => {
    element.indeterminate = true;
    await element.updateComplete;
    const progress = element.shadowRoot?.querySelector('.progress');
    // When undefined, the attribute is not set (returns empty string)
    expect(progress?.getAttribute('aria-valuenow')).toBe('');
  });
});
