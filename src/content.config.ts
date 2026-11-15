import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const shows = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/shows' }),
  schema: z.object({
    title: z.string(),
    season: z.string(),
    sort_date: z.coerce.date(),
    playwright: z.string().optional().nullable(),
    directors: z.string().optional().nullable(),
    gallery: z.array(z.string()).optional().nullable(),
    dates: z.string().optional().nullable(),
    venue: z.string().optional().nullable(),
    ticket_url: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    featured: z.boolean().optional().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    show_in_menu: z.boolean().optional().default(false),
    menu_order: z.number().optional().default(10),
    image: z.string().optional().nullable(),
  }),
});

export const collections = { shows, pages };
