/**
 * Upload product images from Google Drive to Supabase Storage
 * Run: node scripts/upload-product-images.mjs
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY env var:
 *   $env:SUPABASE_SERVICE_ROLE_KEY="your-key"; node scripts/upload-product-images.mjs
 */

const SUPABASE_URL = 'https://tkdplqdnoqnqsgwpohwh.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'products';

if (!SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY env var');
  process.exit(1);
}

// Map: Drive file ID → { filename, slug }
// Using the best hero image per product
const IMAGES = [
  // Individual links (user-specified hero shots)
  {
    driveId: '17Zat99QwdllfWDzxU7Orulwa9xEbfVph',
    filename: 'coffee-is-a-lifestyle-tee.jpg',
    slug: 'coffee-is-a-lifestyle-tee',
  },
  {
    driveId: '1uEtm3mKM1LuHq46pShB5FPswpQp62QTu',
    filename: 'symbol-cap.jpg',
    slug: 'symbol-cap',
  },
  {
    driveId: '18RRG2413RXrti5f3DHy2MMvRwneV2aYD',
    filename: 'can-you-do-an-iced-pourover-tee.jpg',
    slug: 'can-you-do-an-iced-pourover-tee',
  },
  // White tshirt subfolder — hero shot for Elevated Rituals Tee
  {
    driveId: '19OxmfHvnFIDABimycZKbhn-wifRtwIrf',
    filename: 'elevated-rituals-tee.jpg',
    slug: 'elevated-rituals-tee',
  },
  // Leather bag subfolder — hero shot
  {
    driveId: '14tuOtvQCy1LdbUcD1bN16vxcA3dnXD_0',
    filename: 'hold-my-coffee-bag.jpg',
    slug: 'hold-my-coffee-bag',
  },
  // Root: cortado cup
  {
    driveId: '1DNh3oxgEiYjRZm14vj6YdP6RDjDWnqQy',
    filename: 'cortado-and-espresso-cup.jpg',
    slug: 'cortado-and-espresso-cup',
  },
  // Cup subfolder — first image for Functional Cup
  {
    driveId: '1K8gJVpPRSPf9mlsT6nVR1OxE97Yk2ibc',
    filename: 'functional-cup-for-pourover.jpg',
    slug: 'functional-cup-for-pourover',
  },
  // Cup subfolder — second image for Ritual Cup & Saucer
  {
    driveId: '1zuSWqaH920BUUL0j2h_khmMUAjeU7k_p',
    filename: 'ritual-cup-and-hourglass-saucer.jpg',
    slug: 'ritual-cup-and-hourglass-saucer',
  },
  // Root: bag.jpg for Hold My Coffee Bag (cleaner product shot)
  {
    driveId: '1GXX99N8KVUa31AQtnOEKoWC9PfC_Bzsm',
    filename: 'hold-my-coffee-bag-2.jpg',
    slug: null, // secondary shot, not used for DB update
  },
  // Root: cap.jpg for Symbol Cap (product shot)
  {
    driveId: '1geReXhmspuihZ_oNnuSurCD-JGgCya1Q',
    filename: 'symbol-cap-product.jpg',
    slug: null, // secondary shot
  },
];

async function downloadFromDrive(fileId) {
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Drive download failed: ${res.status} ${res.statusText}`);
  return res;
}

async function uploadToSupabase(filename, bodyBuffer, contentType) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': contentType || 'image/jpeg',
      'x-upsert': 'true',
    },
    body: bodyBuffer,
  });
  const json = await res.json();
  return { status: res.status, json };
}

function getPublicUrl(filename) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

async function main() {
  const sqlLines = [];

  for (const img of IMAGES) {
    process.stdout.write(`Downloading ${img.filename} from Drive...`);
    let driveRes;
    try {
      driveRes = await downloadFromDrive(img.driveId);
    } catch (e) {
      console.log(` FAILED: ${e.message}`);
      continue;
    }

    const contentType = driveRes.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await driveRes.arrayBuffer());
    process.stdout.write(` ${Math.round(buffer.length / 1024)}KB. Uploading...`);

    const { status, json } = await uploadToSupabase(img.filename, buffer, contentType);
    if (status === 200 || status === 201 || json.Key) {
      const publicUrl = getPublicUrl(img.filename);
      console.log(` OK → ${publicUrl}`);
      if (img.slug) {
        sqlLines.push(
          `UPDATE products SET image_url = '${publicUrl}' WHERE slug = '${img.slug}';`
        );
      }
    } else {
      console.log(` UPLOAD ERROR: ${JSON.stringify(json)}`);
    }
  }

  console.log('\n── SQL to run in Supabase SQL Editor ──────────────────────');
  sqlLines.forEach((l) => console.log(l));
  console.log('────────────────────────────────────────────────────────────');
}

main().catch(console.error);
