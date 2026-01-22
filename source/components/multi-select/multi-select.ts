import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { multiSelectStyles } from './multi-select.style.js';

export type MultiSelectSize = 'small' | 'medium' | 'large';
export type MultiSelectVariant =
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface MultiSelectOption {
  value: string;
  label: string;
}

@customElement('bp-multi-select')
export class BpMultiSelect extends LitElement {
  /** The current selected values as an array */
  @property({ type: Array }) declare value: string[];

  /** Name attribute for form submission */
  @property({ type: String }) declare name: string;

  /** Placeholder text when no values are selected */
  @property({ type: String }) declare placeholder: string;

  /** Whether the multi-select is disabled */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /** Whether the multi-select is required */
  @property({ type: Boolean, reflect: true }) declare required: boolean;

  /** Size variant of the multi-select */
  @property({ type: String, reflect: true }) declare size: MultiSelectSize;

  /** Visual variant for validation states */
  @property({ type: String, reflect: true })
  declare variant: MultiSelectVariant;

  /** Maximum number of selections allowed (0 = unlimited) */
  @property({ type: Number }) declare maxSelections: number;

  /** Whether to show a clear all button */
  @property({ type: Boolean }) declare clearable: boolean;

  /** Whether the dropdown is currently open */
  @state() private isOpen = false;

  /** Index of the focused option for keyboard navigation */
  @state() private focusedIndex = -1;

  static styles = [multiSelectStyles];

  constructor() {
    super();
    this.value = [];
    this.name = '';
    this.placeholder = 'Select options';
    this.disabled = false;
    this.required = false;
    this.size = 'medium';
    this.variant = 'default';
    this.maxSelections = 0;
    this.clearable = true;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  private handleDocumentClick = (event: MouseEvent) => {
    if (!this.contains(event.target as globalThis.Node)) {
      this.isOpen = false;
      this.focusedIndex = -1;
    }
  };

  private handleToggle = (event?: Event) => {
    event?.stopPropagation();
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.focusedIndex = 0;
    }
  };

  private getOptions(): MultiSelectOption[] {
    const slot = this.shadowRoot?.querySelector('slot');
    const assignedElements = slot?.assignedElements() || [];
    const options = assignedElements.filter(
      (el): el is globalThis.HTMLOptionElement => el.tagName === 'OPTION'
    );

    return options.map((option) => ({
      value: option.value || option.textContent || '',
      label: option.textContent || '',
    }));
  }

  private isSelected(value: string): boolean {
    return this.value.includes(value);
  }

