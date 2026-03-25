import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardList, Send } from "lucide-react"

interface WorkPhaseProps {
  work: {
    title: string
    description: string
    fields: { label: string; placeholder: string }[]
  }
  workFields: Record<number, string>
  isComplete: boolean
  onFieldChange: (index: number, value: string) => void
  onSubmit: () => void
}

export function WorkPhase({ work, workFields, isComplete, onFieldChange, onSubmit }: WorkPhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <Badge variant="outline" className="mx-auto mb-2">
          <ClipboardList className="h-3 w-3 mr-1" />
          ワーク
        </Badge>
        <CardTitle className="text-xl">{work.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground text-center">{work.description}</p>
        <div className="space-y-4">
          {work.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium">{field.label}</label>
              {field.placeholder.length > 60 ? (
                <Textarea
                  placeholder={field.placeholder}
                  value={workFields[index] || ""}
                  onChange={(e) => onFieldChange(index, e.target.value)}
                  rows={3}
                />
              ) : (
                <Input
                  placeholder={field.placeholder}
                  value={workFields[index] || ""}
                  onChange={(e) => onFieldChange(index, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">書くことで記憶に定着します（+50pt）</p>
        <Button className="w-full" onClick={onSubmit} disabled={!isComplete}>
          <Send className="mr-2 h-4 w-4" />
          完了して次へ (+50pt)
        </Button>
      </CardContent>
    </Card>
  )
}
