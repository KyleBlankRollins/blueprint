import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { comboboxStyles } from './combobox.style.js';

export type ComboboxSize = 'small' | 'medium' | 'large';
export type ComboboxVariant =
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface ComboboxOption {
  value: string;
  label: string;
}

@customElement('bp-combobox')
export class BpCombobox extends LitElement {
  /** The current value of the combobox */
  @property({ type: String, reflect: true }) declare value: string;

  /** Name attribute for form submission */
  @property({ type: String }) declare name: string;

  /** Placeholder text when no value is selected */
  @property({ type: String }) declare placeholder: string;

  /** Whether the combobox is disabled */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /** Whether the combobox is required */
  @property({ type: Boolean, reflect: true }) declare required: boolean;

  /** Size variant of the combobox */
  @property({ type: String, reflect: true }) declare size: ComboboxSize;

  /** Visual variant for validation states */
  @property({ type: String, reflect: true }) declare variant: ComboboxVariant;

  /** Whether to allow free-form input (not just from the options list) */
  @property({ type: Boolean }) declare allowCustomValue: boolean;

  /** Whether the dropdown is currently open */
  @state() private isOpen = false;

  /** Current search/filter text */
  @state() private searchText = '';

  /** Index of the focused option for keyboard navigation */
  @state() private focusedIndex = -1;

  /** Reference to the input element */
  @query('input[type="text"]') private inputElement!: HTMLInputElement;

  static styles = [comboboxStyles];

  constructor() {
    super();
    this.value = '';
    this.name = '';
    this.placeholder = 'Search or select...';
    this.disabled = false;
    this.required = false;
    this.size = 'medium';
    this.variant = 'default';
    this.allowCustomValue = false;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleDocumentClick);
    // Initialize search text with selected label
    this.updateComplete.then(() => this.updateSearchText());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  private updateSearchText() {
    if (!this.value) {
      this.searchText = '';
      return;
    }

    const options = this.getOptions();
    const selectedOption = options.find((opt) => opt.value === this.value);
    if (selectedOption) {
      this.searchText = selectedOption.label;
    }
  }

  private handleDocumentClick = (event: MouseEvent) => {
    if (!this.contains(event.target as globalThis.Node)) {
      this.closeDropdown();
    }
  };

  private closeDropdown() {
    this.isOpen = false;
    this.focusedIndex = -1;
    // Restore the selected value's label
    this.updateSearchText();
  }

  private getOptions(): ComboboxOption[] {
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

  private getFilteredOptions(): ComboboxOption[] {
    const allOptions = this.getOptions();
    if (!this.searchText.trim()) {
      return allOptions;
    }

    const searchLower = this.searchText.toLowerCase();
    return allOptions.filter((option) =>
      option.label.toLowerCase().includes(searchLower)
    );
  }

  private handleInputFocus = () => {
    if (this.disabled) return;
    this.isOpen = true;
    this.focusedIndex = -1;
  };

  private handleInputClick = (event: MouseEvent) => {
    event.stopPropagation();
    if (this.disabled) return;
    this.isOpen = true;
  };

  private handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value;
    this.isOpen = true;
    this.focusedIndex = -1;

    // If allowCustomValue is true, update value immediately
    if (this.allowCustomValue) {
      const previousValue = this.value;
      this.value = this.searchText;

      this.dispatchEvent(
        new CustomEvent('bp-change', {
          detail: {
            value: this.value,
            previousValue,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  private handleOptionClick = (option: ComboboxOption) => {
    if (this.disabled) return;

    const previousValue = this.value;
    this.value = option.value;
    this.searchText = option.label;
    this.isOpen = false;
    this.focusedIndex = -1;

    // Dispatch change event
    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: {
          value: this.value,
          label: option.label,
          previousValue,
        },
        bubbles: true,
        composed: true,
      })
    );

    // Update hidden input for form submission
    const hiddenInput = this.shadowRoot?.querySelector('input[type="hidden"]');
    if (hiddenInput) {
      (hiddenInput as HTMLInputElement).value = this.value;
    }

    // Return focus to input
    this.inputElement?.focus();
  };

  private handleInputKeyDown = (event: globalThis.KeyboardEvent) => {
    if (this.disabled) return;

    const filteredOptions = this.getFilteredOptions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
          this.focusedIndex = 0;
        } else {
          this.focusedIndex = Math.min(
            this.focusedIndex + 1,
            filteredOptions.length - 1
          );
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
          this.focusedIndex = filteredOptions.length - 1;
        } else {
          this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (this.isOpen && this.focusedIndex >= 0) {
          const option = filteredOptions[this.focusedIndex];
          if (option) {
            this.handleOptionClick(option);
          }
        } else if (!this.isOpen) {
          this.isOpen = true;
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'Tab':
        // Allow tab to close dropdown
        this.closeDropdown();
        break;
    }
  };

  private handleClear = (event: MouseEvent) => {
    event.stopPropagation();
    if (this.disabled) return;

    const previousValue = this.value;
    this.value = '';
    this.searchText = '';

    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: {
          value: '',
          previousValue,
        },
        bubbles: true,
        composed: true,
      })
    );

    this.inputElement?.focus();
  };

