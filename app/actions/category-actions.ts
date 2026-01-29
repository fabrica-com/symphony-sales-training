"use server"

import { getCategoryByIdFromDb } from "@/lib/db/categories"
import { getCategoryTest } from "@/lib/test-data"

export async function getCategoryByIdAction(categoryId: string) {
  return await getCategoryByIdFromDb(categoryId)
}

export async function getCategoryTestAction(categoryId: string) {
  // ローカルのtest-data.tsから50問のテストデータを取得
  const localTest = getCategoryTest(categoryId)
  if (localTest) {
    return localTest
  }
  return null
}
