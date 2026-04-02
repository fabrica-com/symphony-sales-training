// カテゴリテスト型定義

/** サーバーのみが持つ完全な問題（correctAnswer, explanation 含む） */
export interface TestQuestionFull {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  source: string
}

/** クライアントに送る問題（正解・解説なし） */
export interface TestQuestion {
  id: number
  question: string
  options: string[]
  source: string
}

/** クライアントに送るテスト（正解なし） */
export interface CategoryTest {
  categoryId: string
  categoryName: string
  totalQuestions: number
  passingScore: number
  timeLimit: number
  questions: TestQuestion[]
}

/** サーバー採点後に返す各問題の結果 */
export interface QuestionResult {
  question: string
  options: string[]
  source: string
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
  explanation: string
}

/** サーバー採点後に返すテスト結果 */
export interface TestGradingResult {
  score: number
  percentage: number
  passed: boolean
  correctCount: number
  incorrectCount: number
  questionResults: QuestionResult[]
}

/** 前回のテスト結果（一覧表示用） */
export interface PreviousTestResult {
  percentage: number
  correctCount: number
  totalQuestions: number
  completedAt: string
  incorrectQuestionIndices: number[]
}

/** 前回のテスト詳細（詳細ページ用） */
export interface PreviousTestResultDetail extends PreviousTestResult {
  score: number
  questionResults: QuestionResult[]
}
