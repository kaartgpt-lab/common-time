-- is_admin() pointed at 'jaivardhan@commontime.in', which has no account — so it
-- always returned false and ALL product writes / image uploads were blocked.
-- Point it at the real admin accounts (must match ADMIN_EMAILS in src/pages/Admin.jsx).
CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email IN ('jai@commontime.in', 'sarthack0@gmail.com')
  );
$function$;

-- Admin image uploads now target the 'products' bucket (where all real product
-- images live); previously only 'product-images' was permitted.
DROP POLICY IF EXISTS "Admin can upload to products bucket" ON storage.objects;
CREATE POLICY "Admin can upload to products bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND is_admin());

DROP POLICY IF EXISTS "Admin can update products bucket" ON storage.objects;
CREATE POLICY "Admin can update products bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products' AND is_admin());

DROP POLICY IF EXISTS "Admin can delete from products bucket" ON storage.objects;
CREATE POLICY "Admin can delete from products bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND is_admin());
