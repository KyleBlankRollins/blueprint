/**
 * Primitives Plugin
 * Core color primitives shared by all themes
 *
 * Provides essential base colors:
 * - Pure white (100% lightness)
 * - Pure black (0% lightness)
 *
 * These primitives are used as foundation colors across all theme variants
 * and should be loaded before any other theme plugins.
 *
 * @module primitives
 * @version 1.0.0
 */

import type { ThemePlugin } from '../../core/types.js';

export const primitivesPlugin: ThemePlugin = {
  id: 'primitives',
  version: '1.0.0',
  name: 'Blueprint Primitives',
  description: 'Core color primitives (white, black) shared by all themes',
  author: 'Blueprint Team',
  license: 'MIT',
  tags: ['core', 'primitives', 'foundation'],

  register(builder) {
    // Pure white - Used for high contrast elements, inverted text, and clean backgrounds
    builder.addColor('white', {
      source: { l: 1.0, c: 0, h: 0 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Pure White',
        description:
          'Achromatic white used for maximum contrast and clean surfaces',
        tags: ['primitive', 'achromatic'],
      },
    });

    // Pure black - Used for text, shadows, and maximum contrast
    builder.addColor('black', {
      source: { l: 0.0, c: 0, h: 0 },
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      metadata: {
        name: 'Pure Black',
        description: 'Achromatic black used for text and maximum contrast',
        tags: ['primitive', 'achromatic'],
      },
    });
  },
};

export default primitivesPlugin;
