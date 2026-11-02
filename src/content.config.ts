import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    track: z.enum(['python-zero-to-hero']),
    order: z.number(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    xp: z.number(),
    description: z.string().min(30, { message: 'Description must be at least 30 characters for SEO metadata' }),
    topic: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
  }),
});

export const collections = {
  lessons,
};
