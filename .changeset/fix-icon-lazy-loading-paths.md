---
'@krollins/blueprint': patch
---

Fix icon lazy-loading in consumer bundler environments (Astro/Vite)

The previous approach used `import.meta.url` + `new Function('url', 'return import(url)')` to compute icon module URLs at runtime. This broke in consumer builds because `import.meta.url` points to the consumer's bundled chunk location, not the original package layout.

Replaced with a generated resolver module (`resolver.generated.ts`) containing static `import()` paths for all 430 icons. Static paths let the consumer's bundler (Vite, Rollup, esbuild) analyse and rewrite them at build time, so code-splitting works correctly in both dev and production.
