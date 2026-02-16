/**
 * DB の training_categories / trainings のデータ有無を確認するスクリプト
 * 実行: bun run scripts/check-db.ts
 */
import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error("環境変数が未設定です。.env.local を読み込んで実行してください。")
  console.error("例: bun run scripts/check-db.ts (プロジェクトルートで)")
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

async function check() {
  console.log("=== DB データ確認 ===\n")
  console.log("接続先:", url)
  console.log("")

  const { data: categories, error: catError } = await supabase
    .from("training_categories")
    .select("*")
    .order("display_order")

  if (catError) {
    console.error("training_categories 取得エラー:", catError.message)
    return
  }

  console.log("【training_categories】件数:", categories?.length ?? 0)
  if (categories && categories.length > 0) {
    categories.forEach((c) => console.log(`  - ${c.id}: ${c.name}`))
  }
  console.log("")

  const { data: trainings, error: trainError } = await supabase
    .from("trainings")
    .select("id, title, category_id")
    .order("id")
    .limit(20)

  if (trainError) {
    console.error("trainings 取得エラー:", trainError.message)
    return
  }

  const { count } = await supabase
    .from("trainings")
    .select("*", { count: "exact", head: true })

  console.log("【trainings】総件数:", count ?? 0)
  if (trainings && trainings.length > 0) {
    trainings.forEach((t) => console.log(`  - ${t.id}: ${t.title} (category: ${t.category_id})`))
    if ((count ?? 0) > 20) console.log(`  ... 他 ${(count ?? 0) - 20} 件`)
  }
}

check()
