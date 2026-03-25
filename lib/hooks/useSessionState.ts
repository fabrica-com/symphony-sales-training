"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import type { SessionContent, DeepDiveReading } from "@/lib/session-data/types"
import type { Training, Category } from "@/lib/training-data"
import { computeMaxScore } from "@/lib/score-calc"
import { useAuth } from "@/lib/auth-context"

export type SessionPhase =
  | "checkin"
  | "review"
  | "mission"
  | "story1"
  | "infographic"
  | "quickcheck"
  | "story2"
  | "quote"
  | "simulation"
  | "roleplay"
  | "work"
  | "reflection"
  | "complete"
  | "preview"
  | "action"
  | "deepdive"
  | "ending"

export function buildActivePhases(
  sessionContent: SessionContent,
  deepDiveContent: DeepDiveReading | null
): SessionPhase[] {
  const phases: SessionPhase[] = ["checkin"]
  if (sessionContent.reviewQuiz) phases.push("review")
  phases.push("mission")
  if (sessionContent.story?.part1?.length) phases.push("story1")
  if (sessionContent.infographic) phases.push("infographic")
  if (sessionContent.quickCheck?.length) phases.push("quickcheck")
  if (sessionContent.story?.part2?.length) phases.push("story2")
  if (sessionContent.quote) phases.push("quote")
  if (sessionContent.simulation?.length) phases.push("simulation")
  if (sessionContent.roleplay?.length) phases.push("roleplay")
  if (sessionContent.work?.fields?.length) phases.push("work")
  phases.push("reflection")
  phases.push("complete")
  phases.push("preview")
  if (sessionContent.actionOptions?.length) phases.push("action")
  if (deepDiveContent) phases.push("deepdive")
  phases.push("ending")
  return phases
}

export interface SessionStateProps {
  training: Training
  category: Category
  sessionContent: SessionContent
  deepDiveContent: DeepDiveReading | null
}

