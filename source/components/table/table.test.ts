import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './table.js';
import type { BpTable, TableColumn, TableRow } from './table.js';

describe('bp-table', () => {
  let element: BpTable;

  const sampleColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', align: 'center' },
  ];

  const sampleRows: TableRow[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'User' },
  ];

  beforeEach(() => {
    element = document.createElement('bp-table');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // Registration tests
  it('should be registered in HTMLElementTagNameMap', () => {
    const constructor = customElements.get('bp-table');
    expect(constructor).toBeDefined();
  });

  // Rendering tests
  it('should render table element to DOM', async () => {
    await element.updateComplete;
    expect(element.shadowRoot).toBeTruthy();
    const table = element.shadowRoot?.querySelector('.table');
    expect(table).toBeTruthy();
  });

  it('should render columns as header cells', async () => {
    element.columns = sampleColumns;
    await element.updateComplete;

    const headers = element.shadowRoot?.querySelectorAll('.header-cell');
    expect(headers?.length).toBe(3);
  });

  it('should render rows as table rows', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    await element.updateComplete;

    const rows = element.shadowRoot?.querySelectorAll('.row');
    expect(rows?.length).toBe(3);
  });

  // Default values tests
  it('should have correct default property values', () => {
    expect(element.columns).toEqual([]);
    expect(element.rows).toEqual([]);
    expect(element.variant).toBe('default');
    expect(element.size).toBe('medium');
    expect(element.selectable).toBe(false);
    expect(element.multiSelect).toBe(false);
    expect(element.selectedRows).toEqual([]);
    expect(element.sortState).toBe(null);
    expect(element.stickyHeader).toBe(false);
    expect(element.hoverable).toBe(true);
    expect(element.loading).toBe(false);
  });

  // Property tests
  it('should set property: variant', async () => {
    element.variant = 'striped';
    await element.updateComplete;
    expect(element.variant).toBe('striped');
    const table = element.shadowRoot?.querySelector('.table');
    expect(table?.classList.contains('table--striped')).toBe(true);
  });

  it('should set property: size', async () => {
    element.size = 'large';
    await element.updateComplete;
    expect(element.size).toBe('large');
    const table = element.shadowRoot?.querySelector('.table');
    expect(table?.classList.contains('table--large')).toBe(true);
  });

  it('should set property: selectable', async () => {
    element.selectable = true;
    element.columns = sampleColumns;
    element.rows = sampleRows;
    await element.updateComplete;

    const checkboxes = element.shadowRoot?.querySelectorAll(
      'input[type="checkbox"]'
    );
    expect(checkboxes?.length).toBeGreaterThan(0);
  });

  it('should set property: hoverable', async () => {
    element.hoverable = true;
    element.columns = sampleColumns;
    element.rows = sampleRows;
    await element.updateComplete;

    const row = element.shadowRoot?.querySelector('.row');
    expect(row?.classList.contains('row--hoverable')).toBe(true);
  });

  it('should set property: stickyHeader', async () => {
    element.stickyHeader = true;
    await element.updateComplete;

    const table = element.shadowRoot?.querySelector('.table');
    expect(table?.classList.contains('table--sticky-header')).toBe(true);
  });

  it('should set property: loading', async () => {
    element.loading = true;
    element.columns = sampleColumns;
    await element.updateComplete;

    const table = element.shadowRoot?.querySelector('.table');
    expect(table?.classList.contains('table--loading')).toBe(true);
  });

  // CSS Parts tests
  it('should expose all CSS parts for styling', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('[part="table"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="thead"]')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="tbody"]')).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector('[part="header-row"]')
    ).toBeTruthy();
    expect(element.shadowRoot?.querySelector('[part="row"]')).toBeTruthy();
  });

  // Event tests - sorting
  it('should emit bp-sort event when sortable column is clicked', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    await element.updateComplete;

    const sortHandler = vi.fn();
    element.addEventListener('bp-sort', sortHandler);

    const sortableHeader = element.shadowRoot?.querySelector(
      '.header-cell--sortable'
    ) as HTMLElement;
    sortableHeader?.click();

    expect(sortHandler).toHaveBeenCalled();
    expect(sortHandler.mock.calls[0][0].detail.column).toBe('name');
    expect(sortHandler.mock.calls[0][0].detail.direction).toBe('asc');
  });

  it('should emit bp-select event when row is selected', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    await element.updateComplete;

    const selectHandler = vi.fn();
    element.addEventListener('bp-select', selectHandler);

    const row = element.shadowRoot?.querySelector('.row') as HTMLElement;
    row?.click();

    expect(selectHandler).toHaveBeenCalled();
    expect(selectHandler.mock.calls[0][0].detail.selectedRows).toContain(1);
  });

  it('should emit bp-row-click event when row is clicked', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    await element.updateComplete;

    const clickHandler = vi.fn();
    element.addEventListener('bp-row-click', clickHandler);

    const row = element.shadowRoot?.querySelector('.row') as HTMLElement;
    row?.click();

    expect(clickHandler).toHaveBeenCalled();
    expect(clickHandler.mock.calls[0][0].detail.row.id).toBe(1);
  });

  // Slot tests
  it('should render empty slot when no data', async () => {
    element.columns = sampleColumns;
    element.rows = [];
    await element.updateComplete;

    const emptySlot = element.shadowRoot?.querySelector('slot[name="empty"]');
    expect(emptySlot).toBeTruthy();
  });

  it('should render loading slot when loading', async () => {
    element.columns = sampleColumns;
    element.loading = true;
    await element.updateComplete;

    const loadingSlot = element.shadowRoot?.querySelector(
      'slot[name="loading"]'
    );
    expect(loadingSlot).toBeTruthy();
  });

  // Interaction tests - sorting
  it('should cycle sort direction on multiple clicks', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    await element.updateComplete;

    const sortableHeader = element.shadowRoot?.querySelector(
      '.header-cell--sortable'
    ) as HTMLElement;

    // First click - asc
    sortableHeader?.click();
    await element.updateComplete;
    expect(element.sortState?.direction).toBe('asc');

    // Second click - desc
    sortableHeader?.click();
    await element.updateComplete;
    expect(element.sortState?.direction).toBe('desc');

    // Third click - none
    sortableHeader?.click();
    await element.updateComplete;
    expect(element.sortState?.direction).toBe('none');
  });

  it('should sort rows ascending by string column', async () => {
    element.columns = sampleColumns;
    element.rows = [
      { id: 1, name: 'Charlie', email: 'c@test.com', role: 'User' },
      { id: 2, name: 'Alice', email: 'a@test.com', role: 'Admin' },
      { id: 3, name: 'Bob', email: 'b@test.com', role: 'User' },
    ];
    element.sortState = { column: 'name', direction: 'asc' };
    await element.updateComplete;

    const cells = element.shadowRoot?.querySelectorAll(
      '.row .cell:first-of-type'
    );
    expect(cells?.[0].textContent?.trim()).toBe('Alice');
    expect(cells?.[1].textContent?.trim()).toBe('Bob');
    expect(cells?.[2].textContent?.trim()).toBe('Charlie');
  });

  // Interaction tests - selection
  it('should toggle row selection on click', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    await element.updateComplete;

    const row = element.shadowRoot?.querySelector('.row') as HTMLElement;
    row?.click();
    await element.updateComplete;

    expect(element.selectedRows).toContain(1);
    expect(element.shadowRoot?.querySelector('.row--selected')).toBeTruthy();

    // Click again to deselect
    row?.click();
    await element.updateComplete;
    expect(element.selectedRows).not.toContain(1);
  });

  it('should allow multiple selection when multiSelect is true', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    element.multiSelect = true;
    await element.updateComplete;

    const rows = Array.from(
      element.shadowRoot?.querySelectorAll('.row') ?? []
    ) as HTMLElement[];
    rows[0]?.click();
    await element.updateComplete;
    rows[1]?.click();
    await element.updateComplete;

    expect(element.selectedRows).toContain(1);
    expect(element.selectedRows).toContain(2);
  });

  it('should only allow single selection when multiSelect is false', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    element.multiSelect = false;
    await element.updateComplete;

    const rows = Array.from(
      element.shadowRoot?.querySelectorAll('.row') ?? []
    ) as HTMLElement[];
    rows[0]?.click();
    await element.updateComplete;
    rows[1]?.click();
    await element.updateComplete;

    expect(element.selectedRows.length).toBe(1);
    expect(element.selectedRows).toContain(2);
  });

  // Public method tests
  it('should select all rows with selectAll() method', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    element.multiSelect = true;
    await element.updateComplete;

    element.selectAll();
    await element.updateComplete;

    expect(element.selectedRows.length).toBe(3);
  });

  it('should deselect all rows with deselectAll() method', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    element.multiSelect = true;
    element.selectedRows = [1, 2, 3];
    await element.updateComplete;

    element.deselectAll();
    await element.updateComplete;

    expect(element.selectedRows.length).toBe(0);
  });

  it('should clear sort with clearSort() method', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.sortState = { column: 'name', direction: 'asc' };
    await element.updateComplete;

    element.clearSort();
    await element.updateComplete;

    expect(element.sortState).toBe(null);
  });

  // Accessibility tests
  it('should have role="grid" on table element', async () => {
    await element.updateComplete;
    const table = element.shadowRoot?.querySelector('.table');
    expect(table?.getAttribute('role')).toBe('grid');
  });

  it('should have aria-busy when loading', async () => {
    element.loading = true;
    await element.updateComplete;
    const table = element.shadowRoot?.querySelector('.table');
    expect(table?.getAttribute('aria-busy')).toBe('true');
  });

  it('should have aria-sort on sortable header cells', async () => {
    element.columns = sampleColumns;
    element.sortState = { column: 'name', direction: 'asc' };
    await element.updateComplete;

    const sortableHeader = element.shadowRoot?.querySelector(
      '.header-cell--sortable'
    );
    expect(sortableHeader?.getAttribute('aria-sort')).toBe('ascending');
  });

  it('should have aria-selected on selectable rows', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    element.selectedRows = [1];
    await element.updateComplete;

    const selectedRow = element.shadowRoot?.querySelector('.row--selected');
    expect(selectedRow?.getAttribute('aria-selected')).toBe('true');
  });

  it('should have aria-label on select all checkbox', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    element.multiSelect = true;
    await element.updateComplete;

    const selectAllCheckbox = element.shadowRoot?.querySelector(
      'thead input[type="checkbox"]'
    );
    expect(selectAllCheckbox?.getAttribute('aria-label')).toBe(
      'Select all rows'
    );
  });

  it('should have aria-label on row checkboxes', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    await element.updateComplete;

    const rowCheckbox = element.shadowRoot?.querySelector(
      'tbody input[type="checkbox"]'
    );
    expect(rowCheckbox?.getAttribute('aria-label')).toBe('Select row');
  });

  // Custom render function test
  it('should use custom render function for cell content', async () => {
    element.columns = [
      { key: 'name', label: 'Name' },
      {
        key: 'status',
        label: 'Status',
        render: (value) => `Status: ${value}`,
      },
    ];
    element.rows = [{ id: 1, name: 'Test', status: 'Active' }];
    await element.updateComplete;

    const cells = element.shadowRoot?.querySelectorAll('.row .cell');
    expect(cells?.[1].textContent?.trim()).toBe('Status: Active');
  });

  // Property validation tests
  it('should validate variant from attribute', async () => {
    element.setAttribute('variant', 'invalid');
    await element.updateComplete;
    expect(element.variant).toBe('default');
  });

  it('should validate size from attribute', async () => {
    element.setAttribute('size', 'invalid');
    await element.updateComplete;
    expect(element.size).toBe('medium');
  });

  // Keyboard navigation tests
  it('should sort column when Enter is pressed on sortable header', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    await element.updateComplete;

    const sortHandler = vi.fn();
    element.addEventListener('bp-sort', sortHandler);

    const sortableHeader = element.shadowRoot?.querySelector(
      '.header-cell--sortable'
    ) as HTMLElement;
    sortableHeader?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );

    expect(sortHandler).toHaveBeenCalled();
  });

  it('should sort column when Space is pressed on sortable header', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    await element.updateComplete;

    const sortHandler = vi.fn();
    element.addEventListener('bp-sort', sortHandler);

    const sortableHeader = element.shadowRoot?.querySelector(
      '.header-cell--sortable'
    ) as HTMLElement;
    sortableHeader?.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );

    expect(sortHandler).toHaveBeenCalled();
  });

  it('should toggle row selection when Enter is pressed on selectable row', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    await element.updateComplete;

    const row = element.shadowRoot?.querySelector('.row') as HTMLElement;
    row?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    await element.updateComplete;

    expect(element.selectedRows).toContain(1);
  });

  it('should toggle row selection when Space is pressed on selectable row', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    await element.updateComplete;

    const row = element.shadowRoot?.querySelector('.row') as HTMLElement;
    row?.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    await element.updateComplete;

    expect(element.selectedRows).toContain(1);
  });

  // Sort with null/undefined values
  it('should handle sorting with null and undefined values', async () => {
    element.columns = [{ key: 'value', label: 'Value', sortable: true }];
    element.rows = [
      { id: 1, value: 'A' },
      { id: 2, value: null },
      { id: 3, value: undefined },
      { id: 4, value: 'B' },
    ];
    element.sortState = { column: 'value', direction: 'asc' };
    await element.updateComplete;

    const cells = element.shadowRoot?.querySelectorAll('.row .cell');
    // Nulls/undefined should be sorted to end
    expect(cells?.[0].textContent?.trim()).toBe('A');
    expect(cells?.[1].textContent?.trim()).toBe('B');
  });

  // Multi-select mode behavior
  it('should maintain selectedRows when switching multiSelect mode', async () => {
    element.columns = sampleColumns;
    element.rows = sampleRows;
    element.selectable = true;
    element.multiSelect = true;
    element.selectedRows = [1, 2, 3];
    await element.updateComplete;

    // Switching to single-select doesn't auto-clear - developer controls this
    element.multiSelect = false;
    await element.updateComplete;

    // Component maintains the array, but only first selection is enforced on next interaction
    expect(element.selectedRows).toEqual([1, 2, 3]);
  });

  // Column alignment test
  it('should apply column alignment', async () => {
    element.columns = [
      { key: 'left', label: 'Left', align: 'left' },
      { key: 'center', label: 'Center', align: 'center' },
      { key: 'right', label: 'Right', align: 'right' },
    ];
    element.rows = [{ id: 1, left: 'L', center: 'C', right: 'R' }];
    await element.updateComplete;

    const cells = element.shadowRoot?.querySelectorAll('.row .cell');
    expect(cells?.[0].getAttribute('style')).toContain('text-align: left');
    expect(cells?.[1].getAttribute('style')).toContain('text-align: center');
    expect(cells?.[2].getAttribute('style')).toContain('text-align: right');
  });
});
