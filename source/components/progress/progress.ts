import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { progressStyles } from './progress.style.js';

export type ProgressVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type ProgressSize = 'sm' | 'md' | 'lg';

/**
 * A progress bar component for displaying task completion or loading status.
 *
 * @fires bp-complete - Fired when progress reaches 100%
 */
@customElement('bp-progress')
export class BpProgress extends LitElement {
  /**
   * Current progress value
   */
  @property({ type: Number }) declare value: number;

  /**
   * Maximum value for progress (value will be clamped to 0-max)
   */
  @property({ type: Number }) declare max: number;

  /**
   * Visual variant of the progress bar
   */
  @property({ type: String, reflect: true }) declare variant: ProgressVariant;

  /**
   * Size of the progress bar
   */
  @property({ type: String, reflect: true }) declare size: ProgressSize;

  /**
   * Optional label text displayed above the progress bar
   */
  @property({ type: String }) declare label: string;

  /**
   * Whether to show percentage text
   */
  @property({ type: Boolean }) declare showValue: boolean;

  /**
   * Whether the progress bar is indeterminate (loading state)
   */
  @property({ type: Boolean }) declare indeterminate: boolean;

  static styles = [progressStyles];

  constructor() {
    super();
    this.value = 0;
    this.max = 100;
    this.variant = 'primary';
    this.size = 'md';
    this.label = '';
    this.showValue = false;
    this.indeterminate = false;
  }

  private get percentage(): number {
    if (this.max <= 0) return 0;
    const percent = (this.value / this.max) * 100;
    return Math.min(100, Math.max(0, percent));
  }

  private get complete(): boolean {
    return this.percentage >= 100 && !this.indeterminate;
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('value') && this.percentage >= 100) {
      this.dispatchEvent(
        new CustomEvent('bp-complete', {
          detail: {
            value: this.value,
            max: this.max,
            percentage: this.percentage,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <div class="progress-container">
        ${this.label || this.showValue
          ? html`
              <div class="progress-header" part="header">
                ${this.label
                  ? html`<span class="progress-label">${this.label}</span>`
                  : null}
                ${this.showValue && !this.indeterminate
                  ? html`<span class="progress-value"
                      >${Math.round(this.percentage)}%</span
                    >`
                  : null}
              </div>
            `
          : null}
        <div
          class="progress progress--${this.variant} progress--${this
            .size} ${this.indeterminate ? 'progress--indeterminate' : ''} ${this
            .complete
            ? 'progress--complete'
            : ''}"
          part="track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="${this.max}"
          aria-valuenow="${this.indeterminate ? undefined : this.value}"
          aria-label="${this.label || 'Progress'}"
          aria-live="polite"
          aria-atomic="false"
        >
          <div
            class="progress-bar"
            part="bar"
            style="width: ${this.indeterminate
              ? '100%'
              : this.percentage + '%'}"
          ></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-progress': BpProgress;
  }
}
