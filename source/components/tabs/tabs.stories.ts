import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './tabs.js';
import type { TabItem } from './tabs.js';

const defaultTabs: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'pricing', label: 'Pricing' },
];

const tabsWithIcons: TabItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

const closableTabs: TabItem[] = [
  { id: 'doc1', label: 'Document 1', closable: true },
  { id: 'doc2', label: 'Document 2', closable: true },
  { id: 'doc3', label: 'Document 3', closable: true },
];

const tabsWithDisabled: TabItem[] = [
  { id: 'tab1', label: 'Enabled' },
  { id: 'tab2', label: 'Disabled', disabled: true },
  { id: 'tab3', label: 'Also Enabled' },
];

const meta: Meta = {
  title: 'Components/Tabs',
  component: 'bp-tabs',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The ID of the currently selected tab',
    },
    tabs: {
      control: 'object',
      description: 'Array of tab items',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the tabs',
    },
    variant: {
      control: 'select',
      options: ['default', 'pills', 'underline'],
      description: 'The visual style of the tabs',
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'start', 'end'],
      description: 'Position of the tab list relative to panels',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether all tabs are disabled',
    },
    manual: {
      control: 'boolean',
      description: 'Whether activation requires Enter/Space',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    tabs: defaultTabs,
    value: 'overview',
    size: 'medium',
    variant: 'default',
    placement: 'top',
    disabled: false,
    manual: false,
  },
  render: (args) => html`
    <bp-tabs
      .tabs=${args.tabs}
      .value=${args.value}
      .size=${args.size}
      .variant=${args.variant}
      .placement=${args.placement}
      ?disabled=${args.disabled}
      ?manual=${args.manual}
    >
      <div data-tab-id="overview">
        <h3>Overview Content</h3>
        <p>
          This is the overview panel with detailed information about the
          product.
        </p>
      </div>
      <div data-tab-id="features">
        <h3>Features Content</h3>
        <p>Discover all the amazing features we offer.</p>
      </div>
      <div data-tab-id="reviews">
        <h3>Reviews Content</h3>
        <p>See what our customers are saying about us.</p>
      </div>
      <div data-tab-id="pricing">
        <h3>Pricing Content</h3>
        <p>Choose the plan that works best for you.</p>
      </div>
    </bp-tabs>
  `,
};

export const Underline: Story = {
  args: {
    ...Default.args,
    variant: 'underline',
  },
  render: Default.render,
};

