/**
 * Downsize + recompress every product image IN PLACE in Supabase Storage.
 * Same object path (URL unchanged) => no DB changes, live immediately.
 * Run: $env:SUPABASE_SERVICE_ROLE_KEY="<key>"; node scripts/optimize-images.mjs
 */
import sharp from 'sharp';

const SUPABASE_URL = 'https://tkdplqdnoqnqsgwpohwh.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'products';
const MAX_DIM = 1600;      // longest side
const JPEG_Q = 80;
if (!KEY) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

// Collect every object path in the `products` bucket referenced by either table.
async function collectPaths() {
  const paths = new Set();
  for (const tbl of ['product_images?select=image_url', 'products?select=image_url']) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${tbl}`, { headers: H });
    const rows = await r.json();
    for (const row of rows) {
      const u = row.image_url;
      if (!u) continue;
      const marker = `/storage/v1/object/public/${BUCKET}/`;
      const i = u.indexOf(marker);
      if (i === -1) continue;                    // different bucket/project -> skip
      paths.add(decodeURIComponent(u.slice(i + marker.length)));
    }
  }
  return [...paths];
}

async function download(path) {
  const enc = path.split('/').map(encodeURIComponent).join('/');
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${enc}`);
  if (!r.ok) return null;
  return Buffer.from(await r.arrayBuffer());
}
async function upload(path, buf, ct) {
  const enc = path.split('/').map(encodeURIComponent).join('/');
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${enc}`, {
    method: 'POST', headers: { ...H, 'Content-Type': ct, 'x-upsert': 'true' }, body: buf });
  return r.status;
}

async function optimize(path, buf) {
  const ext = path.split('.').pop().toLowerCase();
  const img = sharp(buf, { failOn: 'none' });
  const meta = await img.metadata();
  let pipe = sharp(buf, { failOn: 'none' }).rotate(); // respect EXIF orientation
  if (Math.max(meta.width || 0, meta.height || 0) > MAX_DIM) {
    pipe = pipe.resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true });
  }
  if (ext === 'png') {
    return { out: await pipe.png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer(), ct: 'image/png' };
  }
  return { out: await pipe.jpeg({ quality: JPEG_Q, mozjpeg: true, progressive: true }).toBuffer(), ct: 'image/jpeg' };
}

const paths = await collectPaths();
console.log(`optimizing ${paths.length} images (max ${MAX_DIM}px, jpeg q${JPEG_Q})\n`);
let before = 0, after = 0, done = 0, skip = 0;
for (const p of paths) {
  const buf = await download(p);
  if (!buf) { console.log(`  ✗ download failed: ${p}`); skip++; continue; }
  try {
    const { out, ct } = await optimize(p, buf);
    if (out.length >= buf.length) {           // already small enough
      console.log(`  = ${p}  ${(buf.length/1024).toFixed(0)}KB (kept)`);
      before += buf.length; after += buf.length; skip++; continue;
    }
    const st = await upload(p, out, ct);
    const ok = st === 200 || st === 201;
    console.log(`  ${ok ? '✓' : '✗' + st} ${p}  ${(buf.length/1024).toFixed(0)}KB -> ${(out.length/1024).toFixed(0)}KB`);
    if (ok) { before += buf.length; after += out.length; done++; }
    else { skip++; }
  } catch (e) { console.log(`  ✗ ${p}: ${e.message}`); skip++; }
}
console.log(`\ndone: ${done} optimized, ${skip} skipped`);
console.log(`total: ${(before/1048576).toFixed(1)}MB -> ${(after/1048576).toFixed(1)}MB  (${before?Math.round((1-after/before)*100):0}% smaller)`);
