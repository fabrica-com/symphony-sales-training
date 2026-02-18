/**
 * 修了テストの設定・問題を DB に投入するスクリプト
 * テーブルは事前にマイグレーションで作成済みであること
 */
import { createClient } from "@supabase/supabase-js"
import { finalExamData } from "../lib/final-exam-data"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321"
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!key) { console.error("SUPABASE_SERVICE_ROLE_KEY is required"); process.exit(1) }

const supabase = createClient(url, key)

async function main() {
  console.log("=== 修了テスト投入 ===\n")

  // Config upsert
  const { error: configError } = await supabase.from("final_exam_config").upsert({
    id: 1,
    total_questions: finalExamData.totalQuestions,
    passing_score: finalExamData.passingScore,
    time_limit: finalExamData.timeLimit,
  })
  if (configError) {
    console.error("Config 投入エラー:", configError.message)
    return
  }
  console.log("  ✓ final_exam_config")

  // Delete existing questions
  const { data: existingQ } = await supabase.from("final_exam_questions").select("id")
  if (existingQ && existingQ.length > 0) {
    await supabase.from("final_exam_questions").delete().in("id", existingQ.map((r) => r.id))
  }

  // Insert questions in batches
  const questions = finalExamData.questions.map((q) => ({
    question_number: q.id,
    question: q.question,
    options: q.options,
    correct_answer: q.correctAnswer,
    explanation: q.explanation,
    source: q.source,
    difficulty: q.difficulty,
  }))

  const batchSize = 50
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize)
    const { error } = await supabase.from("final_exam_questions").insert(batch)
    if (error) {
      console.error(`  Questions batch ${i}-${i + batch.length} エラー:`, error.message)
      return
    }
  }

  const { count } = await supabase.from("final_exam_questions").select("*", { count: "exact", head: true })
  console.log(`  ✓ final_exam_questions: ${count}問`)
}

main()
