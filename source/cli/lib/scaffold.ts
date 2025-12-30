import * as fs from 'fs';
import * as path from 'path';

export interface ScaffoldResult {
  success: boolean;
  componentName?: string;
  filesCreated?: string[];
  error?: string;
}

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

export function validateComponentName(name: string): boolean {
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
    'cli',
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
export function scaffoldComponent(componentName: string): ScaffoldResult {
  // Validate component name
  if (!validateComponentName(componentName)) {
    return {
      success: false,
      error: `Invalid component name: "${componentName}". Must be kebab-case (e.g., "my-component")`,
    };
  }

  const componentsDir = path.join(process.cwd(), 'source', 'components');
  const componentDir = path.join(componentsDir, componentName);

  // Check if component directory already exists
  if (fs.existsSync(componentDir)) {
    return {
      success: false,
      error: `Component directory already exists: ${componentDir}`,
    };
  }

  const filesCreated: string[] = [];

  try {
    // Create component directory
    fs.mkdirSync(componentDir, { recursive: true });
    filesCreated.push(componentDir);

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
      filesCreated.push(filePath);
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
    filesCreated.push(indexPath);

    return {
      success: true,
      componentName,
      filesCreated,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to scaffold component: ${error}`,
    };
  }
}
