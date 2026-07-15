-- Add variant columns (grind + package weight) to order_items so orders record
-- exactly how each coffee should be ground and which size was purchased.
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS grind  TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS weight TEXT;
