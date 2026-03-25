import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Volume2 } from "lucide-react"

interface InfographicPhaseProps {
  infographic: {
    title: string
    content: string
    highlight: string
    audioText?: string
  }
  onNext: () => void
}

export function InfographicPhase({ infographic, onNext }: InfographicPhaseProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <Badge variant="outline" className="mx-auto mb-2">知識インプット</Badge>
        <CardTitle className="text-lg">{infographic.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-secondary/50 p-6">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-center">
            {infographic.content}
          </pre>
        </div>
        <div className="rounded-lg bg-primary/10 border-2 border-primary/30 p-4 text-center">
          <p className="font-bold">💡 {infographic.highlight}</p>
        </div>
        {infographic.audioText && (
          <div className="flex items-start gap-3 rounded-lg bg-secondary/30 p-4">
            <Volume2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm">{infographic.audioText}</p>
          </div>
        )}
        <Button className="w-full" onClick={onNext}>
          次へ <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
