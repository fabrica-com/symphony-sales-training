import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

// Use global to persist the singleton
const globalForSupabaseAdmin = globalThis as typeof globalThis & {
  supabaseAdminClient: SupabaseClient | undefined
}

/**
 * Creates a singleton Supabase admin client using SERVICE_ROLE_KEY
 * This client bypasses RLS and should only be used on the server side
 * for privileged operations like data migration or system tasks
 */
export async function createAdminClient() {
  // Return cached instance if available
  if (globalForSupabaseAdmin.supabaseAdminClient) {
    return globalForSupabaseAdmin.supabaseAdminClient
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")
  }

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  )

  // Cache the instance
  globalForSupabaseAdmin.supabaseAdminClient = client

  return client
}
