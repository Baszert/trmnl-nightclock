// Builds preview/index.html: the real templates with real Open-Meteo clouds for nights around the world.
// Usage: node dev/preview.mjs [--refresh]
import fs from 'node:fs';
import path from 'node:path';
import { Liquid } from 'liquidjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const refresh = process.argv.includes('--refresh');
// [label, lat, lon, place, locale, language, test moment (local), clock]
const S = [
  ['Utrecht, do 15 okt, helder', 52.0907, 5.1214, 'Utrecht', 'nl', 'auto', '2026-10-15T23:00'],
  ['Utrecht, vannacht, bewolkt', 52.0907, 5.1214, 'Utrecht', 'nl', 'auto', '2026-10-12T22:00'],
  ['Utrecht, 25 okt, volle maan', 52.0907, 5.1214, 'Utrecht', 'nl', 'auto', '2026-10-25T23:00'],
  ['Brooklyn, Oct 15, 12-hour', 40.6782, -73.9442, 'Brooklyn', 'en-US', 'auto', '2026-10-15T22:00'],
  ['Sydney, Oct 15 (looking north)', -33.8688, 151.2093, 'Sydney', 'en-AU', 'auto', '2026-10-15T22:00'],
  ['München, 13. Okt', 48.1351, 11.582, 'München', 'de', 'auto', '2026-10-13T23:00'],
  ['Paris, 14 oct', 48.8566, 2.3522, 'Paris', 'fr', 'auto', '2026-10-14T23:00'],
  ['Tromsø, 14 des, polarnatt, Geminidene', 69.6492, 18.9553, 'Tromsø', 'nb', 'auto', '2026-12-14T22:00'],
  ['Madrid, 12 ago, Perseidas', 40.4168, -3.7038, 'Madrid', 'es', 'auto', '2026-08-12T23:30'],
  ['Helsinki, juhannus, ei pimeää', 60.1699, 24.9384, 'Helsinki', 'fi', 'auto', '2026-06-21T23:30'],
  ['Kaapstad, 4 jan', -33.9249, 18.4241, 'Cape Town', 'en', 'auto', '2027-01-04T22:00'],
  ['Roma, 13 ott', 41.9028, 12.4964, 'Roma', 'it', 'auto', '2026-10-13T23:00']
];
const dataDir = path.join(root, 'dev/data');
fs.mkdirSync(dataDir, { recursive: true });

const engine = new Liquid();
const shared = read('src/shared.liquid').replace(/<script>[\s\S]*?<\/script>/, '');   // the script is loaded once by the page
const out = [];
for (const [label, lat, lon, place, locale, language, test] of S) {
  const file = path.join(dataDir, `${lat},${lon}.json`);
  let meteo;
  if (!refresh && fs.existsSync(file)) meteo = JSON.parse(fs.readFileSync(file, 'utf8'));
  else {
    meteo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=cloud_cover&timezone=auto&past_days=1&forecast_days=16&timeformat=unixtime`).then((r) => r.json());
    fs.writeFileSync(file, JSON.stringify(meteo));
  }
  // dates beyond the forecast: a clear demo sky, with the right UTC offset for that date
  const t0 = Date.parse(test + 'Z') / 1000 - (meteo.utc_offset_seconds || 0);
  let m = meteo;
  if (!meteo.hourly || t0 > meteo.hourly.time[meteo.hourly.time.length - 1] - 10 * 3600 || t0 < meteo.hourly.time[0]) {
    const off = { 'Tromsø': 3600, Madrid: 7200, Helsinki: 10800, 'Cape Town': 7200 }[place] ?? meteo.utc_offset_seconds;
    const start = Math.floor((Date.parse(test.slice(0, 10) + 'T00:00:00Z') / 1000 - off) / 3600) * 3600;
    m = { latitude: lat, longitude: lon, utc_offset_seconds: off, hourly: { time: Array.from({ length: 48 }, (_, i) => start + i * 3600), cloud_cover: Array.from({ length: 48 }, (_, i) => (i % 7 === 3 ? 30 : 5)) } };
  }
  const ctx = Object.assign({}, m, { trmnl: { system: { timestamp_utc: Math.floor(Date.now() / 1000) }, user: { locale }, plugin_settings: { instance_name: 'Nightclock',
    custom_fields_values: { lat_lon: `${lat},${lon}`, place_name: place, language, clock: 'auto', moment: 'auto', lines: true, names: true, test_date: test } } } });
  const html = {};
  for (const v of ['full', 'half_horizontal', 'half_vertical', 'quadrant']) html[v] = await engine.parseAndRender(shared + '\n' + read('src/' + v + '.liquid'), ctx);
  out.push({ label, html });
}
fs.mkdirSync(path.join(root, 'preview'), { recursive: true });
fs.copyFileSync(path.join(root, 'dev/nachtklok.js'), path.join(root, 'preview/nachtklok.js'));
const page = read('dev/preview.template.html').replace('/*DATA*/null', () => JSON.stringify(out).replace(/<\/script/g, '<\\/script'));
fs.writeFileSync(path.join(root, 'preview/index.html'), page);
console.log(`preview/index.html: ${out.length} nights`);
