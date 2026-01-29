"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock } from "lucide-react"
import type { TrainingResult } from "@/lib/training-results"
import { useAuth } from "@/lib/auth-context"

interface TrainingResultsClientProps {
  trainingId: number
}

export function TrainingResultsClient({ trainingId }: TrainingResultsClientProps) {
  const { user, trainingLogs } = useAuth()
  const [results, setResults] = useState<TrainingResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Filter trainingLogs by trainingId and convert to TrainingResult format
    const filteredResults = (trainingLogs || [])
      .filter((log: any) => {
        // Check both trainingId/training_id AND odaiNumber (which is the actual training ID in the system)
        const logTrainingId = log.trainingId || log.training_id || log.odaiNumber
        return logTrainingId === trainingId
      })
      .map((log: any) => ({
        id: log.id,
        trainingId: log.trainingId || log.training_id || log.odaiNumber,
        trainingTitle: log.trainingTitle || log.training_title,
        categoryId: log.categoryId || log.category_id,
        categoryName: log.categoryName || log.category_name,
        attemptNumber: log.attemptNumber || log.attempt_number,
        score: log.score || log.overall_score,
        maxScore: log.maxScore || log.max_score || 100,
        duration: log.duration || log.duration_seconds,
        feedback: log.feedback || "",
        strengths: log.strengths || [],
        improvements: log.improvements || [],
        evaluation: log.evaluation || {},
        completedAt: log.completedAt || log.completed_at,
      }))

    console.log("[v0] TrainingResultsClient - trainingId:", trainingId)
    console.log("[v0] TrainingResultsClient - user:", user?.id)
    console.log("[v0] TrainingResultsClient - total trainingLogs:", trainingLogs?.length)
    console.log("[v0] TrainingResultsClient - filtered results count:", filteredResults.length)
    console.log("[v0] TrainingResultsClient - filtered results:", filteredResults)

    setResults(filteredResults)
    setLoading(false)
  }, [trainingId, trainingLogs, user])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            研修結果
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">読み込み中...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          研修結果
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">この研修はまだ受講していません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">受講 #{result.attemptNumber}回目</p>
                    <p className="text-sm text-muted-foreground">
                      {result.completedAt ? new Date(result.completedAt).toLocaleString("ja-JP") : "実施日未記録"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <span className="text-2xl font-bold">{result.score}</span>
                      <span className="text-muted-foreground">/ {result.maxScore || 100} pt</span>
                    </div>
                    <Badge className="mt-2">{Math.round((result.score / (result.maxScore || 100)) * 100)}%</Badge>
                  </div>
                </div>

                {result.duration && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Clock className="h-4 w-4" />
                    <span>所要時間: {Math.round(result.duration / 60)}分</span>
                  </div>
                )}

                {result.feedback && (
                  <div className="mt-3 p-3 rounded bg-secondary/30">
                    <p className="text-sm font-medium mb-1">フィードバック</p>
                    <p className="text-sm text-muted-foreground">{result.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
