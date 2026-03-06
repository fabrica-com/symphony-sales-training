import { createClient } from "@supabase/supabase-js"

/**
 * Creates a Supabase admin client using SERVICE_ROLE_KEY.
 * This client bypasses RLS and should only be used on the server side.
 *
 * ⚠️ WARNING: This bypasses RLS. Use sparingly for:
 * - Admin operations
 * - Batch processing
 * - System-level operations
 *
 * For user-specific operations, prefer using createClient() from lib/supabase/server.ts
 * which respects user sessions and RLS policies.
 *
 * NOTE: Do NOT cache in globalThis. With Next.js 16 Fluid compute,
 * global state may be shared across requests unexpectedly.
 * Creating a new client per call is safe — the underlying HTTP client
 * is lightweight and Supabase SDK handles connection reuse internally.
 */
export async function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  )
}
