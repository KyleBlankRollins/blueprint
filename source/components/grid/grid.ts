import { LitElement, html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { gridStyles } from './grid.style.js';
import type { LayoutGap } from '../stack/stack.js';

export type GridAlign = 'start' | 'center' | 'end' | 'stretch';

/**
 * Lays its children out on a grid with a token-based gap. Give it a fixed
 * number of `columns`, or a `minColumnWidth` to fit as many columns as the
 * space allows (responsive without media queries).
 *
 * @element bp-grid
 *
 * @slot - The grid items
 */
@customElement('bp-grid')
export class BpGrid extends LitElement {
  /** Fixed number of equal-width columns (ignored when `minColumnWidth` is set) */
  @property({ type: Number, reflect: true }) declare columns: number;

  /**
   * Minimum column width as a CSS length (e.g. `16rem`, `240px`). When set,
   * the grid fits as many columns of at least this width as it can.
   */
  @property({ type: String, attribute: 'min-column-width', reflect: true })
  declare minColumnWidth: string;

  /** Space between rows and columns, from the semantic spacing scale */
  @property({ type: String, reflect: true }) declare gap: LayoutGap;

  /** Vertical alignment of items within their row */
  @property({ type: String, reflect: true }) declare align: GridAlign;

  static styles = [gridStyles];

  constructor() {
    super();
    this.columns = 1;
    this.minColumnWidth = '';
    this.gap = 'md';
    this.align = 'stretch';
  }

  /** The grid-template-columns value the properties describe */
  get template(): string {
    if (this.minColumnWidth) {
      return `repeat(auto-fit, minmax(min(${this.minColumnWidth}, 100%), 1fr))`;
    }
    const count = Math.max(1, Math.floor(Number(this.columns) || 1));
    return `repeat(${count}, minmax(0, 1fr))`;
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('columns') || changed.has('minColumnWidth')) {
      this.style.setProperty('--_bp-grid-template', this.template);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-grid': BpGrid;
  }
}
