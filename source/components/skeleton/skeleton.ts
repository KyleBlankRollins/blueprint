import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { skeletonStyles } from './skeleton.style.js';

/**
 * A skeleton loading placeholder that indicates content is loading.
 * Use skeletons to reduce perceived loading time and provide visual feedback.
 *
 * @slot - Optional slot for custom skeleton content
 *
 * @csspart base - The skeleton container element
 */
@customElement('bp-skeleton')
export class BpSkeleton extends LitElement {
  /** The visual variant of the skeleton */
  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) => {
        const valid = ['text', 'circular', 'rectangular', 'rounded'];
        return value && valid.includes(value) ? value : 'text';
      },
    },
  })
  declare variant: 'text' | 'circular' | 'rectangular' | 'rounded';

  /** Width of the skeleton. Can be any valid CSS value. */
  @property({ type: String }) declare width: string;

  /** Height of the skeleton. Can be any valid CSS value. */
  @property({ type: String }) declare height: string;

  /** Whether to animate the skeleton with a shimmer effect */
  @property({ type: Boolean, reflect: true }) declare animated: boolean;

  /** Number of lines to display (only for text variant) */
  @property({
    type: Number,
    converter: (value: string | null) => {
      const num = Number(value);
      return num > 0 ? num : 1;
    },
  })
  declare lines: number;

  /** The size preset (affects default dimensions) */
  @property({ type: String }) declare size: 'small' | 'medium' | 'large';

  static styles = [skeletonStyles];

  constructor() {
    super();
    this.variant = 'text';
    this.width = '';
    this.height = '';
    this.animated = true;
    this.lines = 1;
    this.size = 'medium';
  }

  /**
   * Generates CSS custom properties for width and height.
   * Uses custom properties instead of inline styles for CSP compliance.
   * @returns CSS string with custom property declarations
   */
  private getCustomProperties(): string {
    const props: string[] = [];

    if (this.width) {
      props.push(`--skeleton-width: ${this.width}`);
    }

    if (this.height) {
      props.push(`--skeleton-height: ${this.height}`);
    }

    return props.join('; ');
  }

  /**
   * Renders a single skeleton element with appropriate classes and styles.
   * @returns Template result for a single skeleton
   */
  private renderSingleSkeleton() {
    const classes = [
      'skeleton',
      `skeleton--${this.variant}`,
      `skeleton--${this.size}`,
      this.animated ? 'skeleton--animated' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const customProps = this.getCustomProperties();

    return html`
      <div class=${classes} part="base" style=${customProps || nothing}>
        <slot></slot>
      </div>
    `;
  }

  /**
   * Renders text skeleton lines.
   * If variant is text and lines > 1, renders multiple lines with a container.
   * Otherwise delegates to renderSingleSkeleton.
   * @returns Template result for text lines or single skeleton
   */
  private renderTextLines() {
    if (this.variant !== 'text' || this.lines <= 1) {
      return this.renderSingleSkeleton();
    }

    const customProps = this.getCustomProperties();
    const lineElements = [];
    for (let i = 0; i < this.lines; i++) {
      const isLastLine = i === this.lines - 1;
      const classes = [
        'skeleton',
        'skeleton--text',
        `skeleton--${this.size}`,
        this.animated ? 'skeleton--animated' : '',
        isLastLine ? 'skeleton--last-line' : '',
      ]
        .filter(Boolean)
        .join(' ');

      lineElements.push(
        html`<div
          class=${classes}
          part="base"
          style=${customProps || nothing}
        ></div>`
      );
    }

    return html`<div class="skeleton__lines">${lineElements}</div>`;
  }

  render() {
    return this.renderTextLines();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-skeleton': BpSkeleton;
  }
}
