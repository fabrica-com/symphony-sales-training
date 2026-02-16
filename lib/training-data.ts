export type Level = "新卒" | "若手" | "中堅" | "上級" | "MGR" | "全レベル"

export interface ContentSection {
  title: string
  content: string | string[]
  type?: "text" | "list" | "comparison" | "table" | "quote"
}

export interface TrainingDetail {
  purpose: string
  goal: string
  sections: ContentSection[]
  summary: string[]
  quote?: {
    text: string
    author: string
  }
}

export interface Training {
  id: number
  title: string
  subtitle?: string
  duration: number
  level: Level
  detail?: TrainingDetail
}

export interface Category {
  id: string
  name: string
  description: string
  totalDuration: number
  targetLevel: string
  trainings: Training[]
  color: string
}

export const levelColors: Record<Level, string> = {
  新卒: "bg-blue-100 text-blue-700",
  若手: "bg-green-100 text-green-700",
  中堅: "bg-amber-100 text-amber-700",
  上級: "bg-rose-100 text-rose-700",
  MGR: "bg-slate-100 text-slate-700",
  全レベル: "bg-primary/10 text-primary",
}
