import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './tooltip.js';

const meta: Meta = {
  title: 'Components/Tooltip',
  component: 'bp-tooltip',
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'The text content displayed in the tooltip',
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position of tooltip relative to trigger element',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tooltip is disabled',
    },
    delay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Delay in milliseconds before showing tooltip on hover',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip',
    placement: 'top',
    disabled: false,
    delay: 200,
  },
  render: (args) => html`
    <bp-tooltip
      .content=${args.content}
      .placement=${args.placement}
      ?disabled=${args.disabled}
      .delay=${args.delay}
    >
      <button>Hover me</button>
    </bp-tooltip>
  `,
};

export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const AllPlacements: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 48px; padding: 64px; justify-content: center; align-items: center;"
    >
      <bp-tooltip content="Top tooltip" placement="top">
        <button>Top</button>
      </bp-tooltip>
      <bp-tooltip content="Right tooltip" placement="right">
        <button>Right</button>
      </bp-tooltip>
      <bp-tooltip content="Bottom tooltip" placement="bottom">
        <button>Bottom</button>
      </bp-tooltip>
      <bp-tooltip content="Left tooltip" placement="left">
        <button>Left</button>
      </bp-tooltip>
    </div>
  `,
};

export const LongContent: Story = {
  args: {
    content:
      'This is a much longer tooltip that demonstrates the max-width behavior and text wrapping capabilities',
    placement: 'top',
    disabled: false,
    delay: 200,
  },
  render: (args) => html`
    <bp-tooltip
      .content=${args.content}
      .placement=${args.placement}
      ?disabled=${args.disabled}
      .delay=${args.delay}
    >
      <button>Hover for long tooltip</button>
    </bp-tooltip>
  `,
};
