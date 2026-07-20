-- Let the admin account read every order (customers still only see their own —
-- SELECT policies are OR'd, so this is purely additive).
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING ((auth.jwt() ->> 'email') = 'jai@commontime.in');

DROP POLICY IF EXISTS "Admin can view all order items" ON order_items;
CREATE POLICY "Admin can view all order items"
  ON order_items FOR SELECT
  USING ((auth.jwt() ->> 'email') = 'jai@commontime.in');
