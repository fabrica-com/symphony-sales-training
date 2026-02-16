/**
 * リモート Supabase の全データをローカルに同期するスクリプト
 *
 * 実行: REMOTE_URL=... REMOTE_KEY=... LOCAL_URL=... LOCAL_KEY=... bun run scripts/sync-remote-to-local.ts
 *
 * または .env.remote と .env.local を用意して:
 *   export $(grep -v '^#' .env.local | xargs)
 *   REMOTE_URL=https://... REMOTE_KEY=... bun run scripts/sync-remote-to-local.ts
 */

import { createClient } from "@supabase/supabase-js"

const REMOTE_URL = process.env.REMOTE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const REMOTE_KEY = process.env.REMOTE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
const LOCAL_URL = process.env.LOCAL_URL ?? "http://127.0.0.1:54321"
const LOCAL_KEY = process.env.LOCAL_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

if (!REMOTE_URL || !REMOTE_KEY) {
  console.error("リモート接続情報が不足しています。")
  console.error("REMOTE_URL と REMOTE_KEY (または NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY) を設定してください。")
  process.exit(1)
}

if (!LOCAL_KEY) {
  console.error("ローカル接続情報が不足しています。LOCAL_KEY (SUPABASE_SERVICE_ROLE_KEY) を設定してください。")
  process.exit(1)
}

const remote = createClient(REMOTE_URL, REMOTE_KEY)
const local = createClient(LOCAL_URL, LOCAL_KEY)

// 削除順（子→親、FK の逆順）
const DELETE_ORDER = [
  "category_test_questions",
  "category_test_results",
  "category_tests",
  "quiz_responses",
  "user_reflections",
  "training_sessions",
  "user_training_progress",
  "deep_dive_progress",
  "final_exam_results",
  "deep_dive_contents",
  "session_contents",
  "trainings",
  "training_categories",
  "profiles",
] as const

// 投入順（親→子、FK 順）
const INSERT_ORDER = [...DELETE_ORDER].reverse()

async function fetchAll<T>(table: string): Promise<T[]> {
  const pageSize = 1000
  let offset = 0
  const all: T[] = []
  while (true) {
    const { data, error } = await remote
      .from(table)
      .select("*")
      .range(offset, offset + pageSize - 1)
    if (error) throw new Error(`${table} fetch: ${error.message}`)
    if (!data?.length) break
    all.push(...(data as T[]))
    if (data.length < pageSize) break
    offset += pageSize
  }
  return all
}

async function clearTable(table: string): Promise<void> {
  const { count } = await local.from(table).select("*", { count: "exact", head: true })
  if ((count ?? 0) === 0) return

  const { data: rows } = await local.from(table).select("id")
  if (!rows?.length) return

  const ids = rows.map((r) => r.id).filter((id) => id != null)
  if (ids.length === 0) return

  // バッチ削除（100件ずつ）
  const batchSize = 100
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)
    const { error } = await local.from(table).delete().in("id", batch)
    if (error) throw new Error(error.message)
  }
}

async function main() {
  console.log("=== リモート → ローカル DB 同期 ===\n")
  console.log("リモート:", REMOTE_URL)
  console.log("ローカル:", LOCAL_URL)
  console.log("")

  // 1. ローカルをクリア（削除順）
  console.log("【1/2】ローカルテーブルをクリア中...")
  for (const table of DELETE_ORDER) {
    try {
      const { count: before } = await local.from(table).select("*", { count: "exact", head: true })
      await clearTable(table)
      if ((before ?? 0) > 0) console.log(`  ✓ ${table}`)
    } catch (e) {
      console.warn(`  ${table} スキップ: ${e}`)
    }
  }
  console.log("")

  // 2. リモートから取得してローカルに投入
  console.log("【2/2】リモートから取得してローカルに投入中...")
  for (const table of INSERT_ORDER) {
    try {
      const rows = await fetchAll(table)
      if (rows.length === 0) continue

      // バッチ投入（Supabase の制限に合わせて 100 件ずつ）
      const batchSize = 100
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize)
        const { error } = await local.from(table).insert(batch)
        if (error) throw error
      }
      console.log(`  ✓ ${table}: ${rows.length} 件`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error(`  ✗ ${table}: ${msg}`)
    }
  }

  console.log("\n同期完了。")
}

main()
