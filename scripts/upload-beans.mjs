/**
 * Upload beans product images (from Drive) to Supabase Storage + product_images.
 * Run: $env:SUPABASE_SERVICE_ROLE_KEY="<key>"; node scripts/upload-beans.mjs
 * Idempotent: replaces product_images rows for the 7 bean products.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SUPABASE_URL = 'https://tkdplqdnoqnqsgwpohwh.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'products';
if (!SERVICE_KEY) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'beans-manifest.json'), 'utf8'));

const PRODUCT_ID = {
  'aster': '9b971a18-e0b2-499a-8e23-071f20239a79',
  'cherry-bomb': 'f7a7e608-7c5a-45c0-8ab3-5a89b12c5fe4',
  'dinner-wine': 'd891067a-aee0-4e1c-9864-f1c6ee0cd72e',
  'house-pourover': '7dc5c9ce-fe4c-4091-92fa-d249349ee7d5',
  'jasmine-blossom': '497647d7-c075-4c78-81f6-31fc1e20ba0c',
  'lodhi-espresso-blend': 'd242b6cd-c3ca-4676-9cc0-c45a1b5be825',
  'santa-ana-sunset': '8511f880-3b56-4d76-bb18-a7df7acde911',
};
const publicUrl = (p) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${p}`;
const sniff = (b) => (b[0]===0xFF&&b[1]===0xD8)?'jpg':(b[0]===0x89&&b[1]===0x50)?'png':null;

async function driveDownload(id) {
  const res = await fetch(`https://drive.usercontent.google.com/download?id=${id}&export=download`);
  const buf = Buffer.from(await res.arrayBuffer());
  return { buf, kind: sniff(buf) };
}
async function upload(p, buf, ct) {
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${p}`, {
    method: 'POST', headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': ct, 'x-upsert': 'true' }, body: buf });
  return r.status;
}
async function del(pid) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/product_images?product_id=eq.${pid}`, { method: 'DELETE', headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'return=minimal' } });
  return r.status;
}
async function insert(rows) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/product_images`, { method: 'POST', headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(rows) });
  return { status: r.status, body: await r.text() };
}

// group manifest by slug preserving position order
const bySlug = {};
for (const m of manifest) (bySlug[m.slug] = bySlug[m.slug] || []).push(m);

let ok = 0, fail = 0;
for (const slug of Object.keys(bySlug)) {
  const pid = PRODUCT_ID[slug];
  if (!pid) { console.log(`no product id for ${slug}`); continue; }
  const items = bySlug[slug].sort((a, b) => a.pos - b.pos);
  const rows = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    process.stdout.write(`  ${it.file} … `);
    const { buf, kind } = await driveDownload(it.id);
    if (!kind) { console.log('SKIP (not image)'); fail++; continue; }
    const storagePath = it.file; // e.g. beans/lodhi/hero.jpg
    const st = await upload(storagePath, buf, kind === 'png' ? 'image/png' : 'image/jpeg');
    if (st === 200 || st === 201) { console.log(`OK ${Math.round(buf.length/1024)}KB`); ok++; rows.push({ product_id: pid, image_url: publicUrl(storagePath), position: i }); }
    else { console.log(`UPLOAD FAIL ${st}`); fail++; }
  }
  const d = await del(pid);
  const ins = await insert(rows);
  console.log(`  → ${slug}: ${rows.length} rows, delete=${d}, insert=${ins.status}${ins.status<300?'':' '+ins.body.slice(0,120)}`);
}
console.log(`\n✅ ${ok} uploaded  ❌ ${fail} failed`);
