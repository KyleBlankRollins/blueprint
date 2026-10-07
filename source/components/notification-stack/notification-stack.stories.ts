import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './notification-stack.js';
import type { BpNotificationStack } from './notification-stack.js';
import '../button/button.js';

const meta: Meta = {
  title: 'Components/Notification Stack',
  component: 'bp-notification-stack',
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Where the stack sits on screen',
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Most notifications visible at once',
    },
    duration: {
      control: { type: 'number', min: 0, step: 500 },
      description: 'Default auto-dismiss time (ms); errors stay open',
    },
  },
};

export default meta;
type Story = StoryObj;

const stack = () =>
  document.querySelector('#story-stack') as BpNotificationStack;

let count = 0;

export const Default: Story = {
  args: { position: 'bottom-right', max: 3, duration: 5000 },
  render: (args) => html`
    <div style="display: flex; gap: var(--bp-spacing-xs); flex-wrap: wrap;">
      <bp-button @bp-click=${() => stack().notify(`Draft ${++count} saved`)}
        >Info</bp-button
      >
      <bp-button
        variant="secondary"
        @bp-click=${() =>
          stack().notify({
            variant: 'success',
            title: 'Published',
            message: 'Your changes are live.',
          })}
        >Success</bp-button
      >
      <bp-button
        variant="secondary"
        @bp-click=${() =>
          stack().notify({
            variant: 'warning',
            message: 'Your session will expire in 5 minutes.',
          })}
        >Warning</bp-button
      >
      <bp-button
        variant="secondary"
        @bp-click=${() =>
          stack().notify({
            variant: 'error',
            title: 'Upload failed',
            message: 'Failed to connect to server. Please try again.',
          })}
        >Error (stays open)</bp-button
      >
      <bp-button variant="secondary" @bp-click=${() => stack().clear()}
        >Clear all</bp-button
      >
    </div>
    <bp-notification-stack
      id="story-stack"
      position=${args.position}
      .max=${args.max}
      .duration=${args.duration}
    ></bp-notification-stack>
  `,
};

export const WithAction: Story = {
  render: () => html`
    <bp-button
      @bp-click=${() => {
        const n = stack().notify({ message: 'Conversation archived.' });
        const undo = document.createElement('bp-button');
        undo.slot = 'action';
        undo.size = 'sm';
        undo.variant = 'secondary';
        undo.textContent = 'Undo';
        undo.addEventListener('bp-click', () => n.hide());
        n.append(undo);
      }}
      >Archive</bp-button
    >
    <bp-notification-stack id="story-stack"></bp-notification-stack>
  `,
};
