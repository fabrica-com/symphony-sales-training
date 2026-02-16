/**
 * カテゴリテストデータを DB に投入するスクリプト
 * 対象: C(補完), D, E, F, G, H, I, J, K, L, M
 */
import { createClient } from "@supabase/supabase-js"
import {
  categoryATest, categoryCTest, categoryDTest, categoryETest, categoryFTest,
  categoryGTest, categoryHTest, categoryITest, categoryJTest,
  categoryKTest, categoryLTest, categoryMTest,
  type CategoryTest,
} from "../lib/test-data"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321"
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!key) { console.error("SUPABASE_SERVICE_ROLE_KEY is required"); process.exit(1) }

const supabase = createClient(url, key)

const tests: CategoryTest[] = [
  categoryATest, categoryCTest, categoryDTest, categoryETest, categoryFTest,
  categoryGTest, categoryHTest, categoryITest, categoryJTest,
  categoryKTest, categoryLTest, categoryMTest,
]

async function seedTest(test: CategoryTest) {
  // Upsert category_tests
  const { data: existing } = await supabase
    .from("category_tests")
    .select("id")
    .eq("category_id", test.categoryId)
    .single()

  let testId: number

  if (existing) {
    // Update
    await supabase.from("category_tests").update({
      category_name: test.categoryName,
      total_questions: test.totalQuestions,
      passing_score: test.passingScore,
      time_limit: test.timeLimit,
    }).eq("id", existing.id)
    testId = existing.id

    // Delete old questions
    await supabase.from("category_test_questions").delete().eq("category_test_id", testId)
  } else {
    // Insert
    const { data: inserted, error } = await supabase.from("category_tests").insert({
      category_id: test.categoryId,
      category_name: test.categoryName,
      total_questions: test.totalQuestions,
      passing_score: test.passingScore,
      time_limit: test.timeLimit,
    }).select("id").single()

    if (error || !inserted) {
      console.error(`  Failed to insert category_test for ${test.categoryId}:`, error?.message)
      return false
    }
    testId = inserted.id
  }

  // Insert questions in batches
  const questions = test.questions.map((q) => ({
    category_test_id: testId,
    question_number: q.id,
    question: q.question,
    options: q.options,
    correct_answer: q.correctAnswer,
    explanation: q.explanation,
    source: q.source,
  }))

  const batchSize = 50
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize)
    const { error } = await supabase.from("category_test_questions").insert(batch)
    if (error) {
      console.error(`  Failed to insert questions for ${test.categoryId}:`, error.message)
      return false
    }
  }
  return true
}

async function main() {
  console.log("=== カテゴリテスト投入 ===\n")

  for (const test of tests) {
    const ok = await seedTest(test)
    console.log(`  ${ok ? "✓" : "✗"} ${test.categoryId}: ${test.categoryName} (${test.totalQuestions}問)`)
  }

  // Verify
  const { count } = await supabase.from("category_tests").select("*", { count: "exact", head: true })
  const { count: qCount } = await supabase.from("category_test_questions").select("*", { count: "exact", head: true })
  console.log(`\n結果: category_tests=${count}, category_test_questions=${qCount}`)
}

main()
