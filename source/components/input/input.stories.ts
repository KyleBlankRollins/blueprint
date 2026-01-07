import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './input.js';
import type { InputVariant, InputSize, InputType } from './input.js';

const meta: Meta = {
  title: 'Components/Input',
  component: 'bp-input',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
      description: 'Visual variant of the input',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
    },
    value: {
      control: 'text',
      description: 'Input value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (only shown when variant is error)',
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
      description: 'Whether the input is readonly',
    },
  },
  args: {
    variant: 'default',
    size: 'md',
    type: 'text',
    value: '',
    placeholder: '',
    label: '',
    helperText: '',
    errorMessage: '',
    disabled: false,
    required: false,
    readonly: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <bp-input
      .variant=${args.variant as InputVariant}
      .size=${args.size as InputSize}
      .type=${args.type as InputType}
      .value=${args.value}
      .placeholder=${args.placeholder}
      .label=${args.label}
      .helperText=${args.helperText}
      .errorMessage=${args.errorMessage}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?readonly=${args.readonly}
    ></bp-input>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;"
    >
      <bp-input
        variant="default"
        label="Default"
        placeholder="Enter text..."
        helperText="This is the default variant"
      ></bp-input>

      <bp-input
        variant="success"
        label="Success"
        value="john@example.com"
        helperText="Email is valid"
      ></bp-input>

      <bp-input
        variant="error"
        label="Error"
        value="invalid-email"
        errorMessage="Please enter a valid email address"
      ></bp-input>

      <bp-input
        variant="warning"
        label="Warning"
        value="Password123"
        helperText="Password is weak, consider adding special characters"
      ></bp-input>

      <bp-input
        variant="info"
        label="Info"
        placeholder="Optional field"
        helperText="This field is optional but recommended"
      ></bp-input>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <bp-input size="sm" label="Small" placeholder="Small input"></bp-input>

      <bp-input
        size="md"
        label="Medium (default)"
        placeholder="Medium input"
      ></bp-input>

      <bp-input size="lg" label="Large" placeholder="Large input"></bp-input>
    </div>
  `,
};

export const WithLabel: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <bp-input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        helperText="We'll never share your email"
      ></bp-input>
    </div>
  `,
};

export const Required: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <bp-input
        label="Username"
        required
        placeholder="Enter username"
        helperText="Username is required"
      ></bp-input>
    </div>
  `,
};

export const WithError: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <bp-input
        variant="error"
        label="Email"
        type="email"
        value="invalid@"
        errorMessage="Please enter a valid email address"
        required
      ></bp-input>
    </div>
  `,
};

export const WithSuccess: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <bp-input
        variant="success"
        label="Username"
        value="john_doe"
        helperText="Username is available"
      ></bp-input>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <bp-input
        label="Disabled empty"
        disabled
        placeholder="This input is disabled"
      ></bp-input>

      <bp-input
        label="Disabled with value"
        value="Cannot edit this"
        disabled
      ></bp-input>
    </div>
  `,
};

export const Readonly: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <bp-input
        label="Read-only field"
        value="This field is read-only"
        readonly
        helperText="You cannot modify this field"
      ></bp-input>
    </div>
  `,
};

export const InputTypes: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;"
    >
      <bp-input type="text" label="Text" placeholder="Enter text"></bp-input>

      <bp-input
        type="email"
        label="Email"
        placeholder="you@example.com"
        autocomplete="email"
      ></bp-input>

      <bp-input
        type="password"
        label="Password"
        placeholder="Enter password"
        autocomplete="current-password"
      ></bp-input>

      <bp-input
        type="number"
        label="Number"
        placeholder="Enter number"
        .min=${0}
        .max=${100}
        .step=${5}
      ></bp-input>

      <bp-input
        type="tel"
        label="Phone"
        placeholder="+1 (555) 000-0000"
        autocomplete="tel"
      ></bp-input>

      <bp-input
        type="url"
        label="Website"
        placeholder="https://example.com"
        autocomplete="url"
      ></bp-input>

      <bp-input type="search" label="Search" placeholder="Search..."></bp-input>
    </div>
  `,
};

export const LoginForm: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        console.log('Form submitted');
      }}
      style="display: flex; flex-direction: column; gap: 20px; max-width: 400px; padding: 32px; border: 1px solid var(--bp-color-border); border-radius: var(--bp-border-radius-lg);"
    >
      <h3
        style="margin: 0 0 8px 0; font-family: var(--bp-font-family); font-size: var(--bp-font-size-xl);"
      >
        Sign In
      </h3>

      <bp-input
        type="email"
        label="Email"
        placeholder="you@example.com"
        autocomplete="email"
        required
        name="email"
      ></bp-input>

      <bp-input
        type="password"
        label="Password"
        placeholder="Enter your password"
        autocomplete="current-password"
        required
        name="password"
      ></bp-input>

      <button
        type="submit"
        style="padding: 12px 24px; background: var(--bp-color-primary); color: white; border: none; border-radius: var(--bp-border-radius-md); font-family: var(--bp-font-family); font-size: var(--bp-font-size-base); cursor: pointer;"
      >
        Sign In
      </button>
    </form>
  `,
};

