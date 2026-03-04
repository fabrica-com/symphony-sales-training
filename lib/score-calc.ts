import type { SessionContent, DeepDiveReading } from "@/lib/session-data/types"

/**
 * シミュレーションの最大獲得可能ポイントを計算
 * points が未設定の場合は isCorrect ? 15 : 0 でフォールバック
 */
export function computeSimMax(simulation: SessionContent["simulation"]): number {
  return (simulation ?? []).reduce(
    (sum, scene) =>
      sum + Math.max(0, ...scene.options.map((o) => o.points ?? (o.isCorrect ? 15 : 0))),
    0,
  )
}

/**
 * セッション全フェーズの最大獲得可能スコアを計算
 */
export function computeMaxScore(
  sessionContent: SessionContent,
  deepDiveContent: DeepDiveReading | null | undefined,
): number {
  const simMax = computeSimMax(sessionContent.simulation)
  return (
    10 + // mood（必ず存在）
    (sessionContent.reviewQuiz ? 10 : 0) +
    (sessionContent.story?.part1?.length ? 20 : 0) +
    (sessionContent.quickCheck?.length ?? 0) * 15 +
    (sessionContent.story?.part2?.length ? 20 : 0) +
    simMax +
    (sessionContent.roleplay?.length ? 20 : 0) +
    (sessionContent.work?.fields ? 50 : 0) +
    10 + // reflection
    20 + // action
    (deepDiveContent ? 30 : 0)
  )
}

/**
 * サーバー側スコアバリデーション（maxScoreでクランプ）
 */
export function clampScore(score: number, maxScore: number): number {
  const scoreValue = score ?? 0
  const isValid = !isNaN(scoreValue) && isFinite(scoreValue)
  const finalScore = isValid ? scoreValue : 0
  return Math.min(maxScore, Math.max(0, Math.round(finalScore)))
}
