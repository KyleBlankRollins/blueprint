import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
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
