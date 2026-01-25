import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './notification.js';

const meta: Meta = {
  title: 'Components/Notification',
  component: 'bp-notification',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'The visual style variant of the notification',
    },
    open: {
      control: 'boolean',
      description: 'Whether the notification is visible',
    },
    closable: {
      control: 'boolean',
      description: 'Whether to show a close button',
    },
    duration: {
      control: 'number',
      description: 'Auto-close duration in milliseconds (0 = no auto-close)',
    },
    notificationTitle: {
      control: 'text',
      description: 'The notification title text',
    },
    message: {
      control: 'text',
      description: 'The notification message text',
    },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Position of the notification on screen',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'info',
    open: true,
    closable: true,
    duration: 0,
    notificationTitle: 'Information',
    message: 'This is an informational notification.',
  },
  render: (args) => html`
    <bp-notification
      variant=${args.variant}
      ?open=${args.open}
      ?closable=${args.closable}
      .duration=${args.duration}
      .notificationTitle=${args.notificationTitle}
      .message=${args.message}
    ></bp-notification>
  `,
};

export const Info: Story = {
  render: () => html`
    <bp-notification
      variant="info"
      open
      closable
      notificationTitle="Information"
      message="Your settings have been saved successfully."
    ></bp-notification>
  `,
};

export const Success: Story = {
  render: () => html`
    <bp-notification
      variant="success"
      open
      closable
      notificationTitle="Success"
      message="Your file has been uploaded successfully."
    ></bp-notification>
  `,
};

export const Warning: Story = {
  render: () => html`
    <bp-notification
      variant="warning"
      open
      closable
      notificationTitle="Warning"
      message="Your session will expire in 5 minutes."
    ></bp-notification>
  `,
};

export const Error: Story = {
  render: () => html`
    <bp-notification
      variant="error"
      open
      closable
      notificationTitle="Error"
      message="Failed to save changes. Please try again."
    ></bp-notification>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: 16px; position: relative;"
    >
      <bp-notification
        variant="info"
        open
        closable
        notificationTitle="Information"
        message="This is an informational notification."
        style="position: relative;"
      ></bp-notification>
      <bp-notification
        variant="success"
        open
        closable
        notificationTitle="Success"
        message="Operation completed successfully."
        style="position: relative;"
      ></bp-notification>
      <bp-notification
        variant="warning"
        open
        closable
        notificationTitle="Warning"
        message="Please review your input before continuing."
        style="position: relative;"
      ></bp-notification>
      <bp-notification
        variant="error"
        open
        closable
        notificationTitle="Error"
        message="Something went wrong. Please try again."
        style="position: relative;"
      ></bp-notification>
    </div>
  `,
};

export const WithCustomContent: Story = {
  render: () => html`
    <bp-notification
      variant="success"
      open
      closable
      notificationTitle="File Uploaded"
    >
      <p>
        Your document <strong>report.pdf</strong> has been uploaded
        successfully.
      </p>
      <p style="margin-top: 8px; font-size: 14px; opacity: 0.8;">
        File size: 2.4 MB
      </p>
    </bp-notification>
  `,
};

export const WithActionButton: Story = {
  render: () => html`
    <bp-notification
      variant="warning"
      open
      closable
      notificationTitle="Session Expiring"
      message="Your session will expire in 5 minutes."
    >
      <button
        slot="action"
        style="background: none; border: 1px solid currentColor; padding: 4px 12px; border-radius: 4px; cursor: pointer; color: inherit;"
      >
        Extend Session
      </button>
    </bp-notification>
  `,
};

export const WithCustomIcon: Story = {
  render: () => html`
    <bp-notification
      variant="info"
      open
      closable
      notificationTitle="New Message"
      message="You have received a new message from John."
    >
      <svg
        slot="icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        />
      </svg>
    </bp-notification>
  `,
};

export const NonClosable: Story = {
  render: () => html`
    <bp-notification
      variant="info"
      open
      notificationTitle="Processing"
      message="Please wait while we process your request..."
    ></bp-notification>
  `,
};

export const AutoCloseDemo: Story = {
  render: () => html`
    <div>
      <p style="margin-bottom: 16px;">
        Click the button to show a notification that auto-closes after 3
        seconds:
      </p>
      <button
        @click=${() => {
          const notification = document.getElementById(
            'auto-close-demo'
          ) as HTMLElement & { show: () => void };
          notification?.show();
        }}
        style="padding: 8px 16px; cursor: pointer;"
      >
        Show Notification
      </button>
      <bp-notification
        id="auto-close-demo"
        variant="success"
        closable
        .duration=${3000}
        notificationTitle="Auto-closing Notification"
        message="This notification will close automatically in 3 seconds."
        style="position: relative; margin-top: 16px;"
      ></bp-notification>
    </div>
  `,
};

export const Positions: Story = {
  render: () => html`
    <div
      style="position: relative; height: 400px; border: 1px dashed #ccc; overflow: hidden;"
    >
      <bp-notification
        variant="info"
        open
        closable
        position="top-right"
        notificationTitle="Top Right"
        message="Notification in top-right position"
      ></bp-notification>
      <bp-notification
        variant="success"
        open
        closable
        position="top-left"
        notificationTitle="Top Left"
        message="Notification in top-left position"
      ></bp-notification>
      <bp-notification
        variant="warning"
        open
        closable
        position="bottom-right"
        notificationTitle="Bottom Right"
        message="Notification in bottom-right position"
      ></bp-notification>
      <bp-notification
        variant="error"
        open
        closable
        position="bottom-left"
        notificationTitle="Bottom Left"
        message="Notification in bottom-left position"
      ></bp-notification>
    </div>
  `,
};
