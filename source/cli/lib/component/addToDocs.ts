import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  extractAPI,
  formatMarkdownTable,
  isValidComponentName,
} from './extractAPI.js';

export interface DocsResult {
  success: boolean;
  docsPath: string;
  errors: string[];
}

export { isValidComponentName };

/**
 * Converts kebab-case to Title Case.
 * @param str - String in kebab-case format
 * @returns Title Case string
 */
function kebabToTitleCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generates MDX content for a component documentation page.
 * @param componentName - Component name in kebab-case
 * @param api - Extracted API information
 * @returns MDX content string
 */
function generateMdxContent(
  componentName: string,
  api: ReturnType<typeof extractAPI>
): string {
  const titleCase = kebabToTitleCase(componentName);
  const tagName = `bp-${componentName}`;

  // Build properties table
  let propertiesTable = '';
  if (api.properties.length > 0) {
    const headers = ['Property', 'Type', 'Default', 'Description'];
    const rows = api.properties.map((prop) => [
      `\`${prop.name}\``,
      `\`${prop.type}\``,
      prop.defaultValue ? `\`${prop.defaultValue}\`` : '-',
      prop.description || '-',
    ]);
    propertiesTable = formatMarkdownTable(headers, rows);
  } else {
    propertiesTable = 'This component has no configurable properties.\n';
  }

  // Build events table
  let eventsSection = '';
  if (api.events.length > 0) {
    const headers = ['Event', 'Detail', 'Description'];
    const rows = api.events.map((event) => [
      `\`${event.name}\``,
      event.detail === '-' ? '-' : `\`${event.detail}\``,
      event.description,
    ]);
    eventsSection = `
### Events

${formatMarkdownTable(headers, rows)}`;
  }

  return `---
title: ${titleCase}
description: The ${tagName} component
---

import ComponentPreview from '../../../components/ComponentPreview.astro';

The \`${tagName}\` component.

## Import

\`\`\`javascript
import 'blueprint/components/${componentName}';
\`\`\`

## Examples

### Default

<ComponentPreview>
  <${tagName}></${tagName}>
</ComponentPreview>

\`\`\`html
<${tagName}></${tagName}>
\`\`\`

## API Reference

### Properties

${propertiesTable}${eventsSection}
`;
}

/**
 * Updates the Sidebar.astro navigation to include the new component.
 * Inserts the entry alphabetically in the Components section.
 * @param componentName - Component name in kebab-case
 * @returns Object with success status and any errors
 */
function updateSidebarNavigation(componentName: string): {
  success: boolean;
  error?: string;
} {
  const root = process.cwd();
  const sidebarPath = join(root, 'docs', 'src', 'components', 'Sidebar.astro');

  if (!existsSync(sidebarPath)) {
    return { success: false, error: 'Sidebar.astro not found' };
  }

  const content = readFileSync(sidebarPath, 'utf-8');
  const titleCase = kebabToTitleCase(componentName);
  const href = `/components/${componentName}`;

  // Check if entry already exists
  if (content.includes(`href: '${href}'`)) {
    return { success: true }; // Already exists, skip
  }

  // Find the Components section items array
  // Look for the pattern: title: 'Components', items: [
  const componentsSectionMatch = content.match(
    /(\{\s*title:\s*'Components',\s*items:\s*\[)([\s\S]*?)(\]\s*,?\s*\})/
  );

  if (!componentsSectionMatch) {
    return { success: false, error: 'Could not find Components section in Sidebar.astro' };
  }

  const [fullMatch, prefix, itemsContent, suffix] = componentsSectionMatch;

  // Parse existing items
  const itemPattern = /\{\s*label:\s*'([^']+)',\s*href:\s*'([^']+)'\s*\}/g;
  const items: Array<{ label: string; href: string }> = [];
  let match;

  while ((match = itemPattern.exec(itemsContent)) !== null) {
    items.push({ label: match[1], href: match[2] });
  }

  // Add new item
  items.push({ label: titleCase, href });

  // Sort alphabetically by label
  items.sort((a, b) => a.label.localeCompare(b.label));

  // Rebuild items array
  const newItemsContent = items
    .map((item) => `      { label: '${item.label}', href: '${item.href}' }`)
    .join(',\n');

  const newSection = `${prefix}\n${newItemsContent},\n    ${suffix}`;
  const newContent = content.replace(fullMatch, newSection);

  writeFileSync(sidebarPath, newContent, 'utf-8');

  return { success: true };
}

/**
 * Adds a documentation page for a component.
 * @param componentName - Name of the component (kebab-case)
 * @returns Result with success status, docs path, and any errors
 */
export function addToDocs(componentName: string): DocsResult {
  const root = process.cwd();
  const docsPath = join(
    root,
    'docs',
    'src',
    'content',
    'docs',
    'components',
    `${componentName}.mdx`
  );

  // Check if docs page already exists
  if (existsSync(docsPath)) {
    return {
      success: false,
      docsPath,
      errors: [`Documentation page already exists: ${componentName}.mdx`],
    };
  }

  // Extract API from component
  const api = extractAPI(componentName);

  if (!api.success) {
    return {
      success: false,
      docsPath,
      errors: api.errors,
    };
  }

  // Generate MDX content
  const mdxContent = generateMdxContent(componentName, api);

  // Write the MDX file
  writeFileSync(docsPath, mdxContent, 'utf-8');

  // Update sidebar navigation
  const sidebarResult = updateSidebarNavigation(componentName);

  const errors: string[] = [];
  if (!sidebarResult.success && sidebarResult.error) {
    errors.push(`Warning: ${sidebarResult.error}`);
  }

  return {
    success: true,
    docsPath,
    errors,
  };
}
