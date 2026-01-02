import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './spinner.js';

const meta: Meta = {
  title: 'Components/Spinner',
  component: 'bp-spinner',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the spinner',
    },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'error', 'warning', 'inverse', 'neutral'],
      description: 'Visual variant of the spinner',
    },
    label: {
      control: 'text',
      description: 'Accessible label for screen readers',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'primary',
    label: 'Loading...',
  },
  render: (args) => html`
    <bp-spinner
      .size=${args.size}
      .variant=${args.variant}
      .label=${args.label}
    ></bp-spinner>
  `,
};

export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'primary',
    label: 'Loading...',
  },
  render: (args) => html`
    <bp-spinner
      .size=${args.size}
      .variant=${args.variant}
      .label=${args.label}
    ></bp-spinner>
  `,
};

export const Medium: Story = {
  args: {
    size: 'md',
    variant: 'primary',
    label: 'Loading...',
  },
  render: (args) => html`
    <bp-spinner
      .size=${args.size}
      .variant=${args.variant}
      .label=${args.label}
    ></bp-spinner>
  `,
};

export const Large: Story = {
  args: {
    size: 'lg',
    variant: 'primary',
    label: 'Loading...',
  },
  render: (args) => html`
    <bp-spinner
      .size=${args.size}
      .variant=${args.variant}
      .label=${args.label}
    ></bp-spinner>
  `,
};

export const CustomLabel: Story = {
  args: {
    size: 'md',
    variant: 'primary',
    label: 'Processing data...',
  },
  render: (args) => html`
    <bp-spinner
      .size=${args.size}
      .variant=${args.variant}
      .label=${args.label}
    ></bp-spinner>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center;">
      <bp-spinner size="sm" label="Small spinner"></bp-spinner>
      <bp-spinner size="md" label="Medium spinner"></bp-spinner>
      <bp-spinner size="lg" label="Large spinner"></bp-spinner>
    </div>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div
      style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;"
    >
      <div style="text-align: center;">
        <bp-spinner variant="primary" label="Primary"></bp-spinner>
        <div style="margin-top: 8px; font-size: 12px;">Primary</div>
      </div>
      <div style="text-align: center;">
        <bp-spinner variant="success" label="Success"></bp-spinner>
        <div style="margin-top: 8px; font-size: 12px;">Success</div>
      </div>
      <div style="text-align: center;">
        <bp-spinner variant="error" label="Error"></bp-spinner>
        <div style="margin-top: 8px; font-size: 12px;">Error</div>
      </div>
      <div style="text-align: center;">
        <bp-spinner variant="warning" label="Warning"></bp-spinner>
        <div style="margin-top: 8px; font-size: 12px;">Warning</div>
      </div>
      <div style="text-align: center;">
        <bp-spinner variant="neutral" label="Neutral"></bp-spinner>
        <div style="margin-top: 8px; font-size: 12px;">Neutral</div>
      </div>
      <div
        style="text-align: center; background: #333; padding: 16px; border-radius: 4px;"
      >
        <bp-spinner variant="inverse" label="Inverse"></bp-spinner>
        <div style="margin-top: 8px; font-size: 12px; color: white;">
          Inverse
        </div>
      </div>
    </div>
  `,
};
