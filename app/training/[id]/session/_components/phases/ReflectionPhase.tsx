import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ReflectionPhaseProps {
  question?: string
  placeholder?: string
  reflectionText: string
  onTextChange: (value: string) => void
  onSubmit: () => void
}

export function ReflectionPhase({
  question,
  placeholder,
  reflectionText,
  onTextChange,
  onSubmit,
}: ReflectionPhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <Badge variant="outline" className="mx-auto mb-2">リフレクション</Badge>
        <CardTitle className="text-xl">今日の学びを一言で</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          {question || "今日学んだことで、明日から実践したいことは？"}
        </p>
        <Textarea
          placeholder={placeholder || "自由に記入してください..."}
          value={reflectionText}
          onChange={(e) => onTextChange(e.target.value)}
          rows={4}
        />
        <p className="text-xs text-muted-foreground text-center">書くことで記憶に定着します（+10pt）</p>
        <Button className="w-full" onClick={onSubmit} disabled={!reflectionText.trim()}>
          <Send className="mr-2 h-4 w-4" />
          送信して次へ
        </Button>
      </CardContent>
    </Card>
  )
}
