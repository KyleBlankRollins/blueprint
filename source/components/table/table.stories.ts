import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './table.js';
import type { TableColumn, TableRow } from './table.js';

const sampleColumns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', align: 'center' },
  { key: 'status', label: 'Status', align: 'right' },
];

const sampleRows: TableRow[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'User',
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'Diana Ross',
    email: 'diana@example.com',
    role: 'Moderator',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Eve Wilson',
    email: 'eve@example.com',
    role: 'User',
    status: 'Pending',
  },
];

const meta: Meta = {
  title: 'Components/Table',
  component: 'bp-table',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'striped', 'bordered'],
      description: 'Visual variant of the table',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting padding and font size',
    },
    selectable: {
      control: 'boolean',
      description: 'Whether rows can be selected',
    },
    multiSelect: {
      control: 'boolean',
      description: 'Whether multiple rows can be selected',
    },
    hoverable: {
      control: 'boolean',
      description: 'Whether rows highlight on hover',
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Whether the header sticks when scrolling',
    },
    loading: {
      control: 'boolean',
      description: 'Whether to show loading state',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    selectable: false,
    multiSelect: false,
    hoverable: true,
    stickyHeader: false,
    loading: false,
  },
  render: (args) => html`
    <bp-table
      .columns=${sampleColumns}
      .rows=${sampleRows}
      variant=${args.variant}
      size=${args.size}
      ?selectable=${args.selectable}
      ?multiSelect=${args.multiSelect}
      ?hoverable=${args.hoverable}
      ?stickyHeader=${args.stickyHeader}
      ?loading=${args.loading}
    ></bp-table>
  `,
};

export const Striped: Story = {
  args: {
    variant: 'striped',
    size: 'md',
    hoverable: true,
  },
  render: (args) => html`
    <bp-table
      .columns=${sampleColumns}
      .rows=${sampleRows}
      variant=${args.variant}
      size=${args.size}
      ?hoverable=${args.hoverable}
    ></bp-table>
  `,
};

export const Bordered: Story = {
  args: {
    variant: 'bordered',
    size: 'md',
    hoverable: true,
  },
  render: (args) => html`
    <bp-table
      .columns=${sampleColumns}
      .rows=${sampleRows}
      variant=${args.variant}
      size=${args.size}
      ?hoverable=${args.hoverable}
    ></bp-table>
  `,
};

export const Small: Story = {
  args: {
    variant: 'default',
    size: 'sm',
    hoverable: true,
  },
  render: (args) => html`
    <bp-table
      .columns=${sampleColumns}
      .rows=${sampleRows}
      variant=${args.variant}
      size=${args.size}
      ?hoverable=${args.hoverable}
    ></bp-table>
  `,
};

export const Large: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    hoverable: true,
  },
  render: (args) => html`
    <bp-table
      .columns=${sampleColumns}
      .rows=${sampleRows}
      variant=${args.variant}
      size=${args.size}
      ?hoverable=${args.hoverable}
    ></bp-table>
  `,
};

export const Selectable: Story = {
  args: {
    variant: 'default',
    size: 'md',
    selectable: true,
    multiSelect: false,
    hoverable: true,
  },
  render: (args) => html`
    <bp-table
      .columns=${sampleColumns}
      .rows=${sampleRows}
      variant=${args.variant}
      size=${args.size}
      ?selectable=${args.selectable}
      ?multiSelect=${args.multiSelect}
      ?hoverable=${args.hoverable}
      @bp-select=${(e: CustomEvent) => console.log('Selected:', e.detail)}
    ></bp-table>
  `,
};

export const MultiSelect: Story = {
  args: {
    variant: 'default',
    size: 'md',
    selectable: true,
    multiSelect: true,
    hoverable: true,
  },
  render: (args) => html`
    <bp-table
      .columns=${sampleColumns}
      .rows=${sampleRows}
      variant=${args.variant}
      size=${args.size}
      ?selectable=${args.selectable}
      ?multiSelect=${args.multiSelect}
      ?hoverable=${args.hoverable}
      @bp-select=${(e: CustomEvent) => console.log('Selected:', e.detail)}
    ></bp-table>
  `,
};

export const Sortable: Story = {
  render: () => {
    const sortableColumns: TableColumn[] = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'role', label: 'Role', sortable: true, align: 'center' },
      { key: 'status', label: 'Status', align: 'right' },
    ];

    return html`
      <bp-table
        .columns=${sortableColumns}
        .rows=${sampleRows}
        hoverable
        @bp-sort=${(e: CustomEvent) => console.log('Sort:', e.detail)}
      ></bp-table>
    `;
  },
};

export const StickyHeader: Story = {
  render: () => html`
    <div style="height: 200px; overflow: auto;">
      <bp-table
        .columns=${sampleColumns}
        .rows=${[...sampleRows, ...sampleRows, ...sampleRows]}
        stickyHeader
        hoverable
      ></bp-table>
    </div>
  `,
};

export const Loading: Story = {
  args: {
    variant: 'default',
    size: 'md',
    loading: true,
  },
  render: (args) => html`
    <bp-table
      .columns=${sampleColumns}
      .rows=${sampleRows}
      variant=${args.variant}
      size=${args.size}
      ?loading=${args.loading}
    >
      <div slot="loading" style="text-align: center; padding: 1rem;">
        Loading data...
      </div>
    </bp-table>
  `,
};

export const EmptyState: Story = {
  render: () => html`
    <bp-table .columns=${sampleColumns} .rows=${[]}>
      <div
        slot="empty"
        style="text-align: center; padding: 2rem; color: var(--bp-color-text-muted);"
      >
        No data available
      </div>
    </bp-table>
  `,
};

export const CustomRender: Story = {
  render: () => {
    const customColumns: TableColumn[] = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email' },
      {
        key: 'status',
        label: 'Status',
        render: (value) => {
          const color =
            value === 'Active'
              ? 'green'
              : value === 'Inactive'
                ? 'red'
                : 'orange';
          return `<span style="color: ${color}; font-weight: 600;">${value}</span>`;
        },
      },
    ];

    return html`
      <bp-table
        .columns=${customColumns}
        .rows=${sampleRows}
        hoverable
      ></bp-table>
    `;
  },
};
