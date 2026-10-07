import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { stackStyles } from './stack.style.js';

/** Semantic spacing steps (`--bp-spacing-*`) usable as a layout gap */
export type LayoutGap =
  'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type StackDirection = 'vertical' | 'horizontal';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify =
  'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

/**
 * Lays its children out in a single row or column with a token-based gap.
 * Use it for the space between siblings instead of margins: a vertical stack
 * for form fields and page sections, a horizontal one (with `wrap`) for
 * button groups, tags and toolbars.
 *
 * @element bp-stack
 *
 * @slot - The items to lay out
 */
@customElement('bp-stack')
export class BpStack extends LitElement {
  /** Main axis: a column (`vertical`) or a row (`horizontal`) */
  @property({ type: String, reflect: true }) declare direction: StackDirection;

  /** Space between items, from the semantic spacing scale */
  @property({ type: String, reflect: true }) declare gap: LayoutGap;

  /** Cross-axis alignment of the items */
  @property({ type: String, reflect: true }) declare align: StackAlign;

  /** Main-axis distribution of the items */
  @property({ type: String, reflect: true }) declare justify: StackJustify;

  /** Let items wrap onto new lines when they run out of room */
  @property({ type: Boolean, reflect: true }) declare wrap: boolean;

  static styles = [stackStyles];

  constructor() {
    super();
    this.direction = 'vertical';
    this.gap = 'md';
    this.align = 'stretch';
    this.justify = 'start';
    this.wrap = false;
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-stack': BpStack;
  }
}
