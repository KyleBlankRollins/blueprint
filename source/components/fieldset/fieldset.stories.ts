import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './fieldset.js';
import '../input/input.js';
import '../checkbox/checkbox.js';
import '../button/button.js';

const meta: Meta = {
  title: 'Components/Fieldset',
  component: 'bp-fieldset',
  tags: ['autodocs'],
  argTypes: {
    legend: {
      control: 'text',
      description: 'Group name, rendered as the legend',
    },
    description: {
      control: 'text',
      description: 'Helper text linked to the group',
    },
    errorMessage: { control: 'text', description: 'Group-level error message' },
    required: {
      control: 'boolean',
      description: 'Adds an asterisk to the legend',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every control inside',
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Stack controls or lay them out in a row',
    },
  },
  args: {
    legend: 'Shipping address',
    description: 'We only ship within the EU.',
    errorMessage: '',
    required: false,
    disabled: false,
    orientation: 'vertical',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <bp-fieldset
      .legend=${args.legend}
      .description=${args.description}
      .errorMessage=${args.errorMessage}
      ?required=${args.required}
      ?disabled=${args.disabled}
      orientation=${args.orientation}
    >
      <bp-input label="Street" name="street"></bp-input>
      <bp-input label="City" name="city"></bp-input>
      <bp-input label="Postal code" name="postal"></bp-input>
    </bp-fieldset>
  `,
};

export const CheckboxGroup: Story = {
  render: () => html`
    <bp-fieldset
      legend="Notifications"
      description="Choose how we contact you."
      orientation="horizontal"
    >
      <bp-checkbox name="notify" value="email" checked>Email</bp-checkbox>
      <bp-checkbox name="notify" value="sms">SMS</bp-checkbox>
      <bp-checkbox name="notify" value="push">Push</bp-checkbox>
    </bp-fieldset>
  `,
};

export const WithError: Story = {
  render: () => html`
    <bp-fieldset
      legend="Notifications"
      required
      errorMessage="Choose at least one channel."
    >
      <bp-checkbox name="notify" value="email">Email</bp-checkbox>
      <bp-checkbox name="notify" value="sms">SMS</bp-checkbox>
    </bp-fieldset>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <bp-fieldset legend="Billing" disabled>
      <bp-input label="Card number" name="card"></bp-input>
      <bp-checkbox name="save" checked>Save card</bp-checkbox>
      <bp-button>Pay</bp-button>
    </bp-fieldset>
  `,
};
