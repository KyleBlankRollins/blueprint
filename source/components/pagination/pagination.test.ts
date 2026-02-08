import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './pagination.js';
import type { BpPagination } from './pagination.js';

describe('bp-pagination', () => {
  let element: BpPagination;

  beforeEach(() => {
    element = document.createElement('bp-pagination');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-pagination');
    expect(constructor).toBeDefined();
  });

  // Rendering
  it('should render pagination element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const nav = element.shadowRoot!.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  // Default Values
  it('should have correct default property values', () => {
    expect(element.currentPage).toBe(1);
    expect(element.totalPages).toBe(1);
    expect(element.siblingCount).toBe(1);
    expect(element.boundaryCount).toBe(1);
    expect(element.showFirstLast).toBe(true);
    expect(element.showPrevNext).toBe(true);
    expect(element.showInfo).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.size).toBe('md');
  });

  // Property Reactivity (DOM updates when properties change)
  it('should update active button in DOM when currentPage changes', async () => {
    element.totalPages = 5;
    element.currentPage = 2;
    await element.updateComplete;

    let activeButton = element.shadowRoot!.querySelector(
      '.pagination__button--active'
    );
    expect(activeButton?.textContent?.trim()).toBe('2');

    element.currentPage = 4;
    await element.updateComplete;

    activeButton = element.shadowRoot!.querySelector(
      '.pagination__button--active'
    );
    expect(activeButton?.textContent?.trim()).toBe('4');
  });

  it('should update CSS class when size property changes', async () => {
    element.size = 'sm';
    await element.updateComplete;
    const nav = element.shadowRoot!.querySelector('nav');
    expect(nav?.classList.contains('pagination--sm')).toBe(true);

    element.size = 'lg';
    await element.updateComplete;
    expect(nav?.classList.contains('pagination--lg')).toBe(true);
    expect(nav?.classList.contains('pagination--sm')).toBe(false);
  });

  it('should update page info text when currentPage changes', async () => {
    element.showInfo = true;
    element.totalPages = 10;
    element.currentPage = 3;
    await element.updateComplete;

    let info = element.shadowRoot!.querySelector('.pagination__info');
    expect(info?.textContent?.trim()).toBe('Page 3 of 10');

    element.currentPage = 7;
    await element.updateComplete;

    info = element.shadowRoot!.querySelector('.pagination__info');
    expect(info?.textContent?.trim()).toBe('Page 7 of 10');
  });

  // Events
  it('should emit bp-page-change event when page button clicked', async () => {
    element.totalPages = 5;
    element.currentPage = 1;
    await element.updateComplete;

    const eventSpy = vi.fn();
    element.addEventListener('bp-page-change', eventSpy);

    const pageButton = element.shadowRoot!.querySelectorAll(
      '.pagination__button--page'
    )[1] as HTMLButtonElement;
    pageButton.click();
    await element.updateComplete;

    expect(eventSpy).toHaveBeenCalled();
    expect(eventSpy.mock.calls[0][0].detail.page).toBe(2);
  });

  it('should emit bp-page-change event with correct page when next button clicked', async () => {
    element.totalPages = 5;
    element.currentPage = 2;
    await element.updateComplete;

    const eventSpy = vi.fn();
    element.addEventListener('bp-page-change', eventSpy);

    const nextButton = element.shadowRoot!.querySelector(
      '.pagination__button--next'
    ) as HTMLButtonElement;
    nextButton.click();
    await element.updateComplete;

    expect(eventSpy).toHaveBeenCalled();
    expect(eventSpy.mock.calls[0][0].detail.page).toBe(3);
  });

  it('should emit bp-page-change event with correct page when prev button clicked', async () => {
    element.totalPages = 5;
    element.currentPage = 3;
    await element.updateComplete;

    const eventSpy = vi.fn();
    element.addEventListener('bp-page-change', eventSpy);

    const prevButton = element.shadowRoot!.querySelector(
      '.pagination__button--prev'
    ) as HTMLButtonElement;
    prevButton.click();
    await element.updateComplete;

    expect(eventSpy).toHaveBeenCalled();
    expect(eventSpy.mock.calls[0][0].detail.page).toBe(2);
  });

  // CSS Parts
  it('should expose container part for styling', async () => {
    await element.updateComplete;
    const container = element.shadowRoot!.querySelector('[part~="container"]');
    expect(container).toBeTruthy();
  });

  it('should expose button parts for styling', async () => {
    element.totalPages = 5;
    await element.updateComplete;
    const buttons = element.shadowRoot!.querySelectorAll('[part~="button"]');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should expose button-first part when showFirstLast is true', async () => {
    element.showFirstLast = true;
    await element.updateComplete;
    const firstButton = element.shadowRoot!.querySelector(
      '[part~="button-first"]'
    );
    expect(firstButton).toBeTruthy();
  });

  // Page Number Generation Algorithm
  it('should generate correct page numbers with siblingCount=1', async () => {
    element.totalPages = 20;
    element.currentPage = 10;
    element.siblingCount = 1;
    element.boundaryCount = 1;
    await element.updateComplete;

    const pageNumbers = Array.from(
      element.shadowRoot!.querySelectorAll('.pagination__button--page')
    ).map((btn) => btn.textContent?.trim());

    expect(pageNumbers).toEqual(['1', '9', '10', '11', '20']);
  });

  it('should generate correct page numbers with siblingCount=2', async () => {
    element.totalPages = 20;
    element.currentPage = 10;
    element.siblingCount = 2;
    element.boundaryCount = 1;
    await element.updateComplete;

    const pageNumbers = Array.from(
      element.shadowRoot!.querySelectorAll('.pagination__button--page')
    ).map((btn) => btn.textContent?.trim());

    expect(pageNumbers).toEqual(['1', '8', '9', '10', '11', '12', '20']);
  });

  it('should respect boundaryCount when generating page numbers', async () => {
    element.totalPages = 20;
    element.currentPage = 10;
    element.siblingCount = 0;
    element.boundaryCount = 2;
    await element.updateComplete;

    const pageNumbers = Array.from(
      element.shadowRoot!.querySelectorAll('.pagination__button--page')
    ).map((btn) => btn.textContent?.trim());

    // Should show: 1, 2, ..., 10, ..., 19, 20
    expect(pageNumbers[0]).toBe('1');
    expect(pageNumbers[1]).toBe('2');
    expect(pageNumbers[pageNumbers.length - 2]).toBe('19');
    expect(pageNumbers[pageNumbers.length - 1]).toBe('20');
  });

  it('should show all pages when total is small', async () => {
    element.totalPages = 5;
    element.currentPage = 3;
    element.siblingCount = 1;
    element.boundaryCount = 1;
    await element.updateComplete;

    const pageNumbers = Array.from(
      element.shadowRoot!.querySelectorAll('.pagination__button--page')
    ).map((btn) => btn.textContent?.trim());

    expect(pageNumbers).toEqual(['1', '2', '3', '4', '5']);
  });

  // Interactions
  it('should navigate to first page when first button clicked', async () => {
    element.totalPages = 10;
    element.currentPage = 5;
    await element.updateComplete;

    const firstButton = element.shadowRoot!.querySelector(
      '.pagination__button--first'
    ) as HTMLButtonElement;
    firstButton.click();
    await element.updateComplete;

    expect(element.currentPage).toBe(1);
  });

  it('should navigate to last page when last button clicked', async () => {
    element.totalPages = 10;
    element.currentPage = 5;
    await element.updateComplete;

    const lastButton = element.shadowRoot!.querySelector(
      '.pagination__button--last'
    ) as HTMLButtonElement;
    lastButton.click();
    await element.updateComplete;

    expect(element.currentPage).toBe(10);
  });

  it('should not change page when clicking disabled button', async () => {
    element.disabled = true;
    element.totalPages = 5;
    element.currentPage = 1;
    await element.updateComplete;

    const pageButton = element.shadowRoot!.querySelectorAll(
      '.pagination__button--page'
    )[1] as HTMLButtonElement;
    pageButton.click();
    await element.updateComplete;

    expect(element.currentPage).toBe(1);
  });

  it('should disable prev/first buttons on first page', async () => {
    element.totalPages = 5;
    element.currentPage = 1;
    await element.updateComplete;

    const prevButton = element.shadowRoot!.querySelector(
      '.pagination__button--prev'
    ) as HTMLButtonElement;
    const firstButton = element.shadowRoot!.querySelector(
      '.pagination__button--first'
    ) as HTMLButtonElement;

    expect(prevButton.disabled).toBe(true);
    expect(firstButton.disabled).toBe(true);

    // Verify clicking does nothing
    const eventSpy = vi.fn();
    element.addEventListener('bp-page-change', eventSpy);
    prevButton.click();
    firstButton.click();
    expect(eventSpy).not.toHaveBeenCalled();
    expect(element.currentPage).toBe(1);
  });

  it('should disable next/last buttons on last page', async () => {
    element.totalPages = 5;
    element.currentPage = 5;
    await element.updateComplete;

    const nextButton = element.shadowRoot!.querySelector(
      '.pagination__button--next'
    ) as HTMLButtonElement;
    const lastButton = element.shadowRoot!.querySelector(
      '.pagination__button--last'
    ) as HTMLButtonElement;

    expect(nextButton.disabled).toBe(true);
    expect(lastButton.disabled).toBe(true);

    // Verify clicking does nothing
    const eventSpy = vi.fn();
    element.addEventListener('bp-page-change', eventSpy);
    nextButton.click();
    lastButton.click();
    expect(eventSpy).not.toHaveBeenCalled();
    expect(element.currentPage).toBe(5);
  });

  // Accessibility
  it('should have aria-label on navigation element', async () => {
    await element.updateComplete;
    const nav = element.shadowRoot!.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Pagination');
  });

  it('should have aria-label on page buttons', async () => {
    element.totalPages = 3;
    await element.updateComplete;
    const pageButton = element.shadowRoot!.querySelector(
      '.pagination__button--page'
    ) as HTMLButtonElement;
    expect(pageButton.getAttribute('aria-label')).toContain('Page');
  });

  it('should have aria-current on active page button', async () => {
    element.totalPages = 5;
    element.currentPage = 3;
    await element.updateComplete;
    const activeButton = element.shadowRoot!.querySelector(
      '.pagination__button--active'
    ) as HTMLButtonElement;
    expect(activeButton.getAttribute('aria-current')).toBe('page');
  });

  it('should have aria-live region when showInfo is true', async () => {
    element.showInfo = true;
    element.totalPages = 5;
    element.currentPage = 2;
    await element.updateComplete;
    const info = element.shadowRoot!.querySelector('.pagination__info');
    expect(info?.getAttribute('aria-live')).toBe('polite');
  });

  // Additional functionality tests
  it('should show ellipsis for large page counts', async () => {
    element.totalPages = 20;
    element.currentPage = 10;
    element.siblingCount = 1;
    element.boundaryCount = 1;
    await element.updateComplete;
    const ellipsis = element.shadowRoot!.querySelectorAll(
      '.pagination__ellipsis'
    );
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('should hide first/last buttons when showFirstLast is false', async () => {
    element.showFirstLast = false;
    element.totalPages = 5;
    await element.updateComplete;
    const firstButton = element.shadowRoot!.querySelector(
      '.pagination__button--first'
    );
    const lastButton = element.shadowRoot!.querySelector(
      '.pagination__button--last'
    );
    expect(firstButton).toBeNull();
    expect(lastButton).toBeNull();
  });

  it('should hide prev/next buttons when showPrevNext is false', async () => {
    element.showPrevNext = false;
    element.totalPages = 5;
    await element.updateComplete;
    const prevButton = element.shadowRoot!.querySelector(
      '.pagination__button--prev'
    );
    const nextButton = element.shadowRoot!.querySelector(
      '.pagination__button--next'
    );
    expect(prevButton).toBeNull();
    expect(nextButton).toBeNull();
  });

  it('should display page info when showInfo is true', async () => {
    element.showInfo = true;
    element.totalPages = 10;
    element.currentPage = 5;
    await element.updateComplete;
    const info = element.shadowRoot!.querySelector('.pagination__info');
    expect(info?.textContent?.trim()).toContain('Page 5 of 10');
  });

  // Keyboard Navigation
  it('should have proper tabIndex on all buttons for keyboard navigation', async () => {
    element.totalPages = 5;
    await element.updateComplete;
    const buttons = element.shadowRoot!.querySelectorAll('.pagination__button');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((button) => {
      expect((button as HTMLButtonElement).tabIndex).toBeGreaterThanOrEqual(0);
    });
  });

  it('should not emit events when disabled buttons are clicked', async () => {
    element.disabled = true;
    element.totalPages = 5;
    element.currentPage = 1;
    await element.updateComplete;

    const eventSpy = vi.fn();
    element.addEventListener('bp-page-change', eventSpy);

    const pageButton = element.shadowRoot!.querySelectorAll(
      '.pagination__button--page'
    )[1] as HTMLButtonElement;
    expect(pageButton.disabled).toBe(true);

    pageButton.click();
    await element.updateComplete;

    expect(eventSpy).not.toHaveBeenCalled();
  });
});
