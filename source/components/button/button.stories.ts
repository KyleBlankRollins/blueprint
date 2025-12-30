import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './button.js';
import type { ButtonVariant, ButtonSize } from './button.js';

const meta: Meta = {
  title: 'Components/Button',
  component: 'bp-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'error', 'warning', 'info', 'secondary'],
      description: 'Visual variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native button type',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <bp-button
      .variant=${args.variant as ButtonVariant}
      .size=${args.size as ButtonSize}
      ?disabled=${args.disabled}
      .type=${args.type}
    >
      Click me
    </bp-button>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; gap: 12px; align-items: center;">
        <bp-button variant="primary">Primary</bp-button>
        <bp-button variant="success">Success</bp-button>
        <bp-button variant="error">Error</bp-button>
        <bp-button variant="warning">Warning</bp-button>
        <bp-button variant="info">Info</bp-button>
        <bp-button variant="secondary">Secondary</bp-button>
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <bp-button variant="primary" disabled>Primary</bp-button>
        <bp-button variant="success" disabled>Success</bp-button>
        <bp-button variant="error" disabled>Error</bp-button>
        <bp-button variant="warning" disabled>Warning</bp-button>
        <bp-button variant="info" disabled>Info</bp-button>
        <bp-button variant="secondary" disabled>Secondary</bp-button>
      </div>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center;">
      <bp-button size="sm">Small</bp-button>
      <bp-button size="md">Medium</bp-button>
      <bp-button size="lg">Large</bp-button>
    </div>
  `,
};

export const Primary: Story = {
  render: () => html`<bp-button variant="primary">Primary Button</bp-button>`,
};

export const Success: Story = {
  render: () => html`<bp-button variant="success">Success Button</bp-button>`,
};

export const Error: Story = {
  render: () => html`<bp-button variant="error">Error Button</bp-button>`,
};

export const Warning: Story = {
  render: () => html`<bp-button variant="warning">Warning Button</bp-button>`,
};

export const Info: Story = {
  render: () => html`<bp-button variant="info">Info Button</bp-button>`,
};

export const Secondary: Story = {
  render: () => html`
    <bp-button variant="secondary">Secondary Button</bp-button>
  `,
};

export const Small: Story = {
  render: () => html`<bp-button size="sm">Small Button</bp-button>`,
};

export const Medium: Story = {
  render: () => html`<bp-button size="md">Medium Button</bp-button>`,
};

export const Large: Story = {
  render: () => html`<bp-button size="lg">Large Button</bp-button>`,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center;">
      <bp-button variant="primary" disabled>Disabled Primary</bp-button>
      <bp-button variant="secondary" disabled>Disabled Secondary</bp-button>
    </div>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center;">
      <bp-button variant="primary">
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            style="display: block;"
          >
            <path
              d="M8 0L10.472 5.528L16 8L10.472 10.472L8 16L5.528 10.472L0 8L5.528 5.528L8 0Z"
            />
          </svg>
          <span>With Icon</span>
        </span>
      </bp-button>
      <bp-button variant="success">
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            style="display: block;"
          >
            <path
              d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
            />
          </svg>
          <span>Success</span>
        </span>
      </bp-button>
      <bp-button variant="error">
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            style="display: block;"
          >
            <path
              d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
            />
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
          <span>Delete</span>
        </span>
      </bp-button>
    </div>
  `,
};

export const IconOnly: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center;">
      <bp-button
        variant="primary"
        size="sm"
        aria-label="Edit"
        style="padding: 8px;"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          style="display: block;"
        >
          <path
            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
          />
        </svg>
      </bp-button>
      <bp-button variant="success" aria-label="Save" style="padding: 12px;">
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="currentColor"
          style="display: block;"
        >
          <path
            d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
          />
        </svg>
      </bp-button>
      <bp-button
        variant="error"
        size="lg"
        aria-label="Delete"
        style="padding: 16px;"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          fill="currentColor"
          style="display: block;"
        >
          <path
            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
          />
          <path
            fill-rule="evenodd"
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
          />
        </svg>
      </bp-button>
    </div>
  `,
};

export const LongText: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 300px;"
    >
      <bp-button variant="primary">
        This is a button with quite a long label to see how it wraps
      </bp-button>
      <bp-button variant="secondary" size="sm">
        Small button with a very long label that should wrap nicely
      </bp-button>
    </div>
  `,
};

export const ButtonGroup: Story = {
  render: () => html`
    <div style="display: flex; gap: 0;">
      <bp-button
        variant="secondary"
        style="border-top-right-radius: 0; border-bottom-right-radius: 0;"
      >
        Left
      </bp-button>
      <bp-button
        variant="secondary"
        style="border-radius: 0; margin-left: -1px;"
      >
        Center
      </bp-button>
      <bp-button
        variant="secondary"
        style="border-top-left-radius: 0; border-bottom-left-radius: 0; margin-left: -1px;"
      >
        Right
      </bp-button>
    </div>
  `,
};

export const FormButtons: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        console.log('Form submitted!');
      }}
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; padding: 24px; border: 1px solid var(--bp-color-border); border-radius: var(--bp-border-radius-lg);"
    >
      <h3 style="margin: 0 0 8px 0; font-family: var(--bp-font-family-sans);">
        User Registration
      </h3>
      <input
        type="text"
        placeholder="Username"
        style="padding: 8px 12px; border: 1px solid var(--bp-color-border); border-radius: var(--bp-border-radius-md); font-family: var(--bp-font-family-sans);"
      />
      <input
        type="email"
        placeholder="Email"
        style="padding: 8px 12px; border: 1px solid var(--bp-color-border); border-radius: var(--bp-border-radius-md); font-family: var(--bp-font-family-sans);"
      />
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <bp-button type="reset" variant="secondary">Reset</bp-button>
        <bp-button type="submit" variant="primary">Submit</bp-button>
      </div>
    </form>
  `,
};

export const Interactive: Story = {
  render: () => {
    let clickCount = 0;

    return html`
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <bp-button
          variant="primary"
          @bp-click=${() => {
            clickCount++;
            const counter = document.getElementById('click-counter');
            if (counter) {
              counter.textContent = `Clicked ${clickCount} time${clickCount === 1 ? '' : 's'}`;
            }
          }}
        >
          Click me!
        </bp-button>
        <p
          id="click-counter"
          style="margin: 0; font-family: var(--bp-font-family-sans); color: var(--bp-color-text-muted);"
        >
          Not clicked yet
        </p>
      </div>
    `;
  },
};
