import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const person = z.object({ role: z.string().optional().nullable(), name: z.string().optional().nullable() });
// Dates/times are kept as plain text like "2026-12-01" or "2026-12-01T19:00" (Vermont local time).
const when = z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString().slice(0, 16) : String(v)));

const shows = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/shows' }),
  schema: z.object({
    title: z.string(),
    season: z.string(),
    sort_date: z.coerce.date(),
    playwright: z.string().optional().nullable(),
    directors: z.string().optional().nullable(),
    dates: z.string().optional().nullable(),
    venue: z.string().optional().nullable(),
    ticket_url: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    video_url: z.string().optional().nullable(),
    gallery: z.array(z.string()).optional().nullable(),
    cast: z.array(person).optional().nullable(),
    crew: z.array(person).optional().nullable(),
    featured: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    type: z.string().optional().nullable(),
    start: when,
    end: when.optional().nullable(),
    location: z.string().optional().nullable(),
    summary: z.string().optional().nullable(),
    link_url: z.string().optional().nullable(),
    link_label: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    draft: z.boolean().optional().default(false),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: when,
    summary: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    draft: z.boolean().optional().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    show_in_menu: z.boolean().optional().default(false),
    menu_order: z.number().optional().default(10),
    image: z.string().optional().nullable(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { shows, events, news, pages };
