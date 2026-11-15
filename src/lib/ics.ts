import { parts } from './content';

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const pad = (n: number) => String(n).padStart(2, '0');

const stamp = (s: string, fallbackHour?: number) => {
  const p = parts(s)!;
  const date = `${p.y}${pad(p.mo)}${pad(p.d)}`;
  if (p.h === null && fallbackHour === undefined) return { allDay: true, v: date };
  return { allDay: false, v: `${date}T${pad(p.h ?? fallbackHour!)}${pad(p.mi)}00` };
};

const nextDay = (v: string) => {
  const d = new Date(Date.UTC(+v.slice(0, 4), +v.slice(4, 6) - 1, +v.slice(6, 8) + 1));
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
};

export const vevent = (e: any, site: string) => {
  const d = e.data;
  if (!parts(d.start)) return '';
  const s = stamp(d.start);
  const lines = ['BEGIN:VEVENT', `UID:${e.id}@uplayers`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`, `SUMMARY:${esc(d.title)}`];
  if (s.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${s.v}`, `DTEND;VALUE=DATE:${nextDay(s.v)}`);
  } else {
    const end = d.end && parts(d.end)?.h !== null ? stamp(d.end).v : `${s.v.slice(0, 9)}${pad(Math.min(+s.v.slice(9, 11) + 2, 23))}${s.v.slice(11)}`;
    lines.push(`DTSTART;TZID=America/New_York:${s.v}`, `DTEND;TZID=America/New_York:${end}`);
  }
  if (d.location) lines.push(`LOCATION:${esc(d.location)}`);
  lines.push(`DESCRIPTION:${esc((d.summary ? d.summary + '\n\n' : '') + `${site}/events/${e.id}`)}`, `URL:${site}/events/${e.id}`, 'END:VEVENT');
  return lines.join('\r\n');
};

export const calendar = (events: any[], site: string) =>
  ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//University Players//Events//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:University Players', 'X-WR-TIMEZONE:America/New_York',
    ...events.map((e) => vevent(e, site)).filter(Boolean), 'END:VCALENDAR'].join('\r\n');
