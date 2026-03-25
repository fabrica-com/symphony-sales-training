import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MoodOption } from "@/lib/session-data/types"

interface CheckinPhaseProps {
  moodOptions: MoodOption[]
  selectedMood: number | null
  onMoodSelect: (index: number) => void
  onNext: () => void
}

export function CheckinPhase({ moodOptions, selectedMood, onMoodSelect, onNext }: CheckinPhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">おはようございます！今日の調子は？</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {moodOptions.map((option, index) => (
            <Button
              key={index}
              variant={selectedMood === index ? "default" : "outline"}
              className={cn("h-auto py-4 flex-col gap-2", selectedMood === index && "ring-2 ring-primary")}
              onClick={() => onMoodSelect(index)}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="text-sm">{option.label}</span>
            </Button>
          ))}
        </div>
        {selectedMood !== null && (
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            <p className="text-sm">{moodOptions[selectedMood].response}</p>
          </div>
        )}
        {selectedMood !== null && (
          <Button className="w-full" onClick={onNext}>
            次へ <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
