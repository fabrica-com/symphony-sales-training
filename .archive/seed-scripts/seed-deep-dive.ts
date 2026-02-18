/**
 * 不足している Deep Dive コンテンツを DB に投入するスクリプト
 * DB にないもの (ID: 101-130) をハードコードから取得して投入
 */
import { createClient } from "@supabase/supabase-js"
import { getDeepDiveContent } from "../lib/deep-dive-content"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321"
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!key) { console.error("SUPABASE_SERVICE_ROLE_KEY is required"); process.exit(1) }

const supabase = createClient(url, key)

async function main() {
  console.log("=== Deep Dive コンテンツ投入 ===\n")

  // 既存のtraining_idを取得
  const { data: existing } = await supabase
    .from("deep_dive_contents")
    .select("training_id")
  const existingIds = new Set(existing?.map((r) => r.training_id) ?? [])

  // ハードコードにあるがDBにないものを投入 (1-130をチェック)
  let inserted = 0
  for (let id = 1; id <= 130; id++) {
    if (existingIds.has(id)) continue

    const content = getDeepDiveContent(id)
    if (!content) continue

    const { error } = await supabase.from("deep_dive_contents").insert({
      training_id: id,
      title: content.title,
      subtitle: content.subtitle,
      introduction: content.introduction,
      sections: content.sections,
      conclusion: content.conclusion,
      reference_list: content.references ?? null,
    })

    if (error) {
      console.error(`  ✗ training_id=${id}: ${error.message}`)
    } else {
      console.log(`  ✓ training_id=${id}: ${content.title}`)
      inserted++
    }
  }

  const { count } = await supabase.from("deep_dive_contents").select("*", { count: "exact", head: true })
  console.log(`\n投入: ${inserted}件, 合計: ${count}件`)
}

main()
