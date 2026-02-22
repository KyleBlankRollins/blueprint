import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './switch.js';

const meta: Meta = {
  title: 'Components/Switch',
  component: 'bp-switch',
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is in the on position',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the switch is required',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the switch',
    },
    error: {
      control: 'boolean',
      description: 'Whether the switch has an error state',
    },
    name: {
      control: 'text',
      description: 'The name attribute for form submission',
    },
    value: {
      control: 'text',
      description: 'The value attribute for form submission',
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
    <bp-switch
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      ?required=${args.required}
      ?error=${args.error}
      size=${args.size || 'md'}
      name=${args.name || ''}
      value=${args.value || 'on'}
    >
      Enable notifications
    </bp-switch>
  `,
};

export const Checked: Story = {
  render: () => html` <bp-switch checked>Enabled by default</bp-switch> `,
};

export const Unchecked: Story = {
  render: () => html` <bp-switch>Disabled by default</bp-switch> `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-switch size="sm">Small switch</bp-switch>
      <bp-switch size="md">Medium switch (default)</bp-switch>
      <bp-switch size="lg">Large switch</bp-switch>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-switch disabled>Disabled (off)</bp-switch>
      <bp-switch checked disabled>Disabled (on)</bp-switch>
    </div>
  `,
};

export const ErrorState: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <bp-switch error required>You must enable this option</bp-switch>
      <p style="color: var(--bp-color-error); font-size: 14px; margin: 0;">
        This setting is required
      </p>
    </div>
  `,
};

export const Required: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <bp-switch required>Accept terms and conditions *</bp-switch>
      <p style="font-size: 14px; color: var(--bp-color-text); margin: 0;">
        * Required field
      </p>
    </div>
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
      <bp-switch name="newsletter" value="yes" checked>
        Subscribe to newsletter
      </bp-switch>

      <bp-switch name="notifications" value="enabled">
        Enable push notifications
      </bp-switch>

      <bp-switch name="marketing" value="yes">
        Receive marketing emails
      </bp-switch>

      <button
        type="submit"
        style="padding: 8px 16px; background: var(--bp-color-primary); color: var(--bp-color-text-inverse); border: none; border-radius: 4px; cursor: pointer;"
      >
        Save Preferences
      </button>
    </form>
  `,
};

export const SwitchGroup: Story = {
  render: () => html`
    <fieldset
      style="border: 1px solid var(--bp-color-border); padding: 16px; border-radius: 4px;"
    >
      <legend style="font-weight: 600; padding: 0 8px;">
        Privacy Settings
      </legend>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <bp-switch name="privacy" value="profile-visible" checked>
          Make profile public
        </bp-switch>
        <bp-switch name="privacy" value="show-email">
          Show email address
        </bp-switch>
        <bp-switch name="privacy" value="allow-messages" checked>
          Allow direct messages
        </bp-switch>
      </div>
    </fieldset>
  `,
};

export const WithDescription: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <bp-switch checked>Enable two-factor authentication</bp-switch>
        <p
          style="font-size: 14px; color: var(--bp-color-text); margin: 4px 0 0 0; opacity: 0.7;"
        >
          Add an extra layer of security to your account
        </p>
      </div>

      <div>
        <bp-switch>Automatically save drafts</bp-switch>
        <p
          style="font-size: 14px; color: var(--bp-color-text); margin: 4px 0 0 0; opacity: 0.7;"
        >
          Save your work automatically every 30 seconds
        </p>
      </div>

      <div>
        <bp-switch checked>Dark mode</bp-switch>
        <p
          style="font-size: 14px; color: var(--bp-color-text); margin: 4px 0 0 0; opacity: 0.7;"
        >
          Use dark theme across the application
        </p>
      </div>
    </div>
  `,
};

export const Interactive: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-switch
        @bp-change=${(e: CustomEvent) => {
          console.log('Switch changed:', e.detail.checked);
        }}
        @bp-focus=${() => {
          console.log('Switch focused');
        }}
        @bp-blur=${() => {
          console.log('Switch blurred');
        }}
      >
        Toggle to see events in console
      </bp-switch>
    </div>
  `,
};
