export interface TrainingResult {
  id: string
  trainingId: number
  attemptNumber: number
  date?: string
  duration: number
  score: number
  maxScore?: number
  trainingTitle?: string
  categoryId?: string
  categoryName?: string
  evaluation?: {
    category: string
    score: number
    comment: string
  }[]
  feedback: string
  strengths: string[]
  improvements: string[]
  completedAt?: string
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-600"
  if (score >= 80) return "text-blue-600"
  if (score >= 70) return "text-amber-600"
  return "text-red-600"
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return "bg-emerald-100 border-emerald-300"
  if (score >= 80) return "bg-blue-100 border-blue-300"
  if (score >= 70) return "bg-amber-100 border-amber-300"
  return "bg-red-100 border-red-300"
}
