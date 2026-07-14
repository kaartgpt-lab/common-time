/**
 * Upload the locally-downloaded product images (../product-images/<slug>/*)
 * to Supabase Storage, then (re)populate product_images rows — all via REST.
 *
 * Run:
 *   $env:SUPABASE_SERVICE_ROLE_KEY="<key>"; node scripts/upload-local-images.mjs
 *
 * Idempotent: re-running replaces the product_images rows for these products.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SUPABASE_URL = 'https://tkdplqdnoqnqsgwpohwh.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'products';

if (!SERVICE_KEY) {
  console.error('❌  Missing SUPABASE_SERVICE_ROLE_KEY env var');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_ROOT = path.resolve(__dirname, '..', '..', 'product-images');

// folder slug (local)  ->  { productId, dbSlug }
const MAP = {
  'can-you-do-an-iced-pourover-tee': { id: '916135f5-c3f2-4da9-81e7-eee4b2ef12f2', dbSlug: 'can-you-do-an-iced-pourover-tee' },
  'elevated-rituals-tee':            { id: '2af0d6ea-5eed-4470-be91-7dde520c319d', dbSlug: 'elevated-rituals-tee' },
  'coffee-is-a-lifestyle-tee':       { id: 'b280f883-3149-4392-877a-f8c38089c725', dbSlug: 'coffee-is-a-lifestyle-tee' },
  'coffee-after-6-pm-scented-candle':{ id: '2e207e15-d0c3-4e50-866c-639bb0690925', dbSlug: 'coffee-after-6-pm-scented-candle' },
  'ceramic-moka-pot':                { id: 'e9bb40d1-d7d9-4208-bd80-bd8aa3eeadb3', dbSlug: 'ceramic-dripper-set-for-pourover' },
  'hold-my-coffee-bag':              { id: '1370613d-1271-43b2-9ccc-372a57aa6c71', dbSlug: 'hold-my-coffee-bag' },
  'symbol-cap':                      { id: '657481d9-56b7-477e-a27e-c81968866026', dbSlug: 'symbol-cap' },
  'ritual-bottle':                   { id: '64126d54-4082-41c5-9645-2dcfb6554899', dbSlug: 'ritual-bottle' },
  'to-go-tumbler':                   { id: 'ddd9823c-df10-4ad4-b61b-edd6fc25bc23', dbSlug: 'to-go-tumbler' },
  'timeless-tray':                   { id: 'cb6988f6-5d4e-46ae-9aea-7816d5f0e2f5', dbSlug: 'timeless-tray' },
  'functional-cup-for-pourover':     { id: 'f8ab5111-3e7b-4f7a-afe2-5d76c3c79f80', dbSlug: 'functional-cup-for-pourover' },
  'ritual-cup-hourglass-saucer':     { id: '6f25e6eb-15d1-47f9-ba9f-c02845f50581', dbSlug: 'ritual-cup-and-hourglass-saucer' },
  'cortado-espresso-cup':            { id: '89d47ce9-5ae5-4859-af5d-19f90e8ea324', dbSlug: 'cortado-and-espresso-cup' },
  'set-of-3-pencils':                { id: '22e50b59-f416-4f2b-903b-5a6da8d25d87', dbSlug: 'set-of-3-pencils' },
};

const CT = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const publicUrl = (p) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${p}`;

async function uploadFile(storagePath, buffer, contentType) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: buffer,
  });
  return { status: res.status, body: await res.text() };
}

async function deleteRows(productId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/product_images?product_id=eq.${productId}`, {
    method: 'DELETE',
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Prefer: 'return=minimal' },
  });
  return res.status;
}

async function insertRows(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/product_images`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal',
    },
    body: JSON.stringify(rows),
  });
  return { status: res.status, body: await res.text() };
}

async function main() {
  let uploaded = 0, failed = 0;
  const summary = [];

  for (const [slug, { id, dbSlug }] of Object.entries(MAP)) {
    const dir = path.join(IMAGES_ROOT, slug);
    if (!fs.existsSync(dir)) { console.log(`⚠️  no folder for ${slug}`); continue; }
    const files = fs.readdirSync(dir)
      .filter((f) => CT[path.extname(f).toLowerCase()])
      .sort();

    const rows = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buf = fs.readFileSync(path.join(dir, file));
      const ct = CT[path.extname(file).toLowerCase()];
      const storagePath = `merch/${slug}/${file}`;
      process.stdout.write(`  ${storagePath} (${Math.round(buf.length / 1024)}KB) … `);
      const { status, body } = await uploadFile(storagePath, buf, ct);
      if (status === 200 || status === 201) {
        console.log('OK');
        uploaded++;
        rows.push({ product_id: id, image_url: publicUrl(storagePath), position: i });
      } else {
        console.log(`FAIL ${status} ${body.slice(0, 120)}`);
        failed++;
      }
    }

    // Replace DB rows for this product
    const delStatus = await deleteRows(id);
    const ins = await insertRows(rows);
    const insOk = ins.status >= 200 && ins.status < 300;
    console.log(`  → ${slug}: uploaded ${rows.length}, delete=${delStatus}, insert=${ins.status}${insOk ? '' : ' ' + ins.body.slice(0, 160)}`);
    summary.push({ slug, dbSlug, count: rows.length, insertOk: insOk });
  }

  console.log(`\n✅  ${uploaded} files uploaded  ❌  ${failed} failed\n`);
  console.log('Per product:');
  for (const s of summary) console.log(`  ${s.count.toString().padStart(2)}  ${s.dbSlug}${s.insertOk ? '' : '   <<< INSERT FAILED'}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
