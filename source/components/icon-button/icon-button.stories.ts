import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './icon-button.js';
import '../tooltip/tooltip.js';

const VARIANTS = [
  'ghost',
  'secondary',
  'primary',
  'success',
  'error',
  'warning',
  'info',
];

const meta: Meta = {
  title: 'Components/Icon Button',
  component: 'bp-icon-button',
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text', description: 'Built-in icon name' },
    label: { control: 'text', description: 'Accessible name (required)' },
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['square', 'circle'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    icon: 'cross',
    label: 'Close',
    variant: 'ghost',
    size: 'md',
    shape: 'square',
    disabled: false,
  },
  render: (args) => html`
    <bp-icon-button
      icon=${args.icon}
      label=${args.label}
      variant=${args.variant}
      size=${args.size}
      shape=${args.shape}
      ?disabled=${args.disabled}
    ></bp-icon-button>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; gap: var(--bp-spacing-xs);">
      ${VARIANTS.map(
        (v) =>
          html`<bp-icon-button
            icon="settings"
            label="Settings (${v})"
            variant=${v}
          ></bp-icon-button>`
      )}
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: var(--bp-spacing-xs); align-items: center;">
      <bp-icon-button
        icon="trash"
        label="Delete"
        variant="secondary"
        size="sm"
      ></bp-icon-button>
      <bp-icon-button
        icon="trash"
        label="Delete"
        variant="secondary"
        size="md"
      ></bp-icon-button>
      <bp-icon-button
        icon="trash"
        label="Delete"
        variant="secondary"
        size="lg"
      ></bp-icon-button>
      <bp-icon-button
        icon="plus"
        label="Add"
        variant="primary"
        shape="circle"
        size="lg"
      ></bp-icon-button>
    </div>
  `,
};

export const WithTooltip: Story = {
  render: () => html`
    <bp-tooltip content="Copy link">
      <bp-icon-button icon="link" label="Copy link"></bp-icon-button>
    </bp-tooltip>
  `,
};
