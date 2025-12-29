import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../source/components/**/*.stories.ts'],
  addons: [],
  framework: '@storybook/web-components-vite',
};
export default config;
