import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './select.js';

const meta: Meta = {
  title: 'Components/Select',
  component: 'bp-select',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The currently selected value',
    },
    name: {
      control: 'text',
      description: 'Name attribute for form submission',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the select is required',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the select',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    placeholder: 'Select an option',
    size: 'md',
  },
  render: (args) => html`
    <bp-select
      .value=${args.value || ''}
      .name=${args.name || ''}
      .placeholder=${args.placeholder || 'Select an option'}
      ?disabled=${args.disabled}
      ?required=${args.required}
      .size=${args.size || 'md'}
    >
      <option value="react">React</option>
      <option value="vue">Vue</option>
      <option value="angular">Angular</option>
      <option value="svelte">Svelte</option>
    </bp-select>
  `,
};

export const WithValue: Story = {
  args: {
    value: 'vue',
    placeholder: 'Select a framework',
    size: 'md',
  },
  render: (args) => html`
    <bp-select
      .value=${args.value || ''}
      .placeholder=${args.placeholder || 'Select an option'}
      .size=${args.size || 'md'}
    >
      <option value="react">React</option>
      <option value="vue">Vue</option>
      <option value="angular">Angular</option>
      <option value="svelte">Svelte</option>
    </bp-select>
  `,
};

export const Disabled: Story = {
  args: {
    value: 'react',
    disabled: true,
    size: 'md',
  },
  render: (args) => html`
    <bp-select
      .value=${args.value || ''}
      ?disabled=${args.disabled}
      .size=${args.size || 'md'}
    >
      <option value="react">React</option>
      <option value="vue">Vue</option>
      <option value="angular">Angular</option>
    </bp-select>
  `,
};

export const Required: Story = {
  args: {
    placeholder: 'Select a country (required)',
    required: true,
    size: 'md',
  },
  render: (args) => html`
    <bp-select
      .placeholder=${args.placeholder || 'Select an option'}
      ?required=${args.required}
      .size=${args.size || 'md'}
      name="country"
    >
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="uk">United Kingdom</option>
      <option value="au">Australia</option>
    </bp-select>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">
          Small
        </label>
        <bp-select size="sm" placeholder="Small select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </bp-select>
      </div>

      <div>
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">
          Medium (default)
        </label>
        <bp-select size="md" placeholder="Medium select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </bp-select>
      </div>

      <div>
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">
          Large
        </label>
        <bp-select size="lg" placeholder="Large select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </bp-select>
      </div>
    </div>
  `,
};

export const LongOptionList: Story = {
  args: {
    placeholder: 'Select a country',
    size: 'md',
  },
  render: (args) => html`
    <bp-select
      .placeholder=${args.placeholder || 'Select an option'}
      .size=${args.size || 'md'}
    >
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="mx">Mexico</option>
      <option value="uk">United Kingdom</option>
      <option value="fr">France</option>
      <option value="de">Germany</option>
      <option value="it">Italy</option>
      <option value="es">Spain</option>
      <option value="nl">Netherlands</option>
      <option value="be">Belgium</option>
      <option value="ch">Switzerland</option>
      <option value="au">Australia</option>
      <option value="nz">New Zealand</option>
      <option value="jp">Japan</option>
      <option value="cn">China</option>
      <option value="kr">South Korea</option>
      <option value="in">India</option>
      <option value="br">Brazil</option>
      <option value="ar">Argentina</option>
      <option value="za">South Africa</option>
    </bp-select>
  `,
};

export const WithEventHandling: Story = {
  args: {
    placeholder: 'Select a color',
    size: 'md',
  },
  render: (args) => html`
    <div>
      <bp-select
        .placeholder=${args.placeholder || 'Select an option'}
        .size=${args.size || 'md'}
        @bp-change=${(e: CustomEvent) => {
          const { value, label, previousValue } = e.detail;
          console.log('Select changed:', { value, label, previousValue });
          window.alert(`Selected: ${label} (value: ${value})`);
        }}
      >
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="yellow">Yellow</option>
        <option value="purple">Purple</option>
      </bp-select>
      <p style="margin-top: 12px; font-size: 14px; color: #666;">
        Open the console or watch for alerts when selecting an option
      </p>
    </div>
  `,
};

export const InForm: Story = {
  render: () => html`
    <form
      @submit=${(e: Event) => {
        e.preventDefault();
        const form = e.target as globalThis.HTMLFormElement;
        const formData = new window.FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Form submitted:', data);
        window.alert('Form submitted! Check console for values.');
      }}
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <div>
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">
          Framework *
        </label>
        <bp-select name="framework" placeholder="Select a framework" required>
          <option value="react">React</option>
          <option value="vue">Vue</option>
          <option value="angular">Angular</option>
          <option value="svelte">Svelte</option>
        </bp-select>
      </div>

      <div>
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">
          Experience Level
        </label>
        <bp-select
          name="level"
          placeholder="Select your level"
          value="intermediate"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </bp-select>
      </div>

      <button
        type="submit"
        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;"
      >
        Submit Form
      </button>
    </form>
  `,
};

export const VisualComparison: Story = {
  render: () => html`
    <div style="display: grid; gap: 24px;">
      <div>
        <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">
          Default State
        </h3>
        <bp-select placeholder="Select an option">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </bp-select>
      </div>

      <div>
        <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">
          With Value Selected
        </h3>
        <bp-select value="2">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </bp-select>
      </div>

      <div>
        <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">
          Required
        </h3>
        <bp-select placeholder="Required field" required>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </bp-select>
      </div>

      <div>
        <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">
          Disabled
        </h3>
        <bp-select value="1" disabled>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </bp-select>
      </div>
    </div>
  `,
};
