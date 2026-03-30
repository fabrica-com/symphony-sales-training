import { createClient } from "@supabase/supabase-js"

let cached: ReturnType<typeof createClient> | null = null

/**
 * Cookie 不要の Supabase クライアント。
 * RLS が `USING (true)` な公開テーブル（trainings, training_categories,
 * session_contents, deep_dive_contents 等）の読み取り専用に使う。
 * cookies() を呼ばないため、Next.js の静的生成 / ISR と共存できる。
 */
export function createStaticClient() {
  if (cached) return cached
  cached = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  return cached
}
