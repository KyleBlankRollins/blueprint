/**
 * Guards the committed theme output in source/themes/generated.
 *
 * Themes are generated (`npm run theme:generate`), so the committed files must
 * be exactly what the generator produces from the plugins and defaults. If this
 * test fails, either regenerate the themes or fix the source that drifted.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as prettier from 'prettier';
import {
  ThemeBuilder,
  ThemeBase,
  buildTheme,
  generateFontFaceCSSForPlugin,
  generateAllColorScales,
  validateThemeContrast,
} from '../builder/index.js';
import { collectPluginAssets } from '../builder/assetCollector.js';

const here = dirname(fileURLToPath(import.meta.url));
const generatedDir = join(here, '..', 'generated');
const pluginsDir = join(here, '..', 'plugins');

async function generateFiles(): Promise<Record<string, string>> {
  const builder = ThemeBuilder.withDefaults();
  const theme = builder.build();
  const plugins = builder
    .getPlugins()
    .filter((p): p is ThemeBase => p instanceof ThemeBase);

  const assets = await collectPluginAssets(plugins, pluginsDir);
  const fontFaceByPlugin = new Map<string, string>();
  for (const plugin of plugins) {
    const css = generateFontFaceCSSForPlugin(assets, plugin.id);
    if (css) fontFaceByPlugin.set(plugin.id, css);
  }

  const files = buildTheme(theme, { fontFaceByPlugin });
  return Object.fromEntries(
    Object.entries(files).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  );
}

// The theme:generate script formats its output with Prettier, so compare the
// formatted generator output with what is committed.
async function format(file: string, content: string): Promise<string> {
  const filepath = join(generatedDir, file);
  const options = (await prettier.resolveConfig(filepath)) ?? {};
  return prettier.format(content, { ...options, filepath });
}

describe('generated themes', () => {
  it('committed files match the generator output', async () => {
    const files = await generateFiles();
    expect(Object.keys(files).length).toBeGreaterThan(0);

    for (const [file, content] of Object.entries(files)) {
      const committed = readFileSync(join(generatedDir, file), 'utf8');
      expect(
        await format(file, committed),
        `${file} is out of date: run npm run theme:generate`
      ).toBe(await format(file, content));
    }
  });

  it('registers the Figtree italic as an italic style of Figtree', () => {
    const css = readFileSync(
      join(generatedDir, 'blueprint-core', 'fonts.css'),
      'utf8'
    );
    const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(
      (m) => m[1]
    );
    const figtree = faces.filter((f) => /font-family:\s*'Figtree'/.test(f));
    expect(figtree.some((f) => /font-style:\s*normal/.test(f))).toBe(true);
    expect(figtree.some((f) => /font-style:\s*italic/.test(f))).toBe(true);
    expect(css).not.toContain("Figtree-Italic'");
  });

  it('blueprint-core meets the WCAG AA pairs checked by validateThemeContrast', () => {
    const theme = ThemeBuilder.withDefaults().build();
    expect(theme.accessibility?.enforceWCAG).toBe(true);
    const violations = validateThemeContrast(
      generateAllColorScales(theme.colors),
      theme
    );
    expect(violations).toEqual([]);
  });
});
