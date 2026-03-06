/**
 * ローカルSupabaseのデータを本番にSync
 * Service Role Key使用（RLSバイパス）
 *
 * Usage: bun run scripts/sync-to-prod.ts
 */
import { createClient as createLocalClient } from "@supabase/supabase-js"
import { createClient as createRemoteClient } from "@supabase/supabase-js"

const LOCAL_URL = "http://127.0.0.1:54321"
const LOCAL_KEY = "sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz"

const REMOTE_URL = "https://ihkatkbbfjufsvxtikch.supabase.co"
const REMOTE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloa2F0a2JiZmp1ZnN2eHRpa2NoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc5NzA1NiwiZXhwIjoyMDg0MzczMDU2fQ.VIR2KiPz2UMFf5vdtw4mx7Mp6WjcOl7NMxIUsIUpUO4"

const local = createLocalClient(LOCAL_URL, LOCAL_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const remote = createRemoteClient(REMOTE_URL, REMOTE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// テーブル順序（FK依存順）
const TABLES = [
  "training_categories",
  "trainings",
  "session_contents",
  "deep_dive_contents",
  "category_deep_dive_contents",
  "category_tests",
  "category_test_questions",
  "final_exam_config",
  "final_exam_questions",
  // ユーザー依存テーブルはprofilesがauth.usersに依存するのでスキップ
  // "profiles",
  // "training_sessions",
  // "quiz_responses",
  // "user_reflections",
  // "user_training_progress",
  // "deep_dive_progress",
  // "category_test_results",
  // "final_exam_results",
]

async function syncTable(table: string) {
  // ローカルから全データ取得
  const { data: localData, error: localErr } = await local
    .from(table)
    .select("*")
    .order("id" as any)
    .limit(10000)

  if (localErr) {
    console.error(`  ❌ ローカル読み取りエラー (${table}):`, localErr.message)
    return
  }

  if (!localData || localData.length === 0) {
    console.log(`  ⏭️  ${table}: データなし`)
    return
  }

  console.log(`  📦 ${table}: ${localData.length}件`)

  // 本番の既存データを削除
  const { error: delErr } = await remote.from(table).delete().neq("id" as any, "___impossible___")
  if (delErr) {
    // deleteが失敗する場合はtruncateできないので、upsertで対応
    console.log(`  ⚠️  削除スキップ (${table}): ${delErr.message}`)
  }

  // バッチでupsert（100件ずつ）
  const batchSize = 100
  let inserted = 0
  for (let i = 0; i < localData.length; i += batchSize) {
    const batch = localData.slice(i, i + batchSize)
    const { error: upsertErr } = await remote.from(table).upsert(batch, {
      onConflict: "id",
      ignoreDuplicates: false,
    })
    if (upsertErr) {
      console.error(`  ❌ upsertエラー (${table}, batch ${i}):`, upsertErr.message)
    } else {
      inserted += batch.length
    }
  }
  console.log(`  ✅ ${table}: ${inserted}件 同期完了`)
}

async function main() {
  console.log("🚀 ローカル → 本番 データ同期開始\n")

  for (const table of TABLES) {
    await syncTable(table)
  }

  console.log("\n✨ 同期完了")
}

main().catch(console.error)
