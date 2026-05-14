/// <reference lib="deno.window" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validate environment variables at startup
if (!supabaseUrl) {
  throw new Error("SUPABASE_URL environment variable is not set");
}
if (!serviceRole) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is not set");
}
if (!anonKey) {
  throw new Error("SUPABASE_ANON_KEY environment variable is not set");
}

console.log("[supabase.ts] All environment variables loaded successfully");

export const supabaseAdmin = createClient(supabaseUrl, serviceRole, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export function createUserClient(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";

  console.log("[createUserClient]", {
    headerExists: !!authHeader,
    headerLength: authHeader.length,
  });

  if (!authHeader) {
    throw new Error("No Authorization header");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header must start with Bearer");
  }

  const token = authHeader.replace("Bearer ", "").trim();

  return createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
    },
  });
}