export const Pills: Story = {
  args: {
    ...Default.args,
    variant: 'pills',
  },
  render: Default.render,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div>
        <h4>Small</h4>
        <bp-tabs .tabs=${defaultTabs} value="overview" size="small">
          <div data-tab-id="overview">Overview content</div>
          <div data-tab-id="features">Features content</div>
          <div data-tab-id="reviews">Reviews content</div>
          <div data-tab-id="pricing">Pricing content</div>
        </bp-tabs>
      </div>
      <div>
        <h4>Medium (default)</h4>
        <bp-tabs .tabs=${defaultTabs} value="overview" size="medium">
          <div data-tab-id="overview">Overview content</div>
          <div data-tab-id="features">Features content</div>
          <div data-tab-id="reviews">Reviews content</div>
          <div data-tab-id="pricing">Pricing content</div>
        </bp-tabs>
      </div>
      <div>
        <h4>Large</h4>
        <bp-tabs .tabs=${defaultTabs} value="overview" size="large">
          <div data-tab-id="overview">Overview content</div>
          <div data-tab-id="features">Features content</div>
          <div data-tab-id="reviews">Reviews content</div>
          <div data-tab-id="pricing">Pricing content</div>
        </bp-tabs>
      </div>
    </div>
  `,
};

export const VerticalStart: Story = {
  args: {
    tabs: defaultTabs,
    value: 'overview',
    placement: 'start',
  },
  render: (args) => html`
    <bp-tabs
      .tabs=${args.tabs}
      .value=${args.value}
      .placement=${args.placement}
      style="height: 300px;"
    >
      <div data-tab-id="overview">Overview content for vertical tabs</div>
      <div data-tab-id="features">Features content for vertical tabs</div>
      <div data-tab-id="reviews">Reviews content for vertical tabs</div>
      <div data-tab-id="pricing">Pricing content for vertical tabs</div>
    </bp-tabs>
  `,
};

export const VerticalEnd: Story = {
  args: {
    tabs: defaultTabs,
    value: 'overview',
    placement: 'end',
  },
  render: (args) => html`
    <bp-tabs
      .tabs=${args.tabs}
      .value=${args.value}
      .placement=${args.placement}
      style="height: 300px;"
    >
      <div data-tab-id="overview">Overview content</div>
      <div data-tab-id="features">Features content</div>
      <div data-tab-id="reviews">Reviews content</div>
      <div data-tab-id="pricing">Pricing content</div>
    </bp-tabs>
  `,
};

export const BottomPlacement: Story = {
  args: {
    tabs: defaultTabs,
    value: 'overview',
    placement: 'bottom',
  },
  render: (args) => html`
    <bp-tabs
      .tabs=${args.tabs}
      .value=${args.value}
      .placement=${args.placement}
    >
      <div data-tab-id="overview">Overview content with bottom tabs</div>
      <div data-tab-id="features">Features content with bottom tabs</div>
      <div data-tab-id="reviews">Reviews content with bottom tabs</div>
      <div data-tab-id="pricing">Pricing content with bottom tabs</div>
    </bp-tabs>
  `,
};

export const WithIcons: Story = {
  args: {
    tabs: tabsWithIcons,
    value: 'home',
  },
  render: (args) => html`
    <bp-tabs .tabs=${args.tabs} .value=${args.value}>
      <div data-tab-id="home">Home content</div>
      <div data-tab-id="settings">Settings content</div>
      <div data-tab-id="profile">Profile content</div>
    </bp-tabs>
  `,
};

export const Closable: Story = {
  args: {
    tabs: closableTabs,
    value: 'doc1',
  },
  render: (args) => html`
    <bp-tabs
      .tabs=${args.tabs}
      .value=${args.value}
      @bp-tab-close=${(e: CustomEvent) =>
        console.log('Close tab:', e.detail.tabId)}
    >
      <div data-tab-id="doc1">Document 1 content</div>
      <div data-tab-id="doc2">Document 2 content</div>
      <div data-tab-id="doc3">Document 3 content</div>
    </bp-tabs>
  `,
};

export const DisabledTabs: Story = {
  args: {
    tabs: tabsWithDisabled,
    value: 'tab1',
  },
  render: (args) => html`
    <bp-tabs .tabs=${args.tabs} .value=${args.value}>
      <div data-tab-id="tab1">Enabled tab content</div>
      <div data-tab-id="tab2">Disabled tab content (you won't see this)</div>
      <div data-tab-id="tab3">Also enabled tab content</div>
    </bp-tabs>
  `,
};

export const AllDisabled: Story = {
  args: {
    tabs: defaultTabs,
    value: 'overview',
    disabled: true,
  },
  render: (args) => html`
    <bp-tabs .tabs=${args.tabs} .value=${args.value} ?disabled=${args.disabled}>
      <div data-tab-id="overview">Overview content</div>
      <div data-tab-id="features">Features content</div>
      <div data-tab-id="reviews">Reviews content</div>
      <div data-tab-id="pricing">Pricing content</div>
    </bp-tabs>
  `,
};

export const ManualActivation: Story = {
  args: {
    tabs: defaultTabs,
    value: 'overview',
    manual: true,
  },
  render: (args) => html`
    <bp-tabs .tabs=${args.tabs} .value=${args.value} ?manual=${args.manual}>
      <div data-tab-id="overview">
        <p>In manual mode, arrow keys move focus but don't activate tabs.</p>
        <p>Press Enter or Space to activate the focused tab.</p>
      </div>
      <div data-tab-id="features">Features content</div>
      <div data-tab-id="reviews">Reviews content</div>
      <div data-tab-id="pricing">Pricing content</div>
    </bp-tabs>
  `,
};

export const UnderlineVertical: Story = {
  args: {
    tabs: defaultTabs,
    value: 'overview',
    variant: 'underline',
    placement: 'start',
  },
  render: (args) => html`
    <bp-tabs
      .tabs=${args.tabs}
      .value=${args.value}
      .variant=${args.variant}
      .placement=${args.placement}
      style="height: 300px;"
    >
      <div data-tab-id="overview">
        Underline variant with vertical placement
      </div>
      <div data-tab-id="features">Features content</div>
      <div data-tab-id="reviews">Reviews content</div>
      <div data-tab-id="pricing">Pricing content</div>
    </bp-tabs>
  `,
};
