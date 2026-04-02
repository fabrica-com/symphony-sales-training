"use server"

import { getCategoryByIdFromDb, getCategoryTestFromDb } from "@/lib/db/categories"
import { createClient } from "@/lib/supabase/server"
import type { PreviousTestResult, PreviousTestResultDetail, QuestionResult } from "@/lib/test-data"

export async function getCategoryByIdAction(categoryId: string) {
  return await getCategoryByIdFromDb(categoryId)
}

export async function getCategoryTestAction(categoryId: string) {
  const full = await getCategoryTestFromDb(categoryId)
  if (!full) return null

  // correctAnswer と explanation をクライアントに送らない
  return {
    categoryId: full.categoryId,
    categoryName: full.categoryName,
    totalQuestions: full.totalQuestions,
    passingScore: full.passingScore,
    timeLimit: full.timeLimit,
    questions: full.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      source: q.source,
    })),
  }
}

export async function getAllCategoriesWithTrainingsAction() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from("training_categories")
    .select("*")
    .order("display_order")

  if (error || !categories) return []

  const { data: trainings } = await supabase
    .from("trainings")
    .select("id, category_id, title, subtitle, duration, level, detail, display_order")
    .order("display_order")

  const { data: tests } = await supabase
    .from("category_tests")
    .select("category_id")
  const categoryIdsWithTest = new Set((tests ?? []).map((t) => t.category_id))

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    totalDuration: cat.total_duration,
    targetLevel: cat.target_level,
    color: cat.color,
    hasTest: categoryIdsWithTest.has(cat.id),
    trainings: (trainings ?? [])
      .filter((t) => t.category_id === cat.id)
      .map((t) => ({
        id: t.id,
        title: t.title,
        subtitle: t.subtitle,
        duration: t.duration,
        level: t.level,
        detail: t.detail,
      })),
  }))
}

// カテゴリID・名前のみ取得（軽量版、出題範囲表示用など）
export async function getAllCategoryNamesAction(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("training_categories")
    .select("id, name")
    .order("display_order")

  if (error || !data) return []
  return data.map((c) => ({ id: c.id, name: c.name }))
}

/**
 * 前回のテスト結果を取得（現在のユーザーの直前の試行）
 * @param categoryId カテゴリID
 * @returns 前回の結果、またはnull（初回受験時）
 */
export async function getPreviousTestResultAction(categoryId: string): Promise<PreviousTestResult | null> {
  const supabase = await createClient()

  // 認証ユーザーの取得
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return null

  // そのカテゴリの全試行を取得（新しい順）
  const { data: results, error } = await supabase
    .from("category_test_results")
    .select("*")
    .eq("user_id", user.id)
    .eq("category_id", categoryId)
    .order("completed_at", { ascending: false })
    .limit(2)

  if (error || !results || results.length === 0) return null

  // 最新が1回目なら、2番目の試行を前回とする
  const previousResult = results.length > 1 ? results[1] : null

  if (!previousResult) return null

  // answersから間違えた問題のインデックスを抽出
  const answers = previousResult.answers as number[] | null
  const test = await getCategoryTestFromDb(categoryId)

  if (!test || !answers || answers.length === 0) {
    return {
      percentage: previousResult.percentage,
      correctCount: previousResult.correct_count,
      totalQuestions: previousResult.total_questions,
      completedAt: previousResult.completed_at ?? new Date().toISOString(),
      incorrectQuestionIndices: [],
    }
  }

  // 正解を持つテスト問題と比較して間違い問題を特定
  const incorrectIndices = answers
    .map((userAnswer, index) => ({
      index,
      userAnswer,
      correctAnswer: test.questions[index]?.correctAnswer,
    }))
    .filter(({ userAnswer, correctAnswer }) => userAnswer !== correctAnswer && userAnswer >= 0)
    .map(({ index }) => index)

  return {
    percentage: previousResult.percentage,
    correctCount: previousResult.correct_count,
    totalQuestions: previousResult.total_questions,
    completedAt: previousResult.completed_at ?? new Date().toISOString(),
    incorrectQuestionIndices: incorrectIndices,
  }
}

/**
 * 前回のテスト結果の詳細を取得
 * @param categoryId カテゴリID
 * @returns 前回の結果詳細、またはnull
 */
export async function getPreviousTestResultDetailAction(categoryId: string): Promise<PreviousTestResultDetail | null> {
  const supabase = await createClient()

  // 認証ユーザーの取得
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return null

  // そのカテゴリの全試行を取得（新しい順）
  const { data: results, error } = await supabase
    .from("category_test_results")
    .select("*")
    .eq("user_id", user.id)
    .eq("category_id", categoryId)
    .order("completed_at", { ascending: false })
    .limit(2)

  if (error || !results || results.length === 0) return null

  // 最新が1回目なら、2番目の試行を前回とする
  const previousResult = results.length > 1 ? results[1] : null

  if (!previousResult) return null

  const answers = previousResult.answers as number[] | null
  const test = await getCategoryTestFromDb(categoryId)

  if (!test || !answers || answers.length === 0) {
    return {
      percentage: previousResult.percentage,
      correctCount: previousResult.correct_count,
      totalQuestions: previousResult.total_questions,
      completedAt: previousResult.completed_at ?? new Date().toISOString(),
      score: previousResult.score,
      incorrectQuestionIndices: [],
      questionResults: [],
    }
  }

  // 各問題の結果を構築
  const questionResults: QuestionResult[] = test.questions.map((q, index) => {
    const userAnswer = answers[index] ?? -1
    const isCorrect = userAnswer === q.correctAnswer && userAnswer >= 0

    return {
      question: q.question,
      options: q.options,
      source: q.source,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    }
  })

  // 間違い問題のインデックス
  const incorrectIndices = questionResults
    .map((qr, index) => ({ index, isCorrect: qr.isCorrect }))
    .filter(({ isCorrect }) => !isCorrect)
    .map(({ index }) => index)

  return {
    percentage: previousResult.percentage,
    correctCount: previousResult.correct_count,
    totalQuestions: previousResult.total_questions,
    completedAt: previousResult.completed_at ?? new Date().toISOString(),
    score: previousResult.score,
    incorrectQuestionIndices: incorrectIndices,
    questionResults,
  }
}

