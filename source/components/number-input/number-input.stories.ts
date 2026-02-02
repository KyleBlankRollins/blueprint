import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './number-input.js';

const meta: Meta = {
  title: 'Components/NumberInput',
  component: 'bp-number-input',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Current numeric value',
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value',
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
    },
    step: {
      control: 'number',
      description: 'Increment/decrement step amount',
    },
    name: {
      control: 'text',
      description: 'Form field name',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when empty',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the input is read-only',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning'],
      description: 'Visual variant for validation states',
    },
    message: {
      control: 'text',
      description: 'Helper or error message text',
    },
    precision: {
      control: 'number',
      description: 'Number of decimal places',
    },
    hideButtons: {
      control: 'boolean',
      description: 'Whether to hide increment/decrement buttons',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    value: 0,
    step: 1,
    label: 'Quantity',
    placeholder: 'Enter a number',
  },
  render: (args) => html`
    <bp-number-input
      .value=${args.value}
      .step=${args.step}
      .label=${args.label}
      .placeholder=${args.placeholder}
    ></bp-number-input>
  `,
};

export const WithMinMax: Story = {
  args: {
    value: 5,
    min: 0,
    max: 10,
    step: 1,
    label: 'Rating (0-10)',
  },
  render: (args) => html`
    <bp-number-input
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      .label=${args.label}
    ></bp-number-input>
  `,
};

export const DecimalPrecision: Story = {
  args: {
    value: 1.5,
    min: 0,
    max: 100,
    step: 0.1,
    precision: 2,
    label: 'Price',
  },
  render: (args) => html`
    <bp-number-input
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      .precision=${args.precision}
      .label=${args.label}
    ></bp-number-input>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;"
    >
      <bp-number-input size="sm" label="Small" .value=${10}></bp-number-input>
      <bp-number-input
        size="md"
        label="Medium (default)"
        .value=${20}
      ></bp-number-input>
      <bp-number-input size="lg" label="Large" .value=${30}></bp-number-input>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 300px;"
    >
      <bp-number-input
        variant="default"
        label="Default"
        .value=${0}
      ></bp-number-input>
      <bp-number-input
        variant="success"
        label="Success"
        message="Value is valid"
        .value=${50}
      ></bp-number-input>
      <bp-number-input
        variant="error"
        label="Error"
        message="Value must be positive"
        .value=${-5}
      ></bp-number-input>
      <bp-number-input
        variant="warning"
        label="Warning"
        message="Value is close to limit"
        .value=${95}
      ></bp-number-input>
    </div>
  `,
};

export const Disabled: Story = {
  args: {
    value: 42,
    label: 'Disabled input',
    disabled: true,
  },
  render: (args) => html`
    <bp-number-input
      .value=${args.value}
      .label=${args.label}
      ?disabled=${args.disabled}
    ></bp-number-input>
  `,
};

export const ReadOnly: Story = {
  args: {
    value: 100,
    label: 'Read-only input',
    readonly: true,
  },
  render: (args) => html`
    <bp-number-input
      .value=${args.value}
      .label=${args.label}
      ?readonly=${args.readonly}
    ></bp-number-input>
  `,
};

export const HiddenButtons: Story = {
  args: {
    value: 25,
    label: 'Without buttons',
    hideButtons: true,
  },
  render: (args) => html`
    <bp-number-input
      .value=${args.value}
      .label=${args.label}
      ?hideButtons=${args.hideButtons}
    ></bp-number-input>
  `,
};

export const Required: Story = {
  args: {
    label: 'Required field',
    required: true,
    placeholder: 'This field is required',
  },
  render: (args) => html`
    <bp-number-input
      .label=${args.label}
      ?required=${args.required}
      .placeholder=${args.placeholder}
    ></bp-number-input>
  `,
};
