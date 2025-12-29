# GitHub Copilot Instructions for Blueprint

## Commands You Can Use

**Development:**

- `npm run dev` - Start development server (http://localhost:5173/demo/)
- `npm run build` - Build library for production (outputs to `dist/`)
- `npm run preview` - Preview the built library

**Code Quality:**

- `npm run lint` - Run ESLint on source code
- `npm run lint:fix` - Fix auto-fixable ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

## Project Knowledge

**Tech Stack:** Lit 3.3, TypeScript 5.9, Vite 7.3, ESLint 9.39, Prettier 3.7

**File Structure:**

- `src/` - Source code (you READ and WRITE here)
- `src/components/` - Individual web components
- `src/themes/` - CSS custom properties and design tokens
- `demo/` - Development demo page
- `dist/` - Built library output (generated, don't modify)
- `.github/` - GitHub configuration and this file

## Code style

Prioritize readable code over concision. Especially in the case of variable names. Variable names should be descriptive. Never use obscure one or two letter variable names unless there's a very good reason to do so.

## CSS Architecture and Style

### Design Token Usage (Critical)

**✅ Always do:**

```css
/* Use design tokens from src/themes/light.css */
color: var(--bp-color-primary);
padding: var(--bp-spacing-md);
border-radius: var(--bp-border-radius-md);
```

**🚫 Never do:**

```css
/* No hardcoded colors or fallback values */
color: var(--bp-color-primary, #3b82f6); /* ❌ No fallbacks */
color: #3b82f6; /* ❌ No hardcoded colors */
padding: 12px; /* ❌ Use spacing tokens */
```

### No fallbacks

Never use fallback values with `var()`. Every `var()` should use a custom property that is defined in a CSS theme file. Fallback values prevent us from using theme values. If a custom property doesn't work, we need to fix that instead of relying on fallback values that are hard to debug.

If no appropriate theme file exists, ask whether you should create one.

### Color definitions and use

All CSS rules that use a color value should use a custom property that's defined in a theme file. There should never be one-off color declarations.

If no appropriate theme file exists, ask whether you should create one.

## Component Standards

All components in this library follow the scaffold reference pattern defined in `mb-button/SCAFFOLD-REFERENCE.md`.

### Required Files

- [ ] `component-name.ts` - Component logic
- [ ] `component-name.style.ts` - Component styles
- [ ] `component-name.test.ts` - Unit tests (Vitest)
- [ ] `component-name.stories.ts` - Storybook documentation
- [ ] `README.md` - API documentation

### Code Patterns

- [ ] Uses `@customElement()` decorator
- [ ] Extends `LitElement`
- [ ] Properties use `@property()` decorator
- [ ] Styles imported from separate `.style.ts` file
- [ ] Exports in `components/index.ts`
- [ ] TypeScript declaration for `HTMLElementTagNameMap`

### Style Organization

- [ ] Base styles first
- [ ] Variants second
- [ ] Sizes third
- [ ] States last (hover, active, disabled, etc.)
- [ ] Uses semantic design tokens (not primitives)

### Testing

- [ ] Minimum 10+ tests per component
- [ ] Tests custom element registration
- [ ] Tests property values and reactivity
- [ ] Tests events and interactions
- [ ] Tests accessibility (ARIA, keyboard nav)
- [ ] Tests CSS parts exposure

### Documentation (README)

- [ ] Features list
- [ ] Usage examples
- [ ] API documentation (properties, slots, events, CSS parts)
- [ ] Design tokens used
- [ ] Accessibility notes

### Accessibility

- [ ] Proper ARIA attributes
- [ ] Focus indicators
- [ ] Keyboard support
- [ ] Semantic HTML
- [ ] Screen reader friendly

## Web components

This project uses Lit Element for all web components.

### LitElement Component Conventions

All components use **Lit Element** with **Shadow DOM**:

### Component Structure

```
src/components/
├── component-name/
│   ├── component-name.ts            # Component logic
│   ├── component-name.test.ts       # Unit tests (Vitest)
│   ├── component-name.stories.ts    # Storybook documentation
│   ├── component-name.style.ts      # Dedicated styles
│   └── README.md                    # API documentation
```

### Naming Conventions

- **Custom element**: `bp-component-name` (kebab-case, bp- prefix)
- **Component file**: `bp-component-name.ts`
- **Styles file**: `bp-component-name.style.ts`
- **Style export**: `componentNameStyles` (camelCase + "Styles")

### Component Pattern

```typescript
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentNameStyles } from './component-name.style.js';

@customElement('bp-component-name')
export class BpComponentName extends LitElement {
  @property({ type: String }) declare someProp: string;

  static styles = [componentNameStyles];

  render() {
    return html`<div>${this.someProp}</div>`;
  }
}

// TypeScript declaration for HTMLElementTagNameMap
declare global {
  interface HTMLElementTagNameMap {
    'bp-component-name': BpComponentName;
  }
}
```

## Boundaries

### ✅ Always do:

- Use design tokens from `src/themes/light.css`
- Follow `bp-` naming convention for components
- Import styles from separate `.style.ts` files
- Export components from `src/components/index.ts`
- Run `npm run lint` and `npm run format` before committing
- Use semantic HTML and proper ARIA attributes
- Test components in the demo page (`npm run dev`)

### ⚠️ Ask first:

- Adding new design tokens to theme files
- Creating new shared utility styles
- Major changes to component APIs
- Adding external dependencies

### 🚫 Never do:

- Use hardcoded colors, spacing, or other design values
- Use fallback values with `var()` (e.g., `var(--bp-color, #333)`)
- Modify files in `dist/` or `node_modules/`
- Create components without proper TypeScript types
- Skip accessibility considerations (ARIA, keyboard navigation)
- Use `ga-` or `mb-` prefixes (use `bp-` for Blueprint)

## Development Workflow

1. **Create component:** Use the folder structure in `src/components/component-name/`
2. **Test locally:** Run `npm run dev` and test in demo page
3. **Check quality:** Run `npm run lint` and `npm run format`
4. **Build:** Run `npm run build` to ensure it compiles
5. **Export:** Add to `src/components/index.ts`

## Backwards Compatibility

We NEVER care about backwards compatibility. This is a greenfield project with 0 users. When implementing refactors or planning work, DO NOT spend any time thinking about backwards compatibility.

DO NOT deprecate features, APIs, or UI. We want to REMOVE any code related to older iterations.
