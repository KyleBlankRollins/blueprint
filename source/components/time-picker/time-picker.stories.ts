import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './time-picker.js';

const meta: Meta = {
  title: 'Components/TimePicker',
  component: 'bp-time-picker',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Selected time in HH:MM format (12 or 24-hour)',
    },
    name: {
      control: 'text',
      description: 'Form field name for form submissions',
    },
    label: {
      control: 'text',
      description: 'Accessible label for screen readers',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when no time is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the time picker',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required for forms',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Visual size of the time picker',
    },
    format: {
      control: 'select',
      options: ['12', '24'],
      description: 'Time format (12-hour or 24-hour)',
    },
    step: {
      control: 'number',
      description:
        'Time interval in minutes (e.g., 15 for 15-minute intervals)',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <bp-time-picker placeholder="Select time"></bp-time-picker>
  `,
};

export const WithValue: Story = {
  render: () => html`
    <bp-time-picker
      value="2:30 PM"
      placeholder="Appointment time"
    ></bp-time-picker>
  `,
};

export const Format24Hour: Story = {
  render: () => html`
    <bp-time-picker
      format="24"
      value="14:30"
      placeholder="24-hour format"
    ></bp-time-picker>
  `,
};

export const SmallSize: Story = {
  render: () => html`
    <bp-time-picker
      size="small"
      placeholder="Small time picker"
    ></bp-time-picker>
  `,
};

export const LargeSize: Story = {
  render: () => html`
    <bp-time-picker
      size="large"
      placeholder="Large time picker"
    ></bp-time-picker>
  `,
};

export const Step30Minutes: Story = {
  render: () => html`
    <bp-time-picker
      step="30"
      placeholder="30-minute intervals"
    ></bp-time-picker>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <bp-time-picker
      disabled
      value="3:00 PM"
      placeholder="Disabled picker"
    ></bp-time-picker>
  `,
};

export const Required: Story = {
  render: () => html`
    <form>
      <bp-time-picker
        name="meeting-time"
        required
        placeholder="Meeting time (required)"
      ></bp-time-picker>
      <br /><br />
      <button type="submit">Submit</button>
    </form>
  `,
};

export const InForm: Story = {
  render: () => html`
    <form>
      <label for="start-time">Start Time</label><br />
      <bp-time-picker
        name="start-time"
        label="Start time"
        placeholder="Select start time"
      ></bp-time-picker>
      <br /><br />
      <label for="end-time">End Time</label><br />
      <bp-time-picker
        name="end-time"
        label="End time"
        placeholder="Select end time"
      ></bp-time-picker>
      <br /><br />
      <button type="submit">Schedule</button>
    </form>
  `,
};
