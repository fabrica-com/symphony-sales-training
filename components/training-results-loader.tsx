"use client"

import { useEffect, useState } from "react"
import { TrainingResults } from "@/components/training-results"
import { getTrainingResultsAction } from "@/app/actions/training-actions"
import type { TrainingResult } from "@/lib/training-results-types"
import { useAuth } from "@/lib/auth-context"

interface TrainingResultsLoaderProps {
  trainingId: number
}

export function TrainingResultsLoader({ trainingId }: TrainingResultsLoaderProps) {
  const { user } = useAuth()
  const [results, setResults] = useState<TrainingResult[]>([])

  useEffect(() => {
    if (!user) return
    getTrainingResultsAction(trainingId).then(setResults)
  }, [user, trainingId])

  return <TrainingResults results={results} />
}
