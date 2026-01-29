"use client"

import { useState } from "react"
import { Calendar, Clock, TrendingUp, ChevronDown, ChevronUp, Award, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { type TrainingResult, getScoreColor, getScoreBgColor } from "@/lib/training-results"

interface TrainingResultsProps {
  results: TrainingResult[]
}

export function TrainingResults({ results }: TrainingResultsProps) {
  // Debug logs
  console.log("[v0] TrainingResults component - results count:", results.length)
  console.log("[v0] TrainingResults component - results data:", results)
  
  const [expandedResult, setExpandedResult] = useState<string | null>(
    results.length > 0 ? results[results.length - 1].id : null,
  )

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            研修結果
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <p className="text-muted-foreground text-sm">まだ研修を受講していません</p>
            <p className="text-muted-foreground text-xs mt-1">AIロープレを開始して研修を受けましょう</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const latestResult = results[results.length - 1]
  const previousResult = results.length > 1 ? results[results.length - 2] : null
  const improvement = previousResult ? latestResult.overallScore - previousResult.overallScore : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          研修結果
          <Badge variant="secondary" className="ml-auto">
            {results.length}回受講
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 最新スコアサマリー */}
        <div className={`rounded-lg border p-4 ${getScoreBgColor(latestResult.overallScore)}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">最新スコア</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(latestResult.overallScore)}`}>
                {latestResult.overallScore}
              </span>
              <span className="text-muted-foreground text-sm">/ 100</span>
            </div>
          </div>
          {improvement !== 0 && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              {improvement > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600">+{improvement}点アップ</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                  <span className="text-red-600">{improvement}点</span>
                </>
              )}
              <span className="text-muted-foreground">（前回比）</span>
            </div>
          )}
        </div>

        {/* 各回の結果一覧 */}
        <div className="space-y-2">
          {results.map((result) => (
            <div key={result.id} className="border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                className="w-full justify-between px-4 py-3 h-auto"
                onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">
                    {result.attemptNumber}回目
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {result.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}点</span>
                  {expandedResult === result.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </Button>

              {expandedResult === result.id && (
                <div className="px-4 pb-4 space-y-4 border-t bg-muted/30">
                  {/* 実施情報 */}
                  <div className="flex items-center gap-4 pt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {result.duration}分
                    </span>
                  </div>

                  {/* カテゴリ別評価 */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">カテゴリ別評価</p>
                    {result.evaluation.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <span className={getScoreColor(item.score)}>{item.score}点</span>
                        </div>
                        <Progress value={item.score} className="h-2" />
                        <p className="text-xs text-muted-foreground">{item.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* フィードバック */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">総合フィードバック</p>
                    <p className="text-sm text-muted-foreground bg-background rounded p-3">{result.feedback}</p>
                  </div>

                  {/* 良かった点・改善点 */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        良かった点
                      </p>
                      <ul className="space-y-1">
                        {result.strengths.map((item, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-1">
                            <Award className="h-3.5 w-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium flex items-center gap-1 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        改善点
                      </p>
                      <ul className="space-y-1">
                        {result.improvements.map((item, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-1">
                            <TrendingUp className="h-3.5 w-3.5 mt-0.5 text-amber-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
