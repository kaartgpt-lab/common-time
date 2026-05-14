-- Add slug column to products for URL-friendly routing
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
