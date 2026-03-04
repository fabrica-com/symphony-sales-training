import { createBrowserClient } from "@supabase/ssr"

/**
 * Creates a Supabase browser client
 * 
 * IMPORTANT: Do NOT cache this client in globalThis or any shared state.
 * Caching can cause PKCE code verifier mismatches when:
 * - Page is reloaded
 * - User returns from OAuth callback
 * - Cookie state changes between renders
 * 
 * createBrowserClient handles internal optimizations, so creating a new
 * client per call is safe and recommended for Next.js App Router.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables are not configured. " +
      "Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  // Create a new client each time to ensure proper cookie/session state
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
