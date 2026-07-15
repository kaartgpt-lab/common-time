/**
 * Set products.image_url = the product's hero (product_images position 0) for every
 * product that has gallery images. Fixes homepage/ProductGrid thumbnails, which read
 * the single image_url column (not the product_images join).
 * Run: $env:SUPABASE_SERVICE_ROLE_KEY="<key>"; node scripts/set-hero-image-url.mjs
 */
const SUPABASE_URL = 'https://tkdplqdnoqnqsgwpohwh.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,slug,image_url,product_images(image_url,position)`, { headers: H });
const products = await res.json();

let updated = 0, skipped = 0;
for (const p of products) {
  const imgs = (p.product_images || []).slice().sort((a, b) => a.position - b.position);
  if (!imgs.length) { skipped++; continue; }
  const hero = imgs[0].image_url;
  if (p.image_url === hero) { console.log(`= ${p.slug} (already hero)`); continue; }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${p.id}`, {
    method: 'PATCH',
    headers: { ...H, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ image_url: hero }),
  });
  console.log(`${r.status < 300 ? '✓' : '✗ ' + r.status} ${p.slug}  <- ${hero.split('/').pop()}`);
  if (r.status < 300) updated++;
}
console.log(`\nupdated ${updated}, unchanged/skipped ${skipped}`);
