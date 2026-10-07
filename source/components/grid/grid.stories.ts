import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './grid.js';
import '../card/card.js';

const meta: Meta = {
  title: 'Components/Grid',
  component: 'bp-grid',
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'number', min: 1, max: 12 },
      description: 'Fixed number of equal-width columns',
    },
    minColumnWidth: {
      control: 'text',
      description: 'Minimum column width; fits as many columns as possible',
    },
    gap: {
      control: 'select',
      options: ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Space between rows and columns',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Vertical alignment of items within a row',
    },
  },
};

export default meta;
type Story = StoryObj;

const cell = (label: string) => html`
  <div
    style="padding: var(--bp-spacing-md); background: var(--bp-color-surface-subdued); border: var(--bp-border-width) solid var(--bp-color-border); border-radius: var(--bp-border-radius);"
  >
    ${label}
  </div>
`;

export const Default: Story = {
  args: { columns: 3, minColumnWidth: '', gap: 'md', align: 'stretch' },
  render: (args) => html`
    <bp-grid
      columns=${args.columns}
      min-column-width=${args.minColumnWidth}
      gap=${args.gap}
      align=${args.align}
    >
      ${[1, 2, 3, 4, 5, 6].map((n) => cell(`Item ${n}`))}
    </bp-grid>
  `,
};

export const Responsive: Story = {
  render: () => html`
    <p>Resize the canvas: columns are at least 14rem wide.</p>
    <bp-grid min-column-width="14rem" gap="lg">
      ${['Starter', 'Team', 'Business', 'Enterprise'].map(
        (plan) => html`
          <bp-card>
            <strong>${plan}</strong>
            <p>Everything in the plan before, and more.</p>
          </bp-card>
        `
      )}
    </bp-grid>
  `,
};

export const TwelveColumn: Story = {
  render: () => html`
    <bp-grid columns="12" gap="xs">
      ${Array.from({ length: 12 }, (_, i) => cell(String(i + 1)))}
      <div style="grid-column: span 8;">${cell('span 8')}</div>
      <div style="grid-column: span 4;">${cell('span 4')}</div>
    </bp-grid>
  `,
};
