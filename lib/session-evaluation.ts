/**
 * Pure functions for session evaluation logic
 * Extracted from useSessionState hook for testability
 */

import type { SessionContent } from "@/lib/session-data/types"

/**
 * Reviews quiz answer evaluation
 */
export function evaluateReviewAnswer(
  selectedIndex: number,
  correctIndex: number | undefined
): { isCorrect: boolean; pointsToAdd: number } {
  if (correctIndex === undefined) {
    return { isCorrect: false, pointsToAdd: 0 }
  }
  const isCorrect = selectedIndex === correctIndex
  return {
    isCorrect,
    pointsToAdd: isCorrect ? 10 : 0,
  }
}

/**
 * Quick check answer evaluation
 */
export function evaluateQuickCheckAnswer(
  selectedIndex: number,
  correctIndex: number | undefined
): { isCorrect: boolean; pointsToAdd: number } {
  if (correctIndex === undefined) {
    return { isCorrect: false, pointsToAdd: 0 }
  }
  const isCorrect = selectedIndex === correctIndex
  return {
    isCorrect,
    pointsToAdd: isCorrect ? 15 : 0,
  }
}

/**
 * Simulation answer evaluation
 * Returns points defined in option, or 15 if correct with no explicit points
 */
export function evaluateSimulationAnswer(
  selectedIndex: number,
  simulationOptions: Array<{
    text: string
    points?: number
    isCorrect: boolean
  }>
): { isCorrect: boolean; pointsToAdd: number } {
  const option = simulationOptions[selectedIndex]
  if (!option) {
    return { isCorrect: false, pointsToAdd: 0 }
  }

  const isCorrect = option.isCorrect
  // 不正解の場合は常に 0 ポイント、正解の場合のみ points または 15
  const pointsToAdd = isCorrect
    ? (option.points ?? 15)
    : 0

  return { isCorrect, pointsToAdd }
}

/**
 * Determines if roleplay is complete and calculates points
 * Only awards points on first completion
 */
export function evaluateRoleplayCompletion(
  alreadyComplete: boolean
): { pointsToAdd: number } {
  if (alreadyComplete) {
    return { pointsToAdd: 0 }
  }
  return { pointsToAdd: 20 }
}

/**
 * Determines if deep dive reading is complete and calculates points
 * Only awards points on first completion
 */
export function evaluateDeepDiveCompletion(
  alreadyRead: boolean
): { pointsToAdd: number } {
  if (alreadyRead) {
    return { pointsToAdd: 0 }
  }
  return { pointsToAdd: 30 }
}

/**
 * Evaluates story completion
 */
export function evaluateStoryCompletion(): { pointsToAdd: number } {
  return { pointsToAdd: 20 }
}

/**
 * Evaluates work submission
 * Awards points only if at least one field is filled
 */
export function evaluateWorkSubmission(
  workFields: Record<number, string>
): { isComplete: boolean; pointsToAdd: number } {
  const filledCount = Object.values(workFields).filter(
    (v) => v && v.trim().length > 0
  ).length

  if (filledCount === 0) {
    return { isComplete: false, pointsToAdd: 0 }
  }

  return { isComplete: true, pointsToAdd: 50 }
}

/**
 * Evaluates reflection submission
 * Awards points only if text is not empty
 */
export function evaluateReflectionSubmission(
  reflectionText: string
): { canSubmit: boolean; pointsToAdd: number } {
  const trimmed = reflectionText.trim()

  if (trimmed.length === 0) {
    return { canSubmit: false, pointsToAdd: 0 }
  }

  return { canSubmit: true, pointsToAdd: 10 }
}

/**
 * Evaluates action selection
 */
export function evaluateActionSelection(): { pointsToAdd: number } {
  return { pointsToAdd: 20 }
}

/**
 * Evaluates mood selection
 */
export function evaluateMoodSelection(): { pointsToAdd: number } {
  return { pointsToAdd: 10 }
}

/**
 * Calculates progress percentage
 */
export function calculateProgress(
  currentPhaseIndex: number,
  totalPhases: number
): number {
  if (totalPhases === 0) return 0
  return ((currentPhaseIndex + 1) / totalPhases) * 100
}

/**
 * Checks if work can be submitted (at least one field filled)
 */
export function isWorkComplete(
  workFields: Record<number, string> | undefined
): boolean {
  if (!workFields) return false
  return Object.values(workFields).some((v) => v && v.trim().length > 0)
}
