import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { textStyles } from './text.style.js';

export type TextElement = 'p' | 'span' | 'div';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type TextVariant =
  | 'default'
  | 'muted'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
export type TextTracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider';
export type TextLineHeight =
  | 'none'
  | 'tight'
  | 'snug'
  | 'normal'
  | 'relaxed'
  | 'loose';

/**
 * A typography component for body text with flexible styling options.
 *
 * @element bp-text
 *
 * @property {TextElement} as - The HTML element type to render
 * @property {TextSize} size - The size of the text
 * @property {TextWeight} weight - The font weight
 * @property {TextVariant} variant - The color variant
 * @property {TextAlign} align - Text alignment
 * @property {TextTransform} transform - Text transformation (uppercase, lowercase, capitalize)
 * @property {TextTracking} tracking - Letter spacing
 * @property {TextLineHeight} lineHeight - Line height variant
 * @property {number} clamp - Number of lines to clamp (multi-line truncation)
 * @property {boolean} italic - Whether the text is italic
 * @property {boolean} truncate - Whether to truncate with ellipsis
 *
 * @slot - The text content
 *
 * @csspart text - The text container element
 */
@customElement('bp-text')
export class BpText extends LitElement {
  /**
   * The element type to render.
   */
  @property({ type: String, reflect: true }) declare as: TextElement;

  /**
   * The size of the text.
   */
  @property({ type: String, reflect: true }) declare size: TextSize;

  /**
   * The font weight of the text.
   */
  @property({ type: String, reflect: true }) declare weight: TextWeight;

  /**
   * The color variant of the text.
   */
  @property({ type: String, reflect: true }) declare variant: TextVariant;

  /**
   * The text alignment.
   */
  @property({ type: String, reflect: true }) declare align: TextAlign;

  /**
   * Text transformation.
   */
  @property({ type: String, reflect: true }) declare transform: TextTransform;

  /**
   * Letter spacing (tracking).
   */
  @property({ type: String, reflect: true }) declare tracking: TextTracking;

  /**
   * Line height variant.
   */
  @property({ type: String, reflect: true, attribute: 'line-height' })
  declare lineHeight: TextLineHeight;

  /**
   * Number of lines to clamp (multi-line truncation).
   * When set, text will be truncated to the specified number of lines.
   */
  @property({ type: Number, reflect: true }) declare clamp: number;

  /**
   * Whether the text should be italic.
   */
  @property({ type: Boolean, reflect: true }) declare italic: boolean;

  /**
   * Whether the text should be truncated with ellipsis.
   */
  @property({ type: Boolean, reflect: true }) declare truncate: boolean;

  static styles = [textStyles];

  constructor() {
    super();
    this.as = 'p';
    this.size = 'base';
    this.weight = 'normal';
    this.variant = 'default';
    this.align = 'left';
    this.transform = 'none';
    this.tracking = 'normal';
    this.lineHeight = 'normal';
    this.clamp = 0;
    this.italic = false;
    this.truncate = false;
  }

  render() {
    const classes = [
      'text',
      `text--${this.size}`,
      `text--${this.weight}`,
      `text--${this.variant}`,
      `text--align-${this.align}`,
      this.transform !== 'none' ? `text--transform-${this.transform}` : '',
      this.tracking !== 'normal' ? `text--tracking-${this.tracking}` : '',
      this.lineHeight !== 'normal'
        ? `text--line-height-${this.lineHeight}`
        : '',
      this.clamp > 0 ? `text--clamp-${this.clamp}` : '',
      this.italic ? 'text--italic' : '',
      this.truncate ? 'text--truncate' : '',
    ]
      .filter(Boolean)
      .join(' ');

    // Render the appropriate element based on 'as' prop
    switch (this.as) {
      case 'span':
        return html`<span part="text" class="${classes}"><slot></slot></span>`;
      case 'div':
        return html`<div part="text" class="${classes}"><slot></slot></div>`;
      case 'p':
      default:
        return html`<p part="text" class="${classes}"><slot></slot></p>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-text': BpText;
  }
}
