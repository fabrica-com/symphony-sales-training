"use server"

import { createClient } from "@/lib/supabase/server"
import { categoryATest, getCategoryTest } from "@/lib/test-data"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()

  // カテゴリAのテストデータを取得（現在はAのみ）
  const categoryTests = [categoryATest]

  const results: { category: string; success: boolean; error?: string }[] = []

  for (const test of categoryTests) {
    try {
      // 1. カテゴリテスト設定を挿入
      const { data: categoryTest, error: testError } = await supabase
        .from("category_tests")
        .upsert(
          {
            category_id: test.categoryId,
            category_name: test.categoryName,
            total_questions: test.totalQuestions,
            passing_score: test.passingScore,
            time_limit: test.timeLimit,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "category_id" }
        )
        .select()
        .single()

      if (testError) {
        results.push({
          category: test.categoryId,
          success: false,
          error: `Failed to insert category test: ${testError.message}`,
        })
        continue
      }

      // 2. 既存の問題を削除（再挿入のため）
      await supabase
        .from("category_test_questions")
        .delete()
        .eq("category_test_id", categoryTest.id)

      // 3. 問題を挿入
      const questionsToInsert = test.questions.map((q) => ({
        category_test_id: categoryTest.id,
        question_number: q.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation,
        source: q.source,
      }))

      const { error: questionsError } = await supabase
        .from("category_test_questions")
        .insert(questionsToInsert)

      if (questionsError) {
        results.push({
          category: test.categoryId,
          success: false,
          error: `Failed to insert questions: ${questionsError.message}`,
        })
        continue
      }

      results.push({
        category: test.categoryId,
        success: true,
      })
    } catch (error) {
      results.push({
        category: test.categoryId,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return NextResponse.json({
    message: "Test data migration completed",
    results,
  })
}
