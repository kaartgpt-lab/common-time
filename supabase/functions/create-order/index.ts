/**
 * create-order Edge Function
 * Validates cart, creates DB order, calls Razorpay to get a payment order_id
 */

/// <reference lib="deno.window" />

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin, createUserClient } from "../_shared/supabase.ts";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

interface CartItem { product_id: string; quantity: number; }
interface ShippingAddress {
  name: string; phone: string; address_line1: string;
  address_line2?: string; city: string; state: string; pincode: string;
}
interface Product { id: string; name: string; price: number; stock_quantity: number; is_active: boolean; }

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* ---------- AUTH ---------- */
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createUserClient(req);
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* ---------- BODY ---------- */
    const { items, shipping_address: shipping } = await req.json() as {
      items: CartItem[]; shipping_address: ShippingAddress;
    };

    if (!items?.length) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!shipping?.name || !shipping?.phone || !shipping?.address_line1 ||
        !shipping?.city || !shipping?.state || !shipping?.pincode) {
      return new Response(JSON.stringify({ error: "Shipping address is incomplete" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* ---------- VALIDATE PRODUCTS & CALCULATE TOTAL ---------- */
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, stock_quantity, is_active")
      .in("id", items.map((i) => i.product_id));

    if (productsError || !products?.length) {
      return new Response(JSON.stringify({ error: "Invalid products" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const productMap = new Map<string, Product>(
      (products as Product[]).map((p) => [p.id, p])
    );

    let totalPaise = 0;
    const orderItemsRows: { product_id: string; quantity: number; price_at_purchase: number }[] = [];

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product?.is_active) {
        return new Response(JSON.stringify({ error: `Product ${item.product_id} is unavailable` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const qty = Math.max(1, Math.floor(Number(item.quantity)) || 1);
      if (product.stock_quantity < qty) {
        return new Response(JSON.stringify({ error: `Insufficient stock for ${product.name}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      totalPaise += product.price * qty;
      orderItemsRows.push({ product_id: product.id, quantity: qty, price_at_purchase: product.price });
    }

    if (totalPaise < 100) {
      return new Response(JSON.stringify({ error: "Order total must be at least ₹1" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* ---------- CREATE DB ORDER (pending) ---------- */
    const shippingString = [shipping.address_line1, shipping.address_line2, shipping.city, shipping.state, shipping.pincode]
      .filter(Boolean).join(", ");

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        total_amount: totalPaise,
        shipping_name: shipping.name,
        shipping_phone: shipping.phone,
        shipping_address: shippingString,
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_pincode: shipping.pincode,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      throw new Error("Order creation failed: " + orderError?.message);
    }

    /* ---------- CREATE ORDER ITEMS ---------- */
    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsRows.map((row) => ({ ...row, order_id: order.id })));

    if (itemsError) throw new Error("Order items creation failed: " + itemsError.message);

    /* ---------- CALL RAZORPAY ---------- */
    const rzpAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${rzpAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: totalPaise,
        currency: "INR",
        receipt: `rcpt_${order.id.slice(0, 20)}`,
      }),
    });

    if (!rzpRes.ok) {
      const err = await rzpRes.json();
      console.error("[create-order] Razorpay error:", err);
      // Clean up the pending order so the user can retry
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return new Response(JSON.stringify({ error: "Payment gateway error", detail: err }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rzpOrder = await rzpRes.json();

    // Persist the Razorpay order ID so verify-payment can look it up
    await supabaseAdmin
      .from("orders")
      .update({ razorpay_order_id: rzpOrder.id })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        order_id: order.id,
        razorpay_order_id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[create-order] Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error", message: err instanceof Error ? err.message : String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});