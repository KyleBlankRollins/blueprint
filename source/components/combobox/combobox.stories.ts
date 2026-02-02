import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './combobox.js';

const meta: Meta = {
  title: 'Components/Combobox',
  component: 'bp-combobox',
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the combobox is disabled',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the combobox',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
      description: 'Visual variant for validation states',
    },
    allowCustomValue: {
      control: 'boolean',
      description: 'Allow free-form input',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <bp-combobox placeholder="Select a fruit">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
      <option value="date">Date</option>
      <option value="elderberry">Elderberry</option>
      <option value="fig">Fig</option>
      <option value="grape">Grape</option>
    </bp-combobox>
  `,
};

export const WithPreselectedValue: Story = {
  render: () => html`
    <bp-combobox .value=${'banana'} placeholder="Select a fruit">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
      <option value="date">Date</option>
    </bp-combobox>
  `,
};

export const WithCustomValues: Story = {
  render: () => html`
    <bp-combobox allowCustomValue placeholder="Type or select">
      <option value="preset1">Preset Option 1</option>
      <option value="preset2">Preset Option 2</option>
      <option value="preset3">Preset Option 3</option>
    </bp-combobox>
  `,
};

export const SmallSize: Story = {
  render: () => html`
    <bp-combobox size="sm" placeholder="Small combobox">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </bp-combobox>
  `,
};

export const LargeSize: Story = {
  render: () => html`
    <bp-combobox size="lg" placeholder="Large combobox">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </bp-combobox>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <bp-combobox disabled .value=${'apple'} placeholder="Disabled">
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
    </bp-combobox>
  `,
};

export const SuccessState: Story = {
  render: () => html`
    <bp-combobox
      variant="success"
      .value=${'valid'}
      placeholder="Valid selection"
    >
      <option value="valid">Valid Option</option>
      <option value="other">Other Option</option>
    </bp-combobox>
  `,
};

export const ErrorState: Story = {
  render: () => html`
    <bp-combobox variant="error" placeholder="Required field">
      <option value="opt1">Option 1</option>
      <option value="opt2">Option 2</option>
    </bp-combobox>
  `,
};

export const WarningState: Story = {
  render: () => html`
    <bp-combobox variant="warning" .value=${'warn'} placeholder="Warning state">
      <option value="warn">Warning Option</option>
      <option value="other">Other Option</option>
    </bp-combobox>
  `,
};
