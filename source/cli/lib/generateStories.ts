import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Constants for JSDoc extraction
const JSDOC_SEARCH_LINES = 10;
const JSDOC_START_SEARCH_LINES = 20;

/**
 * Information about a component property extracted from source code.
 */
export interface PropertyInfo {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

/**
 * Result of story generation operation.
 */
export interface StoryGenerationResult {
  success: boolean;
  storiesGenerated: string[];
  errors: string[];
  warnings: string[];
}

/**
 * Validates component name format (kebab-case).
 * @param name - Component name to validate
 * @returns True if valid kebab-case format
 */
export function isValidComponentName(name: string): boolean {
  return /^[a-z]+(-[a-z]+)*$/.test(name);
}

/**
 * Converts kebab-case string to PascalCase.
 * @param str - Kebab-case string to convert
 * @returns PascalCase version of the string
 */
export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Extracts JSDoc comment before a given line.
 * @param lines - All file lines
 * @param startLine - Line to search backwards from
 * @returns Extracted description or empty string
 */
function extractJSDoc(lines: string[], startLine: number): string {
  for (
    let lineIndex = startLine - 1;
    lineIndex >= Math.max(0, startLine - JSDOC_SEARCH_LINES);
    lineIndex--
  ) {
    const line = lines[lineIndex]?.trim();
    if (line?.includes('*/')) {
      let jsDocStart = -1;
      for (
        let searchIndex = lineIndex;
        searchIndex >= Math.max(0, lineIndex - JSDOC_START_SEARCH_LINES);
        searchIndex--
      ) {
        if (lines[searchIndex]?.trim().includes('/**')) {
          jsDocStart = searchIndex;
          break;
        }
      }

      if (jsDocStart !== -1) {
        const jsDoc = lines.slice(jsDocStart, lineIndex + 1).join('\n');
        const descMatch = jsDoc.match(/\/\*\*\s*([\s\S]*?)\*\*/);
        if (descMatch) {
          const jsDocContent = descMatch[1];
          return jsDocContent
            .split('\n')
            .map((line) => line.replace(/^\s*\*\s?/, '').trim())
            .filter((line) => line && !line.startsWith('@'))
            .join(' ');
        }
      }
      break;
    }
  }
  return '';
}

/**
 * Loads a template file and replaces placeholders with values.
 * @param templateName - Name of the template file
 * @param replacements - Key-value pairs for placeholder replacement
 * @returns Processed template content
 */
function loadTemplate(
  templateName: string,
  replacements: Record<string, string>
): string {
  const templatePath = join(process.cwd(), 'source', 'templates', templateName);

  if (!existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  let content = readFileSync(templatePath, 'utf-8');

  Object.entries(replacements).forEach(([key, value]) => {
    // Replace {{PLACEHOLDER}} with actual values
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  });

  return content;
}

/**
 * Extracts property information from component source code.
 * @param content - Component file content
 * @returns Array of property information objects
 */
function extractProperties(content: string): PropertyInfo[] {
  const properties: PropertyInfo[] = [];
  const lines = content.split('\n');

  for (
    let currentLineIndex = 0;
    currentLineIndex < lines.length;
    currentLineIndex++
  ) {
    const line = lines[currentLineIndex];

    if (!line?.includes('@property')) {
      continue;
    }

    // Extract JSDoc description
    const description = extractJSDoc(lines, currentLineIndex);

    const propertyMatch = line.match(/@property\s*\(\s*\{([^}]*)\}\s*\)/);
    if (!propertyMatch) {
      continue;
    }

    let declarationLine = line;
    // Check if property declaration is on same line or next line
    if (!line.match(/\)\s+(?:declare\s+)?(\w+)\s*:/)) {
      declarationLine = lines[currentLineIndex + 1] || '';
    }

    // Match pattern: ) propertyName: type [= defaultValue];
    const declMatch = declarationLine.match(
      /\)\s+(?:declare\s+)?(\w+)\s*:\s*([^;=]+)(?:\s*=\s*([^;]+))?;/
    );
    if (!declMatch?.[1]) {
      continue;
    }

    const name = declMatch[1];
    const type = declMatch[2]?.trim() || 'unknown';
    let defaultValue = declMatch[3]?.trim() || '';

