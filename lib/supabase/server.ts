import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Creates a Supabase server client for each request
 * 
 * IMPORTANT: Do NOT cache this client in globalThis or any shared state.
 * Each request has its own cookie context, and caching can cause PKCE code verifier
 * mismatches between different requests/users.
 * 
 * Next.js will handle optimization internally, so creating a new client per request
 * is the correct approach.
 */
export async function createClient() {
  const cookieStore = await cookies()

  // Create a new client for each request to ensure proper cookie isolation
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
