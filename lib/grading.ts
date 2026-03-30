/**
 * 採点・合格判定・表示変換の純粋関数群。
 * training-actions / final-exam-actions 両方から利用する。
 */

export interface GradeInput {
  answers: number[]
  correctAnswers: number[]
  totalQuestions: number
  passingScore: number
}

export interface GradeResult {
  correctCount: number
  incorrectCount: number
  percentage: number
  passed: boolean
}

/**
 * 回答を採点して合否を判定する。
 * - correctCount: 正解数
 * - percentage: 正解率（0-100、小数点以下四捨五入）
 * - passed: percentage >= passingScore
 */
export function gradeAnswers(input: GradeInput): GradeResult {
  let correctCount = 0
  for (let i = 0; i < input.correctAnswers.length; i++) {
    if (input.answers[i] === input.correctAnswers[i]) correctCount++
  }

  const percentage =
    input.totalQuestions > 0
      ? Math.round((correctCount / input.totalQuestions) * 100)
      : 0

  return {
    correctCount,
    incorrectCount: input.totalQuestions - correctCount,
    percentage,
    passed: percentage >= input.passingScore,
  }
}

/**
 * カテゴリテスト用スコア算出（1問2点方式）。
 */
export function categoryTestScore(correctCount: number): number {
  return correctCount * 2
}

/**
 * 秒数を分数に変換（小数点以下四捨五入）。
 */
export function secondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60)
}

/**
 * ISO 日時文字列を日本語ロケール表示に変換。
 * 入力が falsy なら undefined を返す。
 */
export function formatDateJP(isoString: string | null | undefined): string | undefined {
  if (!isoString) return undefined
  return new Date(isoString).toLocaleDateString("ja-JP")
}
