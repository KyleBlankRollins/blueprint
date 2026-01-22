import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './date-picker.js';

const meta: Meta = {
  title: 'Components/DatePicker',
  component: 'bp-date-picker',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected date in YYYY-MM-DD format',
    },
    name: {
      control: 'text',
      description: 'Form field name for form submissions',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when no date is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the date picker',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required for forms',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Visual size of the date picker',
    },
    min: {
      control: 'text',
      description: 'Minimum selectable date in YYYY-MM-DD format',
    },
    max: {
      control: 'text',
      description: 'Maximum selectable date in YYYY-MM-DD format',
    },
    firstDayOfWeek: {
      control: 'select',
      options: ['0', '1'],
      description: 'First day of week (0 = Sunday, 1 = Monday)',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <bp-date-picker placeholder="Select a date"></bp-date-picker>
  `,
};

export const WithValue: Story = {
  render: () => html`
    <bp-date-picker
      value="2026-01-21"
      placeholder="Event date"
    ></bp-date-picker>
  `,
};

export const WithMinMax: Story = {
  render: () => html`
    <bp-date-picker
      min="2026-01-01"
      max="2026-12-31"
      placeholder="Select a date in 2026"
    ></bp-date-picker>
  `,
};

export const SmallSize: Story = {
  render: () => html`
    <bp-date-picker
      size="small"
      placeholder="Small date picker"
    ></bp-date-picker>
  `,
};

export const LargeSize: Story = {
  render: () => html`
    <bp-date-picker
      size="large"
      placeholder="Large date picker"
    ></bp-date-picker>
  `,
};

export const WeekStartingMonday: Story = {
  render: () => html`
    <bp-date-picker
      firstDayOfWeek="1"
      placeholder="Week starts Monday"
    ></bp-date-picker>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <bp-date-picker
      disabled
      value="2026-01-21"
      placeholder="Disabled picker"
    ></bp-date-picker>
  `,
};

export const Required: Story = {
  render: () => html`
    <form>
      <bp-date-picker
        name="birthdate"
        required
        placeholder="Birth date (required)"
      ></bp-date-picker>
      <br /><br />
      <button type="submit">Submit</button>
    </form>
  `,
};

export const FutureDatesOnly: Story = {
  render: () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    return html`
      <bp-date-picker
        min=${minDate}
        placeholder="Select a future date"
      ></bp-date-picker>
    `;
  },
};
