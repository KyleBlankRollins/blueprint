import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './card.js';

const meta: Meta = {
  title: 'Components/Card',
  component: 'bp-card',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
      description: 'Visual variant of the card',
    },
    hoverable: {
      control: 'boolean',
      description: 'Whether the card should display a hover effect',
    },
    clickable: {
      control: 'boolean',
      description:
        'Whether the card is clickable (shows pointer cursor and emits click events)',
    },
    noPadding: {
      control: 'boolean',
      description: 'Whether to remove default padding from the card body',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'default',
    hoverable: false,
    clickable: false,
    noPadding: false,
  },
  render: (args) => html`
    <bp-card
      .variant=${args.variant}
      ?hoverable=${args.hoverable}
      ?clickable=${args.clickable}
      ?noPadding=${args.noPadding}
    >
      <div slot="header">Card Title</div>
      <p>This is a basic card with header and body content.</p>
    </bp-card>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;"
    >
      <bp-card variant="default">
        <div slot="header">Default Card</div>
        <p>This card has a subtle border and no shadow.</p>
      </bp-card>
      <bp-card variant="outlined">
        <div slot="header">Outlined Card</div>
        <p>This card has a stronger border for emphasis.</p>
      </bp-card>
      <bp-card variant="elevated">
        <div slot="header">Elevated Card</div>
        <p>This card has no border but includes a shadow.</p>
      </bp-card>
    </div>
  `,
};

export const WithMedia: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <bp-card variant="elevated">
        <div
          slot="media"
          style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
        ></div>
        <div slot="header">Featured Article</div>
        <p>
          Cards can include media at the top, perfect for images, videos, or
          custom content.
        </p>
        <div slot="footer">
          <button>Read More</button>
        </div>
      </bp-card>
    </div>
  `,
};

export const WithFooter: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <bp-card>
        <div slot="header">Action Card</div>
        <p>This card includes a footer section for actions or metadata.</p>
        <div slot="footer" style="display: flex; gap: 8px;">
          <button>Cancel</button>
          <button>Save</button>
        </div>
      </bp-card>
    </div>
  `,
};

export const Clickable: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;"
    >
      <bp-card
        clickable
        @bp-click=${(e: CustomEvent) => console.log('Card clicked!', e.detail)}
      >
        <div slot="header">Click me!</div>
        <p>This entire card is clickable and keyboard accessible.</p>
      </bp-card>
      <bp-card
        clickable
        variant="elevated"
        @bp-click=${() => console.log('Elevated card clicked')}
      >
        <div slot="header">Interactive</div>
        <p>
          Clickable cards have hover effects and can be activated with keyboard.
        </p>
      </bp-card>
    </div>
  `,
};

export const Hoverable: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <bp-card variant="outlined" hoverable>
        <div slot="header">Hoverable Card</div>
        <p>This card shows a lift effect on hover without being clickable.</p>
      </bp-card>
    </div>
  `,
};

export const NoPadding: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <bp-card no-padding variant="elevated">
        <div
          style="height: 150px; background: linear-gradient(to right, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;"
        >
          Full Width Content
        </div>
        <div style="padding: 16px;">
          <p>
            Use <code>no-padding</code> for custom layouts. This card has no
            body padding, allowing full-width content.
          </p>
        </div>
      </bp-card>
    </div>
  `,
};

export const ProductCard: Story = {
  render: () => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;"
    >
      <bp-card variant="elevated" hoverable>
        <div
          slot="media"
          style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;"
        >
          📱
        </div>
        <div slot="header">Smartphone X</div>
        <p style="margin: 0 0 8px 0; font-size: 24px; font-weight: bold;">
          $999
        </p>
        <p style="margin: 0; color: #666;">
          Latest model with advanced features
        </p>
        <div slot="footer" style="display: flex; gap: 8px;">
          <button style="flex: 1;">Add to Cart</button>
        </div>
      </bp-card>
      <bp-card variant="elevated" hoverable>
        <div
          slot="media"
          style="height: 200px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;"
        >
          💻
        </div>
        <div slot="header">Laptop Pro</div>
        <p style="margin: 0 0 8px 0; font-size: 24px; font-weight: bold;">
          $1,999
        </p>
        <p style="margin: 0; color: #666;">Professional grade laptop</p>
        <div slot="footer" style="display: flex; gap: 8px;">
          <button style="flex: 1;">Add to Cart</button>
        </div>
      </bp-card>
    </div>
  `,
};
