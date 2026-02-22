import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsSourceDir = path.resolve(__dirname, '../../assets/icons');
const entriesOutputDir = path.resolve(__dirname, './icons/entries');
const typeOutputFile = path.resolve(
  __dirname,
  './icons/icon-name.generated.ts'
);
const allBarrelFile = path.resolve(__dirname, './icons/all.ts');
const resolverOutputFile = path.resolve(__dirname, './icons/resolver.generated.ts');

// Read all .svg files, sorted
const svgFiles = fs
  .readdirSync(iconsSourceDir)
  .filter((f) => f.endsWith('.svg'))
  .sort();

// Derive icon name from filename: "arrow_down.svg" → "arrow-down"
function toIconName(filename) {
  return filename.replace('.svg', '').replace(/_/g, '-');
}

// Derive a camelCase export name: "info-circle" → "infoCircleSvg"
// Handles leading digits after hyphens: "battery-75" → "battery75Svg"
function toExportName(iconName) {
  const camel = iconName.replace(/-([a-z0-9])/g, (_, char) =>
    char.toUpperCase()
  );
  return `${camel}Svg`;
}

// Clear and recreate entries dir
fs.rmSync(entriesOutputDir, { recursive: true, force: true });
fs.mkdirSync(entriesOutputDir, { recursive: true });

// Write per-icon entry files — each exports the SVG string as a value
// Named export for static imports (internal components), default export
// for dynamic imports (lazy loading by name).
for (const file of svgFiles) {
  const iconName = toIconName(file);
  const exportName = toExportName(iconName);
  const svgContent = fs
    .readFileSync(path.join(iconsSourceDir, file), 'utf-8')
    .trim();
  const entryContent = `// Auto-generated icon entry — do not edit.
// Re-generate: node source/components/icon/generate-icon-entries.js

export const ${exportName} = ${JSON.stringify(svgContent)};
export default ${exportName};
`;
  fs.writeFileSync(path.join(entriesOutputDir, `${iconName}.ts`), entryContent);
}

// Write IconName type
const iconNameType = svgFiles.map((f) => `  | '${toIconName(f)}'`).join('\n');
const typeContent = `// Auto-generated icon name type — do not edit.
// Re-generate: node source/components/icon/generate-icon-entries.js

export type IconName =
${iconNameType};
`;
fs.writeFileSync(typeOutputFile, typeContent);

// Write all-icons barrel — imports every icon entry and registers them all.
// Used by Storybook and dev tools. NOT for production consumers.
const allImports = svgFiles
  .map((f) => {
    const iconName = toIconName(f);
    const exportName = toExportName(iconName);
    return `import { ${exportName} } from './entries/${iconName}.js';`;
  })
  .join('\n');
const allRegistrations = svgFiles
  .map((f) => {
    const iconName = toIconName(f);
    const exportName = toExportName(iconName);
    return `  registerIcon('${iconName}', ${exportName});`;
  })
  .join('\n');
const barrelContent = `// Auto-generated barrel — imports and registers all icons.
// Used by Storybook and dev tools. NOT for production consumers.
// Re-generate: node source/components/icon/generate-icon-entries.js

import { registerIcon } from '../icon-registry.js';

${allImports}

${allRegistrations}
`;
fs.writeFileSync(allBarrelFile, barrelContent);

// Write lazy resolver — maps icon names to dynamic import functions.
// Used by bp-icon's _loadIcon method. Each import path is static so
// bundlers (Rollup, Vite, esbuild) can analyse and rewrite them.
const resolverEntries = svgFiles
  .map((f) => {
    const iconName = toIconName(f);
    return `  '${iconName}': () => import('./entries/${iconName}.js'),`;
  })
  .join('\n');
const resolverContent = `// Auto-generated icon resolver — do not edit.
// Re-generate: node source/components/icon/generate-icon-entries.js

const resolvers: Record<string, () => Promise<{ default: string }>> = {
${resolverEntries}
};

export async function loadIconByName(name: string): Promise<string | undefined> {
  const loader = resolvers[name];
  if (!loader) return undefined;
  const mod = await loader();
  return mod.default;
}
`;
fs.writeFileSync(resolverOutputFile, resolverContent);

// Report
console.log(`Generated ${svgFiles.length} icon entries in ${entriesOutputDir}`);
console.log(`Generated type file: ${typeOutputFile}`);
console.log(`Generated barrel file: ${allBarrelFile}`);
console.log(`Generated resolver file: ${resolverOutputFile}`);
