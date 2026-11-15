import { getCollection } from 'astro:content';

// Everything marked "Draft" in the editor is hidden from the public site.
export const published = async <C extends 'shows' | 'events' | 'news' | 'pages'>(c: C) =>
  (await getCollection(c)).filter((e: any) => !e.data.draft);

export const showsByDate = async () => (await published('shows')).sort((a, b) => +b.data.sort_date - +a.data.sort_date);

// ---- Dates (all times are Vermont local time, stored as "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM") ----
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const parts = (s: string) => {
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  return { y: +y, mo: +mo, d: +d, h: h === undefined ? null : +h, mi: mi === undefined ? 0 : +mi };
};

export const fmtTime = (h: number, mi: number) => `${((h + 11) % 12) + 1}${mi ? ':' + String(mi).padStart(2, '0') : ''} ${h < 12 ? 'AM' : 'PM'}`;

export const fmtDate = (s: string, withDay = true) => {
  const p = parts(s);
  if (!p) return s;
  const wd = DAYS[new Date(Date.UTC(p.y, p.mo - 1, p.d)).getUTCDay()];
  return `${withDay ? wd + ', ' : ''}${MONTHS[p.mo - 1]} ${p.d}, ${p.y}`;
};

export const fmtWhen = (start: string, end?: string | null) => {
  const a = parts(start);
  if (!a) return start;
  let out = fmtDate(start);
  if (a.h !== null) out += ` · ${fmtTime(a.h, a.mi)}`;
  const b = end ? parts(end) : null;
  if (b && b.h !== null) {
    const sameDay = b.y === a.y && b.mo === a.mo && b.d === a.d;
    out += sameDay ? `–${fmtTime(b.h, b.mi)}` : ` to ${fmtDate(end!)} ${fmtTime(b.h, b.mi)}`;
  }
  return out;
};

export const badge = (s: string) => {
  const p = parts(s);
  return p ? { month: MONTHS[p.mo - 1].slice(0, 3).toUpperCase(), day: p.d } : { month: '', day: '' };
};

// Last moment an event is still "upcoming" (end time, or end of its day), as a sortable string.
export const endKey = (start: string, end?: string | null) => {
  const s = end || start;
  return s.length <= 10 ? `${s}T23:59` : s.slice(0, 16);
};

export const upcomingEvents = async () => {
  const today = new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' }).slice(0, 16).replace(' ', 'T');
  const all = (await published('events')).sort((a, b) => a.data.start.localeCompare(b.data.start));
  return {
    upcoming: all.filter((e) => endKey(e.data.start, e.data.end) >= today),
    past: all.filter((e) => endKey(e.data.start, e.data.end) < today).reverse(),
  };
};
