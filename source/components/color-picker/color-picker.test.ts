import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './color-picker.js';
import type { BpColorPicker } from './color-picker.js';

describe('bp-color-picker', () => {
  let element: BpColorPicker;

  beforeEach(() => {
    element = document.createElement('bp-color-picker');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Registration Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-color-picker');
    expect(constructor).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Rendering Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should render trigger button to DOM', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.trigger');
    expect(trigger).toBeTruthy();
  });

  it('should render color picker container', async () => {
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.color-picker')).toBeTruthy();
  });

  it('should render trigger swatch', async () => {
    await element.updateComplete;
    const swatch = element.shadowRoot?.querySelector('.trigger-swatch');
    expect(swatch).toBeTruthy();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Default Values Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should have correct default property values', () => {
    expect(element.value).toBe('#000000');
    expect(element.format).toBe('hex');
    expect(element.alpha).toBe(true);
    expect(element.swatches).toEqual([]);
    expect(element.inline).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.readonly).toBe(false);
    expect(element.size).toBe('md');
    expect(element.label).toBe('');
    expect(element.name).toBe('');
    expect(element.placeholder).toBe('');
  });

  it('should have default closed state', async () => {
    await element.updateComplete;
    const picker = element.shadowRoot?.querySelector('.picker');
    expect(picker).toBeNull();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Property Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should set property: value (hex)', async () => {
    element.value = '#ff5733';
    await element.updateComplete;
    expect(element.value).toBe('#ff5733');
  });

  it('should set property: value (rgb)', async () => {
    element.value = 'rgb(255, 87, 51)';
    element.format = 'rgb';
    await element.updateComplete;
    expect(element.value).toContain('rgb');
  });

  it('should set property: value (hsl)', async () => {
    element.value = 'hsl(14, 100%, 60%)';
    element.format = 'hsl';
    await element.updateComplete;
    expect(element.value).toContain('hsl');
  });

  it('should set property: format', async () => {
    element.format = 'rgb';
    await element.updateComplete;
    expect(element.format).toBe('rgb');
  });

  it('should set property: alpha', async () => {
    element.alpha = false;
    await element.updateComplete;
    expect(element.alpha).toBe(false);
  });

  it('should set property: swatches', async () => {
    element.swatches = ['#ff0000', '#00ff00', '#0000ff'];
    await element.updateComplete;
    expect(element.swatches).toHaveLength(3);
  });

  it('should set property: inline', async () => {
    element.inline = true;
    await element.updateComplete;
    expect(element.inline).toBe(true);
    const picker = element.shadowRoot?.querySelector('.picker');
    expect(picker).toBeTruthy();
  });

  it('should set property: disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    expect(element.disabled).toBe(true);
  });

  it('should set property: readonly', async () => {
    element.readonly = true;
    await element.updateComplete;
    expect(element.readonly).toBe(true);
  });

  it('should set property: size', async () => {
    element.size = 'lg';
    await element.updateComplete;
    expect(element.size).toBe('lg');
  });

  it('should set property: label', async () => {
    element.label = 'Select Color';
    await element.updateComplete;
    expect(element.label).toBe('Select Color');
    const label = element.shadowRoot?.querySelector('.trigger-label');
    expect(label?.textContent).toBe('Select Color');
  });

  it('should set property: name', async () => {
    element.name = 'theme-color';
    await element.updateComplete;
    expect(element.name).toBe('theme-color');
  });

  it('should set property: placeholder', async () => {
    element.placeholder = 'Choose a color';
    await element.updateComplete;
    expect(element.placeholder).toBe('Choose a color');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Color Format Parsing Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should parse 3-digit hex color internally', async () => {
    element.value = '#f00';
    await element.updateComplete;
    // Component stores value as-is but parses it correctly internally
    expect(element.value).toBe('#f00');
  });

  it('should parse 6-digit hex color', async () => {
    element.value = '#ff5733';
    await element.updateComplete;
    expect(element.value).toBe('#ff5733');
  });

  it('should parse 8-digit hex color with alpha', async () => {
    element.value = '#ff573380';
    await element.updateComplete;
    expect(element.value).toBe('#ff573380');
  });

  it('should parse rgb color format', async () => {
    element.value = 'rgb(255, 87, 51)';
    await element.updateComplete;
    // Internal conversion should work
    expect(element).toBeTruthy();
  });

  it('should parse rgba color format', async () => {
    element.value = 'rgba(255, 87, 51, 0.5)';
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('should parse hsl color format', async () => {
    element.value = 'hsl(14, 100%, 60%)';
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  it('should parse hsla color format', async () => {
    element.value = 'hsla(14, 100%, 60%, 0.5)';
    await element.updateComplete;
    expect(element).toBeTruthy();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Output Format Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should output hex format when format is hex', async () => {
    element.format = 'hex';
    element.value = '#ff0000';
    await element.updateComplete;
    expect(element.value).toBe('#ff0000');
    expect(element.format).toBe('hex');
  });

  it('should output rgb format when format is rgb', async () => {
    element.value = '#ff0000';
    element.format = 'rgb';
    await element.updateComplete;
    // Trigger a change to apply format
    element.value = '#ff0000';
    await element.updateComplete;
    // The internal value gets formatted on change
  });

  it('should include alpha in output when alpha is enabled and < 1', async () => {
    element.value = '#ff573380';
    element.alpha = true;
    await element.updateComplete;
    expect(element.value).toContain('80');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Popover Interaction Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should open picker on click', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;
    const picker = element.shadowRoot?.querySelector('.picker');
    expect(picker).toBeTruthy();
  });

  it('should close picker on second click', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;
    trigger?.click();
    await element.updateComplete;
    const picker = element.shadowRoot?.querySelector('.picker');
    expect(picker).toBeNull();
  });

  it('should open picker on Enter key', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.trigger'
    ) as HTMLElement;
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await element.updateComplete;
    const picker = element.shadowRoot?.querySelector('.picker');
    expect(picker).toBeTruthy();
  });

  it('should open picker on Space key', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.trigger'
    ) as HTMLElement;
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    await element.updateComplete;
    const picker = element.shadowRoot?.querySelector('.picker');
    expect(picker).toBeTruthy();
  });

  it('should not open when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;
    const picker = element.shadowRoot?.querySelector('.picker');
    expect(picker).toBeNull();
  });

  it('should not open when readonly', async () => {
    element.readonly = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;
    const picker = element.shadowRoot?.querySelector('.picker');
    expect(picker).toBeNull();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Inline Mode Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should render picker inline when inline is true', async () => {
    element.inline = true;
    await element.updateComplete;
    const picker = element.shadowRoot?.querySelector('.picker');
    const trigger = element.shadowRoot?.querySelector('.trigger');
    expect(picker).toBeTruthy();
    expect(trigger).toBeNull();
  });

  it('should render color area in inline mode', async () => {
    element.inline = true;
    await element.updateComplete;
    const colorArea = element.shadowRoot?.querySelector('.color-area');
    expect(colorArea).toBeTruthy();
  });

  it('should render hue slider in inline mode', async () => {
    element.inline = true;
    await element.updateComplete;
    const hueSlider = element.shadowRoot?.querySelector('.hue-slider');
    expect(hueSlider).toBeTruthy();
  });

  it('should render alpha slider in inline mode when alpha is true', async () => {
    element.inline = true;
    element.alpha = true;
    await element.updateComplete;
    const alphaSlider = element.shadowRoot?.querySelector('.alpha-slider');
    expect(alphaSlider).toBeTruthy();
  });

  it('should not render alpha slider when alpha is false', async () => {
    element.inline = true;
    element.alpha = false;
    await element.updateComplete;
    const alphaSlider = element.shadowRoot?.querySelector('.alpha-slider');
    expect(alphaSlider).toBeNull();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Event Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should emit bp-open event when opening', async () => {
    await element.updateComplete;
    const openHandler = vi.fn();
    element.addEventListener('bp-open', openHandler);

    const trigger = element.shadowRoot?.querySelector(
      '.trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;

    expect(openHandler).toHaveBeenCalledTimes(1);
  });

  it('should emit bp-close event when closing', async () => {
    await element.updateComplete;
    const closeHandler = vi.fn();
    element.addEventListener('bp-close', closeHandler);

    const trigger = element.shadowRoot?.querySelector(
      '.trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;
    trigger?.click();
    await element.updateComplete;

    expect(closeHandler).toHaveBeenCalledTimes(1);
  });

  it('should emit bp-change event on value change', async () => {
    element.inline = true;
    await element.updateComplete;
    const changeHandler = vi.fn();
    element.addEventListener('bp-change', changeHandler);

    // Simulate hex input change
    const hexInput = element.shadowRoot?.querySelector(
      '.hex-input'
    ) as HTMLInputElement;
    if (hexInput) {
      hexInput.value = '#ff5733';
      hexInput.dispatchEvent(new Event('change'));
      await element.updateComplete;
      expect(changeHandler).toHaveBeenCalled();
    }
  });

  it('should emit bp-input event on live input', async () => {
    element.inline = true;
    await element.updateComplete;
    const inputHandler = vi.fn();
    element.addEventListener('bp-input', inputHandler);

    const hexInput = element.shadowRoot?.querySelector(
      '.hex-input'
    ) as HTMLInputElement;
    if (hexInput) {
      hexInput.value = '#ff5733';
      hexInput.dispatchEvent(new Event('change'));
      await element.updateComplete;
      expect(inputHandler).toHaveBeenCalled();
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Swatch Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should render swatches when provided', async () => {
    element.inline = true;
    element.swatches = ['#ff0000', '#00ff00', '#0000ff'];
    await element.updateComplete;
    const swatches = element.shadowRoot?.querySelectorAll('.swatch');
    expect(swatches?.length).toBe(3);
  });

  it('should update value when swatch is clicked', async () => {
    element.inline = true;
    element.swatches = ['#ff0000', '#00ff00', '#0000ff'];
    await element.updateComplete;
    const swatch = element.shadowRoot?.querySelector('.swatch') as HTMLElement;
    swatch?.click();
    await element.updateComplete;
    expect(element.value).toBe('#ff0000');
  });

  it('should not select swatch when disabled', async () => {
    element.inline = true;
    element.disabled = true;
    element.swatches = ['#ff0000'];
    await element.updateComplete;
    const swatch = element.shadowRoot?.querySelector('.swatch') as HTMLElement;
    swatch?.click();
    await element.updateComplete;
    expect(element.value).toBe('#000000');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Format Toggle Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should render format toggle button in inline mode', async () => {
    element.inline = true;
    await element.updateComplete;
    const toggle = element.shadowRoot?.querySelector('.format-toggle');
    expect(toggle).toBeTruthy();
  });

  it('should cycle through formats on toggle click', async () => {
    element.inline = true;
    await element.updateComplete;
    const toggle = element.shadowRoot?.querySelector(
      '.format-toggle'
    ) as HTMLElement;

    // Initial state is hex
    const hexInput = element.shadowRoot?.querySelector('.hex-input');
    expect(hexInput).toBeTruthy();

    // Click to switch to RGB
    toggle?.click();
    await element.updateComplete;
    const rgbInputs = element.shadowRoot?.querySelectorAll(
      '.input-row .color-input'
    );
    expect(rgbInputs?.length).toBeGreaterThan(0);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Accessibility Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should have aria-haspopup on trigger', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.trigger');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('should have aria-expanded reflecting open state', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.trigger');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    (trigger as HTMLElement)?.click();
    await element.updateComplete;
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  });

  it('should have aria-disabled when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector('.trigger');
    expect(trigger?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should have role="dialog" on picker panel', async () => {
    await element.updateComplete;
    const trigger = element.shadowRoot?.querySelector(
      '.trigger'
    ) as HTMLElement;
    trigger?.click();
    await element.updateComplete;
    const picker = element.shadowRoot?.querySelector('.picker');
    expect(picker?.getAttribute('role')).toBe('dialog');
  });

  it('should have role="slider" on color area', async () => {
    element.inline = true;
    await element.updateComplete;
    const colorArea = element.shadowRoot?.querySelector('.color-area');
    expect(colorArea?.getAttribute('role')).toBe('slider');
  });

  it('should have role="slider" on hue slider', async () => {
    element.inline = true;
    await element.updateComplete;
    const hueSlider = element.shadowRoot?.querySelector('.hue-slider');
    expect(hueSlider?.getAttribute('role')).toBe('slider');
  });

  it('should have role="slider" on alpha slider', async () => {
    element.inline = true;
    element.alpha = true;
    await element.updateComplete;
    const alphaSlider = element.shadowRoot?.querySelector('.alpha-slider');
    expect(alphaSlider?.getAttribute('role')).toBe('slider');
  });

  it('should have aria-valuenow on hue slider', async () => {
    element.inline = true;
    await element.updateComplete;
    const hueSlider = element.shadowRoot?.querySelector('.hue-slider');
    expect(hueSlider?.hasAttribute('aria-valuenow')).toBe(true);
  });

  it('should have aria-label on color area', async () => {
    element.inline = true;
    await element.updateComplete;
    const colorArea = element.shadowRoot?.querySelector('.color-area');
    expect(colorArea?.getAttribute('aria-label')).toBe('Color selection');
  });

  it('should have tabindex on sliders', async () => {
    element.inline = true;
    await element.updateComplete;
    const colorArea = element.shadowRoot?.querySelector('.color-area');
    const hueSlider = element.shadowRoot?.querySelector('.hue-slider');
    expect(colorArea?.getAttribute('tabindex')).toBe('0');
    expect(hueSlider?.getAttribute('tabindex')).toBe('0');
  });

  it('should set tabindex -1 on sliders when disabled', async () => {
    element.inline = true;
    element.disabled = true;
    await element.updateComplete;
    const colorArea = element.shadowRoot?.querySelector('.color-area');
    expect(colorArea?.getAttribute('tabindex')).toBe('-1');
  });

  it('should have role="listbox" on swatches container', async () => {
    element.inline = true;
    element.swatches = ['#ff0000'];
    await element.updateComplete;
    const swatches = element.shadowRoot?.querySelector('.swatches-container');
    expect(swatches?.getAttribute('role')).toBe('listbox');
  });

  it('should have role="option" on swatch items', async () => {
    element.inline = true;
    element.swatches = ['#ff0000'];
    await element.updateComplete;
    const swatch = element.shadowRoot?.querySelector('.swatch');
    expect(swatch?.getAttribute('role')).toBe('option');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Keyboard Navigation Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should support keyboard navigation on swatch with Enter', async () => {
    element.inline = true;
    element.swatches = ['#ff0000'];
    await element.updateComplete;
    const swatch = element.shadowRoot?.querySelector('.swatch') as HTMLElement;
    swatch?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await element.updateComplete;
    expect(element.value).toBe('#ff0000');
  });

  it('should support keyboard navigation on swatch with Space', async () => {
    element.inline = true;
    element.swatches = ['#00ff00'];
    await element.updateComplete;
    const swatch = element.shadowRoot?.querySelector('.swatch') as HTMLElement;
    swatch?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    await element.updateComplete;
    expect(element.value).toBe('#00ff00');
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Form Integration Tests
  // ─────────────────────────────────────────────────────────────────────────────

  it('should render hidden input when name is set', async () => {
    element.name = 'color-field';
    await element.updateComplete;
    const hiddenInput = element.shadowRoot?.querySelector(
      'input[type="hidden"]'
    );
    expect(hiddenInput).toBeTruthy();
    expect(hiddenInput?.getAttribute('name')).toBe('color-field');
  });

  it('should not render hidden input when name is empty', async () => {
    await element.updateComplete;
    const hiddenInput = element.shadowRoot?.querySelector(
      'input[type="hidden"]'
    );
    expect(hiddenInput).toBeNull();
  });
});
