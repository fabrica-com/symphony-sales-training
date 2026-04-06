import { getAllCategoriesWithTrainings } from "@/lib/db/categories"
import { createStaticClient } from "@/lib/supabase/static"
import DashboardClient from "./dashboard-client"
import type { Category } from "@/lib/training-data"

export const revalidate = 0

export default async function DashboardPage() {
  const supabase = createStaticClient()
  const categories = (await getAllCategoriesWithTrainings(supabase)) as Category[]

  return <DashboardClient categories={categories} />
}