    if (defaultValue) {
      defaultValue = defaultValue.replace(/^['"`]|['"`]$/g, '');
    }

    properties.push({
      name,
      type,
      defaultValue,
      description,
    });
  }

  return properties;
}

/**
 * Parses a TypeScript union type string into individual values.
 * @param typeString - Type string like "'small' | 'medium' | 'large'"
 * @returns Array of union values or null if not a valid union type
 */
function parseUnionType(typeString: string): string[] | null {
  // Match pattern: 'value1' | 'value2' | 'value3'
  const unionMatch = typeString.match(
    /^(['"][\w-]+['"](\s*\|\s*['"][\w-]+['"])+)$/
  );
  if (!unionMatch) {
    return null;
  }

  const values = typeString
    .split('|')
    .map((value) => value.trim().replace(/^['"]|['"]$/g, ''));

  return values;
}

/**
 * Generates Storybook argTypes configuration from properties.
 * @param properties - Array of component properties
 * @returns Formatted argTypes string for Storybook
 */
function generateArgTypes(properties: PropertyInfo[]): string {
  if (properties.length === 0) {
    return '    // No properties to configure';
  }

  const argTypes = properties
    .map((prop) => {
      const unionValues = parseUnionType(prop.type);

      if (unionValues) {
        return `    ${prop.name}: { 
      control: 'select',
      options: [${unionValues.map((value) => `'${value}'`).join(', ')}],
      description: '${prop.description || prop.name}',
    }`;
      } else if (prop.type === 'boolean' || prop.type === 'Boolean') {
        return `    ${prop.name}: { 
      control: 'boolean',
      description: '${prop.description || prop.name}',
    }`;
      } else if (prop.type === 'number' || prop.type === 'Number') {
        return `    ${prop.name}: { 
      control: 'number',
      description: '${prop.description || prop.name}',
    }`;
      } else {
        return `    ${prop.name}: { 
      control: 'text',
      description: '${prop.description || prop.name}',
    }`;
      }
    })
    .join(',\n');

  return argTypes;
}

/**
 * Generates default args object for Storybook stories.
 * @param properties - Array of component properties
 * @returns Formatted args string with default values
 */
function generateDefaultArgs(properties: PropertyInfo[]): string {
  if (properties.length === 0) {
    return '';
  }

  const args = properties
    .map((prop) => {
      let value = prop.defaultValue;

      if (!value) {
        if (prop.type === 'boolean' || prop.type === 'Boolean') {
          value = 'false';
        } else if (prop.type === 'number' || prop.type === 'Number') {
          value = '0';
        } else {
          const unionValues = parseUnionType(prop.type);
          if (unionValues && unionValues.length > 0 && unionValues[0]) {
            value = `'${unionValues[0]}'`;
          } else {
            value = "''";
          }
        }
      } else {
        if (
          prop.type.includes("'") ||
          prop.type.includes('"') ||
          prop.type === 'string' ||
          prop.type === 'String'
        ) {
          if (!value.startsWith("'") && !value.startsWith('"')) {
            value = `'${value}'`;
          }
        }
      }

      return `    ${prop.name}: ${value}`;
    })
    .join(',\n');

  return args;
}

/**
 * Generates property binding syntax for Lit templates.
 * @param properties - Array of component properties
 * @returns String of property bindings (e.g., ".prop=${args.prop}")
 */
function generatePropertyBindings(properties: PropertyInfo[]): string {
  if (properties.length === 0) {
    return '';
  }

  return properties
    .map((prop) => {
      if (prop.type === 'boolean' || prop.type === 'Boolean') {
        return `?${prop.name}=\${args.${prop.name}}`;
      } else {
        return `.${prop.name}=\${args.${prop.name}}`;
      }
    })
    .join(' ');
}

/**
 * Generates additional story variants based on component properties.
 * Creates stories for variants, sizes, and disabled states.
 * @param properties - Array of component properties
 * @returns String containing additional story exports
 */
function generateVariantStories(properties: PropertyInfo[]): string {
  const stories: string[] = [];

  const variantProp = properties.find(
    (prop) =>
      prop.name === 'variant' &&
      parseUnionType(prop.type) &&
      parseUnionType(prop.type)!.length > 1
  );
  const sizeProp = properties.find(
    (prop) =>
      prop.name === 'size' &&
      parseUnionType(prop.type) &&
      parseUnionType(prop.type)!.length > 1
  );

  if (variantProp) {
    const variants = parseUnionType(variantProp.type);
    if (variants) {
      variants.forEach((variant) => {
        const storyName = toPascalCase(variant);
        stories.push(`
export const ${storyName}: Story = {
  ...Default,
  args: {
    ...Default.args,
    variant: '${variant}',
  },
};`);
      });
    }
  }

  if (sizeProp) {
    const sizes = parseUnionType(sizeProp.type);
    if (sizes) {
      sizes.forEach((size) => {
        const storyName = toPascalCase(size);
        stories.push(`
export const ${storyName}: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: '${size}',
  },
};`);
      });
    }
  }

  const disabledProp = properties.find(
    (prop) =>
      prop.name === 'disabled' &&
      (prop.type === 'boolean' || prop.type === 'Boolean')
  );
  if (disabledProp) {
    stories.push(`
export const Disabled: Story = {
  ...Default,
  args: {
    ...Default.args,
    disabled: true,
  },
};`);
  }

  return stories.join('');
}

/**
 * Generates complete Storybook stories file content.
 * @param componentName - Name of the component (kebab-case)
 * @param properties - Array of component properties
 * @returns Complete stories file content
 */
function generateStoriesFile(
  componentName: string,
  properties: PropertyInfo[]
): string {
  const tagName = `bp-${componentName}`;
  const titleName = toPascalCase(componentName);

  const argTypes = generateArgTypes(properties);
  const defaultArgs = generateDefaultArgs(properties);
  const propertyBindings = generatePropertyBindings(properties);
  const variantStories = generateVariantStories(properties);

  let storiesContent = loadTemplate('baseComponent.stories.template', {
    COMPONENT_NAME: componentName,
    TITLE_NAME: titleName,
    TAG_NAME: tagName,
  });

  storiesContent = storiesContent.replace(
    /argTypes:\s*\{[\s\S]*?\n {2}\}/,
    `argTypes: {
${argTypes}
  }`
  );

  storiesContent = storiesContent.replace(
    /args:\s*\{[\s\S]*?\n {2}\}/,
    `args: {
${defaultArgs}
  }`
  );

  storiesContent = storiesContent.replace(
    /\.someProp=\$\{args\.someProp\}/,
    propertyBindings
  );

  storiesContent = storiesContent.replace(/Default content/, 'Button Content');

  if (variantStories) {
    storiesContent += variantStories;
  }

  return storiesContent;
}

/**
 * Generates Storybook stories for a component.
 * @param componentName - Name of the component (kebab-case)
 * @returns Result object with success status, generated files, errors, and warnings
 */
export function generateStories(componentName: string): StoryGenerationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const storiesGenerated: string[] = [];

  if (!isValidComponentName(componentName)) {
    return {
      success: false,
      storiesGenerated: [],
      errors: [
        'Invalid component name. Must be kebab-case (e.g., button, my-component)',
      ],
      warnings: [],
    };
  }

  const componentDir = join(
    process.cwd(),
    'source',
    'components',
    componentName
  );
  const componentFile = join(componentDir, `${componentName}.ts`);

  if (!existsSync(componentFile)) {
    return {
      success: false,
      storiesGenerated: [],
      errors: [`Component file not found: ${componentFile}`],
      warnings: [],
    };
  }

  const componentContent = readFileSync(componentFile, 'utf-8');
  const properties = extractProperties(componentContent);

  if (properties.length === 0) {
    warnings.push(
      'No properties found in component. Generated stories will be basic.'
    );
  }

  let storiesContent: string;
  try {
    storiesContent = generateStoriesFile(componentName, properties);
  } catch (error) {
    errors.push(`Failed to generate stories content: ${error}`);
    return {
      success: false,
      storiesGenerated: [],
      errors,
      warnings,
    };
  }

  const storiesFile = join(componentDir, `${componentName}.stories.ts`);

  if (existsSync(storiesFile)) {
    warnings.push(
      `Stories file already exists at ${storiesFile}. It will be overwritten.`
    );
  }

  try {
    writeFileSync(storiesFile, storiesContent, 'utf-8');
    storiesGenerated.push(storiesFile);
  } catch (error) {
    errors.push(`Failed to write stories file: ${error}`);
    return {
      success: false,
      storiesGenerated: [],
      errors,
      warnings,
    };
  }

  return {
    success: true,
    storiesGenerated,
    errors,
    warnings,
  };
}