export function useSessionState({
  training,
  category,
  sessionContent,
  deepDiveContent,
}: SessionStateProps) {
  const { user, addTrainingLog } = useAuth()

  const activePhases = useMemo(
    () => buildActivePhases(sessionContent, deepDiveContent),
    [sessionContent, deepDiveContent]
  )

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [points, setPoints] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const hasLoggedCompletion = useRef(false)

  const [selectedMood, setSelectedMood] = useState<number | null>(null)

  const [reviewAnswer, setReviewAnswer] = useState<number | null>(null)
  const [showReviewResult, setShowReviewResult] = useState(false)

  const [storySceneIndex, setStorySceneIndex] = useState(0)

  const [quickCheckIndex, setQuickCheckIndex] = useState(0)
  const [quickCheckAnswer, setQuickCheckAnswer] = useState<number | null>(null)
  const [showQuickCheckResult, setShowQuickCheckResult] = useState(false)

  const [simulationIndex, setSimulationIndex] = useState(0)
  const [simulationAnswer, setSimulationAnswer] = useState<number | null>(null)
  const [showSimulationResult, setShowSimulationResult] = useState(false)

  const [roleplayIndex, setRoleplayIndex] = useState(0)
  const [roleplayDialogueIndex, setRoleplayDialogueIndex] = useState(0)
  const [roleplayComplete, setRoleplayComplete] = useState(false)

  const [workFields, setWorkFields] = useState<Record<number, string>>({})
  const [reflectionText, setReflectionText] = useState("")
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const [expandedSections, setExpandedSections] = useState<number[]>([])
  const [deepDiveRead, setDeepDiveRead] = useState(false)

  const currentPhase = activePhases[currentPhaseIndex]
  const progress = ((currentPhaseIndex + 1) / activePhases.length) * 100

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (currentPhase === "ending" && !hasLoggedCompletion.current && user) {
      hasLoggedCompletion.current = true
      const computedMaxScore = computeMaxScore(sessionContent, deepDiveContent)
      const selectedMoodOption = selectedMood !== null ? sessionContent.moodOptions[selectedMood] : null
      const workAnswers = sessionContent.work?.fields
        .map((field, i) => ({ label: field.label, value: workFields[i] ?? "" }))
        .filter((a) => a.value.trim().length > 0)

      addTrainingLog({
        odaiNumber: training.id,
        trainingTitle: training.title,
        categoryId: category.id,
        categoryName: category.name,
        completedAt: new Date().toISOString(),
        score: points,
        maxScore: computedMaxScore,
        duration: elapsedTime,
        moodEmoji: selectedMoodOption?.emoji,
        moodLabel: selectedMoodOption?.label,
        reflectionText: reflectionText || undefined,
        workAnswers: workAnswers && workAnswers.length > 0 ? workAnswers : undefined,
      })
    }
  }, [currentPhase, user, addTrainingLog, training, category, points, elapsedTime, selectedMood, sessionContent, deepDiveContent, reflectionText, workFields])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }, [])

  const goToNextPhase = useCallback(() => {
    setCurrentPhaseIndex((prev) => (prev < activePhases.length - 1 ? prev + 1 : prev))
  }, [activePhases.length])

  const handleMoodSelect = useCallback((index: number) => {
    setSelectedMood(index)
    setPoints((prev) => prev + 10)
  }, [])

  const handleReviewAnswer = useCallback((index: number) => {
    setReviewAnswer(index)
    setShowReviewResult(true)
    if (sessionContent.reviewQuiz && index === sessionContent.reviewQuiz.correctIndex) {
      setPoints((prev) => prev + 10)
    }
  }, [sessionContent.reviewQuiz])

  const handleQuickCheckAnswer = useCallback((index: number) => {
    setQuickCheckAnswer(index)
    setShowQuickCheckResult(true)
    if (index === sessionContent.quickCheck[quickCheckIndex].correctIndex) {
      setPoints((prev) => prev + 15)
    }
  }, [sessionContent.quickCheck, quickCheckIndex])

  const handleNextQuickCheck = useCallback(() => {
    if (quickCheckIndex < sessionContent.quickCheck.length - 1) {
      setQuickCheckIndex((prev) => prev + 1)
      setQuickCheckAnswer(null)
      setShowQuickCheckResult(false)
    } else {
      goToNextPhase()
    }
  }, [quickCheckIndex, sessionContent.quickCheck.length, goToNextPhase])

  const handleSimulationAnswer = useCallback((index: number) => {
    setSimulationAnswer(index)
    setShowSimulationResult(true)
    const option = sessionContent.simulation[simulationIndex].options[index]
    const pointsToAdd = option.points ?? (option.isCorrect ? 15 : 0)
    setPoints((prev) => prev + pointsToAdd)
  }, [sessionContent.simulation, simulationIndex])

  const handleNextSimulation = useCallback(() => {
    if (simulationIndex < sessionContent.simulation.length - 1) {
      setSimulationIndex((prev) => prev + 1)
      setSimulationAnswer(null)
      setShowSimulationResult(false)
    } else {
      goToNextPhase()
    }
  }, [simulationIndex, sessionContent.simulation.length, goToNextPhase])

  const handleRoleplayComplete = useCallback(() => {
    setRoleplayComplete((prev) => {
      if (!prev) setPoints((p) => p + 20)
      return true
    })
  }, [])

  const handleNextRoleplay = useCallback(() => {
    if (sessionContent.roleplay && roleplayIndex < sessionContent.roleplay.length - 1) {
      setRoleplayIndex((prev) => prev + 1)
      setRoleplayDialogueIndex(0)
      setRoleplayComplete(false)
    } else {
      goToNextPhase()
    }
  }, [roleplayIndex, sessionContent.roleplay, goToNextPhase])

  const handleStoryComplete = useCallback(() => {
    setStorySceneIndex(0)
    setPoints((prev) => prev + 20)
    goToNextPhase()
  }, [goToNextPhase])

  const handleReflectionSubmit = useCallback(() => {
    if (reflectionText.trim()) {
      setPoints((prev) => prev + 10)
      goToNextPhase()
    }
  }, [reflectionText, goToNextPhase])

  const handleActionSelect = useCallback((action: string) => {
    setSelectedAction(action)
    setPoints((prev) => prev + 20)
  }, [])

  const handleWorkFieldChange = useCallback((index: number, value: string) => {
    setWorkFields((prev) => ({ ...prev, [index]: value }))
  }, [])

  const handleWorkSubmit = useCallback(() => {
    const filledFields = Object.values(workFields).filter((v) => v.trim()).length
    if (filledFields > 0) {
      setPoints((prev) => prev + 50)
      goToNextPhase()
    }
  }, [workFields, goToNextPhase])

  const toggleSection = useCallback((index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }, [])

  const expandAllSections = useCallback(() => {
    if (deepDiveContent) {
      setExpandedSections(deepDiveContent.sections.map((_, i) => i))
    }
  }, [deepDiveContent])

  const handleDeepDiveComplete = useCallback(() => {
    if (!deepDiveRead) {
      setDeepDiveRead(true)
      setPoints((prev) => prev + 30)
    }
    goToNextPhase()
  }, [deepDiveRead, goToNextPhase])

  const isWorkComplete = sessionContent.work?.fields
    ? sessionContent.work.fields.some((_, index) => workFields[index]?.trim())
    : false

  return {
    activePhases,
    currentPhase,
    currentPhaseIndex,
    progress,
    goToNextPhase,
    points,
    elapsedTime,
    formatTime,
    selectedMood,
    handleMoodSelect,
    reviewAnswer,
    showReviewResult,
    handleReviewAnswer,
    storySceneIndex,
    setStorySceneIndex,
    handleStoryComplete,
    quickCheckIndex,
    quickCheckAnswer,
    showQuickCheckResult,
    handleQuickCheckAnswer,
    handleNextQuickCheck,
    simulationIndex,
    simulationAnswer,
    showSimulationResult,
    handleSimulationAnswer,
    handleNextSimulation,
    roleplayIndex,
    roleplayDialogueIndex,
    setRoleplayDialogueIndex,
    roleplayComplete,
    handleRoleplayComplete,
    handleNextRoleplay,
    workFields,
    isWorkComplete,
    handleWorkFieldChange,
    handleWorkSubmit,
    reflectionText,
    setReflectionText,
    handleReflectionSubmit,
    selectedAction,
    handleActionSelect,
    expandedSections,
    deepDiveRead,
    toggleSection,
    expandAllSections,
    handleDeepDiveComplete,
    user,
  }
}
