-- Seed products from merchData (mapped to coffee / merchandise)
-- Price: stored in paise (INR). 19.99 -> 1999 paise = Rs 19.99

-- Coffee: Coffee Beans, Brewing Kit, Instant Coffee
-- Merchandise: Drinkware, Apparel, Brewing Equipment, Lifestyle

INSERT INTO products (id, name, description, price, image_url, category, stock_quantity, is_active) VALUES
  (gen_random_uuid(), 'CommonTime Signature Coffee Beans', 'Our signature blend of Arabica beans sourced from the highlands of Ethiopia and Colombia. A perfect balance of brightness, body, and aroma.', 1999, '/newshero.jpg', 'coffee', 100, true),
  (gen_random_uuid(), 'CommonTime Cold Brew Kit', 'Everything you need to brew café-quality cold coffee at home. Includes pre-ground beans, filter bags, and a glass bottle.', 3499, '/newshero.jpg', 'coffee', 50, true),
  (gen_random_uuid(), 'CommonTime Drip Coffee Bags', 'Single-serve drip coffee bags for ultimate convenience. Just add hot water and enjoy barista-grade coffee anywhere.', 1599, '/newshero.jpg', 'coffee', 200, true),
  (gen_random_uuid(), 'CommonTime Espresso Cup Set', 'Minimalist ceramic espresso cup set with matte finish. Perfect for your morning ritual.', 2499, '/newshero.jpg', 'merchandise', 80, true),
  (gen_random_uuid(), 'CommonTime Barista Hoodie', 'Cozy fleece hoodie designed for coffee lovers. Embroidered CommonTime logo and soft interior lining.', 4999, '/newshero.jpg', 'merchandise', 60, true),
  (gen_random_uuid(), 'CommonTime Pour Over Kit', 'Includes ceramic dripper, filters, and a precision scoop — ideal for slow, mindful brewing.', 4499, '/newshero.jpg', 'merchandise', 40, true),
  (gen_random_uuid(), 'CommonTime Coffee Candle', 'Hand-poured soy candle that fills your space with the aroma of freshly brewed coffee and vanilla beans.', 1499, '/newshero.jpg', 'merchandise', 120, true),
  (gen_random_uuid(), 'CommonTime Travel Mug', 'Insulated stainless steel travel mug keeps your coffee hot for up to 6 hours. Minimal design with matte finish.', 2299, '/newshero.jpg', 'merchandise', 90, true);