  private dispatchChangeEvent(newValue: string[], previousValue: string[]) {
    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: {
          value: newValue,
          previousValue,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleOptionClick = (option: MultiSelectOption) => {
    if (this.disabled) return;

    const previousValue = [...this.value];
    let newValue: string[];

    if (this.isSelected(option.value)) {
      // Deselect
      newValue = this.value.filter((v) => v !== option.value);
    } else {
      // Select (check max selections)
      if (this.maxSelections > 0 && this.value.length >= this.maxSelections) {
        return;
      }
      newValue = [...this.value, option.value];
    }

    this.value = newValue;
    this.dispatchChangeEvent(newValue, previousValue);
  };

  private handleRemoveTag = (value: string, event: Event) => {
    event.stopPropagation();
    if (this.disabled) return;

    const previousValue = [...this.value];
    const newValue = this.value.filter((v) => v !== value);
    this.value = newValue;
    this.dispatchChangeEvent(newValue, previousValue);
  };

  private handleClearAll = (event: Event) => {
    event.stopPropagation();
    if (this.disabled) return;

    const previousValue = [...this.value];
    const newValue: string[] = [];
    this.value = newValue;
    this.dispatchChangeEvent(newValue, previousValue);
  };

  private handleKeyDown = (event: globalThis.KeyboardEvent) => {
    if (this.disabled) return;

    const options = this.getOptions();

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isOpen && this.focusedIndex >= 0) {
          const option = options[this.focusedIndex];
          if (option) {
            this.handleOptionClick(option);
          }
        } else {
          this.handleToggle();
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.isOpen = false;
        this.focusedIndex = -1;
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
          this.focusedIndex = 0;
        } else {
          this.focusedIndex = Math.min(
            this.focusedIndex + 1,
            options.length - 1
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
          this.focusedIndex = options.length - 1;
        } else {
          this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        }
        break;
    }
  };

  private getLabelForValue(value: string): string {
    const options = this.getOptions();
    const option = options.find((opt) => opt.value === value);
    return option?.label || value;
  }

  render() {
    const options = this.getOptions();
    const hasSelection = this.value.length > 0;

    return html`
      <div
        class=${classMap({
          'multi-select': true,
          'multi-select--open': this.isOpen,
          'multi-select--disabled': this.disabled,
          [`multi-select--${this.size}`]: true,
          [`multi-select--${this.variant}`]: true,
        })}
      >
        <div
          class="multi-select__control"
          @click=${this.handleToggle}
          @keydown=${this.handleKeyDown}
          tabindex=${this.disabled ? '-1' : '0'}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${this.isOpen}
          aria-disabled=${this.disabled}
          part="control"
        >
          <div class="multi-select__value-container">
            ${hasSelection
              ? repeat(
                  this.value,
                  (v) => v,
                  (v) => html`
                    <span class="multi-select__tag" part="tag">
                      <span class="multi-select__tag-label">
                        ${this.getLabelForValue(v)}
                      </span>
                      <button
                        type="button"
                        class="multi-select__tag-remove"
                        @click=${(e: Event) => this.handleRemoveTag(v, e)}
                        aria-label="Remove ${this.getLabelForValue(v)}"
                        tabindex="-1"
                        ?disabled=${this.disabled}
                      >
                        ×
                      </button>
                    </span>
                  `
                )
              : html`<span class="multi-select__placeholder"
                  >${this.placeholder}</span
                >`}
          </div>

          <div class="multi-select__indicators">
            ${this.clearable && hasSelection
              ? html`
                  <button
                    type="button"
                    class="multi-select__clear"
                    @click=${this.handleClearAll}
                    aria-label="Clear all selections"
                    tabindex="-1"
                    ?disabled=${this.disabled}
                    part="clear-button"
                  >
                    ×
                  </button>
                `
              : ''}
            <span class="multi-select__dropdown-indicator" part="indicator">
              ▼
            </span>
          </div>
        </div>

        <div class="multi-select__dropdown" part="dropdown">
          <ul
            class="multi-select__options"
            role="listbox"
            aria-multiselectable="true"
          >
            ${options.length === 0
              ? html`<li
                  class="multi-select__option multi-select__option--empty"
                >
                  No options available
                </li>`
              : repeat(
                  options,
                  (opt) => opt.value,
                  (opt, index) => {
                    const selected = this.isSelected(opt.value);
                    const focused = index === this.focusedIndex;
                    return html`
                      <li
                        class=${classMap({
                          'multi-select__option': true,
                          'multi-select__option--selected': selected,
                          'multi-select__option--focused': focused,
                        })}
                        role="option"
                        aria-selected=${selected}
                        @click=${() => this.handleOptionClick(opt)}
                        part="option ${selected ? 'option-selected' : ''}"
                      >
                        <span class="multi-select__checkbox">
                          ${selected ? '✓' : ''}
                        </span>
                        <span class="multi-select__option-label"
                          >${opt.label}</span
                        >
                      </li>
                    `;
                  }
                )}
          </ul>
        </div>

        <!-- Hidden slot for options -->
        <slot @slotchange=${() => this.requestUpdate()}></slot>

        <!-- Hidden inputs for form submission -->
        ${this.value.map(
          (v) => html`
            <input type="hidden" name="${this.name}" value="${v}" />
          `
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-multi-select': BpMultiSelect;
  }
}
