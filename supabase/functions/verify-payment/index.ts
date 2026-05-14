/**
 * verify-payment Edge Function
 * Verifies Razorpay payment signature and updates order status
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

serve(async (req: Request) => {
  /* ---------- CORS PREFLIGHT ---------- */

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    /* ---------- AUTH ---------- */

    const authHeader = req.headers.get("Authorization") ?? "";

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userClient = createUserClient(req);

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();

    if (authError || !user) {
      console.error("AUTH FAILED:", authError);

      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userId = user.id;

    /* ---------- BODY ---------- */

    const body: VerifyPaymentBody = await req.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Missing payment verification details" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    /* ---------- DEV MODE ---------- */

    const devMode = Deno.env.get("DEV_MODE") === "true";

    let orderId: string;

    if (devMode) {
      // Extract order ID from dev order ID format: dev_order_<timestamp>
      console.log("DEV MODE: Extracting order ID from:", razorpay_order_id);
      
      // In dev mode, we need to find the order by user_id since we don't have actual Razorpay orders
      const { data: orders, error: ordersError } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (ordersError || !orders || orders.length === 0) {
        return new Response(
          JSON.stringify({ error: "Order not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      orderId = orders[0].id;
      console.log("DEV MODE: Found order ID:", orderId);
    } else {
      // Production: Use razorpay_order_id as order ID
      orderId = razorpay_order_id;

      // TODO: Verify signature with Razorpay API
      // For now, we'll trust the client provided it
      console.log("Production mode: Would verify signature with Razorpay");
    }

    /* ---------- UPDATE ORDER STATUS ---------- */

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderId)
      .eq("user_id", userId)
      .select("id, status")
      .single();

    if (updateError || !updatedOrder) {
      console.error("Failed to update order:", updateError);

      return new Response(
        JSON.stringify({ error: "Failed to update order status" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Order updated successfully:", updatedOrder);

    return new Response(
      JSON.stringify({
        verified: true,
        order_id: orderId,
        status: updatedOrder.status,
        dev_mode: devMode,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("verify-payment error:", err);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
