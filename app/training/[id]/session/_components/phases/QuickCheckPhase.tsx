import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizQuestion } from "@/lib/session-data/types"

interface QuickCheckPhaseProps {
  questions: QuizQuestion[]
  currentIndex: number
  answer: number | null
  showResult: boolean
  onAnswer: (index: number) => void
  onNext: () => void
}

export function QuickCheckPhase({
  questions,
  currentIndex,
  answer,
  showResult,
  onAnswer,
  onNext,
}: QuickCheckPhaseProps) {
  const question = questions[currentIndex]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">クイックチェック</Badge>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <CardTitle className="text-lg mt-2">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctIndex
            return (
              <button
                key={index}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-colors",
                  showResult
                    ? isCorrect
                      ? "border-green-500 bg-green-500/10"
                      : answer === index
                        ? "border-red-400 bg-red-400/10"
                        : "border-border bg-muted/30 opacity-60"
                    : answer === index
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
                        : answer === index
                          ? "border-red-400 bg-red-400 text-white"
                          : "border-muted-foreground text-muted-foreground"
                      : answer === index
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
              answer === question.correctIndex
                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-red-500/10 text-red-700 dark:text-red-400",
            )}>
              <p className="font-medium mb-1">
                {answer === question.correctIndex ? "正解！ +15pt" : "惜しい！"}
              </p>
              <p className="text-sm">{question.explanation}</p>
            </div>
            <Button className="w-full" onClick={onNext}>
              {currentIndex < questions.length - 1 ? "次の問題" : "次へ進む"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
