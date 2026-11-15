import type { APIRoute } from 'astro';
import { published } from '../../lib/content';
import { calendar } from '../../lib/ics';

export async function getStaticPaths() {
  return (await published('events')).map((event) => ({ params: { id: event.id }, props: { event } }));
}

export const GET: APIRoute = async ({ props, site, url }) =>
  new Response(calendar([props.event], (site ?? url).origin), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
