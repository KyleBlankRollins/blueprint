import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './progress.js';

const meta: Meta = {
  title: 'Components/Progress',
  component: 'bp-progress',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 5 },
      description: 'Current progress value (0 to max)',
    },
    max: {
      control: { type: 'number', min: 1, max: 500, step: 10 },
      description: 'Maximum value for progress calculation',
    },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'info'],
      description: 'Visual variant of the progress bar',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the progress bar',
    },
    label: {
      control: 'text',
      description: 'Optional label text displayed above progress bar',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show percentage text next to label',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether to show indeterminate loading animation',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    value: 65,
    max: 100,
    variant: 'primary',
    size: 'md',
    label: 'Uploading file',
    showValue: true,
    indeterminate: false,
  },
  render: (args) => html`
    <bp-progress
      .value=${args.value}
      .max=${args.max}
      .variant=${args.variant}
      .size=${args.size}
      .label=${args.label}
      ?showValue=${args.showValue}
      ?indeterminate=${args.indeterminate}
    ></bp-progress>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <bp-progress
        value="75"
        variant="primary"
        label="Primary"
        show-value
      ></bp-progress>
      <bp-progress
        value="100"
        variant="success"
        label="Success"
        show-value
      ></bp-progress>
      <bp-progress
        value="50"
        variant="warning"
        label="Warning"
        show-value
      ></bp-progress>
      <bp-progress
        value="30"
        variant="error"
        label="Error"
        show-value
      ></bp-progress>
      <bp-progress
        value="60"
        variant="info"
        label="Info"
        show-value
      ></bp-progress>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <bp-progress value="50" size="sm" label="Small"></bp-progress>
      <bp-progress value="50" size="md" label="Medium"></bp-progress>
      <bp-progress value="50" size="lg" label="Large"></bp-progress>
    </div>
  `,
};

export const Indeterminate: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <bp-progress indeterminate label="Loading..."></bp-progress>
      <bp-progress
        indeterminate
        variant="success"
        label="Processing"
      ></bp-progress>
      <bp-progress indeterminate size="lg" variant="info"></bp-progress>
    </div>
  `,
};

export const FileUpload: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-progress value="45" label="photo.jpg" show-value></bp-progress>
      <bp-progress
        value="78"
        label="document.pdf"
        show-value
        variant="info"
      ></bp-progress>
      <bp-progress indeterminate label="processing..."></bp-progress>
    </div>
  `,
};

export const DarkBackground: Story = {
  render: () => html`
    <div style="background: #1a1a1a; padding: 32px; border-radius: 8px;">
      <bp-progress
        value="60"
        variant="success"
        label="Dark mode test"
        show-value
      ></bp-progress>
    </div>
  `,
};

export const Completion: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-progress
        value="100"
        label="Completed!"
        show-value
        complete
      ></bp-progress>
      <bp-progress value="95" label="Almost there" show-value></bp-progress>
    </div>
  `,
};
