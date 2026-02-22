import { LitElement, html, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { tableStyles } from './table.style.js';
import { memoizeOne } from '../../utilities/memoize.js';
import { booleanConverter } from '../../utilities/boolean-converter.js';
import { chevronUpSvg } from '../icon/icons/entries/chevron-up.js';
import { chevronDownSvg } from '../icon/icons/entries/chevron-down.js';
import '../icon/icon.js';

export type TableVariant = 'default' | 'striped' | 'bordered';
export type TableSize = 'sm' | 'md' | 'lg';
export type TableSortDirection = 'asc' | 'desc' | 'none';

/**
 * Column definition for the table
 */
export interface TableColumn {
  /** Unique key for the column (matches data property) */
  key: string;
  /** Header label for the column */
  label: string;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Fixed width for the column */
  width?: string;
  /** Custom render function for cell content */
  render?: (value: unknown, row: TableRow) => TemplateResult | string;
}

/**
 * Row data for the table
 */
export interface TableRow {
  /** Unique identifier for the row */
  id: string | number;
  /** Row data keyed by column key */
  [key: string]: unknown;
}

/**
 * Sort state for the table
 */
export interface TableSortState {
  /** Column key being sorted */
  column: string;
  /** Sort direction */
  direction: TableSortDirection;
}

/**
 * A data table component for displaying tabular data with sorting and selection.
 *
 * @element bp-table
 *
 * @property {TableColumn[]} columns - Array of column definitions
 * @property {TableRow[]} rows - Array of row data objects
 * @property {TableVariant} variant - Visual style variant
 * @property {TableSize} size - Size of the table cells
 * @property {boolean} selectable - Whether rows can be selected
 * @property {boolean} multiSelect - Whether multiple rows can be selected
 * @property {(string|number)[]} selectedRows - Array of selected row IDs
 * @property {TableSortState} sortState - Current sort state
 * @property {boolean} stickyHeader - Whether the header sticks on scroll
 * @property {boolean} hoverable - Whether rows highlight on hover
 * @property {boolean} loading - Whether the table is in loading state
 *
 * @fires bp-sort - Fired when a sortable column header is clicked
 * @fires bp-select - Fired when row selection changes
 * @fires bp-row-click - Fired when a row is clicked
 *
 * @slot empty - Content to show when table has no data
 * @slot loading - Content to show when table is loading
 *
 * @csspart table - The table element
 * @csspart thead - The table header section
 * @csspart tbody - The table body section
 * @csspart header-row - A header row
 * @csspart header-cell - A header cell
 * @csspart row - A data row
 * @csspart cell - A data cell
 * @csspart checkbox - Selection checkbox
 * @csspart sort-icon - Sort direction icon
 * @csspart empty-state - Empty state container
 */
@customElement('bp-table')
export class BpTable extends LitElement {
  /** Array of column definitions */
  @property({ type: Array }) declare columns: TableColumn[];

  /** Array of row data objects */
  @property({ type: Array }) declare rows: TableRow[];

  /** Visual style variant */
  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) => {
        const valid: TableVariant[] = ['default', 'striped', 'bordered'];
        return value && valid.includes(value as TableVariant)
          ? (value as TableVariant)
          : 'default';
      },
    },
  })
  declare variant: TableVariant;

  /** Size of the table cells */
  @property({
    type: String,
    reflect: true,
    converter: {
      fromAttribute: (value: string | null) => {
        const valid: TableSize[] = ['sm', 'md', 'lg'];
        return value && valid.includes(value as TableSize)
          ? (value as TableSize)
          : 'md';
      },
    },
  })
  declare size: TableSize;

  /** Whether rows can be selected */
  @property({ type: Boolean, reflect: true }) declare selectable: boolean;

  /** Whether multiple rows can be selected */
  @property({ type: Boolean, reflect: true }) declare multiSelect: boolean;

  /** Array of selected row IDs */
  @property({ type: Array }) declare selectedRows: (string | number)[];

  /** Current sort state */
  @property({ type: Object }) declare sortState: TableSortState | null;

  /** Whether the header sticks on scroll */
  @property({ type: Boolean, reflect: true, attribute: 'sticky-header' })
  declare stickyHeader: boolean;

  /** Whether rows highlight on hover */
  @property({ converter: booleanConverter, reflect: true })
  declare hoverable: boolean;

  /** Whether the table is in loading state */
  @property({ type: Boolean, reflect: true }) declare loading: boolean;

  @state() private allSelected = false;

  /**
   * Properties that only affect visual styling, not rendered structure.
   * Changes to only these properties can skip a full re-render.
   */
  private static readonly VISUAL_ONLY_PROPS = new Set([
    'hoverable',
    'stickyHeader',
  ]);

  static styles = [tableStyles];

  constructor() {
    super();
    this.columns = [];
    this.rows = [];
    this.variant = 'default';
    this.size = 'md';
    this.selectable = false;
    this.multiSelect = false;
    this.selectedRows = [];
    this.sortState = null;
    this.stickyHeader = false;
    this.hoverable = true;
    this.loading = false;
  }

  protected shouldUpdate(changedProperties: PropertyValues): boolean {
    // If all changed properties are visual-only, skip the update.
    // Be conservative: return true if any non-visual property changed.
    for (const key of changedProperties.keys()) {
      if (!BpTable.VISUAL_ONLY_PROPS.has(key as string)) {
        return true;
      }
    }
    // All changes are visual-only — still need to update for CSS class changes
    return true;
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (
      changedProperties.has('selectedRows') ||
      changedProperties.has('rows')
    ) {
      this.allSelected =
        this.rows.length > 0 && this.selectedRows.length === this.rows.length;
    }
  }

  /**
   * Memoized sorted rows computation.
   * Only recomputes when rows or sortState references change.
   */
  private computeSortedRows = memoizeOne(
    (rows: TableRow[], sortState: TableSortState | null): TableRow[] => {
      if (!sortState || sortState.direction === 'none') {
        return rows;
      }

      const { column, direction } = sortState;
      return [...rows].sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        let comparison = 0;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        return direction === 'desc' ? -comparison : comparison;
      });
    }
  );

  /**
   * Get sorted rows based on current sort state (memoized).
   */
  private get sortedRows(): TableRow[] {
    return this.computeSortedRows(this.rows, this.sortState);
  }

  /**
   * Handles click on sortable column header.
   * Cycles through sort directions: asc → desc → none.
   * Manages focus on header after sort completes.
   */
  private handleHeaderClick(column: TableColumn, event: Event) {
    if (!column.sortable) return;

    let direction: TableSortDirection = 'asc';
    if (this.sortState?.column === column.key) {
      if (this.sortState.direction === 'asc') {
        direction = 'desc';
      } else if (this.sortState.direction === 'desc') {
        direction = 'none';
      }
    }

    this.sortState = { column: column.key, direction };
    this.dispatchEvent(
      new CustomEvent('bp-sort', {
        detail: { column: column.key, direction },
        bubbles: true,
        composed: true,
      })
    );

    // Focus management: focus header after sort completes
    this.updateComplete.then(() => {
      (event.target as HTMLElement)?.focus();
    });
  }

  /**
   * Handles click events on table rows.
   * Dispatches bp-row-click event and toggles selection if selectable.
   */
  private handleRowClick(row: TableRow, event: Event) {
    this.dispatchEvent(
      new CustomEvent('bp-row-click', {
        detail: { row, originalEvent: event },
        bubbles: true,
        composed: true,
      })
    );

    if (this.selectable) {
      this.toggleRowSelection(row);
    }
  }

  /**
   * Handles keyboard events on table rows.
   * Triggers selection on Enter or Space key press when selectable.
   */
  private handleRowKeyDown(row: TableRow, event: KeyboardEvent) {
    if (!this.selectable) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleRowSelection(row);
    }
  }

  /**
   * Toggles selection state for a row.
   * Respects multiSelect setting for single vs multiple selection.
   */
  private toggleRowSelection(row: TableRow) {
    const rowId = row.id;
    const isSelected = this.selectedRows.includes(rowId);

    let newSelection: (string | number)[];
    if (this.multiSelect) {
      newSelection = isSelected
        ? this.selectedRows.filter((id) => id !== rowId)
        : [...this.selectedRows, rowId];
    } else {
      newSelection = isSelected ? [] : [rowId];
    }

    this.selectedRows = newSelection;
    this.dispatchEvent(
      new CustomEvent('bp-select', {
        detail: { selectedRows: newSelection, row, selected: !isSelected },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handles select all checkbox toggle.
   * Selects or deselects all rows based on current state.
   */
  private handleSelectAll() {
    if (this.allSelected) {
      this.selectedRows = [];
    } else {
      this.selectedRows = this.rows.map((row) => row.id);
    }
    this.dispatchEvent(
      new CustomEvent('bp-select', {
        detail: {
          selectedRows: this.selectedRows,
          selectAll: !this.allSelected,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handles checkbox click events.
   * Stops propagation only on the checkbox itself to prevent row click.
   */
  private handleCheckboxClick(event: Event, row?: TableRow) {
    // Only stop propagation on the checkbox to prevent triggering row click
    if (event.target instanceof HTMLInputElement) {
      event.stopPropagation();
    }
    if (row) {
      this.toggleRowSelection(row);
    } else {
      this.handleSelectAll();
    }
  }

  /** Select all rows */
  selectAll() {
    this.selectedRows = this.rows.map((row) => row.id);
    this.dispatchEvent(
      new CustomEvent('bp-select', {
        detail: { selectedRows: this.selectedRows, selectAll: true },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Deselect all rows */
  deselectAll() {
    this.selectedRows = [];
    this.dispatchEvent(
      new CustomEvent('bp-select', {
        detail: { selectedRows: [], selectAll: false },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Clear sort state */
  clearSort() {
    this.sortState = null;
  }

  /**
   * Renders the sort icon for sortable columns.
   * Shows chevron-up for ascending, chevron-down for descending, unsorted icon otherwise.
   */
  private renderSortIcon(column: TableColumn) {
    if (!column.sortable) return nothing;

    const isActive = this.sortState?.column === column.key;
    const direction = isActive ? this.sortState?.direction : 'none';

    const iconSvg =
      direction === 'asc'
        ? chevronUpSvg
        : direction === 'desc'
          ? chevronDownSvg
          : chevronUpSvg;

    const iconClasses = {
      'sort-icon': true,
      'sort-icon--active': isActive && direction !== 'none',
      'sort-icon--inactive': direction === 'none',
    };

    return html`
      <span class=${classMap(iconClasses)} part="sort-icon" aria-hidden="true">
        <bp-icon .svg=${iconSvg} size="sm"></bp-icon>
      </span>
    `;
  }

  /**
   * Renders the table header with column labels and sort icons.
   */
  private renderHeader() {
    return html`
      <thead part="thead">
        <tr class="header-row" part="header-row">
          ${this.selectable && this.multiSelect
            ? html`
                <th class="cell cell--checkbox" part="header-cell">
                  <input
                    type="checkbox"
                    part="checkbox"
                    .checked=${this.allSelected}
                    .indeterminate=${this.selectedRows.length > 0 &&
                    !this.allSelected}
                    @click=${(e: Event) => this.handleCheckboxClick(e)}
                    aria-label="Select all rows"
                  />
                </th>
              `
            : this.selectable
              ? html`<th class="cell cell--checkbox" part="header-cell"></th>`
              : nothing}
          ${repeat(
            this.columns,
            (column) => column.key,
            (column) => html`
              <th
                class="cell header-cell ${column.sortable
                  ? 'header-cell--sortable'
                  : ''}"
                part="header-cell"
                style=${column.width ? `width: ${column.width}` : ''}
                @click=${(e: Event) => this.handleHeaderClick(column, e)}
                tabindex=${column.sortable ? 0 : -1}
                @keydown=${(e: KeyboardEvent) => {
                  if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    this.handleHeaderClick(column, e);
                  }
                }}
                aria-sort=${this.sortState?.column === column.key
                  ? this.sortState.direction === 'asc'
                    ? 'ascending'
                    : this.sortState.direction === 'desc'
                      ? 'descending'
                      : 'none'
                  : 'none'}
              >
                <span
                  class="header-cell__content"
                  style="justify-content: ${column.align === 'center'
                    ? 'center'
                    : column.align === 'right'
                      ? 'flex-end'
                      : 'flex-start'}"
                >
                  <span class="header-cell__label">${column.label}</span>
                  ${this.renderSortIcon(column)}
                </span>
              </th>
            `
          )}
        </tr>
      </thead>
    `;
  }

  /**
   * Renders the table body with rows and cells.
   * Handles loading and empty states.
   */
  private renderBody() {
    const sortedRows = this.sortedRows;

    if (this.loading) {
      return html`
        <tbody part="tbody">
          <tr>
            <td
              colspan=${this.columns.length + (this.selectable ? 1 : 0)}
              class="empty-state"
              part="empty-state"
            >
              <slot name="loading">
                <div class="state-content">Loading...</div>
              </slot>
            </td>
          </tr>
        </tbody>
      `;
    }

    if (sortedRows.length === 0) {
      return html`
        <tbody part="tbody">
          <tr>
            <td
              colspan=${this.columns.length + (this.selectable ? 1 : 0)}
              class="empty-state"
              part="empty-state"
            >
              <slot name="empty">
                <div class="state-content">No data available</div>
              </slot>
            </td>
          </tr>
        </tbody>
      `;
    }

    return html`
      <tbody part="tbody">
        ${repeat(
          sortedRows,
          (row) => row.id,
          (row) => {
            const isSelected = this.selectedRows.includes(row.id);
            const rowClasses = {
              row: true,
              'row--selected': isSelected,
              'row--hoverable': this.hoverable,
            };

            return html`
              <tr
                class=${classMap(rowClasses)}
                part="row"
                @click=${(e: Event) => this.handleRowClick(row, e)}
                @keydown=${(e: KeyboardEvent) => this.handleRowKeyDown(row, e)}
                tabindex=${this.selectable ? 0 : -1}
                aria-selected=${ifDefined(
                  this.selectable ? (isSelected ? 'true' : 'false') : undefined
                )}
              >
                ${this.selectable
                  ? html`
                      <td class="cell cell--checkbox" part="cell">
                        <input
                          type="checkbox"
                          part="checkbox"
                          .checked=${isSelected}
                          @click=${(e: Event) =>
                            this.handleCheckboxClick(e, row)}
                          aria-label="Select row"
                        />
                      </td>
                    `
                  : nothing}
                ${repeat(
                  this.columns,
                  (column) => column.key,
                  (column) => {
                    const value = row[column.key];
                    const content = column.render
                      ? column.render(value, row)
                      : value;

                    return html`
                      <td
                        class="cell"
                        part="cell"
                        style="text-align: ${column.align || 'left'}"
                      >
                        ${content}
                      </td>
                    `;
                  }
                )}
              </tr>
            `;
          }
        )}
      </tbody>
    `;
  }

  render() {
    const tableClasses = {
      table: true,
      [`table--${this.variant}`]: true,
      [`table--${this.size}`]: true,
      'table--sticky-header': this.stickyHeader,
      'table--selectable': this.selectable,
      'table--loading': this.loading,
    };

    return html`
      <div class="table-wrapper">
        <table
          class=${classMap(tableClasses)}
          part="table"
          role="grid"
          aria-busy=${this.loading}
        >
          ${this.renderHeader()} ${this.renderBody()}
        </table>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bp-table': BpTable;
  }
}
