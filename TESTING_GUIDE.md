# Testing the Checkout Fixes - Step by Step Guide

## Prerequisites
- Node.js installed
- npm packages installed (`npm install` already done)
- Supabase account and project configured
- Database migrations applied

## Starting the Development Environment

### Step 1: Open Terminal and Navigate to Project
```bash
cd c:\Users\91828\Desktop\common-time\common-time
```

### Step 2: Verify Dev Server is Running
The dev server should already be running on `http://localhost:5173`

If not, start it:
```bash
npm run dev
```

You should see:
```
  VITE v7.1.7  ready in XXXX ms
  ➜  Local:   http://localhost:5173/
```

### Step 3: Open the Application
Open browser and go to: `http://localhost:5173`

---

## Testing Checkout Flow - Dev Mode

### Test 1: Authentication & Login
**What to Test:** User can login and get authenticated token

1. Look for "Login" or "Sign Up" link
2. Sign up with test credentials:
   - Email: `test@example.com`
   - Password: `Test123!@#`
3. Check browser console (F12) for any auth errors
4. You should be logged in

**Expected Result:** ✅ No 401 errors, user is authenticated

---

### Test 2: Add Items to Cart
**What to Test:** Products can be added to cart

1. Navigate to Shop or Browse Products page
2. Add 2-3 items to cart
3. Verify cart count increases
4. Check browser console for errors

**Expected Result:** ✅ Items are added, no console errors

---

### Test 3: Navigate to Checkout
**What to Test:** User can access checkout page

1. Click on Cart
2. Review items in cart
3. Click "Proceed to Checkout" or similar button
4. You should see the Checkout page with:
   - Shipping form on the left
   - Order summary on the right

**Expected Result:** ✅ Checkout page loads, no errors

---

### Test 4: Fill Shipping Address
**What to Test:** Form validation and input

1. Fill in the required fields:
   - Full Name: `John Doe`
   - Phone: `+91 9876543210`
   - Address Line 1: `123 Main Street`
   - Address Line 2: `Apt 4` (optional)
   - City: `New York`
   - State: `NY`
   - Pincode: `10001`

2. Verify all required fields show as filled
3. Check for any validation errors

**Expected Result:** ✅ All fields accept input, no validation errors

---

### Test 5: Complete Order in Dev Mode
**What to Test:** Order creation with dev mode bypass

1. Click the "Pay" button
2. **Important:** Open Browser DevTools (F12) and watch the Console tab
3. You should see log messages like:
   ```
   Creating order at: https://...
   Order response: {order_id: "...", razorpay_order_id: "dev_order_...", amount: XXXXX, dev_mode: true}
   ```

4. Wait for response (should be instant in dev mode)
5. You should see success message: "Order placed successfully (dev mode)!"
6. You should be redirected to orders page automatically

**Expected Result:** ✅ 
- No 401 errors
- No CORS errors
- order_id in response
- dev_mode: true in response
- Success message shown
- Redirected to orders page

---

