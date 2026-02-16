"use server"

import { getCategoryByIdFromDb, getCategoryTestFromDb } from "@/lib/db/categories"
import { createClient } from "@/lib/supabase/server"

export async function getCategoryByIdAction(categoryId: string) {
  return await getCategoryByIdFromDb(categoryId)
}

export async function getCategoryTestAction(categoryId: string) {
  return await getCategoryTestFromDb(categoryId)
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

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    totalDuration: cat.total_duration,
    targetLevel: cat.target_level,
    color: cat.color,
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
