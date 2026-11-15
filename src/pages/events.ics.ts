import type { APIRoute } from 'astro';
import { published } from '../lib/content';
import { calendar } from '../lib/ics';

export const GET: APIRoute = async ({ site, url }) => {
  const origin = (site ?? url).origin;
  return new Response(calendar(await published('events'), origin), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
