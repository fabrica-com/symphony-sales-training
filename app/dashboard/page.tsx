import { getAllCategoriesWithTrainingsAction } from "@/app/actions/category-actions"
import DashboardClient from "./dashboard-client"
import type { Category } from "@/lib/training-data"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const categories = (await getAllCategoriesWithTrainingsAction()) as Category[]

  return <DashboardClient categories={categories} />
}
