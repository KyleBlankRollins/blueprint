import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { headingStyles } from './heading.style.js';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';
export type HeadingWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * A typography component for semantic headings (h1-h6).
 *
 * @element bp-heading
 *
 * @property {HeadingLevel} level - The semantic heading level (h1-h6)
 * @property {HeadingSize} size - The visual size of the heading
 * @property {HeadingWeight} weight - The font weight of the heading
 *
 * @slot - The heading text content
 *
 * @cssprop --bp-heading-color - Custom color for the heading
 * @cssprop --bp-heading-font-family - Custom font family for the heading
 *
 * @csspart heading - The heading element (h1-h6)
 */
@customElement('bp-heading')
export class BpHeading extends LitElement {
  /**
   * The semantic heading level (h1-h6).
   * Determines the actual HTML element rendered.
   */
  @property({ type: Number, reflect: true }) declare level: HeadingLevel;

  /**
   * The visual size of the heading.
   * Allows visual hierarchy independent of semantic level.
   * Defaults to match the level when not specified.
   */
  @property({ type: String, reflect: true }) declare size: HeadingSize;

  /**
   * The font weight of the heading.
   */
  @property({ type: String, reflect: true }) declare weight: HeadingWeight;

  static styles = [headingStyles];

  constructor() {
    super();
    this.level = 1;
    this.size = '4xl';
    this.weight = 'bold';
  }

  render() {
    const sizeClass = `heading--${this.size}`;
    const weightClass = `heading--${this.weight}`;

    // Using a switch to create the proper heading element
    switch (this.level) {
      case 1:
        return html`<h1
          part="heading"
          class="heading ${sizeClass} ${weightClass}"
        >
          <slot></slot>
        </h1>`;
      case 2:
        return html`<h2
          part="heading"
          class="heading ${sizeClass} ${weightClass}"
        >
          <slot></slot>
        </h2>`;
      case 3:
        return html`<h3
          part="heading"
          class="heading ${sizeClass} ${weightClass}"
        >
          <slot></slot>
        </h3>`;
      case 4:
        return html`<h4
          part="heading"
          class="heading ${sizeClass} ${weightClass}"
        >
          <slot></slot>
        </h4>`;
      case 5:
        return html`<h5
          part="heading"
          class="heading ${sizeClass} ${weightClass}"
        >
          <slot></slot>
        </h5>`;
      case 6:
        return html`<h6
          part="heading"
          class="heading ${sizeClass} ${weightClass}"
        >
          <slot></slot>
        </h6>`;
      default:
        return html`<h1
          part="heading"
          class="heading ${sizeClass} ${weightClass}"
        >
          <slot></slot>
        </h1>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-heading': BpHeading;
  }
}
