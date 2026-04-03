/**
 * 復習モードの答え変換ユーティリティ
 */

/**
 * 復習モード時の回答を50問フォーマットに変換
 * @param reviewAnswers 復習モードの回答（復習問題のみ、e.g. 39問）
 * @param reviewQuestionIndices 復習問題のインデックス配列（元の50問内でのインデックス）
 * @returns 50問フォーマットの回答配列（未回答は-1）
 */
export function convertReviewAnswersToFullFormat(
  reviewAnswers: number[],
  reviewQuestionIndices: number[]
): number[] {
  const fullAnswers = Array(50).fill(-1) // デフォルトは-1（未回答）

  for (let i = 0; i < reviewAnswers.length; i++) {
    const originalIndex = reviewQuestionIndices[i]
    fullAnswers[originalIndex] = reviewAnswers[i]
  }

  return fullAnswers
}

/**
 * 前回のテスト結果から復習問題のインデックスを抽出
 * @param previousAnswers 前回の50問フォーマット回答
 * @param correctAnswers 正解配列（50問）
 * @returns 間違えた問題のインデックス配列
 */
export function extractIncorrectIndices(
  previousAnswers: number[],
  correctAnswers: number[]
): number[] {
  const incorrectIndices: number[] = []

  for (let i = 0; i < previousAnswers.length; i++) {
    const userAnswer = previousAnswers[i]
    const correct = correctAnswers[i]

    // 回答済みで、かつ不正解
    if (userAnswer >= 0 && userAnswer !== correct) {
      incorrectIndices.push(i)
    }
  }

  return incorrectIndices
}

/**
 * 復習モードの時間制限を計算
 * @param incorrectCount 間違えた問題数
 * @param totalQuestions 総問題数（50）
 * @param baseTimeLimit ベースの時間制限（秒）
 * @returns 動的に計算された時間制限（秒）
 */
export function calculateReviewTimeLimit(
  incorrectCount: number,
  totalQuestions: number,
  baseTimeLimit: number
): number {
  const ratio = incorrectCount / totalQuestions
  return Math.round(ratio * baseTimeLimit)
}
