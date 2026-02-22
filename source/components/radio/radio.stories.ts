import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './radio.js';

const meta: Meta = {
  title: 'Components/Radio',
  component: 'bp-radio',
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'checked',
    },
    disabled: {
      control: 'boolean',
      description: 'disabled',
    },
    required: {
      control: 'boolean',
      description: 'required',
    },
    name: {
      control: 'text',
      description: 'name',
    },
    value: {
      control: 'text',
      description: 'value',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'size',
    },
    error: {
      control: 'boolean',
      description: 'error',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
    required: false,
    name: '',
    value: '',
    size: 'sm',
    error: false,
  },
  render: (args) => html`
    <bp-radio
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?required=${args.required}
      .name=${args.name}
      .value=${args.value}
      .size=${args.size}
      ?error=${args.error}
    >
      Button Content
    </bp-radio>
  `,
};

export const Sm: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: 'sm',
  },
};
export const Md: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: 'md',
  },
};
export const Lg: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: 'lg',
  },
};
export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const RadioGroup: Story = {
  render: () => html`
    <fieldset style="border: none; padding: 0; margin: 0;">
      <legend style="font-weight: 600; margin-bottom: 12px;">
        Choose your preferred contact method
      </legend>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <bp-radio name="contact" value="email" checked>Email</bp-radio>
        <bp-radio name="contact" value="phone">Phone</bp-radio>
        <bp-radio name="contact" value="sms">SMS</bp-radio>
        <bp-radio name="contact" value="mail">Mail</bp-radio>
      </div>
    </fieldset>
  `,
};

export const ErrorState: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-radio error name="agreement" value="yes"
        >I agree to the terms</bp-radio
      >
      <bp-radio error name="agreement" value="no" checked
        >I do not agree</bp-radio
      >
      <p style="color: var(--bp-color-error); font-size: 14px; margin: 0;">
        You must agree to continue
      </p>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <p style="font-weight: 600; margin: 0 0 4px 0;">Small</p>
        <bp-radio size="sm" name="size-sm" value="1" checked
          >Small radio</bp-radio
        >
        <bp-radio size="sm" name="size-sm" value="2">Another option</bp-radio>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <p style="font-weight: 600; margin: 0 0 4px 0;">Medium (Default)</p>
        <bp-radio size="md" name="size-md" value="1" checked
          >Medium radio</bp-radio
        >
        <bp-radio size="md" name="size-md" value="2">Another option</bp-radio>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <p style="font-weight: 600; margin: 0 0 4px 0;">Large</p>
        <bp-radio size="lg" name="size-lg" value="1" checked
          >Large radio</bp-radio
        >
        <bp-radio size="lg" name="size-lg" value="2">Another option</bp-radio>
      </div>
    </div>
  `,
};

export const Required: Story = {
  render: () => html`
    <form style="display: flex; flex-direction: column; gap: 12px;">
      <fieldset style="border: none; padding: 0; margin: 0;">
        <legend style="font-weight: 600; margin-bottom: 8px;">
          Select a plan *
        </legend>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <bp-radio required name="plan" value="free">Free</bp-radio>
          <bp-radio required name="plan" value="pro">Pro</bp-radio>
          <bp-radio required name="plan" value="enterprise"
            >Enterprise</bp-radio
          >
        </div>
      </fieldset>
      <p style="font-size: 12px; color: var(--bp-color-text-muted); margin: 0;">
        * Required field
      </p>
    </form>
  `,
};

export const HorizontalGroup: Story = {
  render: () => html`
    <fieldset style="border: none; padding: 0; margin: 0;">
      <legend style="font-weight: 600; margin-bottom: 12px;">Rating</legend>
      <div style="display: flex; gap: 16px; align-items: center;">
        <bp-radio name="rating" value="1">1</bp-radio>
        <bp-radio name="rating" value="2">2</bp-radio>
        <bp-radio name="rating" value="3">3</bp-radio>
        <bp-radio name="rating" value="4" checked>4</bp-radio>
        <bp-radio name="rating" value="5">5</bp-radio>
      </div>
    </fieldset>
  `,
};

export const WithDescription: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <bp-radio name="shipping" value="standard" checked>
          Standard Shipping
        </bp-radio>
        <p
          style="margin: 4px 0 0 28px; font-size: 12px; color: var(--bp-color-text-muted);"
        >
          Delivery in 5-7 business days. Free for orders over $50.
        </p>
      </div>
      <div>
        <bp-radio name="shipping" value="express">Express Shipping</bp-radio>
        <p
          style="margin: 4px 0 0 28px; font-size: 12px; color: var(--bp-color-text-muted);"
        >
          Delivery in 2-3 business days. Additional $9.99.
        </p>
      </div>
      <div>
        <bp-radio name="shipping" value="overnight">Overnight</bp-radio>
        <p
          style="margin: 4px 0 0 28px; font-size: 12px; color: var(--bp-color-text-muted);"
        >
          Next business day delivery. Additional $24.99.
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
      <bp-radio size="sm" name="compact" value="1">Compact option 1</bp-radio>
      <bp-radio size="sm" name="compact" value="2">Compact option 2</bp-radio>
      <bp-radio size="sm" name="compact" value="3" checked
        >Compact option 3</bp-radio
      >
      <bp-radio size="sm" name="compact" value="4">Compact option 4</bp-radio>
      <bp-radio size="sm" name="compact" value="5">Compact option 5</bp-radio>
    </div>
  `,
};

export const DisabledStates: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <bp-radio name="disabled-example" value="1" disabled
        >Disabled unchecked</bp-radio
      >
      <bp-radio name="disabled-example" value="2" disabled checked
        >Disabled checked</bp-radio
      >
      <bp-radio name="disabled-example" value="3">Enabled option</bp-radio>
    </div>
  `,
};

export const FormSubmission: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data:', data);
        console.log(`Selected plan: ${data.plan || 'none'}`);
      }}
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <fieldset style="border: none; padding: 0; margin: 0;">
        <legend style="font-weight: 600; margin-bottom: 12px;">
          Choose a subscription plan
        </legend>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <bp-radio name="plan" value="free">Free - $0/month</bp-radio>
          <bp-radio name="plan" value="starter" checked
            >Starter - $9/month</bp-radio
          >
          <bp-radio name="plan" value="pro">Pro - $29/month</bp-radio>
          <bp-radio name="plan" value="enterprise"
            >Enterprise - Contact us</bp-radio
          >
        </div>
      </fieldset>

      <button
        type="submit"
        style="align-self: flex-start; padding: 8px 16px; cursor: pointer;"
      >
        Continue
      </button>

      <p style="font-size: 12px; color: var(--bp-color-text-muted); margin: 0;">
        Check the console to see form submission data
      </p>
    </form>
  `,
};
