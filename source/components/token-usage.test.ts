import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Every --bp-* custom property a component stylesheet reads must be declared
 * by the generated theme CSS (or by the component itself), otherwise the
 * declaration silently falls back to the browser default.
 */
const here = dirname(fileURLToPath(import.meta.url));
const generated = join(here, '..', 'themes', 'generated');

const declared = new Set<string>();
const collectDeclared = (css: string) => {
  for (const m of css.matchAll(/(--bp-[A-Za-z0-9-]+)\s*:/g)) declared.add(m[1]);
};
for (const file of [
  'utilities.css',
  join('blueprint-core', 'light.css'),
  join('blueprint-core', 'dark.css'),
]) {
  collectDeclared(readFileSync(join(generated, file), 'utf8'));
}

const styleFiles = readdirSync(here, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) =>
    readdirSync(join(here, d.name))
      .filter((f) => f.endsWith('.style.ts'))
      .map((f) => join(d.name, f))
  );

describe('component token usage', () => {
  it.each(styleFiles)('%s only reads declared --bp-color-* tokens', (file) => {
    const css = readFileSync(join(here, file), 'utf8');
    collectDeclared(css); // component-local custom properties count as declared
    const used = [...css.matchAll(/var\(\s*(--bp-color-[A-Za-z0-9-]+)/g)].map(
      (m) => m[1]
    );
    const missing = [...new Set(used)].filter((t) => !declared.has(t));
    expect(missing).toEqual([]);
  });
});
