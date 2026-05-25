import { createClient } from "@supabase/supabase-js";
import { getOptionalEnv, getRequiredEnv } from "../config/env";

export function getSupabaseElevatedKey() {
  return (
    getOptionalEnv("SUPABASE_SECRET_KEY") ??
    getOptionalEnv("SUPABASE_SERVICE_ROLE_KEY")
  );
}

export function createAdminSupabaseClient() {
  const elevatedKey = getSupabaseElevatedKey();

  if (!elevatedKey) {
    throw new Error(
      "Missing required environment variable: SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"), elevatedKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
