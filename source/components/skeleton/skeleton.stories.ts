import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './skeleton.js';

const meta: Meta = {
  title: 'Components/Skeleton',
  component: 'bp-skeleton',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'rounded'],
      description: 'The visual variant of the skeleton',
    },
    width: {
      control: 'text',
      description: 'Width of the skeleton (any CSS value)',
    },
    height: {
      control: 'text',
      description: 'Height of the skeleton (any CSS value)',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to animate with shimmer effect',
    },
    lines: {
      control: 'number',
      description: 'Number of lines (text variant only)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size preset',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'text',
    width: '',
    height: '',
    animated: true,
    lines: 1,
    size: 'md',
  },
  render: (args) => html`
    <bp-skeleton
      .variant=${args.variant}
      .width=${args.width}
      .height=${args.height}
      ?animated=${args.animated}
      .lines=${args.lines}
      .size=${args.size}
    ></bp-skeleton>
  `,
};

export const TextVariant: Story = {
  args: {
    ...Default.args,
    variant: 'text',
    width: '300px',
  },
  render: (args) => html`
    <bp-skeleton .variant=${args.variant} .width=${args.width}></bp-skeleton>
  `,
};

export const MultiLineText: Story = {
  args: {
    ...Default.args,
    variant: 'text',
    lines: 4,
    width: '400px',
  },
  render: (args) => html`
    <bp-skeleton
      .variant=${args.variant}
      .lines=${args.lines}
      .width=${args.width}
    ></bp-skeleton>
  `,
};

export const Circular: Story = {
  args: {
    ...Default.args,
    variant: 'circular',
    size: 'lg',
  },
  render: (args) => html`
    <bp-skeleton .variant=${args.variant} .size=${args.size}></bp-skeleton>
  `,
};

export const Rectangular: Story = {
  args: {
    ...Default.args,
    variant: 'rectangular',
    width: '200px',
    height: '150px',
  },
  render: (args) => html`
    <bp-skeleton
      .variant=${args.variant}
      .width=${args.width}
      .height=${args.height}
    ></bp-skeleton>
  `,
};

export const Rounded: Story = {
  args: {
    ...Default.args,
    variant: 'rounded',
    width: '200px',
    height: '100px',
  },
  render: (args) => html`
    <bp-skeleton
      .variant=${args.variant}
      .width=${args.width}
      .height=${args.height}
    ></bp-skeleton>
  `,
};

export const NotAnimated: Story = {
  args: {
    ...Default.args,
    animated: false,
    width: '200px',
  },
  render: (args) => html`
    <bp-skeleton
      .variant=${args.variant}
      ?animated=${args.animated}
      .width=${args.width}
    ></bp-skeleton>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; width: 300px;"
    >
      <div>
        <p style="margin: 0 0 8px; font-size: 14px; color: #666;">Small</p>
        <bp-skeleton variant="text" size="sm"></bp-skeleton>
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 14px; color: #666;">Medium</p>
        <bp-skeleton variant="text" size="md"></bp-skeleton>
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 14px; color: #666;">Large</p>
        <bp-skeleton variant="text" size="lg"></bp-skeleton>
      </div>
    </div>
  `,
};

export const CircularSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <bp-skeleton variant="circular" size="sm"></bp-skeleton>
      <bp-skeleton variant="circular" size="md"></bp-skeleton>
      <bp-skeleton variant="circular" size="lg"></bp-skeleton>
    </div>
  `,
};

export const CardPlaceholder: Story = {
  render: () => html`
    <div
      style="width: 300px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;"
    >
      <div style="display: flex; gap: 12px; margin-bottom: 16px;">
        <bp-skeleton variant="circular" size="md"></bp-skeleton>
        <div style="flex: 1;">
          <bp-skeleton
            variant="text"
            size="md"
            width="120px"
            style="margin-bottom: 8px;"
          ></bp-skeleton>
          <bp-skeleton variant="text" size="sm" width="80px"></bp-skeleton>
        </div>
      </div>
      <bp-skeleton
        variant="rectangular"
        width="100%"
        height="150px"
        style="margin-bottom: 16px;"
      ></bp-skeleton>
      <bp-skeleton variant="text" lines="3"></bp-skeleton>
    </div>
  `,
};

export const ListPlaceholder: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; width: 400px;"
    >
      ${[1, 2, 3].map(
        () => html`
          <div style="display: flex; gap: 12px; align-items: center;">
            <bp-skeleton variant="circular" size="md"></bp-skeleton>
            <div style="flex: 1;">
              <bp-skeleton
                variant="text"
                size="md"
                style="margin-bottom: 4px;"
              ></bp-skeleton>
              <bp-skeleton
                variant="text"
                size="sm"
                width="60%"
              ></bp-skeleton>
            </div>
          </div>
        `
      )}
    </div>
  `,
};