### Test 6: Verify Order in Database
**What to Test:** Order is actually created in Supabase

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to "SQL Editor"
4. Run this query:
   ```sql
   SELECT id, user_id, status, total_amount, created_at 
   FROM orders 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

5. You should see your test order with:
   - `status: 'paid'` (dev mode sets it to paid)
   - `total_amount` matching your order total

6. Click on the order to see order_items
7. Verify order_items exist with your products
8. Check quantities match

**Expected Result:** ✅ 
- Order record exists
- Status is 'paid'
- Amount is correct
- Order items are created
- Shipping address is saved

---

### Test 7: Check Browser Console for Errors
**What to Test:** No console errors or warnings

1. Keep DevTools open (F12)
2. Go through all tests above
3. Watch the Console tab

**Expected Results:** ✅
- No red errors like:
  - ❌ "401 Unauthorized"
  - ❌ "CORS error"
  - ❌ "Fetch failed"
- Only info/debug logs (blue)

---

## Edge Cases to Test

### Test 8: Missing Shipping Field
1. In checkout, leave one field empty (e.g., City)
2. Click Pay
3. Should see error: "Please fill city"
4. Check FDevTools console

**Expected Result:** ✅ Error message, no API call made

---

### Test 9: Out of Stock Item
*If database supports stock_quantity*

1. Manually set a product stock to 0 in database
2. Try adding to cart and checkout with that item
3. Should see error: "Insufficient stock"

**Expected Result:** ✅ Stock validation works

---

### Test 10: Invalid Auth Token
*This tests auth error handling*

1. Open DevTools (F12)
2. In Console, run:
   ```javascript
   await supabase.auth.signOut();
   ```

3. Try to checkout
4. Should see 401 error

**Expected Result:** ✅ Appropriate error shown, redirected to login

---

## Debugging Checklist

If you encounter issues:

### Issue: 401 Authorization Error
**Check:**
- [ ] User is logged in (check Auth context)
- [ ] Session token exists (F12 → Application → Cookies)
- [ ] Token is being sent with Bearer prefix
- [ ] Token has not expired

**Solution:**
- Sign out and login again
- Check browser console for auth errors
- Verify Supabase URL and keys in .env

### Issue: CORS Error
**Check:**
- [ ] CORS headers are set in edge functions
- [ ] Functions URL is correct
- [ ] Browser is making CORS preflight request

**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check edge function logs

### Issue: Order Not Created
**Check:**
- [ ] Response includes all required fields
- [ ] order_id is present in response
- [ ] dev_mode flag is true
- [ ] No error in DevTools console

**Solution:**
- Check Supabase database directly
- Verify DEV_MODE=true in .env.local
- Check edge function logs

### Issue: Razorpay Modal Opens in Dev Mode
**Check:**
- [ ] dev_mode flag is true in response
- [ ] Frontend properly checks response.dev_mode

**Expected:** Should not open Razorpay in dev mode

---

## What Should Happen (Dev Mode Flow)

### Timeline of Events:
1. ⏱️ 0s: User clicks "Pay"
2. ⏱️ 0s: "Creating order at: https://..." logged
3. ⏱️ 0.5s: API call sent with:
   - Authorization: Bearer <token>
   - Items and shipping address
4. ⏱️ 1s: Edge function validates token
5. ⏱️ 1.5s: Edge function checks products & stock
6. ⏱️ 2s: Edge function creates order (status: paid)
7. ⏱️ 2.5s: Edge function responds with dev_mode: true
8. ⏱️ 3s: Frontend receives response
9. ⏱️ 3s: Frontend checks response.dev_mode === true
10. ⏱️ 3s: Cart is cleared
11. ⏱️ 3s: "Order placed successfully (dev mode)!" shown
12. ⏱️ 4s: Navigate to /orders page
13. ⏱️ 4s: Orders page shows new order

---

## Success Criteria

### ✅ All Tests Pass When:
- [ ] No 401 errors in console
- [ ] No CORS errors in console
- [ ] Order created in database
- [ ] Order status is "paid" in dev mode
- [ ] Order redirects to orders page
- [ ] No Razorpay modal opens in dev mode
- [ ] Cart is cleared after order
- [ ] Success toast appears

### ⚠️ Known Limitations (Dev Mode):
- Razorpay is bypassed (expected)
- No real payment processing (expected)
- Stock is not reduced automatically (can be added later)
- No email notifications (can be added later)

---

## Reporting Issues

If something doesn't work:
1. Document the exact error message
2. Take a screenshot of the error
3. Check DevTools console output
4. Check Files modified timestamps in editor
5. Verify environment variables are set

---

## Quick Reference

### Log Messages to Expect
✅ Good:
```
Creating order at: https://...
Order response: {order_id: "...", razorpay_order_id: "...", amount: 20000, dev_mode: true}
```

❌ Bad:
```
Invalid or expired token
CORS error
Failed to fetch
```

### Response Structure (Dev Mode)
```json
{
  "order_id": "order-abc123",
  "razorpay_order_id": "dev_order_1772800246480",
  "amount": 20000,
  "dev_mode": true
}
```

### HTTP Status Codes
- **200**: Success ✅
- **400**: Bad request (empty cart, missing fields)
- **401**: Unauthorized (invalid/missing token)
- **500**: Server error

---

## Next Steps After Testing

If everything passes:
1. ✅ Dev mode checkout is working
2. ✅ Authorization is fixed
3. ✅ CORS is fixed

For Production:
1. Implement real Razorpay integration
2. Set DEV_MODE=false
3. Add Razorpay secret key
4. Test production flow
5. Deploy to production

---

## Support Contact Points

For further help:
- Check edge function logs: Supabase Dashboard → Edge Functions
- Check database: Supabase Dashboard → SQL Editor
- Check frontend errors: Browser DevTools (F12)
- Check network requests: DevTools → Network tab

---

**Last Updated:** 2026-03-06
**Version:** 1.0 (Dev Mode)
