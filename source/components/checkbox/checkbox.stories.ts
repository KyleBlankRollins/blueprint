import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './checkbox.js';
import type { BpCheckbox } from './checkbox.js';

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'bp-checkbox',
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in an indeterminate state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the checkbox',
    },
    error: {
      control: 'boolean',
      description: 'Whether the checkbox has an error state',
    },
    name: {
      control: 'text',
      description: 'The name for form submission',
    },
    value: {
      control: 'text',
      description: 'The value for form submission',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
    size: 'md',
  },
  render: (args) => html`
    <bp-checkbox
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      .size=${args.size}
    >
      Accept terms and conditions
    </bp-checkbox>
  `,
};

export const Checked: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-checkbox>Unchecked</bp-checkbox>
      <bp-checkbox checked>Checked</bp-checkbox>
    </div>
  `,
};

export const Indeterminate: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-checkbox>Unchecked</bp-checkbox>
      <bp-checkbox indeterminate>Indeterminate (partial selection)</bp-checkbox>
      <bp-checkbox checked>Checked</bp-checkbox>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-checkbox size="sm">Small checkbox</bp-checkbox>
      <bp-checkbox size="md">Medium checkbox (default)</bp-checkbox>
      <bp-checkbox size="lg">Large checkbox</bp-checkbox>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-checkbox disabled>Disabled unchecked</bp-checkbox>
      <bp-checkbox checked disabled>Disabled checked</bp-checkbox>
      <bp-checkbox indeterminate disabled>Disabled indeterminate</bp-checkbox>
    </div>
  `,
};

export const ErrorState: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-checkbox error>Unchecked with error</bp-checkbox>
      <bp-checkbox checked error>Checked with error</bp-checkbox>
      <p style="color: var(--bp-color-error); font-size: 14px; margin: 0;">
        You must accept the terms to continue
      </p>
    </div>
  `,
};

export const Required: Story = {
  render: () => html`
    <form>
      <bp-checkbox required name="terms" value="accepted">
        I accept the terms and conditions *
      </bp-checkbox>
      <p
        style="font-size: 12px; color: var(--bp-color-text-muted); margin: 4px 0 0 0;"
      >
        * Required field
      </p>
    </form>
  `,
};

export const FormIntegration: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data:', data);
      }}
      style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;"
    >
      <bp-checkbox name="newsletter" value="yes">
        Subscribe to newsletter
      </bp-checkbox>
      <bp-checkbox name="notifications" value="enabled" checked>
        Enable notifications
      </bp-checkbox>
      <bp-checkbox name="marketing" value="opted-in">
        I agree to receive marketing emails
      </bp-checkbox>

      <button type="submit" style="margin-top: 8px; padding: 8px 16px;">
        Submit
      </button>
    </form>
  `,
};

export const CheckboxGroup: Story = {
  render: () => html`
    <fieldset style="border: none; padding: 0; margin: 0;">
      <legend style="font-weight: 600; margin-bottom: 12px;">
        Select your interests
      </legend>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <bp-checkbox name="interests" value="design">Design</bp-checkbox>
        <bp-checkbox name="interests" value="development" checked>
          Development
        </bp-checkbox>
        <bp-checkbox name="interests" value="marketing">Marketing</bp-checkbox>
        <bp-checkbox name="interests" value="sales">Sales</bp-checkbox>
      </div>
    </fieldset>
  `,
};

export const SelectAllPattern: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <bp-checkbox
        id="select-all"
        @bp-change=${(e: CustomEvent) => {
          const checkboxes =
            document.querySelectorAll<BpCheckbox>('.item-checkbox');
          checkboxes.forEach((cb) => {
            cb.checked = e.detail.checked;
          });
        }}
      >
        Select All
      </bp-checkbox>

      <div
        style="border-left: 2px solid var(--bp-color-border); padding-left: 16px; margin-left: 8px;"
      >
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <bp-checkbox class="item-checkbox">Item 1</bp-checkbox>
          <bp-checkbox class="item-checkbox">Item 2</bp-checkbox>
          <bp-checkbox class="item-checkbox">Item 3</bp-checkbox>
        </div>
      </div>
    </div>
  `,
};

export const WithDescription: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <bp-checkbox name="terms">
          I agree to the Terms and Conditions
        </bp-checkbox>
        <p
          style="margin: 4px 0 0 28px; font-size: 12px; color: var(--bp-color-text-muted);"
        >
          By checking this box, you agree to our terms of service and privacy
          policy.
        </p>
      </div>

      <div>
        <bp-checkbox name="marketing" checked>
          Send me promotional emails
        </bp-checkbox>
        <p
          style="margin: 4px 0 0 28px; font-size: 12px; color: var(--bp-color-text-muted);"
        >
          We'll send you occasional updates about new features and special
          offers.
        </p>
      </div>
    </div>
  `,
};

export const DenseLayout: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: var(--bp-spacing-xs);"
    >
      <bp-checkbox size="sm">Compact option 1</bp-checkbox>
      <bp-checkbox size="sm">Compact option 2</bp-checkbox>
      <bp-checkbox size="sm">Compact option 3</bp-checkbox>
      <bp-checkbox size="sm" checked>Compact option 4</bp-checkbox>
      <bp-checkbox size="sm">Compact option 5</bp-checkbox>
    </div>
  `,
};
