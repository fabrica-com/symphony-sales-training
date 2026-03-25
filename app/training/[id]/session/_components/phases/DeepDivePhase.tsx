import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Bookmark, ChevronDown, ChevronUp } from "lucide-react"
import { RichText } from "@/components/rich-text"
import type { DeepDiveReading } from "@/lib/session-data/types"

interface DeepDivePhaseProps {
  content: DeepDiveReading
  expandedSections: number[]
  deepDiveRead: boolean
  onToggleSection: (index: number) => void
  onExpandAll: () => void
  onComplete: () => void
}

export function DeepDivePhase({
  content,
  expandedSections,
  deepDiveRead,
  onToggleSection,
  onExpandAll,
  onComplete,
}: DeepDivePhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <Badge variant="secondary">深掘り読み物</Badge>
        </div>
        <CardTitle className="text-xl leading-tight">{content.title}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{content.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-secondary/30 p-4">
          <p className="text-sm leading-relaxed whitespace-pre-line">{content.introduction}</p>
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onExpandAll}>
            すべて開く
          </Button>
        </div>

        <div className="space-y-2">
          {content.sections.map((section, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
                onClick={() => onToggleSection(index)}
              >
                <span className="font-medium text-sm">{section.title}</span>
                {expandedSections.includes(index) ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>
              {expandedSections.includes(index) && (
                <div className="px-4 pb-4 border-t">
                  <div className="pt-4">
                    <RichText content={section.content} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
          <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            おわりに
          </h4>
          <RichText content={content.conclusion} />
        </div>

        {content.references && (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">参考文献</p>
            <ul className="space-y-0.5">
              {content.references.map((ref, index) => (
                <li key={index}>・{ref}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2">
          <p className="text-xs text-center text-muted-foreground mb-3">
            深掘り読み物を読むと理解が深まります（+30pt）
          </p>
          <Button className="w-full" onClick={onComplete}>
            {deepDiveRead ? "読了済み" : "読了する (+30pt)"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
