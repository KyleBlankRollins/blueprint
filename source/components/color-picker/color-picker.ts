import { LitElement, html, nothing, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { colorPickerStyles } from './color-picker.style.js';
import { booleanConverter } from '../../utilities/boolean-converter.js';
import {
  type ColorFormat,
  type HSVColor,
  parseColor,
  hsvToRgb,
  hsvToHsl,
  formatColorOutput,
} from './color-picker.utils.js';

/* eslint-disable no-undef */
// Browser globals: PointerEvent and EyeDropper are available in modern browsers

/**
 * Color picker size
 */
export type ColorPickerSize = 'sm' | 'md' | 'lg';

/**
 * A color picker component that provides a consistent, accessible, and feature-rich
 * color selection experience. Supports HEX, RGB, and HSL formats with optional alpha channel.
 *
 * @element bp-color-picker
 *
 * @slot trigger - Custom trigger button content
 * @slot swatches - Custom swatch elements
 * @slot footer - Additional content below picker
 *
 * @csspart trigger - The popover trigger button
 * @csspart popover - The popover container
 * @csspart color-area - The 2D saturation/value gradient
 * @csspart hue-slider - The hue selection slider
 * @csspart alpha-slider - The alpha selection slider
 * @csspart preview - The color preview swatch
 * @csspart input - Text input fields
 * @csspart swatches - Swatches container
 * @csspart swatch - Individual swatch items
 *
 * @fires bp-change - Fired when value changes (on blur/confirm)
 * @fires bp-input - Fired on every input (live updates)
 * @fires bp-open - Popover opened
 * @fires bp-close - Popover closed
 */
@customElement('bp-color-picker')
export class BpColorPicker extends LitElement {
  static styles = [colorPickerStyles];

  /** Current color value */
  @property({ type: String }) declare value: string;

  /** Output format for value */
  @property({ type: String }) declare format: ColorFormat;

  /** Enable alpha channel */
  @property({ converter: booleanConverter, reflect: true })
  declare alpha: boolean;

  /** Predefined swatch colors */
  @property({ type: Array }) declare swatches: string[];

  /** Render inline instead of popover */
  @property({ type: Boolean }) declare inline: boolean;

  /** Disable all interactions */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /** Show value but prevent editing */
  @property({ type: Boolean, reflect: true }) declare readonly: boolean;

  /** Component size */
  @property({ type: String, reflect: true }) declare size: ColorPickerSize;

  /** Accessible label */
  @property({ type: String }) declare label: string;

  /** Form field name */
  @property({ type: String }) declare name: string;

  /** Placeholder for trigger */
  @property({ type: String }) declare placeholder: string;

  /** Whether the popover is open */
  @state() private _open = false;

  /** Internal HSV color state */
  @state() private _hsv: HSVColor = { h: 0, s: 0, v: 0, a: 1 };

  /** Original color when popover opened */
  @state() private _originalValue = '';

  /** Whether eyedropper is supported */
  @state() private _eyedropperSupported = false;

  /** Current input mode for format toggle */
  @state() private _inputMode: ColorFormat = 'hex';

  /** HEX input value for controlled input */
  @state() private _hexInputValue = '';

  /** Whether eyedropper is currently active */
  @state() private _isPickingColor = false;

  @query('.color-area') private _colorArea!: HTMLElement;
  @query('.hue-slider') private _hueSlider!: HTMLElement;
  @query('.alpha-slider') private _alphaSlider!: HTMLElement;

  private _isDraggingArea = false;
  private _isDraggingHue = false;
  private _isDraggingAlpha = false;

  constructor() {
    super();
    this.value = '#000000';
    this.format = 'hex';
    this.alpha = true;
    this.swatches = [];
    this.inline = false;
    this.disabled = false;
    this.readonly = false;
    this.size = 'md';
    this.label = '';
    this.name = '';
    this.placeholder = '';
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Check for EyeDropper API support
    this._eyedropperSupported = 'EyeDropper' in window;
    this._parseValue(this.value);
    this._hexInputValue = this._formatOutput('hex');
    this._inputMode = this.format;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._removeGlobalListeners();
  }

  protected willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('value') && !this._isDragging()) {
      this._parseValue(this.value);
      this._hexInputValue = this._formatOutput('hex');
    }
    if (changedProperties.has('format')) {
      this._inputMode = this.format;
    }
  }

  private _isDragging(): boolean {
    return this._isDraggingArea || this._isDraggingHue || this._isDraggingAlpha;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Color Parsing & Conversion
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Parses a color value string and updates internal HSV state
   * @param value Color string in hex, rgb, or hsl format
   */
  private _parseValue(value: string): void {
    const parsed = parseColor(value);
    if (parsed) {
      this._hsv = parsed;
    }
  }

  /**
   * Formats the current HSV color to the specified output format
   * @param format Output format (hex, rgb, or hsl), defaults to this.format
   * @returns Formatted color string
   */
  private _formatOutput(format: ColorFormat = this.format): string {
    return formatColorOutput(this._hsv, format, this.alpha);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Event Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handles click events on the trigger button
   * Toggles the picker popover open/closed state
   */
  private _handleTriggerClick(): void {
    if (this.disabled || this.readonly) return;
    this._toggleOpen();
  }

  /**
   * Handles keyboard events on the trigger button
   * Opens picker on Enter or Space key
   * @param event Keyboard event
   */
  private _handleTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.readonly) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._toggleOpen();
    }
  }

  /**
   * Toggles the picker popover between open and closed states
   * Saves original value when opening and emits bp-open/bp-close events
   */
  private _toggleOpen(): void {
    if (this._open) {
      this._close();
    } else {
      this._open = true;
      this._originalValue = this.value;
      this.dispatchEvent(
        new CustomEvent('bp-open', { bubbles: true, composed: true })
      );
      this._addGlobalListeners();
    }
  }

  /**
   * Closes the picker popover
   * Removes global event listeners and emits bp-close event
   */
  private _close(): void {
    this._open = false;
    this._removeGlobalListeners();
    this.dispatchEvent(
      new CustomEvent('bp-close', { bubbles: true, composed: true })
    );
  }

  private _handleOutsideClick = (event: MouseEvent): void => {
    const path = event.composedPath();
    if (!path.includes(this)) {
      this._close();
    }
  };

  private _handleEscapeKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      // Restore original value
      this.value = this._originalValue;
      this._parseValue(this._originalValue);
      this._hexInputValue = this._formatOutput('hex');
      this._close();
    }
  };

  /**
   * Adds global document event listeners for outside clicks and escape key
   * Used when picker popover is open
   */
  private _addGlobalListeners(): void {
    document.addEventListener('click', this._handleOutsideClick);
    document.addEventListener('keydown', this._handleEscapeKey);
  }

  /**
   * Removes global document event listeners
   * Called when picker popover is closed
   */
  private _removeGlobalListeners(): void {
    document.removeEventListener('click', this._handleOutsideClick);
    document.removeEventListener('keydown', this._handleEscapeKey);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Color Area Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handles pointer down events on the color area
   * Starts saturation/value drag interaction
   * @param event Pointer event
   */
  private _handleColorAreaPointerDown(event: PointerEvent): void {
    if (this.disabled || this.readonly) return;
    event.preventDefault();
    this._isDraggingArea = true;
    this._colorArea.setPointerCapture(event.pointerId);
    this._updateColorFromPointer(event);
  }

  /**
   * Handles pointer move events on the color area during drag
   * Updates color based on pointer position
   * @param event Pointer event
   */
  private _handleColorAreaPointerMove(event: PointerEvent): void {
    if (!this._isDraggingArea) return;
    this._updateColorFromPointer(event);
  }

  /**
   * Handles pointer up events on the color area
   * Ends drag interaction and emits change event
   * @param event Pointer event
   */
  private _handleColorAreaPointerUp(event: PointerEvent): void {
    if (!this._isDraggingArea) return;
    this._isDraggingArea = false;
    this._colorArea.releasePointerCapture(event.pointerId);
    this._emitChange();
  }

  /**
   * Updates color saturation and value based on pointer position in color area
   * @param event Pointer event with clientX/clientY coordinates
   */
  private _updateColorFromPointer(event: PointerEvent): void {
    const rect = this._colorArea.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

    this._hsv = {
      ...this._hsv,
      s: (x / rect.width) * 100,
      v: 100 - (y / rect.height) * 100,
    };

    this._hexInputValue = this._formatOutput('hex');
    this._emitInput();
  }

  /**
   * Handles keyboard navigation on the color area
   * Arrow keys adjust saturation/value, Shift increases step size
   * @param event Keyboard event
   */
  private _handleColorAreaKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.readonly) return;

    const step = event.shiftKey ? 10 : 1;
    let handled = false;

    switch (event.key) {
      case 'ArrowRight':
        this._hsv = { ...this._hsv, s: Math.min(100, this._hsv.s + step) };
        handled = true;
        break;
      case 'ArrowLeft':
        this._hsv = { ...this._hsv, s: Math.max(0, this._hsv.s - step) };
        handled = true;
        break;
      case 'ArrowUp':
        this._hsv = { ...this._hsv, v: Math.min(100, this._hsv.v + step) };
        handled = true;
        break;
      case 'ArrowDown':
        this._hsv = { ...this._hsv, v: Math.max(0, this._hsv.v - step) };
        handled = true;
        break;
      case 'Home':
        this._hsv = { ...this._hsv, s: 0 };
        handled = true;
        break;
      case 'End':
        this._hsv = { ...this._hsv, s: 100 };
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      this._hexInputValue = this._formatOutput('hex');
      this._emitInput();
      this._emitChange();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Hue Slider Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handles pointer down events on the hue slider
   * Starts hue drag interaction
   * @param event Pointer event
   */
  private _handleHuePointerDown(event: PointerEvent): void {
    if (this.disabled || this.readonly) return;
    event.preventDefault();
    this._isDraggingHue = true;
    this._hueSlider.setPointerCapture(event.pointerId);
    this._updateHueFromPointer(event);
  }

  /**
   * Handles pointer move events on the hue slider during drag
   * Updates hue based on pointer position
   * @param event Pointer event
   */
  private _handleHuePointerMove(event: PointerEvent): void {
    if (!this._isDraggingHue) return;
    this._updateHueFromPointer(event);
  }

  /**
   * Handles pointer up events on the hue slider
   * Ends drag interaction and emits change event
   * @param event Pointer event
   */
  private _handleHuePointerUp(event: PointerEvent): void {
    if (!this._isDraggingHue) return;
    this._isDraggingHue = false;
    this._hueSlider.releasePointerCapture(event.pointerId);
    this._emitChange();
  }

  /**
   * Updates hue based on pointer position in hue slider
   * @param event Pointer event with clientY coordinate
   */
  private _updateHueFromPointer(event: PointerEvent): void {
    const rect = this._hueSlider.getBoundingClientRect();
    const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
    const hue = (y / rect.height) * 360;

    this._hsv = { ...this._hsv, h: hue };
    this._hexInputValue = this._formatOutput('hex');
    this._emitInput();
  }

  /**
   * Handles keyboard navigation on the hue slider
   * Arrow keys adjust hue, Shift increases step size
   * @param event Keyboard event
   */
  private _handleHueKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.readonly) return;

    const step = event.shiftKey ? 10 : 1;
    let handled = false;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        this._hsv = { ...this._hsv, h: (this._hsv.h + step) % 360 };
        handled = true;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        this._hsv = { ...this._hsv, h: (this._hsv.h - step + 360) % 360 };
        handled = true;
        break;
      case 'Home':
        this._hsv = { ...this._hsv, h: 0 };
        handled = true;
        break;
      case 'End':
        this._hsv = { ...this._hsv, h: 359 };
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      this._hexInputValue = this._formatOutput('hex');
      this._emitInput();
      this._emitChange();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Alpha Slider Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handles pointer down events on the alpha slider
   * Starts alpha drag interaction
   * @param event Pointer event
   */
  private _handleAlphaPointerDown(event: PointerEvent): void {
    if (this.disabled || this.readonly) return;
    event.preventDefault();
    this._isDraggingAlpha = true;
    this._alphaSlider.setPointerCapture(event.pointerId);
    this._updateAlphaFromPointer(event);
  }

  /**
   * Handles pointer move events on the alpha slider during drag
   * Updates alpha based on pointer position
   * @param event Pointer event
   */
  private _handleAlphaPointerMove(event: PointerEvent): void {
    if (!this._isDraggingAlpha) return;
    this._updateAlphaFromPointer(event);
  }

  /**
   * Handles pointer up events on the alpha slider
   * Ends drag interaction and emits change event
   * @param event Pointer event
   */
  private _handleAlphaPointerUp(event: PointerEvent): void {
    if (!this._isDraggingAlpha) return;
    this._isDraggingAlpha = false;
    this._alphaSlider.releasePointerCapture(event.pointerId);
    this._emitChange();
  }

  /**
   * Updates alpha based on pointer position in alpha slider
   * @param event Pointer event with clientX coordinate
   */
  private _updateAlphaFromPointer(event: PointerEvent): void {
    const rect = this._alphaSlider.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const alpha = x / rect.width;

    this._hsv = { ...this._hsv, a: alpha };
    this._hexInputValue = this._formatOutput('hex');
    this._emitInput();
  }

  /**
   * Handles keyboard navigation on the alpha slider
   * Arrow keys adjust alpha, Shift increases step size
   * @param event Keyboard event
   */
  private _handleAlphaKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.readonly) return;

    const step = event.shiftKey ? 0.1 : 0.01;
    let handled = false;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        this._hsv = { ...this._hsv, a: Math.min(1, this._hsv.a + step) };
        handled = true;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        this._hsv = { ...this._hsv, a: Math.max(0, this._hsv.a - step) };
        handled = true;
        break;
      case 'Home':
        this._hsv = { ...this._hsv, a: 0 };
        handled = true;
        break;
      case 'End':
        this._hsv = { ...this._hsv, a: 1 };
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      this._hexInputValue = this._formatOutput('hex');
      this._emitInput();
      this._emitChange();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Input Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handles input events on the hex input field
   * Updates controlled input value
   * @param event Input event
   */
  private _handleHexInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this._hexInputValue = input.value;
  }

  /**
   * Handles change events on the hex input field
   * Parses and applies hex color value, adds # prefix if missing
   * @param event Change event
   */
  private _handleHexChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.trim();

    // Add # if missing
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }

    const parsed = parseColor(value);
    if (parsed) {
      this._hsv = parsed;
      this._hexInputValue = this._formatOutput('hex');
      this._emitInput();
      this._emitChange();
    } else {
      // Reset to current value if invalid
      this._hexInputValue = this._formatOutput('hex');
    }
  }

  /**
   * Handles input events on RGB channel inputs
   * Updates color based on red, green, or blue channel value
   * @param channel RGB channel to update ('r', 'g', or 'b')
   * @param event Input event
   */
  private _handleRgbInput(channel: 'r' | 'g' | 'b', event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Math.max(0, Math.min(255, parseInt(input.value, 10) || 0));

    const rgb = hsvToRgb(this._hsv);
    rgb[channel] = value;
    this._hsv = parseColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`)!;
    this._hexInputValue = this._formatOutput('hex');
    this._emitInput();
  }

  /**
   * Handles change events on RGB inputs
   * Emits bp-change event
   */
  private _handleRgbChange(): void {
    this._emitChange();
  }

  /**
   * Handles input events on HSL channel inputs
   * Updates color based on hue, saturation, or lightness value
   * @param channel HSL channel to update ('h', 's', or 'l')
   * @param event Input event
   */
  private _handleHslInput(channel: 'h' | 's' | 'l', event: Event): void {
    const input = event.target as HTMLInputElement;
    const hsl = hsvToHsl(this._hsv);

    if (channel === 'h') {
      hsl.h = Math.max(0, Math.min(360, parseInt(input.value, 10) || 0));
    } else {
      hsl[channel] = Math.max(0, Math.min(100, parseInt(input.value, 10) || 0));
    }

    this._hsv = parseColor(`hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})`)!;
    this._hexInputValue = this._formatOutput('hex');
    this._emitInput();
  }

  /**
   * Handles change events on HSL inputs
   * Emits bp-change event
   */
  private _handleHslChange(): void {
    this._emitChange();
  }

  /**
   * Handles input events on the alpha percentage input
   * Updates alpha channel (0-100%)
   * @param event Input event
   */
  private _handleAlphaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Math.max(0, Math.min(100, parseInt(input.value, 10) || 0));
    this._hsv = { ...this._hsv, a: value / 100 };
    this._hexInputValue = this._formatOutput('hex');
    this._emitInput();
  }

  /**
   * Handles change events on alpha input
   * Emits bp-change event
   */
  private _handleAlphaInputChange(): void {
    this._emitChange();
  }

  /**
   * Handles format toggle button click
   * Cycles through hex → rgb → hsl input modes
   */
  private _handleFormatToggle(): void {
    const formats: ColorFormat[] = ['hex', 'rgb', 'hsl'];
    const currentIndex = formats.indexOf(this._inputMode);
    this._inputMode = formats[(currentIndex + 1) % formats.length];
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Swatch Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handles click events on predefined color swatches
   * Updates color to the swatch value
   * @param color Color string to apply
   */
  private _handleSwatchClick(color: string): void {
    if (this.disabled || this.readonly) return;

    const parsed = parseColor(color);
    if (parsed) {
      this._hsv = parsed;
      this._hexInputValue = this._formatOutput('hex');
      this._emitInput();
      this._emitChange();
    }
  }

  /**
   * Handles keyboard events on swatch elements
   * Activates swatch on Enter or Space key
   * @param color Color string to apply
   * @param event Keyboard event
   */
  private _handleSwatchKeydown(color: string, event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._handleSwatchClick(color);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Eyedropper
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Handles eyedropper button click
   * Opens native EyeDropper API to pick color from screen
   * Only available in browsers that support the EyeDropper API
   */
  private async _handleEyedropper(): Promise<void> {
    if (!this._eyedropperSupported || this.disabled || this.readonly) return;

    this._isPickingColor = true;
    try {
      // @ts-expect-error EyeDropper API is not in TypeScript types yet
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();

      if (result.sRGBHex) {
        const parsed = parseColor(result.sRGBHex);
        if (parsed) {
          this._hsv = parsed;
          this._hexInputValue = this._formatOutput('hex');
          this._emitInput();
          this._emitChange();
        }
      }
    } catch {
      // User cancelled or error occurred
    } finally {
      this._isPickingColor = false;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Event Emission
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Emits bp-input event with current formatted color value
   * Fired during live color updates (dragging, typing)
   */
  private _emitInput(): void {
    const value = this._formatOutput();
    this.dispatchEvent(
      new CustomEvent('bp-input', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Emits bp-change event and updates the value property
   * Fired on blur/confirm actions (drag end, input blur)
   */
  private _emitChange(): void {
    const value = this._formatOutput();
    this.value = value;
    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Renders the 2D color area for saturation and value selection
   * @returns TemplateResult for color area with draggable handle
   */
  private _renderColorArea() {
    const hueColor = `hsl(${this._hsv.h}, 100%, 50%)`;
    const handleX = this._hsv.s;
    const handleY = 100 - this._hsv.v;

    return html`
      <div
        class="color-area"
        part="color-area"
        role="slider"
        tabindex="${this.disabled ? -1 : 0}"
        aria-label="Color selection"
        aria-valuetext="Saturation ${Math.round(
          this._hsv.s
        )}%, Brightness ${Math.round(this._hsv.v)}%"
        style="--hue-color: ${hueColor}"
        @pointerdown=${this._handleColorAreaPointerDown}
        @pointermove=${this._handleColorAreaPointerMove}
        @pointerup=${this._handleColorAreaPointerUp}
        @keydown=${this._handleColorAreaKeydown}
      >
        <div
          class="color-area-handle"
          style="left: ${handleX}%; top: ${handleY}%"
        ></div>
      </div>
    `;
  }

  /**
   * Renders the vertical hue slider (0-360 degrees)
   * @returns TemplateResult for hue slider with draggable handle
   */
  private _renderHueSlider() {
    const handleY = (this._hsv.h / 360) * 100;

    return html`
      <div
        class="hue-slider"
        part="hue-slider"
        role="slider"
        tabindex="${this.disabled ? -1 : 0}"
        aria-label="Hue"
        aria-valuenow="${Math.round(this._hsv.h)}"
        aria-valuemin="0"
        aria-valuemax="360"
        @pointerdown=${this._handleHuePointerDown}
        @pointermove=${this._handleHuePointerMove}
        @pointerup=${this._handleHuePointerUp}
        @keydown=${this._handleHueKeydown}
      >
        <div class="hue-slider-handle" style="top: ${handleY}%"></div>
      </div>
    `;
  }

  /**
   * Renders the horizontal alpha slider (0-100%)
   * Only shown when alpha property is true
   * @returns TemplateResult for alpha slider or nothing
   */
  private _renderAlphaSlider() {
    if (!this.alpha) return nothing;

    const rgb = hsvToRgb(this._hsv);
    const colorStart = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`;
    const colorEnd = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
    const handleX = this._hsv.a * 100;

    return html`
      <div
        class="alpha-slider"
        part="alpha-slider"
        role="slider"
        tabindex="${this.disabled ? -1 : 0}"
        aria-label="Opacity"
        aria-valuenow="${Math.round(this._hsv.a * 100)}"
        aria-valuemin="0"
        aria-valuemax="100"
        style="--alpha-gradient: linear-gradient(to right, ${colorStart}, ${colorEnd})"
        @pointerdown=${this._handleAlphaPointerDown}
        @pointermove=${this._handleAlphaPointerMove}
        @pointerup=${this._handleAlphaPointerUp}
        @keydown=${this._handleAlphaKeydown}
      >
        <div class="alpha-slider-handle" style="left: ${handleX}%"></div>
      </div>
    `;
  }

  /**
   * Renders the color preview showing original and current colors
   * Displays side-by-side comparison with checkerboard background for transparency
   * @returns TemplateResult for preview swatches
   */
  private _renderPreview() {
    const rgb = hsvToRgb(this._hsv);
    const currentColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this._hsv.a})`;
    const originalHsv = parseColor(this._originalValue);
    const originalColor = originalHsv
      ? (() => {
          const origRgb = hsvToRgb(originalHsv);
          return `rgba(${origRgb.r}, ${origRgb.g}, ${origRgb.b}, ${originalHsv.a})`;
        })()
      : currentColor;

    return html`
      <div class="preview" part="preview">
        <div
          class="preview-swatch preview-original"
          style="background: ${originalColor}"
          title="Original color"
          aria-label="Original color"
        ></div>
        <div
          class="preview-swatch preview-current"
          style="background: ${currentColor}"
          title="Current color"
          aria-label="Current color"
        ></div>
      </div>
    `;
  }

  /**
   * Renders the hex color input field
   * @returns TemplateResult for hex input group
   */
  private _renderHexInput() {
    return html`
      <div class="input-group">
        <input
          type="text"
          class="color-input hex-input"
          part="input"
          .value=${this._hexInputValue}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @input=${this._handleHexInput}
          @change=${this._handleHexChange}
          aria-label="Hex color value"
        />
        <span class="input-label">HEX</span>
      </div>
    `;
  }

  /**
   * Renders RGB color input fields (R, G, B, and optionally A)
   * @returns TemplateResult for RGB input row
   */
  private _renderRgbInputs() {
    const rgb = hsvToRgb(this._hsv);

    return html`
      <div class="input-row">
        <div class="input-group">
          <input
            type="number"
            class="color-input"
            part="input"
            min="0"
            max="255"
            .value=${String(rgb.r)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            @input=${(e: Event) => this._handleRgbInput('r', e)}
            @change=${this._handleRgbChange}
            aria-label="Red"
          />
          <span class="input-label">R</span>
        </div>
        <div class="input-group">
          <input
            type="number"
            class="color-input"
            part="input"
            min="0"
            max="255"
            .value=${String(rgb.g)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            @input=${(e: Event) => this._handleRgbInput('g', e)}
            @change=${this._handleRgbChange}
            aria-label="Green"
          />
          <span class="input-label">G</span>
        </div>
        <div class="input-group">
          <input
            type="number"
            class="color-input"
            part="input"
            min="0"
            max="255"
            .value=${String(rgb.b)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            @input=${(e: Event) => this._handleRgbInput('b', e)}
            @change=${this._handleRgbChange}
            aria-label="Blue"
          />
          <span class="input-label">B</span>
        </div>
        ${this.alpha
          ? html`
              <div class="input-group">
                <input
                  type="number"
                  class="color-input"
                  part="input"
                  min="0"
                  max="100"
                  .value=${String(Math.round(this._hsv.a * 100))}
                  ?disabled=${this.disabled}
                  ?readonly=${this.readonly}
                  @input=${this._handleAlphaInput}
                  @change=${this._handleAlphaInputChange}
                  aria-label="Alpha"
                />
                <span class="input-label">A</span>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  /**
   * Renders HSL color input fields (H, S, L, and optionally A)
   * @returns TemplateResult for HSL input row
   */
  private _renderHslInputs() {
    const hsl = hsvToHsl(this._hsv);

    return html`
      <div class="input-row">
        <div class="input-group">
          <input
            type="number"
            class="color-input"
            part="input"
            min="0"
            max="360"
            .value=${String(Math.round(hsl.h))}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            @input=${(e: Event) => this._handleHslInput('h', e)}
            @change=${this._handleHslChange}
            aria-label="Hue"
          />
          <span class="input-label">H</span>
        </div>
        <div class="input-group">
          <input
            type="number"
            class="color-input"
            part="input"
            min="0"
            max="100"
            .value=${String(Math.round(hsl.s))}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            @input=${(e: Event) => this._handleHslInput('s', e)}
            @change=${this._handleHslChange}
            aria-label="Saturation"
          />
          <span class="input-label">S</span>
        </div>
        <div class="input-group">
          <input
            type="number"
            class="color-input"
            part="input"
            min="0"
            max="100"
            .value=${String(Math.round(hsl.l))}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            @input=${(e: Event) => this._handleHslInput('l', e)}
            @change=${this._handleHslChange}
            aria-label="Lightness"
          />
          <span class="input-label">L</span>
        </div>
        ${this.alpha
          ? html`
              <div class="input-group">
                <input
                  type="number"
                  class="color-input"
                  part="input"
                  min="0"
                  max="100"
                  .value=${String(Math.round(this._hsv.a * 100))}
                  ?disabled=${this.disabled}
                  ?readonly=${this.readonly}
                  @input=${this._handleAlphaInput}
                  @change=${this._handleAlphaInputChange}
                  aria-label="Alpha"
                />
                <span class="input-label">A</span>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  /**
   * Renders the input controls container with format toggle button
   * Shows hex, rgb, or hsl inputs based on current input mode
   * @returns TemplateResult for inputs container
   */
  private _renderInputs() {
    return html`
      <div class="inputs-container">
        ${this._inputMode === 'hex' ? this._renderHexInput() : nothing}
        ${this._inputMode === 'rgb' ? this._renderRgbInputs() : nothing}
        ${this._inputMode === 'hsl' ? this._renderHslInputs() : nothing}
        <button
          type="button"
          class="format-toggle"
          @click=${this._handleFormatToggle}
          ?disabled=${this.disabled}
          aria-label="Cycle color format (${this._inputMode.toUpperCase()})"
          title="Cycle color format"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
            />
          </svg>
        </button>
      </div>
    `;
  }

  /**
   * Renders predefined color swatches
   * Shows swatches from the swatches property or slotted content
   * @returns TemplateResult for swatches container or nothing
   */
  private _renderSwatches() {
    const hasSwatches = this.swatches.length > 0;
    const hasSlottedSwatches = this.querySelector('[slot="swatches"]') !== null;

    if (!hasSwatches && !hasSlottedSwatches) return nothing;

    return html`
      <div
        class="swatches-container"
        part="swatches"
        role="listbox"
        aria-label="Color swatches"
      >
        <slot name="swatches">
          ${this.swatches.map(
            (color) => html`
              <button
                type="button"
                class="swatch"
                part="swatch"
                role="option"
                style="background: ${color}"
                @click=${() => this._handleSwatchClick(color)}
                @keydown=${(e: KeyboardEvent) =>
                  this._handleSwatchKeydown(color, e)}
                ?disabled=${this.disabled}
                aria-label="${color}"
              ></button>
            `
          )}
        </slot>
      </div>
    `;
  }

  /**
   * Renders the eyedropper button if API is supported
   * @returns TemplateResult for eyedropper button or nothing
   */
  private _renderEyedropper() {
    if (!this._eyedropperSupported) return nothing;

    return html`
      <button
        type="button"
        class="eyedropper-button"
        @click=${this._handleEyedropper}
        ?disabled=${this.disabled || this.readonly || this._isPickingColor}
        aria-label="Pick color from screen"
        aria-busy="${this._isPickingColor}"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M2 22l1-1h3l9-9m-3-3l3-3 5 5-3 3m-5-5l5 5M12.5 6.5l5 5" />
        </svg>
      </button>
    `;
  }

  /**
   * Renders the complete color picker panel
   * Includes color area, sliders, preview, inputs, and swatches
   * @returns TemplateResult for picker panel
   */
  private _renderPicker() {
    return html`
      <div
        class="picker"
        part="popover"
        role="dialog"
        aria-label="${this.label || 'Color picker'}"
      >
        <div class="picker-body">
          <div class="picker-main">
            ${this._renderColorArea()} ${this._renderHueSlider()}
          </div>
          ${this._renderAlphaSlider()}
          <div class="picker-controls">
            ${this._renderPreview()} ${this._renderInputs()}
            ${this._renderEyedropper()}
          </div>
          ${this._renderSwatches()}
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  /**
   * Renders the trigger button to open the picker popover
   * Shows current color swatch and optional label
   * @returns TemplateResult for trigger button
   */
  private _renderTrigger() {
    const rgb = hsvToRgb(this._hsv);
    const currentColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this._hsv.a})`;
    const hasLabel = this.label || this.placeholder;

    return html`
      <button
        type="button"
        class="trigger"
        part="trigger"
        role="button"
        aria-haspopup="dialog"
        aria-expanded="${this._open}"
        aria-disabled="${this.disabled}"
        tabindex="${this.disabled ? -1 : 0}"
        ?disabled=${this.disabled}
        @click=${this._handleTriggerClick}
        @keydown=${this._handleTriggerKeydown}
      >
        <slot name="trigger">
          <span
            class="trigger-swatch"
            style="background: ${currentColor}"
          ></span>
          ${hasLabel
            ? html`<span class="trigger-label"
                >${this.label || this.placeholder}</span
              >`
            : nothing}
        </slot>
      </button>
    `;
  }

  render() {
    if (this.inline) {
      return this._renderPicker();
    }

    return html`
      <div class="color-picker color-picker--${this.size}">
        ${this._renderTrigger()}
        ${this._open
          ? html`
              <div aria-live="polite" aria-atomic="true" class="sr-only">
                Current color: ${this._formatOutput()}
              </div>
              ${this._renderPicker()}
            `
          : nothing}
      </div>
      ${this.name
        ? html`<input
            type="hidden"
            name="${this.name}"
            .value=${this._formatOutput()}
          />`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-color-picker': BpColorPicker;
  }
}
