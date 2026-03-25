import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const DEFAULT_ACTIONS = ["明日の商談で実践する", "チームに共有する", "資料にまとめる", "もう一度復習する"]

interface ActionPhaseProps {
  actionOptions?: string[]
  selectedAction: string | null
  onSelect: (action: string) => void
  onNext: () => void
}

export function ActionPhase({ actionOptions, selectedAction, onSelect, onNext }: ActionPhaseProps) {
  const options = actionOptions?.length ? actionOptions : DEFAULT_ACTIONS

  return (
    <Card>
      <CardHeader className="text-center">
        <Badge variant="outline" className="mx-auto mb-2">アクション宣言</Badge>
        <CardTitle className="text-xl">今日の実践アクション</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">今日学んだことを、どう活かしますか？</p>
        <div className="space-y-2">
          {options.map((action, index) => (
            <button
              key={index}
              className={cn(
                "w-full rounded-lg border p-4 text-left transition-colors",
                selectedAction === action
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
              )}
              onClick={() => onSelect(action)}
            >
              <div className="flex gap-3 items-start">
                <span className={cn(
                  "shrink-0 h-5 w-5 rounded-full border-2 mt-0.5 flex items-center justify-center",
                  selectedAction === action ? "border-primary bg-primary" : "border-muted-foreground"
                )}>
                  {selectedAction === action && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span className="text-sm leading-relaxed">{action}</span>
              </div>
            </button>
          ))}
        </div>
        {selectedAction && (
          <Button className="w-full" onClick={onNext}>
            宣言する (+20pt) <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
