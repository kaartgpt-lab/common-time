-- Allow both admin accounts to read all orders (customers still only see their own).
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING ((auth.jwt() ->> 'email') IN ('jai@commontime.in', 'sarthack0@gmail.com'));

DROP POLICY IF EXISTS "Admin can view all order items" ON order_items;
CREATE POLICY "Admin can view all order items"
  ON order_items FOR SELECT
  USING ((auth.jwt() ->> 'email') IN ('jai@commontime.in', 'sarthack0@gmail.com'));
