import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizQuestion } from "@/lib/session-data/types"

interface ReviewPhaseProps {
  quiz: QuizQuestion
  reviewAnswer: number | null
  showResult: boolean
  onAnswer: (index: number) => void
  onNext: () => void
}

export function ReviewPhase({ quiz, reviewAnswer, showResult, onAnswer, onNext }: ReviewPhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <Badge variant="outline" className="mx-auto mb-2">昨日のおさらい</Badge>
        <CardTitle className="text-lg">{quiz.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {quiz.options.map((option, index) => {
            const isCorrect = index === quiz.correctIndex
            return (
              <button
                key={index}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-colors",
                  showResult
                    ? isCorrect
                      ? "border-green-500 bg-green-500/10"
                      : reviewAnswer === index
                        ? "border-red-400 bg-red-400/10"
                        : "border-border bg-muted/30 opacity-60"
                    : reviewAnswer === index
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50 hover:bg-muted/50",
                  showResult ? "cursor-default" : "cursor-pointer"
                )}
                onClick={() => !showResult && onAnswer(index)}
                disabled={showResult}
              >
                <div className="flex gap-3 items-start">
                  <span className={cn(
                    "shrink-0 h-6 w-6 rounded-full border flex items-center justify-center text-xs font-bold",
                    showResult
                      ? isCorrect
                        ? "border-green-500 bg-green-500 text-white"
                        : reviewAnswer === index
                          ? "border-red-400 bg-red-400 text-white"
                          : "border-muted-foreground text-muted-foreground"
                      : reviewAnswer === index
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground text-muted-foreground"
                  )}>
                    {showResult && isCorrect ? "✓" : String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm leading-relaxed">{option}</span>
                </div>
              </button>
            )
          })}
        </div>
        {showResult && (
          <>
            <div className={cn(
              "rounded-lg p-4",
              reviewAnswer === quiz.correctIndex
                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-red-500/10 text-red-700 dark:text-red-400",
            )}>
              <p className="font-medium mb-1">
                {reviewAnswer === quiz.correctIndex ? "正解！ +10pt" : "惜しい！"}
              </p>
              <p className="text-sm">{quiz.explanation}</p>
            </div>
            <Button className="w-full" onClick={onNext}>
              次へ進む <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
