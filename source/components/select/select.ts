import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { selectStyles } from './select.style.js';

export type SelectSize = 'sm' | 'md' | 'lg';

@customElement('bp-select')
export class BpSelect extends LitElement {
  /** The current value of the select */
  @property({ type: String, reflect: true }) declare value: string;

  /** Name attribute for form submission */
  @property({ type: String }) declare name: string;

  /** Visible label text displayed above the select */
  @property({ type: String, reflect: true }) declare label: string;

  /** Placeholder text when no value is selected */
  @property({ type: String }) declare placeholder: string;

  /** Whether the select is disabled */
  @property({ type: Boolean, reflect: true }) declare disabled: boolean;

  /** Whether the select is required */
  @property({ type: Boolean, reflect: true }) declare required: boolean;

  /** Size variant of the select */
  @property({ type: String, reflect: true }) declare size: SelectSize;

  /** Whether the dropdown is currently open */
  @state() private isOpen = false;

  /** Label for the selected option */
  @state() private selectedLabel = '';

  /** Index of the focused option for keyboard navigation */
  @state() private focusedIndex = -1;

  static styles = [selectStyles];

  constructor() {
    super();
    this.value = '';
    this.name = '';
    this.label = '';
    this.placeholder = 'Select an option';
    this.disabled = false;
    this.required = false;
    this.size = 'md';
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleDocumentClick, {
      passive: true,
    });
    // Update selected label on initial load
    this.updateComplete.then(() => this.updateSelectedLabel());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick, {
      passive: true,
    } as EventListenerOptions);
  }

  private handleSlotChange = () => {
    this.updateSelectedLabel();
  };

  private updateSelectedLabel() {
    if (!this.value) return;

    const slot = this.shadowRoot?.querySelector('slot');
    const assignedElements = slot?.assignedElements() || [];
    const options = assignedElements.filter(
      (el): el is globalThis.HTMLOptionElement => el.tagName === 'OPTION'
    );

    options.forEach((option) => {
      if ((option.value || option.textContent) === this.value) {
        this.selectedLabel = option.textContent || '';
      }
    });
  }

  private handleDocumentClick = (event: MouseEvent) => {
    if (!this.contains(event.target as unknown as globalThis.Node)) {
      this.isOpen = false;
    }
  };

  private handleToggle = (event?: Event) => {
    event?.stopPropagation();
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  };

  private handleOptionClick = (event: Event) => {
    if (this.disabled) return;

    const target = event.currentTarget as HTMLElement;
    const optionValue = target.dataset.value || '';
    const optionLabel = target.dataset.label || '';

    const previousValue = this.value;
    this.value = optionValue;
    this.selectedLabel = optionLabel;
    this.isOpen = false;
    this.focusedIndex = -1;

    // Dispatch change event
    this.dispatchEvent(
      new CustomEvent('bp-change', {
        detail: {
          value: this.value,
          label: this.selectedLabel,
          previousValue,
        },
        bubbles: true,
        composed: true,
      })
    );

    // Update the underlying hidden input for form integration
    const hiddenInput = this.shadowRoot?.querySelector('input[type="hidden"]');
    if (hiddenInput) {
      (hiddenInput as HTMLInputElement).value = this.value;
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  private handleKeyDown = (event: globalThis.KeyboardEvent) => {
    if (this.disabled) return;

    const options = this.getOptions();

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isOpen && this.focusedIndex >= 0) {
          // Select the focused option
          const option = options[this.focusedIndex];
          if (option) {
            const optionValue = option.value || option.textContent || '';
            const optionLabel = option.textContent || '';
            const previousValue = this.value;
            this.value = optionValue;
            this.selectedLabel = optionLabel;
            this.isOpen = false;
            this.focusedIndex = -1;

            this.dispatchEvent(
              new CustomEvent('bp-change', {
                detail: {
                  value: this.value,
                  label: this.selectedLabel,
                  previousValue,
                },
                bubbles: true,
                composed: true,
              })
            );

            const hiddenInput = this.shadowRoot?.querySelector(
              'input[type="hidden"]'
            );
            if (hiddenInput) {
              (hiddenInput as HTMLInputElement).value = this.value;
              hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        } else {
          this.handleToggle();
        }
        break;
      case 'Escape':
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
        this.scrollFocusedOptionIntoView();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.isOpen = true;
          this.focusedIndex = options.length - 1;
        } else {
          this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        }
        this.scrollFocusedOptionIntoView();
        break;
      case 'Home':
        if (this.isOpen) {
          event.preventDefault();
          this.focusedIndex = 0;
          this.scrollFocusedOptionIntoView();
        }
        break;
      case 'End':
        if (this.isOpen) {
          event.preventDefault();
          this.focusedIndex = options.length - 1;
          this.scrollFocusedOptionIntoView();
        }
        break;
    }
  };

  private getOptions(): Array<{ value: string; textContent: string }> {
    const slot = this.shadowRoot?.querySelector('slot');
    const assignedElements = slot?.assignedElements() || [];
    const options = assignedElements.filter(
      (el): el is globalThis.HTMLOptionElement => el.tagName === 'OPTION'
    );
    return options.map((option) => ({
      value: option.value || option.textContent || '',
      textContent: option.textContent || '',
    }));
  }

  private scrollFocusedOptionIntoView() {
    this.updateComplete.then(() => {
      const focusedOption = this.shadowRoot?.querySelector(
        '.select-option--focused'
      ) as HTMLElement;
      if (focusedOption) {
        focusedOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  private getOptionElements = () => {
    const slot = this.shadowRoot?.querySelector('slot');
    const assignedElements = slot?.assignedElements() || [];
    const options = assignedElements.filter(
      (el): el is globalThis.HTMLOptionElement => el.tagName === 'OPTION'
    );

    return repeat(
      options,
      (option) => option.value || option.textContent || '',
      (option, index) => {
        const optionValue = option.value || option.textContent || '';
        const optionLabel = option.textContent || '';
        const isSelected = this.value === optionValue;
        const isFocused = this.focusedIndex === index;

        if (isSelected && !this.selectedLabel) {
          this.selectedLabel = optionLabel;
        }

        return html`
          <div
            class="select-option ${isSelected
              ? 'select-option--selected'
              : ''} ${isFocused ? 'select-option--focused' : ''}"
            part="option"
            role="option"
            aria-selected="${isSelected ? 'true' : 'false'}"
            data-value="${optionValue}"
            data-label="${optionLabel}"
            tabindex="-1"
            @click=${this.handleOptionClick}
          >
            ${optionLabel}
          </div>
        `;
      }
    );
  };

  render() {
    const selectClasses = {
      select: true,
      [`select--${this.size}`]: true,
      'select--disabled': this.disabled,
      'select--open': this.isOpen,
    };

    const displayLabel = this.selectedLabel || this.placeholder;

    const labelId = this.label ? 'select-label' : undefined;

    return html`
      <div class=${classMap(selectClasses)} part="container">
        ${this.label
          ? html`
              <label class="select-label" id="select-label" part="label">
                ${this.label}
                ${this.required
                  ? html`<span class="select-required">*</span>`
                  : ''}
              </label>
            `
          : ''}
        <!-- Hidden input for form integration (using input instead of select to avoid Firefox conflict) -->
        <input
          type="hidden"
          name=${ifDefined(this.name || undefined)}
          .value=${this.value}
        />

        <!-- Slot for option elements (not rendered, just for content projection) -->
        <slot
          @slotchange=${this.handleSlotChange}
          style="display: none;"
        ></slot>

        <!-- Custom select trigger -->
        <div
          class="select-trigger"
          part="trigger"
          role="combobox"
          aria-expanded="${this.isOpen ? 'true' : 'false'}"
          aria-haspopup="listbox"
          aria-labelledby="${ifDefined(labelId)}"
          aria-disabled="${this.disabled ? 'true' : 'false'}"
          aria-required="${this.required ? 'true' : 'false'}"
          tabindex="${this.disabled ? '-1' : '0'}"
          @click=${this.handleToggle}
          @keydown=${this.handleKeyDown}
        >
          <span class="select-value" part="display">${displayLabel}</span>
          <svg
            class="select-icon"
            part="icon"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <!-- Dropdown menu -->
        ${this.isOpen
          ? html`
              <div class="select-dropdown" part="dropdown" role="listbox">
                ${this.getOptionElements()}
              </div>
            `
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-select': BpSelect;
  }
}
