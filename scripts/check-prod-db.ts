import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ihkatkbbfjufsvxtikch.supabase.co"
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function checkProdDB() {
  console.log("🔍 本番DBの状態を確認中...\n")

  // training_sessions テーブルを確認
  const { data: sessions, error: sessionsError } = await supabase
    .from("training_sessions")
    .select("*")
    .order("completed_at", { ascending: false })
    .limit(5)

  if (sessionsError) {
    console.error("❌ training_sessions エラー:", sessionsError)
  } else {
    console.log(`✅ training_sessions: ${sessions.length}件のレコード`)
    if (sessions.length > 0) {
      console.log("最新のセッション:")
      sessions.forEach((s) => {
        console.log(`  - ${s.training_title} (${s.completed_at})`)
      })
    } else {
      console.log("  ⚠️  レコードが0件です")
    }
  }

  console.log()

  // profiles テーブルを確認
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, name, email")
    .limit(5)

  if (profilesError) {
    console.error("❌ profiles エラー:", profilesError)
  } else {
    console.log(`✅ profiles: ${profiles.length}件のユーザー`)
    profiles.forEach((p) => {
      console.log(`  - ${p.name || p.email} (${p.id})`)
    })
  }

  console.log()

  // user_training_progress テーブルを確認
  const { data: progress, error: progressError } = await supabase
    .from("user_training_progress")
    .select("*")
    .order("completed_at", { ascending: false })
    .limit(5)

  if (progressError) {
    console.error("❌ user_training_progress エラー:", progressError)
  } else {
    console.log(`✅ user_training_progress: ${progress.length}件のレコード`)
    if (progress.length > 0) {
      console.log("最新の進捗:")
      progress.forEach((p) => {
        console.log(`  - Training ID: ${p.training_id}, Status: ${p.status} (${p.completed_at})`)
      })
    } else {
      console.log("  ⚠️  レコードが0件です")
    }
  }
}

checkProdDB().catch(console.error)
