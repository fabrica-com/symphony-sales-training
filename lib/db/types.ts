// Type definitions that can be imported by both server and client code
// This file does NOT import server-only modules

import type { Category } from "@/lib/training-data"

// DBから取得したカテゴリの型（trainingsは別途取得）
export interface DbCategory {
  id: string
  name: string
  description: string
  total_duration: number
  target_level: string
  color: string
  display_order: number
  training_count?: number
}

// Re-export test types from the canonical source
export type {
  TestQuestion,
  TestQuestionFull,
  CategoryTest,
  QuestionResult,
  TestGradingResult,
} from "@/lib/test-data"

// Re-export Category for convenience
export type { Category }