export const RegistrationForm: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        console.log('Registration submitted');
      }}
      style="display: flex; flex-direction: column; gap: 20px; max-width: 400px; padding: 32px; border: 1px solid var(--bp-color-border); border-radius: var(--bp-border-radius-lg);"
    >
      <h3
        style="margin: 0 0 8px 0; font-family: var(--bp-font-family); font-size: var(--bp-font-size-xl);"
      >
        Create Account
      </h3>

      <bp-input
        label="Full Name"
        placeholder="John Doe"
        autocomplete="name"
        required
      ></bp-input>

      <bp-input
        type="email"
        label="Email"
        placeholder="you@example.com"
        autocomplete="email"
        required
      ></bp-input>

      <bp-input
        type="tel"
        label="Phone"
        placeholder="+1 (555) 000-0000"
        autocomplete="tel"
        helperText="Optional but recommended for account recovery"
      ></bp-input>

      <bp-input
        type="password"
        label="Password"
        placeholder="Create a strong password"
        autocomplete="new-password"
        required
        .minlength=${8}
      ></bp-input>

      <button
        type="submit"
        style="padding: 12px 24px; background: var(--bp-color-primary); color: white; border: none; border-radius: var(--bp-border-radius-md); font-family: var(--bp-font-family); font-size: var(--bp-font-size-base); cursor: pointer;"
      >
        Create Account
      </button>
    </form>
  `,
};

export const NumberInput: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <bp-input
        type="number"
        label="Quantity"
        value="1"
        .min=${1}
        .max=${10}
        .step=${1}
        helperText="Min: 1, Max: 10"
      ></bp-input>

      <bp-input
        type="number"
        label="Price"
        value="19.99"
        .min=${0}
        .step=${0.01}
        inputmode="decimal"
        helperText="Enter amount in USD"
      ></bp-input>

      <bp-input
        type="number"
        label="Age"
        .min=${0}
        .max=${120}
        placeholder="Enter your age"
      ></bp-input>
    </div>
  `,
};

export const WithPattern: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <bp-input
        label="Username"
        pattern="[a-zA-Z0-9_]+"
        placeholder="alphanumeric_only"
        helperText="Only letters, numbers, and underscores allowed"
      ></bp-input>

      <bp-input
        label="Zip Code"
        pattern="[0-9]{5}"
        placeholder="12345"
        .maxlength=${5}
        helperText="5-digit US zip code"
      ></bp-input>

      <bp-input
        label="Hex Color"
        pattern="#[0-9A-Fa-f]{6}"
        placeholder="#ff5733"
        helperText="Format: #RRGGBB"
      ></bp-input>
    </div>
  `,
};

export const CharacterLimit: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <bp-input
        label="Tweet"
        .maxlength=${280}
        placeholder="What's happening?"
        helperText="Maximum 280 characters"
      ></bp-input>

      <bp-input
        label="Short bio"
        .minlength=${10}
        .maxlength=${100}
        placeholder="Tell us about yourself"
        helperText="Between 10 and 100 characters"
      ></bp-input>
    </div>
  `,
};

export const SearchInput: Story = {
  render: () => html`
    <div style="max-width: 600px;">
      <bp-input
        type="search"
        size="lg"
        placeholder="Search documentation..."
        autocomplete="off"
        @bp-input=${(e: CustomEvent) => {
          console.log('Search query:', e.detail.value);
        }}
      ></bp-input>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => {
    let charCount = 0;
    const maxChars = 50;

    return html`
      <div style="max-width: 400px;">
        <bp-input
          label="Character counter"
          .maxlength=${maxChars}
          placeholder="Type something..."
          @bp-input=${(e: CustomEvent) => {
            charCount = e.detail.value.length;
            const counter = document.getElementById('char-count');
            if (counter) {
              counter.textContent = `${charCount}/${maxChars}`;
              counter.style.color =
                charCount > maxChars * 0.9
                  ? 'var(--bp-color-danger)'
                  : 'var(--bp-color-text-muted)';
            }
          }}
        ></bp-input>
        <p
          id="char-count"
          style="margin: 8px 0 0 0; font-family: var(--bp-font-family); font-size: var(--bp-font-size-sm); color: var(--bp-color-text-muted); text-align: right;"
        >
          0/${maxChars}
        </p>
      </div>
    `;
  },
};
