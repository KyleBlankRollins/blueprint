# {{PLUGIN_NAME}}

{{DESCRIPTION}}

## Overview

{{OVERVIEW_TEXT}}

## Features

- **Custom color palette:** {{COLOR_LIST}}
- **{{VARIANT_COUNT}} theme variant(s):** {{VARIANT_LIST}}
- **Type-safe** color references via ThemeBuilder
- **WCAG-conscious** color choices

## Colors

### {{EXAMPLE_COLOR_DISPLAY}}

{{COLOR_DESCRIPTION}}

- **OKLCH:** `oklch({{LIGHTNESS}} {{CHROMA}} {{HUE}})`
- **Use cases:** {{USE_CASES}}
- **Scale:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

## Theme Variants

### {{PLUGIN_ID}}-light

Light theme variant optimized for day viewing and light environments.

**Key tokens:**

- `background`: `gray.50` - Clean, bright background
- `text`: `gray.900` - High contrast text
- `primary`: `{{EXAMPLE_COLOR}}.600` - Vibrant brand color
- `surface`: `gray.100` - Subtle surface elevation

### {{PLUGIN_ID}}-dark

Dark theme variant optimized for night viewing and low-light environments.

**Key tokens:**

- `background`: `gray.950` - Deep, comfortable background
- `text`: `gray.50` - High contrast text on dark
- `primary`: `{{EXAMPLE_COLOR}}.400` - Adjusted for dark backgrounds
- `surface`: `gray.900` - Subtle surface elevation

## Usage

### In theme.config.ts

```typescript
import { ThemeBuilder } from '../builder/ThemeBuilder.js';
import primitives from '../plugins/primitives/index.js';
import {{PLUGIN_CONST_NAME}} from '../plugins/{{PLUGIN_ID}}/index.js';

const builder = new ThemeBuilder()
  .use(primitives)
  .use({{PLUGIN_CONST_NAME}});

export const theme = builder.build();
```

### In HTML

```html
<!-- Light variant -->
<html data-theme="{{PLUGIN_ID}}-light">
  <!-- Your content -->
</html>

<!-- Dark variant -->
<html data-theme="{{PLUGIN_ID}}-dark">
  <!-- Your content -->
</html>
```

### In CSS

```css
/* Theme automatically provides CSS custom properties */
.my-component {
  background: var(--bp-background);
  color: var(--bp-text);
  border: 1px solid var(--bp-border);
}

.primary-button {
  background: var(--bp-primary);
  color: var(--bp-text-inverse);
}

.primary-button:hover {
  background: var(--bp-primary-hover);
}
```

## Customization

### Extending This Theme

You can extend this theme in your own plugin:

```typescript
import type { ThemePlugin } from '../../core/types.js';
import {{PLUGIN_CONST_NAME}} from '../{{PLUGIN_ID}}/index.js';

export const myCustomTheme: ThemePlugin = {
  id: 'my-custom-theme',
  version: '1.0.0',
  dependencies: [{ id: '{{PLUGIN_ID}}' }],

  register(builder) {
    // Extend the light variant with custom overrides
    builder.extendThemeVariant('{{PLUGIN_ID}}-light', 'my-custom-light', {
      primary: builder.colors.blue700,  // Different primary color
      background: builder.colors.gray100,  // Slightly darker background
    });
  },
};
```

### Adding Custom Colors

You can add your own colors alongside this theme:

```typescript
export const myPlugin: ThemePlugin = {
  id: 'my-plugin',
  version: '1.0.0',
  dependencies: [{ id: '{{PLUGIN_ID}}' }],

  register(builder) {
    // Add a custom accent color
    builder.addColor('purple', {
      source: { l: 0.55, c: 0.15, h: 300 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    });

    // Use it in a new variant
    builder.addThemeVariant('my-purple-theme', {
      ...builder.getThemeVariant('{{PLUGIN_ID}}-light'),
      primary: builder.colors.purple600,
      primaryHover: builder.colors.purple700,
    });
  },
};
```

## Color Reference

All colors are available with 11 steps each:

| Step | Lightness    | Use Case                |
| ---- | ------------ | ----------------------- |
| 50   | Lightest     | Background tints        |
| 100  | Very light   | Hover states            |
| 200  | Light        | Borders, dividers       |
| 300  | Medium-light | Disabled states         |
| 400  | Medium       | Secondary UI            |
| 500  | Base         | Primary UI (light mode) |
| 600  | Medium-dark  | Primary UI (dark mode)  |
| 700  | Dark         | Hover states            |
| 800  | Very dark    | Active states           |
| 900  | Darkest      | Text on light           |
| 950  | Deepest      | Backgrounds             |

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

### Preview

```bash
npm run dev
# Open http://localhost:5173/demo/theme-preview.html
```

## License

{{LICENSE}}

## Author

{{AUTHOR}}

## Links

- [Documentation]({{HOMEPAGE}})
- [Issues]({{ISSUES_URL}})
- [Changelog](./CHANGELOG.md)
