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

// Read all .svg files, sorted
const svgFiles = fs
  .readdirSync(iconsSourceDir)
  .filter((f) => f.endsWith('.svg'))
  .sort();

// Derive icon name from filename: "arrow_down.svg" → "arrow-down"
function toIconName(filename) {
  return filename.replace('.svg', '').replace(/_/g, '-');
}

// Clear and recreate entries dir
fs.rmSync(entriesOutputDir, { recursive: true, force: true });
fs.mkdirSync(entriesOutputDir, { recursive: true });

// Write per-icon entry files
for (const file of svgFiles) {
  const iconName = toIconName(file);
  const svgContent = fs
    .readFileSync(path.join(iconsSourceDir, file), 'utf-8')
    .trim();
  const entryContent = `// Auto-generated icon entry — do not edit.
// Re-generate: node source/components/icon/generate-icon-entries.js

import { registerIcon } from '../../icon-registry.js';

const svg = ${JSON.stringify(svgContent)};
registerIcon('${iconName}', svg);
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

// Write all-icons barrel
const allImports = svgFiles
  .map((f) => `import './entries/${toIconName(f)}.js';`)
  .join('\n');
const barrelContent = `// Auto-generated barrel — imports all icon entries.
// Used by Storybook and dev tools. NOT for production consumers.
// Re-generate: node source/components/icon/generate-icon-entries.js

${allImports}
`;
fs.writeFileSync(allBarrelFile, barrelContent);

// Report
console.log(`Generated ${svgFiles.length} icon entries in ${entriesOutputDir}`);
console.log(`Generated type file: ${typeOutputFile}`);
console.log(`Generated barrel file: ${allBarrelFile}`);
