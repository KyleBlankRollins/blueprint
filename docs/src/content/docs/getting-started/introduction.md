---
title: Introduction
description: Get started with Blueprint, a portable component library built on Lit
---

Blueprint is a highly portable and customizable component library built on [Lit](https://lit.dev/). It provides a comprehensive set of UI components as native web components, meaning they work anywhere HTML works.

## Why Blueprint?

### Framework Agnostic

Blueprint components are built using the Web Components standard. This means they work natively in:

- **Vanilla JavaScript/HTML** - No framework required
- **React** - Full compatibility with React 19+
- **Vue** - Works seamlessly with Vue 3
- **Angular** - Native custom element support
- **Svelte** - Direct usage as HTML elements
- **Astro** - Perfect for content-focused sites

### Themeable

Blueprint uses a comprehensive design token system built on CSS custom properties. You can:

- Use the built-in light and dark themes
- Create custom themes using our plugin system
- Override individual tokens for fine-grained control

### Accessible

Every component is built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Quick Example

Once Blueprint is installed, you can use components directly in your HTML:

```html
<bp-button variant="primary">Click me</bp-button>
<bp-input placeholder="Enter your name"></bp-input>
<bp-card>
  <bp-heading level="3">Welcome</bp-heading>
  <bp-text>This is a Blueprint card component.</bp-text>
</bp-card>
```

## Next Steps

- [Installation](/getting-started/installation/) - Learn how to install Blueprint
- [Theming](/getting-started/theming/) - Customize the look and feel
- [Components](/components/button/) - Explore the component library
