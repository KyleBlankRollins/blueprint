import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './alert.js';

const meta: Meta = {
  title: 'Components/Alert',
  component: 'bp-alert',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Visual variant indicating the type of alert',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed by the user',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show a default icon for the variant',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'info',
    dismissible: false,
    showIcon: false,
  },
  render: (args) => html`
    <bp-alert
      .variant=${args.variant}
      ?dismissible=${args.dismissible}
      ?showIcon=${args.showIcon}
    >
      This is an informational alert message.
    </bp-alert>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-alert variant="info" showIcon>
        <strong>Info:</strong> Your changes have been saved automatically.
      </bp-alert>
      <bp-alert variant="success" showIcon>
        <strong>Success:</strong> Profile updated successfully!
      </bp-alert>
      <bp-alert variant="warning" showIcon>
        <strong>Warning:</strong> Your session will expire in 5 minutes.
      </bp-alert>
      <bp-alert variant="error" showIcon>
        <strong>Error:</strong> Failed to connect to server. Please try again.
      </bp-alert>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-alert variant="info" showIcon>
        Default info icon appears when showIcon is enabled.
      </bp-alert>
      <bp-alert variant="success" showIcon>
        Success icon indicates positive outcomes.
      </bp-alert>
      <bp-alert variant="warning" showIcon>
        Warning icon alerts users to potential issues.
      </bp-alert>
      <bp-alert variant="error" showIcon>
        Error icon signals critical problems.
      </bp-alert>
    </div>
  `,
};

export const Dismissible: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-alert variant="info" dismissible showIcon>
        This alert can be dismissed by clicking the X button.
      </bp-alert>
      <bp-alert variant="success" dismissible showIcon>
        Dismissible alerts are useful for non-critical notifications.
      </bp-alert>
      <bp-alert
        variant="warning"
        dismissible
        showIcon
        @bp-close=${(e: CustomEvent) =>
          console.log('Alert dismissed:', e.detail)}
      >
        Click the X to dismiss this warning alert.
      </bp-alert>
    </div>
  `,
};

export const WithTitle: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-alert variant="info" showIcon>
        <strong slot="title">System Update Available</strong>
        A new version of the application is ready to install. Update now to get
        the latest features and improvements.
      </bp-alert>
      <bp-alert variant="error" showIcon dismissible>
        <strong slot="title">Payment Failed</strong>
        We couldn't process your payment. Please check your card details and try
        again.
      </bp-alert>
      <bp-alert variant="success" showIcon>
        <strong slot="title">Welcome!</strong>
        Your account has been created successfully. Check your email to verify
        your address.
      </bp-alert>
    </div>
  `,
};

export const CustomIcon: Story = {
  render: () => html`
    <bp-alert variant="warning" showIcon dismissible>
      <svg
        slot="icon"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
      Custom icons can replace the default variant icons using the icon slot.
    </bp-alert>
  `,
};

export const LongContent: Story = {
  render: () => html`
    <bp-alert variant="info" showIcon dismissible>
      <strong slot="title">Important Privacy Update</strong>
      We have updated our privacy policy to provide you with more transparency
      about how we collect, use, and protect your data. This update includes new
      controls for managing your data preferences and enhanced security
      measures. Please review the changes at your earliest convenience. Your
      continued use of our services indicates your acceptance of these updated
      terms.
    </bp-alert>
  `,
};

export const MinimalInfo: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <bp-alert variant="info">Simple info alert without icons.</bp-alert>
      <bp-alert variant="success">Operation completed.</bp-alert>
      <bp-alert variant="warning">Low storage space.</bp-alert>
      <bp-alert variant="error">Connection lost.</bp-alert>
    </div>
  `,
};

export const VisualComparison: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <h3 style="margin: 16px 0 8px 0;">Without Icons</h3>
      <bp-alert variant="info">
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>
      <bp-alert variant="success">
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>
      <bp-alert variant="warning">
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>
      <bp-alert variant="error">
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>

      <h3 style="margin: 16px 0 8px 0;">With Icons</h3>
      <bp-alert variant="info" showIcon>
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>
      <bp-alert variant="success" showIcon>
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>
      <bp-alert variant="warning" showIcon>
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>
      <bp-alert variant="error" showIcon>
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>

      <h3 style="margin: 16px 0 8px 0;">Dismissible with Icons</h3>
      <bp-alert variant="info" showIcon dismissible>
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>
      <bp-alert variant="success" showIcon dismissible>
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>
      <bp-alert variant="warning" showIcon dismissible>
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>
      <bp-alert variant="error" showIcon dismissible>
        This is the same message across all variants to compare visual
        intensity.
      </bp-alert>
    </div>
  `,
};
