-- ═══════════════════════════════════════════════════════════════
-- COMMON TIME — Product Seed Script
-- Run this in the Supabase SQL Editor (supabase.com → SQL Editor)
-- Safe to re-run: uses INSERT ... ON CONFLICT DO UPDATE
-- ═══════════════════════════════════════════════════════════════

-- ── Step 1: Deactivate old non-retail categories ─────────────
UPDATE products
SET is_active = false
WHERE category IN ('coffee', 'matcha', 'all-day', 'bakes', 'all_day');

-- ── Step 2: Upsert all beans ──────────────────────────────────
INSERT INTO products (name, slug, description, price, category, stock_quantity, is_active, tag)
VALUES
  -- Blends (priced at 200g)
  (
    'Lodhi Espresso Blend',
    'lodhi-espresso-blend',
    'Our everyday espresso blend, inspired by our first location and made for the cups we return to often.',
    65000, -- ₹650 in paise
    'beans', 100, true, 'everyday'
  ),
  (
    'House Pourover',
    'house-pourover',
    'A medium roast from Sirangalli, made for a balanced everyday pourover.',
    75000, -- ₹750 in paise
    'beans', 100, true, 'everyday'
  ),
  (
    'Jasmine Blossom',
    'jasmine-blossom',
    'A washed light-medium roast from Sirangalli Kotebetta, delicate and tea-like.',
    75000, -- ₹750 in paise
    'beans', 100, true, 'floral'
  ),
  -- Single origins (priced at 100g)
  (
    'Santa Ana Sunset',
    'santa-ana-sunset',
    'A Bourbon natural from San Agustin, El Salvador — round body, delicate acidity.',
    150000, -- ₹1500 in paise
    'beans', 50, true, 'single origin'
  ),
  (
    'Cherry Bomb',
    'cherry-bomb',
    'A vibrant Ethiopian coffee with black cherry, dark chocolate and a full, creamy body.',
    150000, -- ₹1500 in paise
    'beans', 50, true, 'single origin'
  ),
  (
    'Dinner Wine',
    'dinner-wine',
    'A naturally processed Colombian coffee with red grape, peach and a sweet, juicy finish.',
    150000, -- ₹1500 in paise
    'beans', 50, true, 'single origin'
  ),
  (
    'Aster',
    'aster',
    'A natural Panama Baby Geisha from Finca Hartmann, floral and smooth with a soft nutty sweetness.',
    150000, -- ₹1500 in paise
    'beans', 30, true, 'single origin'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  tag = EXCLUDED.tag;

-- ── Step 3: Upsert all merch ──────────────────────────────────
INSERT INTO products (name, slug, description, price, category, stock_quantity, is_active, tag)
VALUES
  (
    'Can You Do An Iced Pourover Tee',
    'can-you-do-an-iced-pourover-tee',
    'The "Can You Do An Iced Pourover?" tee is made in black cotton terry with a soft, structured feel.',
    100000, -- ₹1000 in paise
    'merch', 50, true, 'apparel'
  ),
  (
    'Elevated Rituals Tee',
    'elevated-rituals-tee',
    'The Elevated Rituals tee is made in white cotton terry, designed as an easy everyday layer.',
    80000, -- ₹800 in paise
    'merch', 50, true, 'apparel'
  ),
  (
    'Coffee Is A Lifestyle Tee',
    'coffee-is-a-lifestyle-tee',
    'The Coffee Is A Lifestyle tee is made in white cotton terry with a clean everyday fit.',
    100000, -- ₹1000 in paise
    'merch', 50, true, 'apparel'
  ),
  (
    'Coffee After 6 PM Scented Candle',
    'coffee-after-6-pm-scented-candle',
    'A scented candle created for slower evenings. Notes of dark roast, warm sugar, and spice.',
    150000, -- ₹1500 in paise
    'merch', 30, true, 'home'
  ),
  (
    'Ceramic Dripper Set for Pourover',
    'ceramic-dripper-set-for-pourover',
    'A ceramic dripper set designed for pourover brewing. Precise, clean, and made for the ritual of a slow cup.',
    200000, -- ₹2000 in paise
    'merch', 20, true, 'brew'
  ),
  (
    'Hold My Coffee Bag',
    'hold-my-coffee-bag',
    'Made in vegan leather and designed to carry coffee, small objects and daily essentials.',
    120000, -- ₹1200 in paise
    'merch', 30, true, 'carry'
  ),
  (
    'Symbol Cap',
    'symbol-cap',
    'An everyday cap featuring the Common Time symbol. Made to be worn often, with a simple shape and a quiet brand detail.',
    80000, -- ₹800 in paise
    'merch', 40, true, 'apparel'
  ),
  (
    'Ritual Bottle',
    'ritual-bottle',
    'An insulated bottle made for hot and cold beverages. Built for daily use.',
    110000, -- ₹1100 in paise
    'merch', 30, true, 'drinkware'
  ),
  (
    'To-Go Tumbler',
    'to-go-tumbler',
    'A 350 ml tumbler designed for coffee on the move. Simple, functional, made to be used often.',
    80000, -- ₹800 in paise
    'merch', 40, true, 'drinkware'
  ),
  (
    'Timeless Tray',
    'timeless-tray',
    'A lean, durable tray made for coffee, objects, and everyday rituals.',
    180000, -- ₹1800 in paise
    'merch', 20, true, 'home'
  ),
  (
    'Functional Cup for Pourover',
    'functional-cup-for-pourover',
    'A 200 ml pourover cup designed to hold warmth for longer. Made for slower cups.',
    100000, -- ₹1000 in paise
    'merch', 25, true, 'drinkware'
  ),
  (
    'Ritual Cup & Hourglass Saucer',
    'ritual-cup-and-hourglass-saucer',
    'A 200 ml cup and hourglass saucer set designed around the ritual of pourover.',
    120000, -- ₹1200 in paise — UPDATE if needed
    'merch', 20, true, 'drinkware'
  ),
  (
    'Cortado & Espresso Cup',
    'cortado-and-espresso-cup',
    'A 120 ml mini cup designed for cortado, espresso, and sensory tasting.',
    80000, -- ₹800 in paise — UPDATE if needed
    'merch', 25, true, 'drinkware'
  ),
  (
    'Set of 3 Pencils',
    'set-of-3-pencils',
    'A set of three pencils for notes, thoughts, and slower writing. write more, type less.',
    15000, -- ₹150 in paise
    'merch', 100, true, 'stationery'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  tag = EXCLUDED.tag;

-- ── Check what was inserted ───────────────────────────────────
SELECT id, name, slug, category, price/100 AS price_inr, is_active
FROM products
WHERE category IN ('beans', 'merch')
ORDER BY category, name;
