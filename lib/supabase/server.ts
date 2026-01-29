import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"

// Use global to persist the singleton across requests
const globalForSupabaseServer = globalThis as typeof globalThis & {
  supabaseServerClient: SupabaseClient | undefined
}

/**
 * Creates a singleton Supabase server client
 * Caching is safe here as each request has its own context
 */
export async function createClient() {
  // Return cached instance if available in this request context
  if (globalForSupabaseServer.supabaseServerClient) {
    return globalForSupabaseServer.supabaseServerClient
  }

  const cookieStore = await cookies()

  const client = createServerClient(
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
            // This can fail - ignore silently
          }
        },
      },
    }
  )

  // Cache the instance
  globalForSupabaseServer.supabaseServerClient = client

  return client
}
