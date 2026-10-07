import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { wcagContrast } from 'culori';

/**
 * The theme generator checks the text pairs it knows about. This test covers
 * the pairs components actually use: every CSS rule in a component stylesheet
 * that sets both a `--bp-color-*` background and a `--bp-color-*` text color
 * must reach WCAG AA (4.5:1) in every blueprint-core theme.
 */
const here = dirname(fileURLToPath(import.meta.url));
const generated = join(here, '..', 'themes', 'generated', 'blueprint-core');

const readTheme = (name: string): Map<string, string> => {
  const css = readFileSync(join(generated, `${name}.css`), 'utf8');
  const values = new Map<string, string>();
  for (const m of css.matchAll(/(--bp-color-[\w-]+):\s*(oklch\([^)]*\))/g)) {
    values.set(m[1], m[2]);
  }
  return values;
};
const themes = { light: readTheme('light'), dark: readTheme('dark') };

type Pair = { rule: string; fg: string; bg: string };
const pairsIn = (css: string): Pair[] => {
  const pairs: Pair[] = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const body = m[2];
    const bg = body.match(
      /background(?:-color)?:\s*var\((--bp-color-[\w-]+)\)\s*;/
    );
    const fg = body.match(/(?<![-\w])color:\s*var\((--bp-color-[\w-]+)\)\s*;/);
    if (bg && fg) {
      const rule = m[1].trim().split('\n').pop()!.trim();
      pairs.push({ rule, fg: fg[1], bg: bg[1] });
    }
  }
  return pairs;
};

const styleFiles = readdirSync(here, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => join(d.name, `${d.name}.style.ts`))
  .filter((f) => existsSync(join(here, f)));

describe('component text contrast', () => {
  it.each(styleFiles)('%s keeps text on fills at 4.5:1', (file) => {
    const failures: string[] = [];
    for (const { rule, fg, bg } of pairsIn(
      readFileSync(join(here, file), 'utf8')
    )) {
      for (const [theme, values] of Object.entries(themes)) {
        const f = values.get(fg);
        const b = values.get(bg);
        // Translucent fills (hover/active overlays) sit on another ground, so
        // they have no contrast of their own.
        if (!f || !b || b.includes('/')) continue;
        const ratio = wcagContrast(f, b);
        if (ratio < 4.5) {
          failures.push(
            `${theme}: ${rule} ${fg} on ${bg} = ${ratio.toFixed(2)}:1`
          );
        }
      }
    }
    expect(failures).toEqual([]);
  });
});
