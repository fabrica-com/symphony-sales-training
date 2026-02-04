import type { DeepDiveReading, DeepDiveSection } from "../deep-dive-content"

// 研修セッション用のデータ型定義
export type { DeepDiveReading, DeepDiveSection }

export interface MoodOption {
  emoji: string
  label: string
  response: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface SimulationScenario {
  situation: string
  customerLine: string
  options: {
    text: string
    isCorrect: boolean
    feedback: string
    points: number
  }[]
}

export interface RoleplayScenario {
  title: string
  situation: string
  seniorOpening?: string
  customerProfile?: string
  customerOpening?: string
  dialogue: {
    speaker: "senior" | "kenta" | "customer" | "sales"
    line: string
    hint?: string
  }[]
  keyPoints: string[]
  successCriteria: string
}

export interface StoryScene {
  title: string
  content: string
  duration: number
}

export interface SessionContent {
  trainingId: number
  title: string
  keyPhrase: string
  badge: {
    name: string
    icon: string
  }
  moodOptions: MoodOption[]
  reviewQuiz: QuizQuestion
  story: {
    part1: StoryScene[]
    part2: StoryScene[]
  }
  infographic: {
    title: string
    content: string
    highlight: string
    audioText?: string
  }
  quickCheck: QuizQuestion[]
  quote: {
    text: string
    textJa: string
    author: string
  }
  simulation: SimulationScenario[]
  reflection: {
    question: string
    placeholder: string
  }
  actionOptions: string[]
  work?: {
    title: string
    description: string
    fields: { label: string; placeholder: string }[]
  }
  roleplay?: RoleplayScenario[]
  deepDive?: DeepDiveReading
}

// 共通のムードオプション
export const commonMoodOptions: MoodOption[] = [
  { emoji: "😤", label: "気合い十分！", response: "その調子！今日も全力でいきましょう！" },
  { emoji: "😊", label: "まあまあ", response: "いい感じですね。今日の15分で更にパワーアップしましょう！" },
  { emoji: "😴", label: "ちょっと眠い...", response: "大丈夫、今日の研修で目が覚めますよ！" },
  { emoji: "😰", label: "正直キツい", response: "そんな日もある。今日の15分で少し元気になれるよ。" },
]
