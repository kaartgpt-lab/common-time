/**
 * API service for Edge Functions and Supabase
 */
import axios from "axios";
import { supabase } from "./supabase";

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;

function getFunctionsUrl() {
  const url = getSupabaseUrl();
  if (!url) return "";
  return url.replace(".supabase.co", ".supabase.co/functions/v1");
}

// Helper to get auth headers
async function getAuthHeaders() {
  try {
    console.log(">>> Getting session from Supabase...");
    const sessionResult = await supabase.auth.getSession();
    
    console.log(">>> Session result:", {
      hasData: !!sessionResult.data,
      hasError: !!sessionResult.error,
      errorMsg: sessionResult.error?.message,
      dataKeys: sessionResult.data ? Object.keys(sessionResult.data) : []
    });

    const { data, error } = sessionResult;

    if (error) {
      console.error(">>> Session error:", error);
      throw new Error("Failed to get session: " + error.message);
    }

    if (!data) {
      console.error(">>> No data returned from getSession");
      throw new Error("No session data from Supabase");
    }

    const session = data.session;
    
    console.log(">>> Session object:", {
      sessionExists: !!session,
      sessionKeys: session ? Object.keys(session) : [],
      hasAccessToken: !!session?.access_token,
      tokenLength: session?.access_token ? session.access_token.length : 0,
      tokenPreview: session?.access_token ? session.access_token.substring(0, 20) + "..." : "NONE",
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : "UNKNOWN",
      isExpired: session?.expires_at ? Date.now() > session.expires_at * 1000 : "UNKNOWN"
    });

    if (!session) {
      throw new Error("No active session - user must be logged in");
    }

    if (!session.access_token) {
      throw new Error("Session exists but missing access_token");
    }

    // Check token expiration
    const expiresAt = session.expires_at * 1000;
    if (Date.now() > expiresAt) {
      console.warn(">>> Token is expired! Attempting refresh...");
      
      const refreshResult = await supabase.auth.refreshSession();
      if (refreshResult.error || !refreshResult.data.session) {
        throw new Error("Token expired and refresh failed - please re-login");
      }
      
      const refreshedSession = refreshResult.data.session;
      console.log(">>> Token refreshed successfully");
      
      return {
        Authorization: `Bearer ${refreshedSession.access_token.trim()}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim(),
        "Content-Type": "application/json",
      };
    }

    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error("VITE_SUPABASE_ANON_KEY is not configured");
    }

    const headers = {
      Authorization: `Bearer ${session.access_token.trim()}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY.trim(),
      "Content-Type": "application/json",
    };

    console.log(">>> Headers ready with Authorization token");

    return headers;
  } catch (error) {
    console.error(">>> getAuthHeaders failed:", error.message);
    throw error;
  }
}

export async function createOrder(items, shippingAddress) {
  try {
    console.log("1. Getting auth headers...");
    const headers = await getAuthHeaders();

    const url = `${getFunctionsUrl()}/create-order`;

    if (!url) {
      throw new Error("Functions URL not configured");
    }

    console.log("2. Preparing request...", {
      url,
      itemsCount: items.length,
      hasShipping: !!shippingAddress
    });

    console.log("3. Request headers:", {
      Authorization: headers.Authorization ? "Bearer ..." : "MISSING",
      apikey: headers.apikey ? "present" : "MISSING",
      "Content-Type": headers["Content-Type"]
    });

    console.log("4. Sending POST request to:", url);
    
    const res = await axios.post(
      url,
      { items, shipping_address: shippingAddress },
      { headers }
    );

    console.log("5. Response received:", {
      status: res.status,
      hasOrderId: !!res.data?.order_id,
      hasRazorpayOrderId: !!res.data?.razorpay_order_id,
      hasAmount: !!res.data?.amount,
      devMode: res.data?.dev_mode
    });

    return res.data;
  } catch (error) {
    console.error("Create order error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      request: error.config ? {
        url: error.config.url,
        method: error.config.method,
        headers: {
          hasAuth: !!error.config.headers?.Authorization,
          hasApiKey: !!error.config.headers?.apikey
        }
      } : null
    });
    throw error;
  }
}

export async function verifyPayment(
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) {
  try {
    console.log("Getting auth headers for payment verification...");
    const headers = await getAuthHeaders();

    const url = `${getFunctionsUrl()}/verify-payment`;

    console.log("Verifying payment at:", url, {
      razorpayOrderId,
      hasPaymentId: !!razorpayPaymentId,
      hasSignature: !!razorpaySignature
    });

    const res = await axios.post(
      url,
      {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      },
      { headers }
    );

    console.log("Payment verification response:", {
      status: res.status,
      verified: res.data?.verified
    });

    return res.data;
  } catch (error) {
    console.error("Verify payment error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
}
