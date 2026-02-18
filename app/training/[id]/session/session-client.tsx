"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Star,
  CheckCircle2,
  Quote,
  Mic,
  Send,
  Volume2,
  ChevronRight,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Bookmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Training, Category } from "@/lib/training-data"
import type { SessionContent, DeepDiveReading } from "@/lib/session-data/types"
import { useAuth } from "@/lib/auth-context"

type SessionPhase =
  | "checkin"
  | "review"
  | "mission"
  | "story1"
  | "infographic"
  | "quickcheck"
  | "story2"
  | "quote"
  | "simulation"
  | "roleplay"
  | "work"
  | "reflection"
  | "complete"
  | "preview"
  | "action"
  | "deepdive"
  | "ending"

const phaseOrder: SessionPhase[] = [
  "checkin",
  "review",
  "mission",
  "story1",
  "infographic",
  "quickcheck",
  "story2",
  "quote",
  "simulation",
  "roleplay",
  "work",
  "reflection",
  "complete",
  "preview",
  "action",
  "deepdive",
  "ending",
]

interface SessionClientProps {
  training: Training
  category: Category
  sessionContent: SessionContent
  deepDiveContent?: DeepDiveReading | null
}

export function SessionClient({ training, category, sessionContent, deepDiveContent: deepDiveContentProp }: SessionClientProps) {
  const { user, addTrainingLog } = useAuth()
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>("checkin")
  const [points, setPoints] = useState(0)
  const [hasLoggedCompletion, setHasLoggedCompletion] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [reviewAnswer, setReviewAnswer] = useState<number | null>(null)
  const [showReviewResult, setShowReviewResult] = useState(false)
  const [storySceneIndex, setStorySceneIndex] = useState(0)
  const [quickCheckIndex, setQuickCheckIndex] = useState(0)
  const [quickCheckAnswer, setQuickCheckAnswer] = useState<number | null>(null)
  const [showQuickCheckResult, setShowQuickCheckResult] = useState(false)
  const [simulationIndex, setSimulationIndex] = useState(0)
  const [simulationAnswer, setSimulationAnswer] = useState<number | null>(null)
  const [showSimulationResult, setShowSimulationResult] = useState(false)
  const [roleplayIndex, setRoleplayIndex] = useState(0)
  const [roleplayDialogueIndex, setRoleplayDialogueIndex] = useState(0)
  const [roleplayUserInput, setRoleplayUserInput] = useState("")
  const [roleplayComplete, setRoleplayComplete] = useState(false)
  const [reflectionText, setReflectionText] = useState("")
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [workFields, setWorkFields] = useState<Record<number, string>>({})

  const [expandedSections, setExpandedSections] = useState<number[]>([])
  const [deepDiveRead, setDeepDiveRead] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Log training completion when reaching ending phase
  useEffect(() => {
    if (currentPhase === "ending" && !hasLoggedCompletion && user) {
      const simMax = (sessionContent.simulation ?? []).reduce(
        (sum, scene) =>
          sum + Math.max(0, ...scene.options.map((o) => o.points ?? 0)),
        0,
      )
      const computedMaxScore =
        10 + // mood
        10 + // reviewQuiz
        (sessionContent.quickCheck?.length ?? 0) * 15 + // quickCheck
        simMax + // simulation
        10 + // reflection
        20 // action

      const selectedMoodOption = selectedMood !== null ? sessionContent.moodOptions[selectedMood] : null
      addTrainingLog({
        odaiNumber: training.id,
        trainingTitle: training.title,
        categoryId: category.id,
        categoryName: category.name,
        completedAt: new Date().toISOString(),
        score: points,
        maxScore: computedMaxScore,
        duration: elapsedTime,
        moodEmoji: selectedMoodOption?.emoji,
        moodLabel: selectedMoodOption?.label,
        reflectionText: reflectionText || undefined,
      })
      setHasLoggedCompletion(true)
    }
  }, [currentPhase, hasLoggedCompletion, user, addTrainingLog, training, category, points, elapsedTime])

  const currentPhaseIndex = phaseOrder.indexOf(currentPhase)
  const progress = ((currentPhaseIndex + 1) / phaseOrder.length) * 100

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const deepDiveContent = deepDiveContentProp ?? null

  const goToNextPhase = () => {
    const currentIndex = phaseOrder.indexOf(currentPhase)
    if (currentIndex < phaseOrder.length - 1) {
      let nextIndex = currentIndex + 1
      // Skip phases if content is missing
      while (nextIndex < phaseOrder.length) {
        const nextPhase = phaseOrder[nextIndex]
        if (nextPhase === "review" && !sessionContent.reviewQuiz) {
          nextIndex++
        } else if (nextPhase === "story1" && !sessionContent.story?.part1) {
          nextIndex++
        } else if (nextPhase === "story2" && !sessionContent.story?.part2) {
          nextIndex++
        } else if (nextPhase === "work" && !sessionContent.work?.fields) {
          nextIndex++
        } else if (nextPhase === "deepdive" && !deepDiveContent) {
          nextIndex++
        } else if (nextPhase === "infographic" && !sessionContent.infographic) {
          nextIndex++
        } else if (nextPhase === "quickcheck" && !sessionContent.quickCheck) {
          nextIndex++
        } else if (nextPhase === "simulation" && !sessionContent.simulation) {
          nextIndex++
        } else if (nextPhase === "roleplay" && !sessionContent.roleplay) {
          nextIndex++
        } else {
          break
        }
      }
      if (nextIndex < phaseOrder.length) {
        setCurrentPhase(phaseOrder[nextIndex])
      }
    }
  }

  const handleMoodSelect = (index: number) => {
    setSelectedMood(index)
    setPoints((prev) => prev + 10)
  }

  const handleReviewAnswer = (index: number) => {
    setReviewAnswer(index)
    setShowReviewResult(true)
    if (sessionContent.reviewQuiz && index === sessionContent.reviewQuiz.correctIndex) {
      setPoints((prev) => prev + 10)
    }
  }

  const handleQuickCheckAnswer = (index: number) => {
    setQuickCheckAnswer(index)
    setShowQuickCheckResult(true)
    if (index === sessionContent.quickCheck[quickCheckIndex].correctIndex) {
      setPoints((prev) => prev + 15)
    }
  }

  const handleSimulationAnswer = (index: number) => {
    setSimulationAnswer(index)
    setShowSimulationResult(true)
    const option = sessionContent.simulation[simulationIndex].options[index]
    const pointsToAdd = option.points ?? (option.isCorrect ? 15 : 0)
    setPoints((prev) => prev + pointsToAdd)
  }

  const handleReflectionSubmit = () => {
    if (reflectionText.trim()) {
      setPoints((prev) => prev + 10)
      goToNextPhase()
    }
  }

  const handleActionSelect = (action: string) => {
    setSelectedAction(action)
    setPoints((prev) => prev + 20)
  }

  const handleWorkFieldChange = (index: number, value: string) => {
    setWorkFields((prev) => ({ ...prev, [index]: value }))
  }

  const handleWorkSubmit = () => {
    const filledFields = Object.values(workFields).filter((v) => v.trim()).length
    if (filledFields > 0) {
      setPoints((prev) => prev + 50)
      goToNextPhase()
    }
  }

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const expandAllSections = () => {
    if (deepDiveContent) {
      setExpandedSections(deepDiveContent.sections.map((_, i) => i))
    }
  }

  const handleDeepDiveComplete = () => {
    if (!deepDiveRead) {
      setDeepDiveRead(true)
      setPoints((prev) => prev + 30)
    }
    goToNextPhase()
  }

  const isWorkComplete = sessionContent.work?.fields
    ? sessionContent.work.fields.some((_, index) => workFields[index]?.trim())
    : false

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href={`/training/${training.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              終了
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                <Star className="h-4 w-4 fill-primary" />
                <span>{points}pt</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-2 h-1" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Phase 1: Checkin */}
        {currentPhase === "checkin" && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">おはようございます！今日の調子は？</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {sessionContent.moodOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedMood === index ? "default" : "outline"}
                    className={cn("h-auto py-4 flex-col gap-2", selectedMood === index && "ring-2 ring-primary")}
                    onClick={() => handleMoodSelect(index)}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-sm">{option.label}</span>
                  </Button>
                ))}
              </div>
              {selectedMood !== null && (
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-sm">{sessionContent.moodOptions[selectedMood].response}</p>
                </div>
              )}
              {selectedMood !== null && (
                <Button className="w-full" onClick={goToNextPhase}>
                  次へ <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Phase 1: Review Quiz */}
        {currentPhase === "review" && sessionContent.reviewQuiz && (
          <Card>
            <CardHeader className="text-center">
              <Badge variant="outline" className="mx-auto mb-2">
                昨日のおさらい
              </Badge>
              <CardTitle className="text-lg">{sessionContent.reviewQuiz.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {sessionContent.reviewQuiz.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      showReviewResult
                        ? index === sessionContent.reviewQuiz.correctIndex
                          ? "default"
                          : reviewAnswer === index
                            ? "destructive"
                            : "outline"
                        : reviewAnswer === index
                          ? "secondary"
                          : "outline"
                    }
                    className="w-full justify-start h-auto py-3 px-4 text-left"
                    onClick={() => !showReviewResult && handleReviewAnswer(index)}
                    disabled={showReviewResult}
                  >
                    <span className="mr-2 font-medium">{String.fromCharCode(65 + index)})</span>
                    <span className="flex-1">{option}</span>
                    {showReviewResult && index === sessionContent.reviewQuiz.correctIndex && (
                      <CheckCircle2 className="ml-2 h-5 w-5 flex-shrink-0" />
                    )}
                  </Button>
                ))}
              </div>
              {showReviewResult && (
                <>
                  <div
                    className={cn(
                      "rounded-lg p-4",
                      reviewAnswer === sessionContent.reviewQuiz.correctIndex
                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                        : "bg-red-500/10 text-red-700 dark:text-red-400",
                    )}
                  >
                    <p className="font-medium mb-1">
                      {reviewAnswer === sessionContent.reviewQuiz.correctIndex ? "正解！ +10pt" : "惜しい！"}
                    </p>
                    <p className="text-sm">{sessionContent.reviewQuiz.explanation}</p>
                  </div>
                  <Button className="w-full" onClick={goToNextPhase}>
                    次へ進む <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Phase 1: Mission */}
        {currentPhase === "mission" && (
          <Card>
            <CardHeader className="text-center">
              <Badge className="mx-auto mb-4">MISSION {training.id.toString().padStart(2, "0")}</Badge>
              <CardTitle className="text-2xl">{training.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-secondary/50 p-6 text-center">
                <div className="text-5xl mb-4">🎬</div>
                <p className="text-lg font-medium mb-2">健太の挑戦</p>
                <p className="text-sm text-muted-foreground">〜{sessionContent.keyPhrase}〜</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">今日学ぶこと:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ {sessionContent.keyPhrase}の意味と重要性</li>
                  <li>✓ 実践的なスキルの習得</li>
                  <li>✓ 明日から使えるアクション</li>
                </ul>
              </div>
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="text-sm">
                  クリアすると:{" "}
                  <span className="font-bold">
                    {sessionContent.badge.icon === "search" && "🔍"}
                    {sessionContent.badge.icon === "sparkles" && "✨"}
                    {sessionContent.badge.icon === "shield" && "🛡️"}
                    {sessionContent.badge.icon === "target" && "🎯"}
                    {sessionContent.badge.icon === "clock" && "⏰"}
                    {sessionContent.badge.icon === "megaphone" && "📢"}
                    {sessionContent.badge.icon === "battery" && "🔋"}
                    {sessionContent.badge.icon === "flame" && "🔥"}
                    {sessionContent.badge.icon === "eye" && "👁️"}
                    {sessionContent.badge.icon === "book" && "📚"}「{sessionContent.badge.name}」
                  </span>{" "}
                  バッジ獲得！
                </p>
              </div>
              <Button className="w-full" onClick={goToNextPhase}>
                研修を始める <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Phase 2: Story Part 1 */}
        {currentPhase === "story1" && sessionContent.story?.part1 && sessionContent.story.part1.length > 0 && sessionContent.story.part1[storySceneIndex] && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">ストーリー Part 1</Badge>
                <span className="text-sm text-muted-foreground">
                  {storySceneIndex + 1} / {sessionContent.story.part1.length}
                </span>
              </div>
              <CardTitle className="text-lg mt-2">{sessionContent.story.part1[storySceneIndex]?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-secondary/30 p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {sessionContent.story.part1[storySceneIndex]?.content}
                </pre>
              </div>
              <div className="flex gap-2">
                {storySceneIndex > 0 && (
                  <Button variant="outline" onClick={() => setStorySceneIndex((prev) => prev - 1)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (sessionContent.story?.part1 && storySceneIndex < sessionContent.story.part1.length - 1) {
                      setStorySceneIndex((prev) => prev + 1)
                    } else {
                      setStorySceneIndex(0)
                      setPoints((prev) => prev + 20)
                      goToNextPhase()
                    }
                  }}
                >
                  {sessionContent.story?.part1 && storySceneIndex < sessionContent.story.part1.length - 1 ? (
                    <>
                      次のシーン <ChevronRight className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      +20pt 次へ進む <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phase 2: Infographic */}
        {currentPhase === "infographic" && sessionContent.infographic && (
          <Card>
            <CardHeader className="text-center">
              <Badge variant="outline" className="mx-auto mb-2">
                知識インプット
              </Badge>
              <CardTitle className="text-lg">{sessionContent.infographic.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-secondary/50 p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-center">
                  {sessionContent.infographic.content}
                </pre>
              </div>
              <div className="rounded-lg bg-primary/10 border-2 border-primary/30 p-4 text-center">
                <p className="font-bold">💡 {sessionContent.infographic.highlight}</p>
              </div>
              {sessionContent.infographic.audioText && (
                <div className="flex items-start gap-3 rounded-lg bg-secondary/30 p-4">
                  <Volume2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{sessionContent.infographic.audioText}</p>
                </div>
              )}
              <Button className="w-full" onClick={goToNextPhase}>
                次へ <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Phase 2: Quick Check */}
        {currentPhase === "quickcheck" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">クイックチェック</Badge>
                <span className="text-sm text-muted-foreground">
                  {quickCheckIndex + 1} / {sessionContent.quickCheck.length}
                </span>
              </div>
              <CardTitle className="text-lg mt-2">{sessionContent.quickCheck[quickCheckIndex].question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {sessionContent.quickCheck[quickCheckIndex].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      showQuickCheckResult
                        ? index === sessionContent.quickCheck[quickCheckIndex].correctIndex
                          ? "default"
                          : quickCheckAnswer === index
                            ? "destructive"
                            : "outline"
                        : quickCheckAnswer === index
                          ? "secondary"
                          : "outline"
                    }
                    className="w-full justify-start h-auto py-3 px-4 text-left"
                    onClick={() => !showQuickCheckResult && handleQuickCheckAnswer(index)}
                    disabled={showQuickCheckResult}
                  >
                    <span className="mr-2 font-medium">{String.fromCharCode(65 + index)})</span>
                    <span className="flex-1">{option}</span>
                    {showQuickCheckResult && index === sessionContent.quickCheck[quickCheckIndex].correctIndex && (
                      <CheckCircle2 className="ml-2 h-5 w-5 flex-shrink-0" />
                    )}
                  </Button>
                ))}
              </div>
              {showQuickCheckResult && (
                <>
                  <div
                    className={cn(
                      "rounded-lg p-4",
                      quickCheckAnswer === sessionContent.quickCheck[quickCheckIndex].correctIndex
                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                        : "bg-red-500/10 text-red-700 dark:text-red-400",
                    )}
                  >
                    <p className="font-medium mb-1">
                      {quickCheckAnswer === sessionContent.quickCheck[quickCheckIndex].correctIndex
                        ? "正解！ +15pt"
                        : "惜しい！"}
                    </p>
                    <p className="text-sm">{sessionContent.quickCheck[quickCheckIndex].explanation}</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (quickCheckIndex < sessionContent.quickCheck.length - 1) {
                        setQuickCheckIndex((prev) => prev + 1)
                        setQuickCheckAnswer(null)
                        setShowQuickCheckResult(false)
                      } else {
                        goToNextPhase()
                      }
                    }}
                  >
                    {quickCheckIndex < sessionContent.quickCheck.length - 1 ? "次の問題" : "次へ進む"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Phase 2: Story Part 2 */}
        {currentPhase === "story2" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">ストーリー Part 2</Badge>
                <span className="text-sm text-muted-foreground">
                  {storySceneIndex + 1} / {sessionContent.story.part2.length}
                </span>
              </div>
              <CardTitle className="text-lg mt-2">{sessionContent.story.part2[storySceneIndex].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-secondary/30 p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {sessionContent.story.part2[storySceneIndex].content}
                </pre>
              </div>
              <div className="flex gap-2">
                {storySceneIndex > 0 && (
                  <Button variant="outline" onClick={() => setStorySceneIndex((prev) => prev - 1)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (storySceneIndex < sessionContent.story.part2.length - 1) {
                      setStorySceneIndex((prev) => prev + 1)
                    } else {
                      setStorySceneIndex(0)
                      setPoints((prev) => prev + 20)
                      goToNextPhase()
                    }
                  }}
                >
                  {storySceneIndex < sessionContent.story.part2.length - 1 ? (
                    <>
                      次のシーン <ChevronRight className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      +20pt 次へ進む <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentPhase === "quote" && (
          <Card>
            <CardHeader className="text-center">
              <Badge variant="outline" className="mx-auto mb-2">
                名言カード
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-secondary/50 p-8 text-center">
                <Quote className="h-8 w-8 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium italic mb-2">"{sessionContent.quote.text}"</p>
                <p className="text-sm text-muted-foreground mb-4">{sessionContent.quote.textJa}</p>
                <p className="text-sm text-muted-foreground">— {sessionContent.quote.author}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-4">
                <p className="text-sm">
                  💡 断られるたびに、あなたは「うまくいかない方法」を1つ学んでいる。それは前進です。
                </p>
              </div>
              <Button className="w-full" onClick={goToNextPhase}>
                次へ <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Phase 2: Key Phrase */}
        {currentPhase === "keyphrase" && (
          <Card>
            <CardHeader className="text-center">
              <Badge variant="outline" className="mx-auto mb-2">
                今日のキーフレーズ
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-primary/10 border-2 border-primary/30 p-8 text-center">
                <p className="text-xl font-bold">「{sessionContent.keyPhrase}」</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">一緒に声に出してみましょう！</p>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Mic className="h-4 w-4" />
                  録音開始
                </Button>
                <p className="text-xs text-muted-foreground mt-2">※声に出すと記憶定着率が2倍になります</p>
              </div>
              <Button className="w-full" onClick={goToNextPhase}>
                次へ <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Phase 3: Simulation */}
        {currentPhase === "simulation" && sessionContent.simulation && sessionContent.simulation.length > 0 && sessionContent.simulation[simulationIndex] && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">シミュレーション</Badge>
                <span className="text-sm text-muted-foreground">
                  {simulationIndex + 1} / {sessionContent.simulation.length}
                </span>
              </div>
              <CardTitle className="text-lg mt-2">{sessionContent.simulation[simulationIndex].situation}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionContent.simulation[simulationIndex].customerLine && (
                <div className="rounded-lg bg-secondary/30 p-4">
                  <p className="text-sm font-medium mb-1">顧客:</p>
                  <p className="text-sm">「{sessionContent.simulation[simulationIndex].customerLine}」</p>
                </div>
              )}
              <p className="font-medium">あなたの対応は？</p>
              <div className="space-y-2">
                {sessionContent.simulation[simulationIndex].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      showSimulationResult
                        ? option.isCorrect
                          ? "default"
                          : simulationAnswer === index
                            ? "destructive"
                            : "outline"
                        : simulationAnswer === index
                          ? "secondary"
                          : "outline"
                    }
                    className="w-full justify-start h-auto py-3 px-4 text-left"
                    onClick={() => !showSimulationResult && handleSimulationAnswer(index)}
                    disabled={showSimulationResult}
                  >
                    <span className="mr-2 font-medium">{String.fromCharCode(65 + index)})</span>
                    <span className="flex-1">{option.text}</span>
                  </Button>
                ))}
              </div>
              {showSimulationResult && (
                <>
                  <div
                    className={cn(
                      "rounded-lg p-4",
                      sessionContent.simulation[simulationIndex].options[simulationAnswer!].isCorrect
                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                    )}
                  >
                    <p className="font-medium mb-1">
                      {sessionContent.simulation[simulationIndex].options[simulationAnswer!].isCorrect
                        ? "正解！"
                        : "惜しい！"}
                    </p>
                    <p className="text-sm">
                      {sessionContent.simulation[simulationIndex].options[simulationAnswer!].feedback}
                    </p>
                    <p className="text-sm mt-2 font-medium">
                      +{sessionContent.simulation[simulationIndex].options[simulationAnswer!].points}pt
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (simulationIndex < sessionContent.simulation.length - 1) {
                        setSimulationIndex((prev) => prev + 1)
                        setSimulationAnswer(null)
                        setShowSimulationResult(false)
                      } else {
                        goToNextPhase()
                      }
                    }}
                  >
                    {simulationIndex < sessionContent.simulation.length - 1 ? "次のシナリオ" : "次へ進む"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Roleplay Phase */}
        {currentPhase === "roleplay" && sessionContent.roleplay && sessionContent.roleplay.length > 0 && sessionContent.roleplay[roleplayIndex] && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  <Mic className="h-3 w-3 mr-1" />
                  ロールプレイ
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {roleplayIndex + 1} / {sessionContent.roleplay.length}
                </span>
              </div>
              <CardTitle className="text-lg mt-2">{sessionContent.roleplay[roleplayIndex].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Situation */}
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium mb-2">シチュエーション</p>
                <p className="text-sm text-muted-foreground">{sessionContent.roleplay[roleplayIndex].situation}</p>
              </div>

              {/* Dialogue */}
              <div className="space-y-3">
                <p className="text-sm font-medium">会話の流れ</p>
                
                {/* Senior Opening */}
                {sessionContent.roleplay[roleplayIndex].seniorOpening && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-xs font-medium">先輩</span>
                    </div>
                    <div className="flex-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
                      <p className="text-sm">{sessionContent.roleplay[roleplayIndex].seniorOpening}</p>
                    </div>
                  </div>
                )}

                {/* Dialogue progression */}
                {sessionContent.roleplay[roleplayIndex].dialogue?.slice(0, roleplayDialogueIndex + 1).map((item, idx) => {
                  const speaker = String(item.speaker).toLowerCase().trim()
                  const isSenior = speaker === "senior" || speaker === "customer" || speaker === "先輩"
                  const isKenta = speaker === "kenta" || speaker === "sales" || speaker === "健太"
                  return (
                    <div key={idx} className={cn("flex gap-3", isKenta && "flex-row-reverse")}>
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        isSenior 
                          ? "bg-blue-100 dark:bg-blue-900/30" 
                          : "bg-green-100 dark:bg-green-900/30"
                      )}>
                        <span className="text-xs font-medium">{isSenior ? "先輩" : "健太"}</span>
                      </div>
                      <div className={cn(
                        "flex-1 rounded-lg p-3",
                        isSenior 
                          ? "bg-blue-50 dark:bg-blue-900/20" 
                          : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      )}>
                        <p className="text-sm">{item.line}</p>
                      </div>
                    </div>
                  )
                })}

                {/* Progress button for dialogue */}
                {!roleplayComplete && sessionContent.roleplay[roleplayIndex].dialogue && roleplayDialogueIndex < sessionContent.roleplay[roleplayIndex].dialogue.length - 1 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setRoleplayDialogueIndex(prev => prev + 1)}
                  >
                    次の会話を見る <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}

                {/* Mark as complete */}
                {!roleplayComplete && (!sessionContent.roleplay[roleplayIndex].dialogue || roleplayDialogueIndex >= sessionContent.roleplay[roleplayIndex].dialogue.length - 1) && (
                  <div className="space-y-3 pt-2">
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">学びのポイント</p>
                      <ul className="space-y-1">
                        {sessionContent.roleplay[roleplayIndex].keyPoints?.map((point, idx) => (
                          <li key={idx} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        setRoleplayComplete(true)
                        setPoints(prev => prev + 20)
                      }}
                    >
                      理解しました +20pt <CheckCircle2 className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Completed - move to next */}
                {roleplayComplete && (
                  <div className="space-y-3 pt-2">
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                      <CheckCircle2 className="h-8 w-8 mx-auto text-primary mb-2" />
                      <p className="font-medium">ロールプレイ完了！</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {sessionContent.roleplay[roleplayIndex].successCriteria}
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (roleplayIndex < sessionContent.roleplay!.length - 1) {
                          setRoleplayIndex(prev => prev + 1)
                          setRoleplayDialogueIndex(0)
                          setRoleplayComplete(false)
                        } else {
                          goToNextPhase()
                        }
                      }}
                    >
                      {roleplayIndex < sessionContent.roleplay!.length - 1 ? "次のロールプレイ" : "次へ進む"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentPhase === "work" && sessionContent.work?.fields && (
          <Card>
            <CardHeader className="text-center">
              <Badge variant="outline" className="mx-auto mb-2">
                <ClipboardList className="h-3 w-3 mr-1" />
                ワーク
              </Badge>
              <CardTitle className="text-xl">{sessionContent.work.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground text-center">{sessionContent.work.description}</p>
              <div className="space-y-4">
                {sessionContent.work.fields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.placeholder.length > 60 ? (
                      <Textarea
                        placeholder={field.placeholder}
                        value={workFields[index] || ""}
                        onChange={(e) => handleWorkFieldChange(index, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <Input
                        placeholder={field.placeholder}
                        value={workFields[index] || ""}
                        onChange={(e) => handleWorkFieldChange(index, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">書くことで記憶に定着します（+50pt）</p>
              <Button className="w-full" onClick={handleWorkSubmit} disabled={!isWorkComplete}>
                <Send className="mr-2 h-4 w-4" />
                完了して次へ (+50pt)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Phase 3: Reflection */}
        {currentPhase === "reflection" && (
          <Card>
            <CardHeader className="text-center">
              <Badge variant="outline" className="mx-auto mb-2">
                リフレクション
              </Badge>
              <CardTitle className="text-xl">今日の学びを一言で</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">{sessionContent.reflection?.question || "今日学んだことで、明日から実践したいことは？"}</p>
              <Textarea
                placeholder={sessionContent.reflection?.placeholder || "自由に記入してください..."}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-center">書くことで記憶に定着します（+10pt）</p>
              <Button className="w-full" onClick={handleReflectionSubmit} disabled={!reflectionText.trim()}>
                <Send className="mr-2 h-4 w-4" />
                送信して次へ
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Phase 4: Complete */}
        {currentPhase === "complete" && (
          <Card>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <CardTitle className="text-2xl">MISSION COMPLETE!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-lg">
                研修No.{training.id}「{training.title}」クリア！
              </p>
              <div className="rounded-lg bg-secondary/50 p-6">
                <div className="text-5xl mb-2">
                  {sessionContent.badge.icon === "search" && "🔍"}
                  {sessionContent.badge.icon === "sparkles" && "✨"}
                  {sessionContent.badge.icon === "shield" && "🛡️"}
                  {sessionContent.badge.icon === "target" && "🎯"}
                  {sessionContent.badge.icon === "clock" && "⏰"}
                  {sessionContent.badge.icon === "megaphone" && "📢"}
                  {sessionContent.badge.icon === "battery" && "🔋"}
                  {sessionContent.badge.icon === "flame" && "🔥"}
                  {sessionContent.badge.icon === "eye" && "👁️"}
                  {sessionContent.badge.icon === "book" && "📚"}
                </div>
                <p className="font-bold">「{sessionContent.badge.name}」</p>
                <p className="text-sm text-muted-foreground">バッジ獲得！</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">今日の獲得ポイント</p>
                <p className="text-3xl font-bold text-primary">+{points}pt</p>
              </div>
              <Button className="w-full" onClick={goToNextPhase}>
                次へ <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Phase 4: Preview */}
        {currentPhase === "preview" && (
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
              <Button className="w-full" onClick={goToNextPhase}>
                次へ <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Phase 4: Action */}
        {currentPhase === "action" && (
          <Card>
            <CardHeader className="text-center">
              <Badge variant="outline" className="mx-auto mb-2">
                アクション宣言
              </Badge>
              <CardTitle className="text-xl">今日の実践アクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">今日学んだことを、どう活かしますか？</p>
              <div className="space-y-2">
                {(sessionContent.actionOptions || ["明日の商談で実践する", "チームに共有する", "資料にまとめる", "もう一度復習する"]).map((action, index) => (
                  <Button
                    key={index}
                    variant={selectedAction === action ? "default" : "outline"}
                    className="w-full justify-start h-auto py-3 px-4 text-left"
                    onClick={() => handleActionSelect(action)}
                  >
                    {action}
                  </Button>
                ))}
              </div>
              {selectedAction && (
                <Button className="w-full" onClick={goToNextPhase}>
                  宣言する (+20pt) <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {currentPhase === "deepdive" && deepDiveContent && (
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <Badge variant="secondary">深掘り読み物</Badge>
              </div>
              <CardTitle className="text-xl leading-tight">{deepDiveContent.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{deepDiveContent.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Introduction */}
              <div className="rounded-lg bg-secondary/30 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-line">{deepDiveContent.introduction}</p>
              </div>

              {/* Expand all button */}
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={expandAllSections}>
                  すべて開く
                </Button>
              </div>

              {/* Sections as accordion */}
              <div className="space-y-2">
                {deepDiveContent.sections.map((section, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
                      onClick={() => toggleSection(index)}
                    >
                      <span className="font-medium text-sm">{section.title}</span>
                      {expandedSections.includes(index) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {expandedSections.includes(index) && (
                      <div className="px-4 pb-4 border-t">
                        <div className="pt-4 prose prose-sm max-w-none">
                          {section.content.split("\n\n").map((paragraph, pIndex) => {
                            // Handle blockquotes
                            if (paragraph.startsWith(">")) {
                              const quoteText = paragraph
                                .split("\n")
                                .map((line) => line.replace(/^>\s*/, ""))
                                .join("\n")
                              return (
                                <blockquote
                                  key={pIndex}
                                  className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground"
                                >
                                  {quoteText}
                                </blockquote>
                              )
                            }
                            // Handle bold headers
                            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                              return (
                                <h4 key={pIndex} className="font-bold mt-4 mb-2">
                                  {paragraph.replace(/\*\*/g, "")}
                                </h4>
                              )
                            }
                            // Handle lists
                            if (paragraph.includes("\n-")) {
                              const lines = paragraph.split("\n")
                              const title = lines[0]
                              const items = lines.slice(1).filter((l) => l.startsWith("-"))
                              return (
                                <div key={pIndex} className="my-3">
                                  {title && <p className="font-medium mb-2">{title.replace(/\*\*/g, "")}</p>}
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    {items.map((item, iIndex) => (
                                      <li key={iIndex}>{item.replace(/^-\s*/, "")}</li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            }
                            // Regular paragraphs
                            return (
                              <p key={pIndex} className="text-sm leading-relaxed my-2">
                                {paragraph
                                  .split("**")
                                  .map((part, partIndex) =>
                                    partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part,
                                  )}
                              </p>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Conclusion */}
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  おわりに
                </h4>
                <p className="text-sm leading-relaxed whitespace-pre-line">{deepDiveContent.conclusion}</p>
              </div>

              {/* References */}
              {deepDiveContent.references && (
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">参考文献</p>
                  <ul className="space-y-0.5">
                    {deepDiveContent.references.map((ref, index) => (
                      <li key={index}>・{ref}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action button */}
              <div className="pt-2">
                <p className="text-xs text-center text-muted-foreground mb-3">
                  深掘り読み物を読むと理解が深まります（+30pt）
                </p>
                <Button className="w-full" onClick={handleDeepDiveComplete}>
                  {deepDiveRead ? "読了済み" : "読了する (+30pt)"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phase 4: Ending */}
        {currentPhase === "ending" && (
          <Card>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <CardTitle className="text-2xl">今日もお疲れ様でした！</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="rounded-lg bg-primary/10 p-4">
                <p className="font-bold">「{sessionContent.keyPhrase}」</p>
              </div>

              {/* Score Summary */}
              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{points}</p>
                    <p className="text-xs text-muted-foreground">獲得ポイント</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
                    <p className="text-xs text-muted-foreground">学習時間</p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">
                今日も1歩、前に進みました。
                <br />
                明日も一緒に頑張りましょう！
              </p>

              {user && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                  <p className="text-sm text-green-800">学習履歴が保存されました</p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button className="w-full">ダッシュボードで進捗を確認</Button>
                    </Link>
                    <Link href={`/training/${training.id}`}>
                      <Button variant="outline" className="w-full bg-transparent">研修ページに戻る</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button className="w-full">ログインして進捗を記録</Button>
                    </Link>
                    <Link href={`/training/${training.id}`}>
                      <Button variant="outline" className="w-full bg-transparent">研修ページに戻る</Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
