import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * Checks if Supabase credentials are valid and live (not placeholder or empty)
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url.includes("placeholder") || key.includes("placeholder")) return false;
  if (!url.startsWith("http")) return false;

  return true;
}

/**
 * Creates an admin / service-role Supabase client.
 * Bypasses Row Level Security (RLS) for backend automated ingestion tasks,
 * Reddit mining cron/scripts (Ticket 04), and database seeds.
 *
 * NOTE: Never expose this client to the browser or client components!
 */
export function createAdminClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-service-role-key";

  if (!isSupabaseConfigured()) {
    console.warn(
      "[Idea-man] SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is not configured. Admin operations will run in safe fallback mode."
    );
  }

  return createSupabaseClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
