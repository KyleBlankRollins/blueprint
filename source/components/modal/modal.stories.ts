import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './modal.js';
import '../button/button.js';

const meta: Meta = {
  title: 'Components/Modal',
  component: 'bp-modal',
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    ariaLabelledby: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    open: true,
    size: 'medium',
  },
  render: (args) => html`
    <bp-modal .open=${args.open} .size=${args.size}>
      <h2 slot="header" id="modal-title">Modal Title</h2>
      <p>
        This is the modal body content. You can put any content here including
        text, images, forms, or other components.
      </p>
      <p>
        The modal will close when you click the X button, press Escape, or click
        outside the modal on the backdrop.
      </p>
      <div slot="footer">
        <bp-button variant="secondary">Cancel</bp-button>
        <bp-button variant="primary">Confirm</bp-button>
      </div>
    </bp-modal>
  `,
};

export const Small: Story = {
  args: {
    open: true,
    size: 'small',
  },
  render: (args) => html`
    <bp-modal .open=${args.open} .size=${args.size}>
      <h2 slot="header">Small Modal</h2>
      <p>This is a small modal dialog.</p>
      <div slot="footer">
        <bp-button variant="primary" size="sm">OK</bp-button>
      </div>
    </bp-modal>
  `,
};

export const Large: Story = {
  args: {
    open: true,
    size: 'large',
  },
  render: (args) => html`
    <bp-modal .open=${args.open} .size=${args.size}>
      <h2 slot="header">Large Modal</h2>
      <p>
        This is a large modal with more content space. Perfect for forms,
        detailed information, or complex interactions.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <div slot="footer">
        <bp-button variant="secondary">Cancel</bp-button>
        <bp-button variant="primary">Save Changes</bp-button>
      </div>
    </bp-modal>
  `,
};

export const WithForm: Story = {
  args: {
    open: true,
    size: 'medium',
  },
  render: (args) => html`
    <bp-modal .open=${args.open} .size=${args.size}>
      <h2 slot="header">Contact Form</h2>
      <form style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label
            for="name"
            style="display: block; margin-bottom: 4px; font-weight: 500;"
            >Name</label
          >
          <input
            type="text"
            id="name"
            name="name"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
          />
        </div>
        <div>
          <label
            for="email"
            style="display: block; margin-bottom: 4px; font-weight: 500;"
            >Email</label
          >
          <input
            type="email"
            id="email"
            name="email"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
          />
        </div>
        <div>
          <label
            for="message"
            style="display: block; margin-bottom: 4px; font-weight: 500;"
            >Message</label
          >
          <textarea
            id="message"
            name="message"
            rows="4"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"
          ></textarea>
        </div>
      </form>
      <div slot="footer">
        <bp-button variant="secondary">Cancel</bp-button>
        <bp-button variant="primary">Submit</bp-button>
      </div>
    </bp-modal>
  `,
};

export const NoFooter: Story = {
  args: {
    open: true,
    size: 'medium',
  },
  render: (args) => html`
    <bp-modal .open=${args.open} .size=${args.size}>
      <h2 slot="header">Information</h2>
      <p>
        This modal doesn't have a footer. The footer section will be
        automatically hidden when there's no content.
      </p>
      <p>You can still close it using the X button or pressing Escape.</p>
    </bp-modal>
  `,
};

export const LongContent: Story = {
  args: {
    open: true,
    size: 'medium',
  },
  render: (args) => html`
    <bp-modal .open=${args.open} .size=${args.size}>
      <h2 slot="header">Terms and Conditions</h2>
      <div>
        <h3>1. Introduction</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <h3>2. User Agreement</h3>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
        <h3>3. Privacy Policy</h3>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </p>
        <h3>4. Content License</h3>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum.
        </p>
        <h3>5. Termination</h3>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium.
        </p>
        <h3>6. Limitation of Liability</h3>
        <p>
          Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et
          quasi architecto beatae vitae dicta sunt explicabo.
        </p>
        <h3>7. Governing Law</h3>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt.
        </p>
      </div>
      <div slot="footer">
        <bp-button variant="secondary">Decline</bp-button>
        <bp-button variant="primary">Accept</bp-button>
      </div>
    </bp-modal>
  `,
};

export const Interactive: Story = {
  render: () => {
    let modalOpen = false;

    const toggleModal = () => {
      modalOpen = !modalOpen;
      // Re-render the story
      const modal = document.querySelector('bp-modal');
      if (modal) {
        modal.open = modalOpen;
      }
    };

    const handleClose = () => {
      modalOpen = false;
      const modal = document.querySelector('bp-modal');
      if (modal) {
        modal.open = false;
      }
    };

    return html`
      <div>
        <bp-button @click=${toggleModal}>Open Modal</bp-button>
        <bp-modal .open=${modalOpen} @bp-close=${handleClose}>
          <h2 slot="header">Interactive Modal</h2>
          <p>
            Click the button below or use Escape key to close this modal. You
            can also click outside on the backdrop.
          </p>
          <div slot="footer">
            <bp-button variant="primary" @click=${handleClose}>
              Close
            </bp-button>
          </div>
        </bp-modal>
      </div>
    `;
  },
};
