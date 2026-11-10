import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    track: z.string(), // e.g. 'python', 'numpy', 'sql', 'dsa'
    category: z.string().default('Python Tutorial'), // section grouping in sidebar, e.g. 'Python Tutorial', 'Python Functions', 'Python Methods'
    order: z.number(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    xp: z.number().default(20),
    description: z.string().min(30, { message: 'Description must be at least 30 characters for SEO metadata' }),
    topic: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
  }),
});

export const collections = {
  lessons,
};
