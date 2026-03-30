"use client"

import Link from "next/link"
import { FileCheck, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TrainingItem } from "@/components/training-item"
import { useAuth } from "@/lib/auth-context"
import type { Training } from "@/lib/training-data"

interface CategoryTrainingsClientProps {
  categoryId: string
  trainings: Training[]
  categoryTest: { totalQuestions: number } | null
}

export function CategoryTrainingsClient({
  categoryId,
  trainings,
  categoryTest,
}: CategoryTrainingsClientProps) {
  const { userProgress } = useAuth()

  const completedTrainingIds = new Set(
    Object.entries(userProgress)
      .filter(([, v]) => !!v)
      .map(([k]) => Number(k))
  )

  const allCompleted =
    trainings.length > 0 && trainings.every((t) => completedTrainingIds.has(t.id))

  return (
    <>
      {categoryTest && (
        <div className="mb-6">
          {allCompleted ? (
            <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
              <Link href={`/category/${categoryId}/test`} prefetch={false}>
                <FileCheck className="mr-2 h-4 w-4" />
                総合テスト ({categoryTest.totalQuestions}問)
              </Link>
            </Button>
          ) : (
            <Button size="sm" disabled className="opacity-50 cursor-not-allowed gap-1">
              <Lock className="h-4 w-4" />
              全研修完了後に受験可能
            </Button>
          )}
        </div>
      )}

      <h2 className="mb-6 text-xl font-semibold">研修一覧</h2>
      <div className="space-y-3">
        {trainings.map((training) => (
          <TrainingItem
            key={training.id}
            training={training}
            categoryId={categoryId}
            completed={completedTrainingIds.has(training.id)}
          />
        ))}
      </div>
    </>
  )
}
