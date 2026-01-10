import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { error, info, success, warn } from '../../utils/logger.js';
import type { ComponentFeature } from './types.js';

/**
 * Open VS Code with agent context instructions
 */
export function openVSCodeWithContext(
  agentType: string,
  componentName: string,
  feature?: ComponentFeature | null
): void {
  const componentPath = join('source', 'components', componentName);

  try {
    // Create Copilot instructions file
    const instructions = generateAgentInstructions(
      agentType,
      componentName,
      feature
    );
    const instructionsFile = join(componentPath, '.copilot-context.md');

    writeFileSync(instructionsFile, instructions);

    // Open VS Code with the component directory
    const vscodeCommand = `code "${componentPath}"`;
    execSync(vscodeCommand, { stdio: 'inherit' });
    success('Opened VS Code successfully');
  } catch (err: unknown) {
    warn(
      'Could not open VS Code automatically. Please open the component directory manually.'
    );
    info(`Component path: ${componentPath}`);
    if (err instanceof Error) {
      error(`Error: ${err.message}`);
    }
  }
}

/**
 * Generate agent-specific instructions for VS Code Copilot
 */
export function generateAgentInstructions(
  agentType: string,
  componentName: string,
  feature?: ComponentFeature | null
): string {
  const featureInfo = feature
    ? `Component: bp-${componentName}
Description: ${feature.description}
Category: ${feature.category}
Complexity: ${feature.complexity}
Priority: ${feature.priority}/5
Dependencies: ${feature.depends_on.length > 0 ? feature.depends_on.join(', ') : 'None'}
`
    : `Component: bp-${componentName}
`;

  const baseInstructions = `# ${agentType.toUpperCase()} AGENT MODE

${featureInfo}Date: ${new Date().toISOString()}

`;

  switch (agentType) {
    case 'component-creator':
      return (
        baseInstructions +
        `## Instructions

You are acting as the **component-creator agent**. Your job is to:

### 1. Create Complete Component Structure
- [ ] \`${componentName}.ts\` - Component logic with @customElement decorator
- [ ] \`${componentName}.style.ts\` - Component styles using design tokens
- [ ] \`${componentName}.test.ts\` - Comprehensive tests (10+ test cases)
- [ ] \`${componentName}.stories.ts\` - Storybook documentation
- [ ] \`README.md\` - Complete API documentation

### 2. Follow Blueprint Standards
- [ ] Use \`bp-${componentName}\` as the custom element name
- [ ] Extend LitElement with Shadow DOM
- [ ] Use design tokens from \`source/themes/light.css\`
- [ ] Follow the scaffold reference pattern
- [ ] Implement proper accessibility (ARIA, keyboard nav)

### 3. Component Requirements
- [ ] Support multiple variants/sizes where appropriate
- [ ] Include proper TypeScript types
- [ ] Add CSS parts for styling hooks
- [ ] Implement proper event handling
- [ ] Include comprehensive JSDoc comments

### 4. Quality Checklist
- [ ] \`npm run lint\` passes
- [ ] \`npm run format\` passes  
- [ ] All tests pass
- [ ] Component renders in Storybook

**When complete, run:** \`bp agent review ${componentName}\`
`
      );

    case 'code-review':
      return (
        baseInstructions +
        `## Instructions

You are acting as the **code-review agent**. Your job is to:

### 1. Review Component Implementation
- [ ] Check adherence to Blueprint patterns
- [ ] Verify proper TypeScript usage
- [ ] Review error handling and edge cases
- [ ] Check performance considerations

### 2. Verify Code Quality
- [ ] Lint and format compliance
- [ ] Test coverage and quality
- [ ] Documentation completeness
- [ ] Code organization and readability

### 3. Check Accessibility
- [ ] ARIA attributes and roles
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Focus management

### 4. Suggest Specific Improvements
Document exactly what needs to be changed:
- File names and line numbers
- Specific code examples
- Rationale for each change

**When complete, run:** \`bp agent next\`
`
      );

    case 'designer':
      return (
        baseInstructions +
        `## Instructions

You are acting as the **designer agent**. Your job is to:

### 1. Review Visual Design
- [ ] Design token usage (colors, spacing, typography)
- [ ] Component variants and states
- [ ] Responsive behavior
- [ ] Visual hierarchy and layout

### 2. Check User Experience
- [ ] Interaction patterns and feedback
- [ ] Loading and error states
- [ ] Animation and transitions
- [ ] Accessibility from UX perspective

### 3. Verify Design System Consistency
- [ ] Matches existing Blueprint components
- [ ] Proper use of design tokens
- [ ] Consistent naming and API patterns
- [ ] Cross-component compatibility

### 4. Suggest Design Improvements
Focus on:
- Visual polish and refinement
- User interaction improvements
- Design system consistency
- Accessibility enhancements

**When complete, run:** \`bp agent next\`
`
      );

    default:
      return baseInstructions + 'Unknown agent type';
  }
}