  render() {
    const filteredOptions = this.getFilteredOptions();
    const hasValue = Boolean(this.value || this.searchText);

    return html`
      <div
        class=${classMap({
          combobox: true,
          'combobox--open': this.isOpen,
          'combobox--disabled': this.disabled,
          [`combobox--${this.size}`]: true,
          [`combobox--${this.variant}`]: true,
        })}
      >
        <div class="combobox__control" part="control">
          <input
            type="text"
            class="combobox__input"
            .value=${this.searchText}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            ?required=${this.required}
            @focus=${this.handleInputFocus}
            @click=${this.handleInputClick}
            @input=${this.handleInputChange}
            @keydown=${this.handleInputKeyDown}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded=${this.isOpen}
            aria-autocomplete="list"
            aria-controls="listbox"
            aria-disabled=${this.disabled}
            part="input"
          />

          <div class="combobox__indicators">
            ${hasValue
              ? html`
                  <button
                    type="button"
                    class="combobox__clear"
                    @click=${this.handleClear}
                    aria-label="Clear selection"
                    tabindex="-1"
                    ?disabled=${this.disabled}
                    part="clear-button"
                  >
                    ×
                  </button>
                `
              : ''}
            <span class="combobox__dropdown-indicator" part="indicator">
              ▼
            </span>
          </div>
        </div>

        <div class="combobox__dropdown" id="listbox" part="dropdown">
          <ul class="combobox__options" role="listbox">
            ${filteredOptions.length === 0
              ? html`<li
                  class="combobox__option combobox__option--empty"
                  role="option"
                >
                  No results found
                </li>`
              : repeat(
                  filteredOptions,
                  (opt) => opt.value,
                  (opt, index) => {
                    const isSelected = opt.value === this.value;
                    const isFocused = index === this.focusedIndex;
                    return html`
                      <li
                        class=${classMap({
                          combobox__option: true,
                          'combobox__option--selected': isSelected,
                          'combobox__option--focused': isFocused,
                        })}
                        role="option"
                        aria-selected=${isSelected}
                        @click=${() => this.handleOptionClick(opt)}
                        part="option ${isSelected ? 'option-selected' : ''}"
                      >
                        ${opt.label}
                      </li>
                    `;
                  }
                )}
          </ul>
        </div>

        <!-- Hidden slot for options -->
        <slot @slotchange=${() => this.requestUpdate()}></slot>

        <!-- Hidden input for form submission -->
        ${this.name
          ? html`<input
              type="hidden"
              name="${this.name}"
              .value=${this.value}
            />`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-combobox': BpCombobox;
  }
}
