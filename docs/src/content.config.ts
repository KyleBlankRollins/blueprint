import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/docs',
    generateId: ({ entry }) => {
      // Strip file extension, then collapse index pages:
      // "components/code-block/index" → "components/code-block"
      const withoutExtension = entry.replace(/\.[^.]+$/, '');
      return withoutExtension.replace(/\/index$/, '');
    },
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z
      .enum(['getting-started', 'components', 'guides', 'themes'])
      .optional(),
    order: z.number().optional(),
  }),
});

export const collections = { docs };
