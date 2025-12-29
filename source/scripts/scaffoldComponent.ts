import * as fs from 'fs';
import * as path from 'path';

// Utility functions
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function validateComponentName(name: string): boolean {
  // Must be kebab-case (lowercase letters, numbers, hyphens)
  // Must not start or end with hyphen
  // Must not have consecutive hyphens
  const kebabCaseRegex = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
  return kebabCaseRegex.test(name);
}

// Template generators
function loadTemplate(
  templateName: string,
  replacements: Record<string, string>
): string {
  const templatePath = path.join(
    process.cwd(),
    'source',
    'templates',
    templateName
  );
  let content = fs.readFileSync(templatePath, 'utf-8');

  // Replace all placeholders
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  });

  return content;
}

function generateComponentTemplate(componentName: string): string {
  const replacements = {
    CLASS_NAME: `Bp${toPascalCase(componentName)}`,
    TAG_NAME: `bp-${componentName}`,
    COMPONENT_NAME: componentName,
    STYLES_NAME: `${toCamelCase(componentName)}Styles`,
  };

  return loadTemplate('baseComponent.template', replacements);
}

function generateStyleTemplate(componentName: string): string {
  const replacements = {
    COMPONENT_NAME: componentName,
    STYLES_NAME: `${toCamelCase(componentName)}Styles`,
  };

  return loadTemplate('baseComponent.style.template', replacements);
}

function generateTestTemplate(componentName: string): string {
  const replacements = {
    CLASS_NAME: `Bp${toPascalCase(componentName)}`,
    TAG_NAME: `bp-${componentName}`,
    COMPONENT_NAME: componentName,
  };

  return loadTemplate('baseComponent.test.template', replacements);
}

function generateStoriesTemplate(componentName: string): string {
  const replacements = {
    CLASS_NAME: `Bp${toPascalCase(componentName)}`,
    TAG_NAME: `bp-${componentName}`,
    COMPONENT_NAME: componentName,
    TITLE_NAME: toPascalCase(componentName),
  };

  return loadTemplate('baseComponent.stories.template', replacements);
}

function generateReadmeTemplate(componentName: string): string {
  const replacements = {
    CLASS_NAME: `Bp${toPascalCase(componentName)}`,
    TAG_NAME: `bp-${componentName}`,
    TITLE_NAME: toPascalCase(componentName),
  };

  return loadTemplate('baseComponent.README.md', replacements);
}

// Main scaffolding function
export function scaffoldComponent(componentName: string): void {
  // Validate component name
  if (!validateComponentName(componentName)) {
    console.error(
      `Invalid component name: "${componentName}". Must be kebab-case (e.g., "my-component")`
    );
    process.exit(1);
  }

  const componentsDir = path.join(process.cwd(), 'source', 'components');
  const componentDir = path.join(componentsDir, componentName);

  // Check if component directory already exists
  if (fs.existsSync(componentDir)) {
    console.error(`Component directory already exists: ${componentDir}`);
    process.exit(1);
  }

  // Create component directory
  fs.mkdirSync(componentDir, { recursive: true });
  console.log(`Created directory: ${componentDir}`);

  // Create files
  const files = [
    {
      name: `${componentName}.ts`,
      content: generateComponentTemplate(componentName),
    },
    {
      name: `${componentName}.style.ts`,
      content: generateStyleTemplate(componentName),
    },
    {
      name: `${componentName}.test.ts`,
      content: generateTestTemplate(componentName),
    },
    {
      name: `${componentName}.stories.ts`,
      content: generateStoriesTemplate(componentName),
    },
    {
      name: 'README.md',
      content: generateReadmeTemplate(componentName),
    },
  ];

  files.forEach((file) => {
    const filePath = path.join(componentDir, file.name);
    fs.writeFileSync(filePath, file.content, 'utf-8');
    console.log(`Created file: ${filePath}`);
  });

  // Add export to components/index.ts
  const indexPath = path.join(componentsDir, 'index.ts');
  const className = `Bp${toPascalCase(componentName)}`;
  const exportStatement = `export { ${className} } from './${componentName}/${componentName}.js';\n`;

  // Read existing exports or create new file
  let indexContent = '';
  if (fs.existsSync(indexPath)) {
    indexContent = fs.readFileSync(indexPath, 'utf-8');
  }

  // Append new export
  indexContent += exportStatement;
  fs.writeFileSync(indexPath, indexContent, 'utf-8');
  console.log(`Added export to ${indexPath}`);

  // Remind user of next steps
  console.log('\n✅ Component scaffolded successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Implement component logic');
  console.log('2. Write tests (minimum 10)');
  console.log('3. Create Storybook stories');
  console.log('4. Complete README documentation');
  console.log('5. Run `npm run format` and `npm run lint`');
}

// CLI execution
const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: npm run scaffold <component-name>');
  console.error('Example: npm run scaffold my-button');
  process.exit(1);
}

scaffoldComponent(componentName);
