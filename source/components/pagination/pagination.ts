import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { paginationStyles } from './pagination.style.js';
import { booleanConverter } from '../../utilities/boolean-converter.js';

/**
 * A pagination component for navigating through multiple pages of content.
 *
 * @fires bp-page-change - Dispatched when the page changes
 *
 * @slot - Default slot for custom content (not typically used)
 *
 * @csspart container - The main pagination container
 * @csspart button - All pagination buttons
 * @csspart button-first - The first page button
 * @csspart button-prev - The previous page button
 * @csspart button-next - The next page button
 * @csspart button-last - The last page button
 * @csspart button-page - Individual page number buttons
 * @csspart button-ellipsis - Ellipsis indicators
 * @csspart info - The page info text
 */
@customElement('bp-pagination')
export class BpPagination extends LitElement {
  /** Current page number (1-indexed) */
  @property({ type: Number, attribute: 'current-page' })
  declare currentPage: number;

  /** Total number of pages */
  @property({ type: Number, attribute: 'total-pages' })
  declare totalPages: number;

  /** Number of page buttons to show around the current page */
  @property({ type: Number, attribute: 'sibling-count' })
  declare siblingCount: number;

  /** Number of page buttons to show at the start and end */
  @property({ type: Number, attribute: 'boundary-count' })
  declare boundaryCount: number;

  /** Show first/last page buttons */
  @property({
    converter: booleanConverter,
    reflect: true,
    attribute: 'show-first-last',
  })
  declare showFirstLast: boolean;

  /** Show previous/next page buttons */
  @property({
    converter: booleanConverter,
    reflect: true,
    attribute: 'show-prev-next',
  })
  declare showPrevNext: boolean;

  /** Show page info text (e.g., "Page 1 of 10") */
  @property({ type: Boolean, attribute: 'show-info' })
  declare showInfo: boolean;

  /** Disable all pagination controls */
  @property({ type: Boolean }) declare disabled: boolean;

  /** Size variant */
  @property({ type: String }) declare size: 'sm' | 'md' | 'lg';

  static styles = [paginationStyles];

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.siblingCount = 1;
    this.boundaryCount = 1;
    this.showFirstLast = true;
    this.showPrevNext = true;
    this.showInfo = false;
    this.disabled = false;
    this.size = 'md';
  }

  private handlePageChange(newPage: number) {
    if (
      this.disabled ||
      newPage < 1 ||
      newPage > this.totalPages ||
      newPage === this.currentPage
    ) {
      return;
    }

    this.currentPage = newPage;
    this.dispatchEvent(
      new CustomEvent('bp-page-change', {
        detail: { page: newPage },
        bubbles: true,
        composed: true,
      })
    );
  }

  private getPageNumbers(): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = [];
    const totalCount = this.totalPages;
    const currentPageNum = this.currentPage;
    const siblingCountNum = this.siblingCount;
    const boundaryCountNum = this.boundaryCount;

    // Calculate range around current page
    const startPage = Math.max(1, currentPageNum - siblingCountNum);
    const endPage = Math.min(totalCount, currentPageNum + siblingCountNum);

    // Add boundary pages at start
    for (let i = 1; i <= Math.min(boundaryCountNum, totalCount); i++) {
      pages.push(i);
    }

    // Add ellipsis after boundary if needed
    if (startPage > boundaryCountNum + 1) {
      pages.push('ellipsis');
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      if (i > boundaryCountNum && i <= totalCount - boundaryCountNum) {
        pages.push(i);
      }
    }

    // Add ellipsis before end boundary if needed
    if (endPage < totalCount - boundaryCountNum) {
      pages.push('ellipsis');
    }

    // Add boundary pages at end
    for (
      let i = Math.max(totalCount - boundaryCountNum + 1, boundaryCountNum + 1);
      i <= totalCount;
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Remove duplicates while preserving order
    return pages.filter((page, index, self) => self.indexOf(page) === index);
  }

  render() {
    const pageNumbers = this.getPageNumbers();
    const isFirstPage = this.currentPage === 1;
    const isLastPage = this.currentPage === this.totalPages;

    return html`
      <nav
        class="pagination pagination--${this.size}"
        part="container"
        aria-label="Pagination"
      >
        ${this.showFirstLast
          ? html`
              <button
                class="pagination__button pagination__button--first"
                part="button button-first"
                ?disabled=${this.disabled || isFirstPage}
                @click=${() => this.handlePageChange(1)}
                aria-label="First page"
              >
                «
              </button>
            `
          : ''}
        ${this.showPrevNext
          ? html`
              <button
                class="pagination__button pagination__button--prev"
                part="button button-prev"
                ?disabled=${this.disabled || isFirstPage}
                @click=${() => this.handlePageChange(this.currentPage - 1)}
                aria-label="Previous page"
              >
                ‹
              </button>
            `
          : ''}
        ${repeat(
          pageNumbers,
          (page, index) => (page === 'ellipsis' ? `ellipsis-${index}` : page),
          (page) =>
            page === 'ellipsis'
              ? html`
                  <span
                    class="pagination__ellipsis"
                    part="button-ellipsis"
                    aria-hidden="true"
                    >…</span
                  >
                `
              : html`
                  <button
                    class="pagination__button pagination__button--page ${page ===
                    this.currentPage
                      ? 'pagination__button--active'
                      : ''}"
                    part="button button-page"
                    ?disabled=${this.disabled}
                    @click=${() => this.handlePageChange(page)}
                    aria-label="Page ${page}"
                    aria-current=${page === this.currentPage ? 'page' : 'false'}
                  >
                    ${page}
                  </button>
                `
        )}
        ${this.showPrevNext
          ? html`
              <button
                class="pagination__button pagination__button--next"
                part="button button-next"
                ?disabled=${this.disabled || isLastPage}
                @click=${() => this.handlePageChange(this.currentPage + 1)}
                aria-label="Next page"
              >
                ›
              </button>
            `
          : ''}
        ${this.showFirstLast
          ? html`
              <button
                class="pagination__button pagination__button--last"
                part="button button-last"
                ?disabled=${this.disabled || isLastPage}
                @click=${() => this.handlePageChange(this.totalPages)}
                aria-label="Last page"
              >
                »
              </button>
            `
          : ''}
        ${this.showInfo
          ? html`
              <span class="pagination__info" part="info" aria-live="polite">
                Page ${this.currentPage} of ${this.totalPages}
              </span>
            `
          : ''}
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-pagination': BpPagination;
  }
}
