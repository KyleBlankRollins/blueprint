import { Command } from 'commander';
import { scaffoldComponent, validateComponentName } from '../lib/scaffold.js';
import { generateStories } from '../lib/generateStories.js';
import { extractAPI } from '../lib/extractAPI.js';
import { addToDemo } from '../lib/addToDemo.js';
import { success, error, info, warn } from '../utils/logger.js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Creates a complete component workflow: scaffold → generate stories → generate API → add to demo.
 * This is the recommended way to create new components.
 */
export function createCommand(program: Command): void {
  program
    .command('create <name>')
    .description(
      'Create a complete component (scaffold + stories + API docs + demo)'
    )
    .option('--skip-demo', 'Skip adding component to demo page')
    .option(
      '--dry-run',
      'Show what would be created without actually creating files'
    )
    .action(
      (name: string, options: { skipDemo?: boolean; dryRun?: boolean }) => {
        info(`\nCreating component: bp-${name}\n`);

        // Validate name format
        if (!validateComponentName(name)) {
          error(
            `Invalid component name: "${name}". Must be kebab-case (e.g., "my-component")`
          );
          info('Valid examples:');
          console.log(`  - button
  - icon-button
  - data-table`);
          process.exit(1);
        }

        if (options.dryRun) {
          const step4 = options.skipDemo
            ? '  4. Skip demo (--skip-demo flag)'
            : `  4. Add to demo page
     - Insert example into demo/index.html`;

          info('DRY RUN: No files will be created or modified');
          info('Workflow steps that would be executed:');

          console.log(`
  1. Scaffold component files
     - source/components/${name}/${name}.ts
     - source/components/${name}/${name}.style.ts
     - source/components/${name}/${name}.test.ts
     - source/components/${name}/${name}.stories.ts
     - source/components/${name}/README.md

  2. Generate Storybook stories
     - Auto-generate stories based on properties

  3. Generate API documentation
     - Extract properties and events
     - Update README with API tables

${step4}
`);
          info('To execute this workflow, run without --dry-run flag');
          return;
        }

        // Step 1: Scaffold component
        info('Step 1/4: Scaffolding component files...');
        const scaffoldResult = scaffoldComponent(name);

        if (!scaffoldResult.success) {
          error(scaffoldResult.error || 'Failed to scaffold component');
          process.exit(1);
        }

        success('✓ Component scaffolded\n');

        // Step 2: Generate Storybook stories
        info('Step 2/4: Generating Storybook stories...');
        const storiesResult = generateStories(name);

        if (!storiesResult.success) {
          warn('Could not generate stories (you can run manually later)');
          storiesResult.errors.forEach((err) => console.log(`  - ${err}`));
        } else {
          success('✓ Stories generated');
        }

        // Step 3: Generate API documentation
        info('\nStep 3/4: Generating API documentation...');
        const apiResult = extractAPI(name);

        if (!apiResult.success) {
          warn('Could not generate API docs (you can run manually later)');
          apiResult.errors.forEach((err) => console.log(`  - ${err}`));
        } else {
          // Update README with API documentation
          try {
            const readmePath = join(
              process.cwd(),
              'source',
              'components',
              name,
              'README.md'
            );
            let readmeContent = readFileSync(readmePath, 'utf-8');

            // Add Properties section
            if (apiResult.properties.length > 0) {
              readmeContent += '\n## Properties\n\n';
              readmeContent += '| Property | Type | Default | Description |\n';
              readmeContent += '|----------|------|---------|-------------|\n';
              apiResult.properties.forEach((prop) => {
                readmeContent += `| \`${prop.name}\` | \`${prop.type}\` | \`${prop.defaultValue || '-'}\` | ${prop.description || '-'} |\n`;
              });
            }

            // Add Events section
            if (apiResult.events.length > 0) {
              readmeContent += '\n## Events\n\n';
              readmeContent += '| Event | Detail | Description |\n';
              readmeContent += '|-------|--------|-------------|\n';
              apiResult.events.forEach((event) => {
                readmeContent += `| \`${event.name}\` | \`${event.detail}\` | ${event.description} |\n`;
              });
            }

            writeFileSync(readmePath, readmeContent, 'utf-8');
            success('✓ API documentation generated');
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : 'Unknown error';
            warn(`Could not write API docs to README: ${message}`);
          }
        }

        // Step 4: Add to demo (optional)
        if (!options.skipDemo) {
          info('\nStep 4/4: Adding component to demo page...');
          const demoResult = addToDemo(name);

          if (!demoResult.success) {
            warn('Could not add to demo page (you can run manually later)');
            demoResult.errors.forEach((err) => console.log(`  - ${err}`));
          } else {
            success('✓ Added to demo page');
          }
        } else {
          info('Step 4/4: Skipped (--skip-demo flag)');
        }

        // Final summary
        const separator = '═'.repeat(60);
        console.log(`\n${separator}`);
        success(`Component bp-${name} created successfully!`);
        console.log(`${separator}\n`);
        info('Files created:');
        scaffoldResult.filesCreated?.forEach((file) => {
          console.log(`  - ${file}`);
        });
        console.log('');
        info('Next steps:');
        console.log(`  1. Implement component logic in the .ts file
  2. Add component styles using design tokens
  3. Write comprehensive tests (minimum 10)
  4. Review and update generated stories
  5. Run: bp check ${name}
`);
      }
    );
}
