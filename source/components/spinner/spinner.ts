import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { spinnerStyles } from './spinner.style.js';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant =
  | 'primary'
  | 'success'
  | 'error'
  | 'warning'
  | 'inverse'
  | 'neutral';

/**
 * A loading spinner component that indicates content is being loaded or processed.
 * Supports multiple sizes, variants, and an optional label for accessibility.
 */
@customElement('bp-spinner')
export class BpSpinner extends LitElement {
  /**
   * Size of the spinner.
   * @type {'sm' | 'md' | 'lg'}
   * @default 'md'
   */
  @property({ type: String, reflect: true }) declare size: SpinnerSize;

  /**
   * Visual variant of the spinner.
   * @type {'primary' | 'success' | 'error' | 'warning' | 'inverse' | 'neutral'}
   * @default 'primary'
   */
  @property({ type: String, reflect: true }) declare variant: SpinnerVariant;

  /**
   * Accessible label for screen readers.
   * @type {string}
   * @default 'Loading...'
   */
  @property({ type: String, reflect: true }) declare label: string;

  static styles = [spinnerStyles];

  constructor() {
    super();
    this.size = 'md';
    this.variant = 'primary';
    this.label = 'Loading...';
  }

  render() {
    return html`
      <div
        class="spinner spinner--${this.size} spinner--${this.variant}"
        role="status"
        aria-label="${this.label}"
        part="spinner"
      >
        <div class="spinner__circle" part="circle"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-spinner': BpSpinner;
  }
}
