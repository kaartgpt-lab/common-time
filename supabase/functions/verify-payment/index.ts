/**
 * verify-payment Edge Function
 * Verifies Razorpay payment signature and marks the matching local order as paid.
 */

/// <reference lib="deno.window" />

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin, createUserClient } from "../_shared/supabase.ts";

interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface OrderRow {
  id: string;
  user_id: string;
  status: string;
  razorpay_order_id: string;
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

function getRazorpaySecret() {
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

  if (!keySecret) {
    throw new Error("RAZORPAY_SECRET_MISSING");
  }

  return keySecret;
}

async function hmacSha256Hex(message: string, secret: string) {
  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(message)
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;

  for (let i = 0; i < left.length; i += 1) {
    result |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }

  return result === 0;
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

    const body: VerifyPaymentBody = await req.json();

    const razorpayOrderId = body.razorpay_order_id?.trim();
    const razorpayPaymentId = body.razorpay_payment_id?.trim();
    const razorpaySignature = body.razorpay_signature?.trim();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return jsonResponse({ error: "Missing payment verification details" }, 400);
    }

    if (!razorpayOrderId.startsWith("order_")) {
      return jsonResponse({ error: "Invalid Razorpay order id" }, 400);
    }

    if (!razorpayPaymentId.startsWith("pay_")) {
      return jsonResponse({ error: "Invalid Razorpay payment id" }, 400);
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, razorpay_order_id")
      .eq("razorpay_order_id", razorpayOrderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return jsonResponse({ error: "Order not found" }, 404);
    }

    const localOrder = order as OrderRow;

    if (localOrder.status === "paid") {
      return jsonResponse({
        verified: true,
        order_id: localOrder.id,
        status: localOrder.status,
      });
    }

    const keySecret = getRazorpaySecret();

    const generatedSignature = await hmacSha256Hex(
      `${razorpayOrderId}|${razorpayPaymentId}`,
      keySecret
    );

    if (!timingSafeEqual(generatedSignature, razorpaySignature)) {
      console.warn("[verify-payment] Signature mismatch:", {
        orderId: localOrder.id,
        razorpayOrderId,
      });

      return jsonResponse({ error: "Payment signature mismatch" }, 400);
    }

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        razorpay_payment_id: razorpayPaymentId,
      })
      .eq("id", localOrder.id)
      .eq("user_id", user.id)
      .select("id, status")
      .single();

    if (updateError || !updatedOrder) {
      console.error("[verify-payment] Order update failed:", updateError);
      return jsonResponse({ error: "Could not update order status" }, 500);
    }

    return jsonResponse({
      verified: true,
      order_id: updatedOrder.id,
      status: updatedOrder.status,
    });
  } catch (error) {
    console.error("[verify-payment] Final error:", error);

    if (error instanceof Error && error.message === "RAZORPAY_SECRET_MISSING") {
      return jsonResponse({ error: "Razorpay secret is not configured" }, 500);
    }

    return jsonResponse({ error: "Internal server error" }, 500);
  }
});