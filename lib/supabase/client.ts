import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

// Use global to persist singleton across component re-renders
const globalForSupabase = globalThis as typeof globalThis & {
  supabaseClient: SupabaseClient | undefined
}

/**
 * Creates a singleton Supabase browser client
 * The same instance is reused across all client-side code to maintain
 * a consistent authentication session
 */
export function createClient() {
  // Return existing instance if available
  if (globalForSupabase.supabaseClient) {
    return globalForSupabase.supabaseClient
  }

  // Get environment variables with fallbacks and validation
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate that required environment variables are set
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables:", {
      url: supabaseUrl ? "set" : "MISSING",
      key: supabaseAnonKey ? "set" : "MISSING",
    })
    throw new Error(
      "Supabase environment variables are not configured. " +
      "Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  // Create new instance only once
  const client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  // Store in global for reuse
  globalForSupabase.supabaseClient = client

  console.log("[v0] Supabase client created (singleton)")

  return client
}
