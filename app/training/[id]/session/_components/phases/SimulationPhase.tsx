import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SimulationScenario } from "@/lib/session-data/types"

interface SimulationPhaseProps {
  scenarios: SimulationScenario[]
  currentIndex: number
  answer: number | null
  showResult: boolean
  onAnswer: (index: number) => void
  onNext: () => void
}

export function SimulationPhase({
  scenarios,
  currentIndex,
  answer,
  showResult,
  onAnswer,
  onNext,
}: SimulationPhaseProps) {
  const scenario = scenarios[currentIndex]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">シミュレーション</Badge>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {scenarios.length}
          </span>
        </div>
        <CardTitle className="text-lg mt-2">{scenario.situation}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scenario.customerLine && (
          <div className="rounded-lg bg-secondary/30 p-4">
            <p className="text-sm font-medium mb-1">顧客:</p>
            <p className="text-sm">「{scenario.customerLine}」</p>
          </div>
        )}
        <p className="font-medium">あなたの対応は？</p>
        <div className="space-y-2">
          {scenario.options.map((option, index) => (
            <button
              key={index}
              className={cn(
                "w-full rounded-lg border p-4 text-left transition-colors",
                showResult
                  ? option.isCorrect
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
              <div className="flex gap-3">
                <span className={cn(
                  "shrink-0 h-6 w-6 rounded-full border flex items-center justify-center text-xs font-bold",
                  showResult
                    ? option.isCorrect
                      ? "border-green-500 bg-green-500 text-white"
                      : answer === index
                        ? "border-red-400 bg-red-400 text-white"
                        : "border-muted-foreground text-muted-foreground"
                    : answer === index
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                )}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm leading-relaxed">{option.text}</span>
              </div>
            </button>
          ))}
        </div>
        {showResult && answer !== null && (
          <>
            <div className={cn(
              "rounded-lg p-4",
              scenario.options[answer].isCorrect
                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
            )}>
              <p className="font-medium mb-1">
                {scenario.options[answer].isCorrect ? "正解！" : "惜しい！"}
              </p>
              <p className="text-sm">{scenario.options[answer].feedback}</p>
              <p className="text-sm mt-2 font-medium">+{scenario.options[answer].points}pt</p>
            </div>
            <Button className="w-full" onClick={onNext}>
              {currentIndex < scenarios.length - 1 ? "次のシナリオ" : "次へ進む"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
