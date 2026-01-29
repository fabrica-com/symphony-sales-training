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

// Test-related types
export interface CategoryTestQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  source: string
}

export interface CategoryTest {
  categoryId: string
  categoryName: string
  totalQuestions: number
  passingScore: number
  timeLimit: number
  questions: CategoryTestQuestion[]
}

// Re-export Category for convenience
export type { Category }
