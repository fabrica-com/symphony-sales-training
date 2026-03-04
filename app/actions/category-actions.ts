"use server"

import { getCategoryByIdFromDb, getCategoryTestFromDb } from "@/lib/db/categories"
import { createAdminClient } from "@/lib/supabase/admin"

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
  const supabase = await createAdminClient()

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
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("training_categories")
    .select("id, name")
    .order("display_order")

  if (error || !data) return []
  return data.map((c) => ({ id: c.id, name: c.name }))
}

