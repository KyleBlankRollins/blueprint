import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './accordion.js';

const meta: Meta = {
  title: 'Components/Accordion',
  component: 'bp-accordion',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'separated'],
      description: 'Visual style variant',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple items can be expanded simultaneously',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether all items are disabled',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    variant: 'default',
    multiple: false,
    disabled: false,
  },
  render: (args) => html`
    <bp-accordion
      variant=${args.variant}
      ?multiple=${args.multiple}
      ?disabled=${args.disabled}
    >
      <bp-accordion-item item-id="item-1" header="What is Blueprint?">
        Blueprint is a highly portable and customizable component library built
        on top of Lit. It provides a set of reusable web components that work
        with any framework.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="How do I install it?">
        You can install Blueprint using npm: <code>npm install blueprint</code>.
        Then import the components you need in your project.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-3" header="Is it accessible?">
        Yes! All Blueprint components are built with accessibility in mind,
        including proper ARIA attributes, keyboard navigation, and screen reader
        support.
      </bp-accordion-item>
    </bp-accordion>
  `,
};

export const DefaultVariant: Story = {
  render: () => html`
    <bp-accordion variant="default">
      <bp-accordion-item item-id="item-1" header="Section 1">
        Content for the first section. The default variant has connected items
        with a shared border.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Section 2">
        Content for the second section.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-3" header="Section 3">
        Content for the third section.
      </bp-accordion-item>
    </bp-accordion>
  `,
};

export const BorderedVariant: Story = {
  render: () => html`
    <bp-accordion variant="bordered">
      <bp-accordion-item item-id="item-1" header="Section 1">
        Content for the first section. The bordered variant gives each item its
        own border.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Section 2">
        Content for the second section.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-3" header="Section 3">
        Content for the third section.
      </bp-accordion-item>
    </bp-accordion>
  `,
};

export const SeparatedVariant: Story = {
  render: () => html`
    <bp-accordion variant="separated">
      <bp-accordion-item item-id="item-1" header="Section 1">
        Content for the first section. The separated variant has gaps between
        items with subtle shadows.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Section 2">
        Content for the second section.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-3" header="Section 3">
        Content for the third section.
      </bp-accordion-item>
    </bp-accordion>
  `,
};

export const MultipleExpanded: Story = {
  render: () => html`
    <bp-accordion variant="default" multiple>
      <bp-accordion-item item-id="item-1" header="First Item">
        When multiple mode is enabled, you can expand multiple items at the same
        time. Click on other headers to see them all stay open.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Second Item">
        This item can be expanded while the first one is still open.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-3" header="Third Item">
        All three items can be expanded simultaneously in multiple mode.
      </bp-accordion-item>
    </bp-accordion>
  `,
};

export const WithDisabledItem: Story = {
  render: () => html`
    <bp-accordion variant="default">
      <bp-accordion-item item-id="item-1" header="Enabled Item">
        This item can be expanded and collapsed normally.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Disabled Item" disabled>
        This content won't be visible because the item is disabled.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-3" header="Another Enabled Item">
        This item works normally.
      </bp-accordion-item>
    </bp-accordion>
  `,
};

export const AllDisabled: Story = {
  render: () => html`
    <bp-accordion variant="default" disabled>
      <bp-accordion-item item-id="item-1" header="Item 1">
        Content 1
      </bp-accordion-item>
      <bp-accordion-item item-id="item-2" header="Item 2">
        Content 2
      </bp-accordion-item>
      <bp-accordion-item item-id="item-3" header="Item 3">
        Content 3
      </bp-accordion-item>
    </bp-accordion>
  `,
};

