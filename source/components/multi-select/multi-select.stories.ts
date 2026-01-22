import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './multi-select.js';

const meta: Meta = {
  title: 'Components/MultiSelect',
  component: 'bp-multi-select',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'object',
      description: 'Array of selected values',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no values are selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the multi-select is disabled',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the multi-select',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
      description: 'Visual variant for validation states',
    },
    maxSelections: {
      control: 'number',
      description: 'Maximum number of selections allowed (0 = unlimited)',
    },
    clearable: {
      control: 'boolean',
      description: 'Whether to show a clear all button',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <bp-multi-select placeholder="Select options">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
      <option value="date">Date</option>
      <option value="elderberry">Elderberry</option>
    </bp-multi-select>
  `,
};

export const WithPreselectedValues: Story = {
  render: () => html`
    <bp-multi-select .value=${['apple', 'cherry']} placeholder="Fruits">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
      <option value="date">Date</option>
      <option value="elderberry">Elderberry</option>
    </bp-multi-select>
  `,
};

export const MaxSelections: Story = {
  render: () => html`
    <bp-multi-select maxSelections="3" placeholder="Choose up to 3">
      <option value="red">Red</option>
      <option value="blue">Blue</option>
      <option value="green">Green</option>
      <option value="yellow">Yellow</option>
      <option value="purple">Purple</option>
    </bp-multi-select>
  `,
};

export const SmallSize: Story = {
  render: () => html`
    <bp-multi-select size="small" placeholder="Small">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </bp-multi-select>
  `,
};

export const LargeSize: Story = {
  render: () => html`
    <bp-multi-select size="large" placeholder="Large">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </bp-multi-select>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <bp-multi-select
      disabled
      .value=${['apple', 'banana']}
      placeholder="Disabled"
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
    </bp-multi-select>
  `,
};

export const NotClearable: Story = {
  render: () => html`
    <bp-multi-select
      .value=${['apple']}
      .clearable=${false}
      placeholder="Not clearable"
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
    </bp-multi-select>
  `,
};

export const SuccessState: Story = {
  render: () => html`
    <bp-multi-select
      variant="success"
      .value=${['apple', 'banana']}
      placeholder="Valid selection"
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
    </bp-multi-select>
  `,
};

export const ErrorState: Story = {
  render: () => html`
    <bp-multi-select variant="error" placeholder="Required field">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
    </bp-multi-select>
  `,
};

export const WarningState: Story = {
  render: () => html`
    <bp-multi-select
      variant="warning"
      .value=${['apple']}
      placeholder="Limited options"
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
    </bp-multi-select>
  `,
};
