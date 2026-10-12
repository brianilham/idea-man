import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Creates a Supabase browser client for Client Components.
 * Gracefully defaults to placeholder values if environment variables are not set yet,
 * preventing client-side startup crashes during initial setup.
 */
export function createClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  ) {
    if (typeof window !== "undefined" && !window.__SUPABASE_WARNED__) {
      console.warn(
        "[Idea-man] Supabase credentials not found or placeholder in client. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable real database features."
      );
      window.__SUPABASE_WARNED__ = true;
    }
  }

  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}

declare global {
  interface Window {
    __SUPABASE_WARNED__?: boolean;
  }
}