export const WithCustomContent: Story = {
  render: () => html`
    <bp-accordion variant="separated">
      <bp-accordion-item
        item-id="faq-1"
        header="How do I customize components?"
      >
        <p>Blueprint components can be customized in several ways:</p>
        <ul style="margin: 8px 0; padding-left: 20px;">
          <li>CSS custom properties (design tokens)</li>
          <li>CSS ::part() selectors for shadow DOM elements</li>
          <li>Slots for custom content</li>
        </ul>
        <p>
          Check the documentation for each component's available customization
          options.
        </p>
      </bp-accordion-item>
      <bp-accordion-item
        item-id="faq-2"
        header="What frameworks are supported?"
      >
        <p style="margin-bottom: 8px;">
          Blueprint works with any framework or no framework at all:
        </p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <span
            style="padding: 4px 8px; background: var(--bp-color-surface); border-radius: 4px;"
            >React</span
          >
          <span
            style="padding: 4px 8px; background: var(--bp-color-surface); border-radius: 4px;"
            >Vue</span
          >
          <span
            style="padding: 4px 8px; background: var(--bp-color-surface); border-radius: 4px;"
            >Angular</span
          >
          <span
            style="padding: 4px 8px; background: var(--bp-color-surface); border-radius: 4px;"
            >Svelte</span
          >
          <span
            style="padding: 4px 8px; background: var(--bp-color-surface); border-radius: 4px;"
            >Vanilla JS</span
          >
        </div>
      </bp-accordion-item>
    </bp-accordion>
  `,
};

export const WithCustomHeader: Story = {
  render: () => html`
    <bp-accordion variant="default">
      <bp-accordion-item item-id="item-1">
        <span
          slot="header"
          style="display: flex; align-items: center; gap: 8px;"
        >
          <span
            style="width: 8px; height: 8px; background: var(--bp-color-success); border-radius: 50%;"
          ></span>
          Active Status
        </span>
        This item has a custom header with a status indicator.
      </bp-accordion-item>
      <bp-accordion-item item-id="item-2">
        <span
          slot="header"
          style="display: flex; align-items: center; gap: 8px;"
        >
          <span
            style="width: 8px; height: 8px; background: var(--bp-color-warning); border-radius: 50%;"
          ></span>
          Pending Status
        </span>
        Another item with a different status indicator.
      </bp-accordion-item>
    </bp-accordion>
  `,
};

export const ProgrammaticControl: Story = {
  render: () => html`
    <div>
      <div style="margin-bottom: 16px; display: flex; gap: 8px;">
        <button
          @click=${() => {
            const accordion = document.getElementById(
              'programmatic-accordion'
            ) as HTMLElement & { expandAll: () => void };
            accordion?.expandAll();
          }}
          style="padding: 8px 16px; cursor: pointer;"
        >
          Expand All
        </button>
        <button
          @click=${() => {
            const accordion = document.getElementById(
              'programmatic-accordion'
            ) as HTMLElement & { collapseAll: () => void };
            accordion?.collapseAll();
          }}
          style="padding: 8px 16px; cursor: pointer;"
        >
          Collapse All
        </button>
      </div>
      <bp-accordion id="programmatic-accordion" variant="default" multiple>
        <bp-accordion-item item-id="item-1" header="First Section">
          Content for the first section.
        </bp-accordion-item>
        <bp-accordion-item item-id="item-2" header="Second Section">
          Content for the second section.
        </bp-accordion-item>
        <bp-accordion-item item-id="item-3" header="Third Section">
          Content for the third section.
        </bp-accordion-item>
      </bp-accordion>
    </div>
  `,
};

export const FAQ: Story = {
  render: () => html`
    <bp-accordion variant="separated">
      <bp-accordion-item
        item-id="faq-1"
        header="What payment methods do you accept?"
      >
        We accept all major credit cards (Visa, MasterCard, American Express),
        PayPal, and bank transfers for enterprise customers.
      </bp-accordion-item>
      <bp-accordion-item item-id="faq-2" header="How long does shipping take?">
        Standard shipping takes 5-7 business days. Express shipping is available
        for 2-3 business day delivery. International shipping times vary by
        location.
      </bp-accordion-item>
      <bp-accordion-item item-id="faq-3" header="What is your return policy?">
        We offer a 30-day money-back guarantee on all products. Items must be
        returned in their original condition. Contact support to initiate a
        return.
      </bp-accordion-item>
      <bp-accordion-item
        item-id="faq-4"
        header="Do you offer customer support?"
      >
        Yes! Our support team is available 24/7 via email and chat. Phone
        support is available Monday-Friday, 9am-5pm EST.
      </bp-accordion-item>
    </bp-accordion>
  `,
};
