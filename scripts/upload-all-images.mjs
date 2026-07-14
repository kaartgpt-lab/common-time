/**
 * Upload ALL merch images from Google Drive to Supabase Storage
 * and output SQL to populate product_images table.
 *
 * STEP 1 — Create the table (run in Supabase SQL Editor FIRST):
 *   See the CREATE TABLE block printed at startup.
 *
 * STEP 2 — Run this script:
 *   $env:SUPABASE_SERVICE_ROLE_KEY="your-key"; node scripts/upload-all-images.mjs
 *
 * STEP 3 — Run the INSERT SQL printed at the end in Supabase SQL Editor.
 */

const SUPABASE_URL = 'https://tkdplqdnoqnqsgwpohwh.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'products';

if (!SERVICE_KEY) {
  console.error('❌  Missing SUPABASE_SERVICE_ROLE_KEY env var');
  process.exit(1);
}

// ── Image manifest ────────────────────────────────────────────────────────────
// driveId  → Google Drive file ID
// filename → path inside the Supabase Storage bucket
// slug     → product slug to attach to (null = upload only, no DB row)
// position → gallery ordering (0 = hero / first image)
const IMAGES = [

  // ═══════════════════════════════════════════════════════════════════════════
  // BEANS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Lodhi Espresso Blend (3 images) ──────────────────────────────────────
  { driveId: '1y-klufGwcidNPRrtDtYQHpclw0Oz4X-3', filename: 'beans/lodhi/lodhi-hero.jpg',    slug: 'lodhi-espresso-blend', position: 0 },
  { driveId: '157BhjcdaUi8hfmS-A2ksW_6GPN750mfE', filename: 'beans/lodhi/RKS05986.jpg',      slug: 'lodhi-espresso-blend', position: 1 },
  { driveId: '1rCiI5aEE6tK3nI8CHFhpoLdJKk6oVRo-', filename: 'beans/lodhi/RKS06407.jpg',      slug: 'lodhi-espresso-blend', position: 2 },

  // ── House Pourover (3 images) ─────────────────────────────────────────────
  { driveId: '1kM_jMGJudLW4gH5KwHB1jypvfTMIPo3D', filename: 'beans/house-pourover/hero.jpg',    slug: 'house-pourover', position: 0 },
  { driveId: '1T6MtMjyPrUYt2UuXwXZXSSYkR-9Q_Psh', filename: 'beans/house-pourover/hero-2.jpg',  slug: 'house-pourover', position: 1 },
  { driveId: '1rzVQEXzwqMLQMMcvmBWd9fjEr2MRVs5U', filename: 'beans/house-pourover/RKS06383.jpg', slug: 'house-pourover', position: 2 },

  // ── Jasmine Blossom (3 images) ────────────────────────────────────────────
  { driveId: '1cpLuOtTWmfadNpidFvR3oOS9vGhBYRhQ', filename: 'beans/jasmine-blossom/hero.jpg',    slug: 'jasmine-blossom', position: 0 },
  { driveId: '1eKqBpGgrhQ025p7GDSBM3ArXJdMcnjlm', filename: 'beans/jasmine-blossom/RKS05989.jpg', slug: 'jasmine-blossom', position: 1 },
  { driveId: '1uqRsJJvl0qNaIiisKPf8YWhTYeY6VOg1', filename: 'beans/jasmine-blossom/RKS06391.jpg', slug: 'jasmine-blossom', position: 2 },

  // ── Santa Ana Sunset (2 images) ───────────────────────────────────────────
  { driveId: '1GPjKUcsOgC3yIg515D9e2rnFPMt1u_CV', filename: 'beans/santa-ana-sunset/hero.jpg',    slug: 'santa-ana-sunset', position: 0 },
  { driveId: '1cLoPf7FeL1mdpBu8g1iaGQO9x4WH3oCe', filename: 'beans/santa-ana-sunset/RKS06386.jpg', slug: 'santa-ana-sunset', position: 1 },

  // ── Cherry Bomb (3 images) ────────────────────────────────────────────────
  { driveId: '1tl9oZukKCmUg1M2kuh8VEP9AC8fgLZTz', filename: 'beans/cherry-bomb/hero.jpg',    slug: 'cherry-bomb', position: 0 },
  { driveId: '1qLqp3Ngk73360aUOjmYiLPdDuKShHG0g', filename: 'beans/cherry-bomb/RKS05110.jpg', slug: 'cherry-bomb', position: 1 },
  { driveId: '1Mo022BZBhTTK9WWzj9--qrsQsgTpmHNM', filename: 'beans/cherry-bomb/RKS06398.jpg', slug: 'cherry-bomb', position: 2 },

  // ── Dinner Wine (2 images) ────────────────────────────────────────────────
  { driveId: '1NsA-B2KBOXAFnk6prU7QZiZiggajMQes', filename: 'beans/dinner-wine/hero.jpg',    slug: 'dinner-wine', position: 0 },
  { driveId: '16p7SNIZlHdonWTPv-RlKayVsyz08lHCa', filename: 'beans/dinner-wine/RKS06398.jpg', slug: 'dinner-wine', position: 1 },

  // ── Aster (3 images) ──────────────────────────────────────────────────────
  { driveId: '1A4qE5roibeIDGFMm8KfnAOVAO50JQ_Vy', filename: 'beans/aster/hero.jpg',      slug: 'aster', position: 0 },
  { driveId: '1KE3Ob99x29YhPeY9HTM-_YixFLN5ip95', filename: 'beans/aster/RKS05973.jpg',   slug: 'aster', position: 1 },
  { driveId: '198DsnQ9cyoHuBBAjJsV41WnY2NxNTNeV', filename: 'beans/aster/RKS06402.jpg',   slug: 'aster', position: 2 },

  // ═══════════════════════════════════════════════════════════════════════════
  // MERCH
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Symbol Cap (10 images) ────────────────────────────────────────────────
  { driveId: '1uEtm3mKM1LuHq46pShB5FPswpQp62QTu', filename: 'cap/cap-hero.jpg',    slug: 'symbol-cap', position: 0 },
  { driveId: '1geReXhmspuihZ_oNnuSurCD-JGgCya1Q', filename: 'cap/cap-2.jpg',       slug: 'symbol-cap', position: 1 },
  { driveId: '1lrp11vD0dfSX3KlthGn4Pa8kwY2Yidc8', filename: 'cap/RKS04869.jpg',    slug: 'symbol-cap', position: 2 },
  { driveId: '1jNQkSfIEymVDX9NUeJLsRvFSu1Og1qyQ', filename: 'cap/RKS04936.jpg',    slug: 'symbol-cap', position: 3 },
  { driveId: '1unxyrfP39YGVoO2D3bHIxa_LXe135Cu-', filename: 'cap/RKS04937.jpg',    slug: 'symbol-cap', position: 4 },
  { driveId: '1yElje2YdNsaCtoZTSFflQd0QHzymL18o', filename: 'cap/RKS04941.jpg',    slug: 'symbol-cap', position: 5 },
  { driveId: '1T9stPZ0SRhp7ONj_ay3W6WfQyqJ2uuM8', filename: 'cap/RKS04943.jpg',    slug: 'symbol-cap', position: 6 },
  { driveId: '1VrBK_hzf0aDJe9156uwVTHylBnq2RSZQ', filename: 'cap/RKS04945.jpg',    slug: 'symbol-cap', position: 7 },
  { driveId: '1pzwE3SlupOp0pLeWyVTGySRvY9M6N6aU', filename: 'cap/RKS04947.jpg',    slug: 'symbol-cap', position: 8 },
  { driveId: '1Jj0kKa7kmgDLPHbTYOUMtadDxeYPFf5b', filename: 'cap/RKS04955.jpg',    slug: 'symbol-cap', position: 9 },

  // ── Hold My Coffee Bag (6 images) ─────────────────────────────────────────
  { driveId: '1GXX99N8KVUa31AQtnOEKoWC9PfC_Bzsm', filename: 'bag/bag-hero.jpg',    slug: 'hold-my-coffee-bag', position: 0 },
  { driveId: '14tuOtvQCy1LdbUcD1bN16vxcA3dnXD_0', filename: 'bag/IMG_1558.jpg',    slug: 'hold-my-coffee-bag', position: 1 },
  { driveId: '1YZq8XMgTfxhXlJhPOnyYoZaSenm5rynb', filename: 'bag/IMG_1571.jpg',    slug: 'hold-my-coffee-bag', position: 2 },
  { driveId: '1tEaa7xAtEvo-szJxJr7D5dGAWBuZzUTl', filename: 'bag/IMG_1600.jpg',    slug: 'hold-my-coffee-bag', position: 3 },
  { driveId: '1soQaQbTYxLH3mN-uzYDWx5vHgczQUMwz', filename: 'bag/IMG_1614.jpg',    slug: 'hold-my-coffee-bag', position: 4 },
  { driveId: '14PrKkqhs7cvHVugChHeVuOo8AkAewNOO', filename: 'bag/RKS04871.jpg',    slug: 'hold-my-coffee-bag', position: 5 },

  // ── Cortado & Espresso Cup (5 images) ─────────────────────────────────────
  { driveId: '1DNh3oxgEiYjRZm14vj6YdP6RDjDWnqQy', filename: 'cup/cortado-hero.jpg', slug: 'cortado-and-espresso-cup', position: 0 },
  { driveId: '1Gd-K1hzPPnjuClu59nrm6LRyxzXQD0Kx', filename: 'cup/RKS04809.jpg',    slug: 'cortado-and-espresso-cup', position: 1 },
  { driveId: '1NREJ-uj3xuVsIhkz7Bho87zj1jK41qLD', filename: 'cup/RKS04815.jpg',    slug: 'cortado-and-espresso-cup', position: 2 },
  { driveId: '1iXvHWKiPn5PztIL7FObtHNe0lNEYDKx5', filename: 'cup/RKS04818.jpg',    slug: 'cortado-and-espresso-cup', position: 3 },
  { driveId: '1bGc1G3GPIfh2Wo_XTLgJkv8MYMVloD3k', filename: 'cup/RKS04824.jpg',    slug: 'cortado-and-espresso-cup', position: 4 },

  // ── Functional Cup for Pourover (5 images) ────────────────────────────────
  { driveId: '1K8gJVpPRSPf9mlsT6nVR1OxE97Yk2ibc', filename: 'cup/IMG_1497.jpg',    slug: 'functional-cup-for-pourover', position: 0 },
  { driveId: '1ln7MchbYUbv30_GAV2hB_DhjJG9D5jkD', filename: 'cup/RKS04830.jpg',    slug: 'functional-cup-for-pourover', position: 1 },
  { driveId: '1ICBob51Y--XLtIojS8GrevqT9K7dstE-', filename: 'cup/RKS04833.jpg',    slug: 'functional-cup-for-pourover', position: 2 },
  { driveId: '1kq7b0ggqYI11eHoLkklQAbm2fHW6cxqp', filename: 'cup/RKS04906.jpg',    slug: 'functional-cup-for-pourover', position: 3 },
  { driveId: '1eqiNJoCT099e837UHonUEUbNPb7-Pq8z', filename: 'cup/RKS04912.jpg',    slug: 'functional-cup-for-pourover', position: 4 },

  // ── Ritual Cup & Hourglass Saucer (2 images) ──────────────────────────────
  { driveId: '1zuSWqaH920BUUL0j2h_khmMUAjeU7k_p', filename: 'cup/IMG_1653.jpg',    slug: 'ritual-cup-and-hourglass-saucer', position: 0 },
  { driveId: '1lKCFstsnjkLI5gOqvpOWCixDOI7ezp9n', filename: 'cup/RKS04914.jpg',    slug: 'ritual-cup-and-hourglass-saucer', position: 1 },

  // ── Coffee After 6 PM Scented Candle (2 images) ──────────────────────────
  { driveId: '18CjfhJtuWrukjnfdqF8GdsyALV872jji', filename: 'candle/RKS04195.jpg', slug: 'coffee-after-6-pm-scented-candle', position: 0 },
  { driveId: '1ME1ideQRwYYqdu4Si07pmOtbGA-aYoG1', filename: 'candle/RKS04200.jpg', slug: 'coffee-after-6-pm-scented-candle', position: 1 },

  // ── Ceramic Moka Pot (1 image) ───────────────────────────────────────────
  { driveId: '1zsqWPDff6sZFPT2E-V8la3mXJT1d0U8Z', filename: 'ceramic-moka-pot/hero.jpg', slug: 'ceramic-moka-pot', position: 0 },

  // ── To-Go Tumbler (8 images) ──────────────────────────────────────────────
  { driveId: '1INXh8iuoxbMG58BK66Vxzg1fzFZ8Mowv', filename: 'tumbler/RKS04932.jpg', slug: 'to-go-tumbler', position: 0 },
  { driveId: '1tHE93RxYbEvIY5P87fV6r4UMHyoZwME0', filename: 'tumbler/RKS04934.jpg', slug: 'to-go-tumbler', position: 1 },
  { driveId: '1Z76SzjDQLY1neDFVd1xsEvoMyuEqtJvL', filename: 'tumbler/RKS04957.jpg', slug: 'to-go-tumbler', position: 2 },
  { driveId: '1E54a_C7Q11YgchooAhBdpNJwwOzvGpRZ', filename: 'tumbler/RKS04965.jpg', slug: 'to-go-tumbler', position: 3 },
  { driveId: '1lfFRoQh4pXooapRDoeBY_3kYyQeBIM0v', filename: 'tumbler/RKS04966.jpg', slug: 'to-go-tumbler', position: 4 },
  { driveId: '1M71aGRiYUek9Wkib7L9c3eSsdQYOghyh', filename: 'tumbler/RKS04969.jpg', slug: 'to-go-tumbler', position: 5 },
  { driveId: '16Bgwhb1BueK-e0NAC-X00ri-RsFvyQVm', filename: 'tumbler/RKS05006.jpg', slug: 'to-go-tumbler', position: 6 },
  { driveId: '1H6d3nJbAgrRUqQs1SNzzp-LjQrKyqCMY', filename: 'tumbler/RKS05011.jpg', slug: 'to-go-tumbler', position: 7 },

  // ── Elevated Rituals Tee — white (8 images) ───────────────────────────────
  { driveId: '1WtlUfGnL-x0oNmtVcBOQpcDQBZSwmnhg', filename: 'tee-white/RKS04969.jpg',  slug: 'elevated-rituals-tee', position: 0 },
  { driveId: '1NJ9l0k1Y3IvbnV3HFExJMSCq3WUSMXRD', filename: 'tee-white/RKS05071.jpg',  slug: 'elevated-rituals-tee', position: 1 },
  { driveId: '1NoWIrUX2Jum6yydtGMp127pY6oljoH_1', filename: 'tee-white/RKS05074.jpg',  slug: 'elevated-rituals-tee', position: 2 },
  { driveId: '1uuNZkqCipcPyVRqyWQB0aw38_uKS5hIp', filename: 'tee-white/RKS05082.jpg',  slug: 'elevated-rituals-tee', position: 3 },
  { driveId: '1TEBJ2seU4GjaPoqvh5WNmC7sB5i7abZo', filename: 'tee-white/RKS05083.jpg',  slug: 'elevated-rituals-tee', position: 4 },
  { driveId: '1t-lVrZnbvEnvRYe_Xpxs57V0PpBGZJUm', filename: 'tee-white/RKS05088.jpg',  slug: 'elevated-rituals-tee', position: 5 },
  { driveId: '1n5isZQXseG--SDTZgwc21oHXHfXAyCq5', filename: 'tee-white/RKS05092.jpg',  slug: 'elevated-rituals-tee', position: 6 },
  { driveId: '1e8e11h4mvKqMaW0QJWKQcBcNrETj6Bn7', filename: 'tee-white/RKS05097.jpg',  slug: 'elevated-rituals-tee', position: 7 },

  // ── Coffee Is A Lifestyle Tee — white (8 images) ──────────────────────────
  { driveId: '19OxmfHvnFIDABimycZKbhn-wifRtwIrf', filename: 'tee-white/IMG_1556.jpg',   slug: 'coffee-is-a-lifestyle-tee', position: 0 },
  { driveId: '1G2smelfaVxMc-Jb-PG4FardxHBQK0UAt', filename: 'tee-white/IMG_1634.jpg',   slug: 'coffee-is-a-lifestyle-tee', position: 1 },
  { driveId: '1aOtBgBVBCy3K5O5cLtow0HUSl2nB8Soe', filename: 'tee-white/IMG_1653.jpg',   slug: 'coffee-is-a-lifestyle-tee', position: 2 },
  { driveId: '1zYY_HoLzbz3DOIHbI3pZPpa6LA-ayZ6P', filename: 'tee-white/RKS04906.jpg',  slug: 'coffee-is-a-lifestyle-tee', position: 3 },
  { driveId: '1BnhDp3Rw6lzK5eX13bYuGYCJHLVrRos9', filename: 'tee-white/RKS04912.jpg',  slug: 'coffee-is-a-lifestyle-tee', position: 4 },
  { driveId: '10Hk_mBEuIWv85_BGuEbMOGtfrugnduz9', filename: 'tee-white/RKS04914.jpg',  slug: 'coffee-is-a-lifestyle-tee', position: 5 },
  { driveId: '1vvAw5ShUorFUbgME6r6YRhzFjDPYrzgz', filename: 'tee-white/RKS04965.jpg',  slug: 'coffee-is-a-lifestyle-tee', position: 6 },
  { driveId: '1WktlAA0-oaIokNHPF9HmLyr-k53aTuXy', filename: 'tee-white/RKS04966.jpg',  slug: 'coffee-is-a-lifestyle-tee', position: 7 },

  // ── Can You Do An Iced Pourover Tee — black (18 images) ──────────────────
  { driveId: '18RRG2413RXrti5f3DHy2MMvRwneV2aYD', filename: 'tee-black/black-hero.jpg', slug: 'can-you-do-an-iced-pourover-tee', position: 0 },
  { driveId: '1rJuOpQiwaQkyhz_d-GFhiKtwMJCGJ23w', filename: 'tee-black/IMG_1577.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 1 },
  { driveId: '1vz8iXdhn6AHrSjioMm0ks7uKbeZChuPD', filename: 'tee-black/RKS04996.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 2 },
  { driveId: '1yny9BsZU5ByIaaw7d9_7-vO2MXN7BbRH', filename: 'tee-black/RKS04999.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 3 },
  { driveId: '1AfXWQv9XAQObygXQ4Hf33-l9O6215mbk', filename: 'tee-black/RKS05003.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 4 },
  { driveId: '1-JEqfBvZJNd8evKBtU1jGScEMq4k2FlF', filename: 'tee-black/RKS05004.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 5 },
  { driveId: '1hXlX3gE6VgSpFIFvV69-RD4Cf1PizuUx', filename: 'tee-black/RKS05006.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 6 },
  { driveId: '1oVdQMQa7GR--Th0_QL94gUzClGuDQ_ar', filename: 'tee-black/RKS05011.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 7 },
  { driveId: '16ZeaLVGJsppCeCAHv-dvC7KHhTZjukZ-', filename: 'tee-black/RKS05026.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 8 },
  { driveId: '1BgNWBDby089YLlNwcnGl4GG5V3hEHCrN', filename: 'tee-black/RKS05028.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 9 },
  { driveId: '11eYUYlPe-F15GDHCMu-0sHGTJzQhXFyo', filename: 'tee-black/RKS05034.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 10 },
  { driveId: '1gluAwyjsouwmFC1DgmZzsvDqpCtHJ_QK', filename: 'tee-black/RKS05036.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 11 },
  { driveId: '12u1lSHACcBDo96cN7U01Fa9xu3tBy7u9', filename: 'tee-black/RKS05043.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 12 },
  { driveId: '1j97c3JqQCqW49hdmFgUjMUBQ-vHSqras', filename: 'tee-black/RKS05046.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 13 },
  { driveId: '1a_B8KZFTT33OCvxAg9zZYSE8Z04wpGod', filename: 'tee-black/RKS05048.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 14 },
  { driveId: '1eEK380-FNE6_GV2Al5TLu05zajYWh0U0', filename: 'tee-black/RKS05054.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 15 },
  { driveId: '1_NsjMcjxW60pJJiWBMmnNXJLIyqFh3eI', filename: 'tee-black/RKS05063.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 16 },
  { driveId: '1ixNb5m2gjaN-HUh-adDA2fYdwwgGfocY', filename: 'tee-black/RKS05069.jpg',  slug: 'can-you-do-an-iced-pourover-tee', position: 17 },
  { driveId: '1_b4XVKQtZungxzV7_8XDATtsYtHogk7C', filename: 'tee-black/detail-4.png',  slug: 'can-you-do-an-iced-pourover-tee', position: 18 },
  { driveId: '1K283IOMZZh7suPapExE0OUInhEaH3Tig', filename: 'tee-black/detail-5.png',  slug: 'can-you-do-an-iced-pourover-tee', position: 19 },

  // ── Ritual Bottle (2 images) ──────────────────────────────────────────────
  { driveId: '1rJvqSUNHg7aX1gmVt5CA3VODP1nysIN7', filename: 'bottle/RKS04790.jpg', slug: 'ritual-bottle', position: 0 },
  { driveId: '1R4uf81jTcxLGSArMiYIK6bHdStZi6H97', filename: 'bottle/RKS04794.jpg', slug: 'ritual-bottle', position: 1 },

  // ── Timeless Tray (3 images) ──────────────────────────────────────────────
  { driveId: '1N3syv0IjMFCdkhE6vINUITET2shscZwD', filename: 'tray/Metal-Tray-hero.jpg',    slug: 'timeless-tray', position: 0 },
  { driveId: '1exqbclmGQjfxr-P9FuZSop3LtUkACMcI', filename: 'tray/Metal-Tray-Closeup.jpg', slug: 'timeless-tray', position: 1 },
  { driveId: '14WeOzMMA2yYAyrK3M_c5YaleTr9xBYPa', filename: 'tray/Metal-Tray-2.jpg',       slug: 'timeless-tray', position: 2 },

  // ── Set of 3 Pencils (2 images) ───────────────────────────────────────────
  { driveId: '12Edjkrd8NYuWO9vjmIfF_XwSSdexNfJ2', filename: 'pencils/Wooden-Pencil-Set.jpg',   slug: 'set-of-3-pencils', position: 0 },
  { driveId: '1jiFlImHsz36Tdi0X4GmFNAMEizbGisSG', filename: 'pencils/Wooden-Pencil-Set-2.jpg', slug: 'set-of-3-pencils', position: 1 },

  // ── Root lifestyle / unassigned shots (uploaded to Storage only) ──────────
  { driveId: '1ab7WR5IyUblTWqSuGwipkZAbOKE_rahu', filename: 'lifestyle/dipinthepool.jpg',     slug: null },
  { driveId: '1SoDF0Ao6z5KnAUmGMc5BTZGRITzIBRIB', filename: 'lifestyle/pineapplecoldbrew.jpg', slug: null },
  { driveId: '1Y20CAX9nC5dWfWnvsuLTnBEkcEkBPm0G', filename: 'lifestyle/eveningshirt.jpg',      slug: null },
  { driveId: '1q78VBOaihK3UBaji-ESuyyKklUPzv42I', filename: 'lifestyle/RKS04783.jpg',          slug: null },
  { driveId: '1ABA-8qQnxhVeo-Jv9jIb8emdKQe8-a0W', filename: 'lifestyle/RKS04786.jpg',         slug: null },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function downloadFromDrive(fileId) {
  // Try the newer usercontent URL first (avoids the virus-scan redirect page)
  const urls = [
    `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`,
    `https://drive.google.com/uc?export=download&id=${fileId}`,
  ];
  for (const url of urls) {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) continue;
    const ct = res.headers.get('content-type') || '';
    // Reject HTML pages (virus-scan confirmation pages)
    if (ct.includes('text/html')) continue;
    return res;
  }
  throw new Error(`Drive download failed for ${fileId}`);
}

async function uploadToSupabase(filename, buffer, contentType) {
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': contentType || 'image/jpeg',
      'x-upsert': 'true',
    },
    body: buffer,
  });
  return { status: res.status, json: await res.json() };
}

function publicUrl(filename) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  STEP 1 — Run this SQL in Supabase SQL Editor BEFORE the script  ║
╚══════════════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS product_images (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url   TEXT        NOT NULL,
  position    INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public read product_images"
  ON product_images FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Service role write product_images"
  ON product_images USING (auth.role() = 'service_role');
CREATE INDEX IF NOT EXISTS product_images_product_position
  ON product_images (product_id, position);

Press Enter when done...`);

await new Promise((r) => process.stdin.once('data', r));

async function main() {
  const inserts = []; // { slug, imageUrl, position }
  let ok = 0, fail = 0;

  for (const img of IMAGES) {
    process.stdout.write(`  ${img.filename} … `);
    let driveRes;
    try {
      driveRes = await downloadFromDrive(img.driveId);
    } catch (e) {
      console.log(`DOWNLOAD FAILED: ${e.message}`);
      fail++;
      continue;
    }

    const contentType = driveRes.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await driveRes.arrayBuffer());
    process.stdout.write(`${Math.round(buffer.length / 1024)} KB → `);

    const { status, json } = await uploadToSupabase(img.filename, buffer, contentType);
    if (status === 200 || status === 201 || json.Key) {
      console.log('OK');
      if (img.slug != null) {
        inserts.push({ slug: img.slug, imageUrl: publicUrl(img.filename), position: img.position ?? 0 });
      }
      ok++;
    } else {
      console.log(`UPLOAD ERROR: ${JSON.stringify(json)}`);
      fail++;
    }
  }

  console.log(`\n✅  ${ok} uploaded  ❌  ${fail} failed`);

  if (inserts.length === 0) {
    console.log('\nNo successful uploads with slugs — nothing to insert.');
    return;
  }

  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  STEP 3 — Run this SQL in Supabase SQL Editor                    ║
╚══════════════════════════════════════════════════════════════════╝

-- Clear existing rows first (safe to re-run)
DELETE FROM product_images
WHERE product_id IN (
  SELECT id FROM products
  WHERE slug IN (${[...new Set(inserts.map((i) => `'${i.slug}'`))].join(', ')})
);

-- Insert fresh rows
INSERT INTO product_images (product_id, image_url, position)
SELECT p.id, v.image_url, v.position
FROM (VALUES`);

  inserts.forEach((r, idx) => {
    const comma = idx < inserts.length - 1 ? ',' : '';
    console.log(`  ('${r.slug}', '${r.imageUrl}', ${r.position})${comma}`);
  });

  console.log(`) AS v(slug, image_url, position)
JOIN products p ON p.slug = v.slug;

-- Verify
SELECT p.slug, count(*) AS img_count
FROM product_images pi
JOIN products p ON p.id = pi.product_id
GROUP BY p.slug ORDER BY p.slug;
`);
}

main().catch(console.error);
