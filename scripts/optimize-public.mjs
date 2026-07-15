/** Optimize large static images in public/ in place (resize + recompress). */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// used images -> max width (heroes are full-bleed banners, placeholder smaller)
const TARGETS = [
  ['public/hero/hero1.jpg', 2000],
  ['public/hero/hero2.jpg', 2000],
  ['public/hero/hero1-right.jpg', 1400],
  ['public/hero/hero2-right.jpg', 1400],
  ['public/herobg.jpg', 2000],
  ['public/newshero.jpg', 1200],
];

let before = 0, after = 0;
for (const [rel, maxW] of TARGETS) {
  if (!fs.existsSync(rel)) { console.log(`  (missing) ${rel}`); continue; }
  const buf = fs.readFileSync(rel);
  const meta = await sharp(buf).metadata();
  let pipe = sharp(buf).rotate();
  if ((meta.width || 0) > maxW) pipe = pipe.resize({ width: maxW, withoutEnlargement: true });
  const out = await pipe.jpeg({ quality: 80, mozjpeg: true, progressive: true }).toBuffer();
  fs.writeFileSync(rel, out);
  before += buf.length; after += out.length;
  console.log(`  ✓ ${rel}  ${(buf.length/1024).toFixed(0)}KB -> ${(out.length/1024).toFixed(0)}KB`);
}
console.log(`\ntotal: ${(before/1048576).toFixed(1)}MB -> ${(after/1048576).toFixed(1)}MB`);
