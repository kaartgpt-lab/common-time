-- Admin RLS policies for product management
-- Run this once in your Supabase SQL editor

-- 1. Drop the existing service-role-only policies
DROP POLICY IF EXISTS "Only service role can insert products" ON products;
DROP POLICY IF EXISTS "Only service role can update products" ON products;
DROP POLICY IF EXISTS "Only service role can delete products" ON products;

-- 2. Create a helper function that checks if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'jaivardhan@commontime.in'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. Re-create policies allowing admin user to manage products
CREATE POLICY "Admin can insert products"
  ON products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update products"
  ON products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin can delete products"
  ON products FOR DELETE
  USING (public.is_admin());

-- 4. Create product-images storage bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage policies — public read, admin write
CREATE POLICY "Public can read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());
