/**
 * API service for Supabase Edge Functions
 */
import axios from "axios";
import { supabase } from "./supabase";

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;

function getFunctionsUrl() {
  const url = getSupabaseUrl();
  if (!url) return "";
  return url.replace(".supabase.co", ".supabase.co/functions/v1");
}

async function getAuthHeaders() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error("Failed to get session: " + error.message);
  }

  let session = data?.session;

  if (!session?.access_token) {
    throw new Error("Please login before checkout");
  }

  if (session.expires_at && Date.now() > session.expires_at * 1000) {
    const refreshResult = await supabase.auth.refreshSession();

    if (refreshResult.error || !refreshResult.data.session?.access_token) {
      throw new Error("Your session expired. Please login again.");
    }

    session = refreshResult.data.session;
  }

  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!anonKey) {
    throw new Error("VITE_SUPABASE_ANON_KEY is not configured");
  }

  return {
    Authorization: `Bearer ${session.access_token.trim()}`,
    apikey: anonKey.trim(),
    "Content-Type": "application/json",
  };
}

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}

export async function createOrder(items, shippingAddress) {
  try {
    const headers = await getAuthHeaders();
    const url = `${getFunctionsUrl()}/create-order`;

    if (!url) {
      throw new Error("Functions URL not configured");
    }

    const res = await axios.post(
      url,
      {
        items,
        shipping_address: shippingAddress,
      },
      { headers }
    );

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not create payment order"));
  }
}

export async function verifyPayment(
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) {
  try {
    const headers = await getAuthHeaders();
    const url = `${getFunctionsUrl()}/verify-payment`;

    if (!url) {
      throw new Error("Functions URL not configured");
    }

    const res = await axios.post(
      url,
      {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      },
      { headers }
    );

    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not verify payment"));
  }
}