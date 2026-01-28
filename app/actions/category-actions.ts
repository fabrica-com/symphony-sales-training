"use server"

import { getCategoryByIdFromDb, getCategoryTestFromDb } from "@/lib/db/categories"

export async function getCategoryByIdAction(categoryId: string) {
  return await getCategoryByIdFromDb(categoryId)
}

export async function getCategoryTestAction(categoryId: string) {
  return await getCategoryTestFromDb(categoryId)
}
