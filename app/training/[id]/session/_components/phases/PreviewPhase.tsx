import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface PreviewPhaseProps {
  onNext: () => void
}

export function PreviewPhase({ onNext }: PreviewPhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <Badge className="mx-auto mb-4">NEXT MISSION</Badge>
        <CardTitle className="text-xl">明日の研修</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-secondary/50 p-6 text-center">
          <div className="text-4xl mb-2">🎬</div>
          <p className="font-medium">予告</p>
          <p className="text-sm text-muted-foreground mt-2">次の研修では新しいスキルを学びます。お楽しみに！</p>
        </div>
        <p className="text-sm text-center text-muted-foreground">明日9:00にリマインド通知します</p>
        <Button className="w-full" onClick={onNext}>
          次へ <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
