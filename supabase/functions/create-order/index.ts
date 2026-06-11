/**
 * create-order Edge Function
 * Creates a local order, then creates a real Razorpay order.
 */

/// <reference lib="deno.window" />

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin, createUserClient } from "../_shared/supabase.ts";

interface CartItem {
  product_id: string;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface CreateOrderBody {
  items: CartItem[];
  shipping_address: ShippingAddress;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getRazorpayKeys() {
  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEYS_MISSING");
  }

  return { keyId, keySecret };
}

async function createRazorpayOrder(params: {
  amount: number;
  currency: string;
  receipt: string;
  userId: string;
}) {
  const { keyId, keySecret } = getRazorpayKeys();

  const basicAuth = btoa(`${keyId}:${keySecret}`);

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      receipt: params.receipt,
      notes: {
        supabase_order_id: params.receipt,
        user_id: params.userId,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    console.error("[create-order] Razorpay auth failed:", data);
    throw new Error("RAZORPAY_AUTH_FAILED");
  }

  if (!response.ok) {
    console.error("[create-order] Razorpay order failed:", data);
    throw new Error("RAZORPAY_ORDER_FAILED");
  }

  if (!data?.id || !String(data.id).startsWith("order_")) {
    console.error("[create-order] Invalid Razorpay order response:", data);
    throw new Error("INVALID_RAZORPAY_ORDER");
  }

  return data;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const authHeader = req.headers.get("Authorization") ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return jsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const userClient = createUserClient(req);

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: "Invalid or expired token" }, 401);
    }

    const body: CreateOrderBody = await req.json();

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return jsonResponse({ error: "Cart is empty" }, 400);
    }

    const shipping = body.shipping_address;

    if (
      !shipping?.name?.trim() ||
      !shipping?.phone?.trim() ||
      !shipping?.address_line1?.trim() ||
      !shipping?.city?.trim() ||
      !shipping?.state?.trim() ||
      !shipping?.pincode?.trim()
    ) {
      return jsonResponse({ error: "Shipping address is incomplete" }, 400);
    }

    const productIds = body.items.map((item) => item.product_id);

    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, name, price, stock_quantity, is_active")
      .in("id", productIds);

    if (productsError || !products || products.length === 0) {
      return jsonResponse({ error: "Invalid products" }, 400);
    }

    const productMap = new Map<string, Product>(
      (products as Product[]).map((product) => [product.id, product])
    );

    let totalAmountRupees = 0;

    const orderItems = [];

    for (const item of body.items) {
      const product = productMap.get(item.product_id);

      if (!product || !product.is_active) {
        return jsonResponse(
          { error: `Product ${item.product_id} is unavailable` },
          400
        );
      }

      const quantity = Math.max(1, Math.floor(Number(item.quantity)) || 1);

      if (product.stock_quantity < quantity) {
        return jsonResponse(
          { error: `Insufficient stock for ${product.name}` },
          400
        );
      }

      totalAmountRupees += product.price * quantity;

      orderItems.push({
        product_id: product.id,
        quantity,
        price_at_purchase: product.price,
      });
    }

    const totalAmountPaise = Math.round(totalAmountRupees * 100);

    if (!Number.isFinite(totalAmountPaise) || totalAmountPaise < 100) {
      return jsonResponse({ error: "Minimum payable amount is ₹1" }, 400);
    }

    const shippingAddress = [
      shipping.address_line1,
      shipping.address_line2,
      shipping.city,
      shipping.state,
      shipping.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        total_amount: totalAmountRupees,
        shipping_name: shipping.name.trim(),
        shipping_phone: shipping.phone.trim(),
        shipping_address: shippingAddress,
        shipping_city: shipping.city.trim(),
        shipping_state: shipping.state.trim(),
        shipping_pincode: shipping.pincode.trim(),
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("[create-order] Local order creation failed:", orderError);
      return jsonResponse({ error: "Could not create order" }, 500);
    }

    const { error: orderItemsError } = await supabaseAdmin
      .from("order_items")
      .insert(
        orderItems.map((item) => ({
          ...item,
          order_id: order.id,
        }))
      );

    if (orderItemsError) {
      console.error("[create-order] Order items creation failed:", orderItemsError);
      return jsonResponse({ error: "Could not create order items" }, 500);
    }

    let razorpayOrder;

    try {
      razorpayOrder = await createRazorpayOrder({
        amount: totalAmountPaise,
        currency: "INR",
        receipt: order.id,
        userId: user.id,
      });
    } catch (error) {
      await supabaseAdmin
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);

      if (error instanceof Error && error.message === "RAZORPAY_KEYS_MISSING") {
        return jsonResponse({ error: "Razorpay keys are not configured" }, 500);
      }

      if (error instanceof Error && error.message === "RAZORPAY_AUTH_FAILED") {
        return jsonResponse({ error: "Razorpay authentication failed" }, 401);
      }

      return jsonResponse({ error: "Could not create Razorpay order" }, 500);
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        razorpay_order_id: razorpayOrder.id,
      })
      .eq("id", order.id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[create-order] Could not save Razorpay order id:", updateError);
      return jsonResponse({ error: "Could not save Razorpay order id" }, 500);
    }

    return jsonResponse({
      order_id: order.id,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("[create-order] Final error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});