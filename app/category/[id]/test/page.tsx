"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, Trophy, RotateCcw } from "lucide-react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { CategoryTest, QuestionResult } from "@/lib/test-data"
import type { Category } from "@/lib/training-data"
import { useAuth } from "@/lib/auth-context"
import { getCategoryByIdAction, getCategoryTestAction } from "@/app/actions/category-actions"
import { submitAndGradeTestAction } from "@/app/actions/training-actions"

type TestPhase = "intro" | "test" | "submitting" | "result"

interface GradingResult {
  score: number
  percentage: number
  passed: boolean
  correctCount: number
  incorrectCount: number
  questionResults: QuestionResult[]
}

export default function CategoryTestPage() {
  const params = useParams()
  const categoryId = params.id as string
  useAuth() // 認証コンテキストの初期化のみ（user は直接使用しない）

  const [test, setTest] = useState<CategoryTest | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<TestPhase>("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryData = await getCategoryByIdAction(categoryId)
        const testData = await getCategoryTestAction(categoryId)

        if (categoryData) setCategory(categoryData)
        if (testData) {
          setTest(testData)
          setTimeRemaining(testData.timeLimit * 60)
          setAnswers(new Array(testData.questions.length).fill(-1))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categoryId])

  const handleSubmitTest = useCallback(async () => {
    if (!test || phase === "submitting") return
    setPhase("submitting")

    const result = await submitAndGradeTestAction({
      categoryId: test.categoryId,
      duration: (test.timeLimit * 60) - timeRemaining,
      answers,
    })

    if (result.success && "questionResults" in result) {
      setGradingResult({
        score: result.score!,
        percentage: result.percentage!,
        passed: result.passed!,
        correctCount: result.correctCount!,
        incorrectCount: result.incorrectCount!,
        questionResults: result.questionResults!,
      })
      setPhase("result")
    } else {
      // エラー時はフォールバック
      setPhase("test")
      alert("採点に失敗しました。もう一度お試しください。")
    }
  }, [test, answers, timeRemaining, phase])

  // Timer
  useEffect(() => {
    if (phase !== "test" || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [phase, timeRemaining])

  // Auto-submit when time runs out
  useEffect(() => {
    if (phase === "test" && timeRemaining === 0 && test) {
      handleSubmitTest()
    }
  }, [phase, timeRemaining, test, handleSubmitTest])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTest = () => {
    setPhase("test")
    setCurrentQuestion(0)
  }

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !test) return

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleNavigateQuestion = (index: number) => {
    setSelectedAnswer(answers[index] >= 0 ? answers[index] : null)
    setCurrentQuestion(index)
  }

  const handleRetryTest = () => {
    if (!test) return
    setPhase("intro")
    setCurrentQuestion(0)
    setAnswers(new Array(test.questions.length).fill(-1))
    setSelectedAnswer(null)
    setTimeRemaining(test.timeLimit * 60)
    setGradingResult(null)
    setShowExplanation(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">テストデータを取得中...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!test || !category) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">テストが見つかりません</p>
            <Button asChild variant="outline">
              <Link href={`/category/${categoryId}`}>カテゴリに戻る</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const answeredCount = answers.filter((a) => a >= 0).length
  const progressPercentage = (answeredCount / test.questions.length) * 100

  // Intro phase
  if (phase === "intro") {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-12">
          <div className="mx-auto max-w-7xl px-4">
            <Link
              href={`/category/${categoryId}`}
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              カテゴリに戻る
            </Link>

            <Card className="mx-auto max-w-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <AlertCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{category.name} 修了テスト</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="text-2xl font-bold">{test.totalQuestions}</p>
                    <p className="text-sm text-muted-foreground">問題数</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="text-2xl font-bold">{test.timeLimit}分</p>
                    <p className="text-sm text-muted-foreground">制限時間</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="text-2xl font-bold">{test.passingScore}%</p>
                    <p className="text-sm text-muted-foreground">合格ライン</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <p className="text-2xl font-bold">1問2pt</p>
                    <p className="text-sm text-muted-foreground">配点</p>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleStartTest}>
                  テスト開始
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }


  // Submitting phase
  if (phase === "submitting") {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">採点中...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Result phase
  if (phase === "result" && gradingResult) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-12">
          <div className="mx-auto max-w-7xl px-4">
            <Card className="mx-auto max-w-2xl mb-8">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  {gradingResult.passed ? (
                    <Trophy className="h-10 w-10 text-yellow-500" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {gradingResult.passed ? "合格おめでとうございます！" : "不合格"}
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  {category.name} 修了テスト
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-5xl font-bold">{gradingResult.percentage}%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {gradingResult.correctCount} / {test.totalQuestions} 問正解（{gradingResult.score}pt）
                  </p>
                </div>
                <Progress value={gradingResult.percentage} className="h-3" />
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={handleRetryTest}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    再挑戦
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href={`/category/${categoryId}`}>カテゴリに戻る</Link>
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  {showExplanation ? "解説を閉じる" : "解説を見る"}
                </Button>
              </CardContent>
            </Card>

            {showExplanation && (
              <div className="mx-auto max-w-2xl space-y-4">
                {gradingResult.questionResults.map((qr, i) => (
                  <Card key={i} className={qr.isCorrect ? "border-green-200" : "border-red-200"}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 mb-4">
                        {qr.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-sm">問{i + 1}. {qr.question}</p>
                          <p className="text-xs text-muted-foreground mt-1">出典: {qr.source}</p>
                        </div>
                      </div>
                      <div className="space-y-2 ml-8">
                        {qr.options.map((opt, oi) => (
                          <div
                            key={oi}
                            className={`text-sm rounded-md px-3 py-2 ${
                              oi === qr.correctAnswer
                                ? "bg-green-50 text-green-700 font-medium"
                                : oi === qr.userAnswer && !qr.isCorrect
                                  ? "bg-red-50 text-red-700"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}) {opt}
                            {oi === qr.correctAnswer && " ✓"}
                            {oi === qr.userAnswer && oi !== qr.correctAnswer && " ✗"}
                          </div>
                        ))}
                      </div>
                      {qr.explanation && (
                        <div className="mt-3 ml-8 rounded-lg bg-secondary/50 p-3">
                          <p className="text-sm text-muted-foreground">{qr.explanation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }


  // Test phase
  const currentQ = test.questions[currentQuestion]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Timer bar */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{category.name} 修了テスト</span>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1 text-sm ${timeRemaining < 60 ? "text-red-500 font-bold" : ""}`}>
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </div>
              <span className="text-sm text-muted-foreground">
                {answeredCount}/{test.questions.length}問回答済
              </span>
            </div>
          </div>
          <Progress value={progressPercentage} className="mt-2 h-1" />
        </div>
      </div>

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    問題 {currentQuestion + 1} / {test.questions.length}
                  </span>
                  <span className="text-xs text-muted-foreground">{currentQ.source}</span>
                </div>
                <CardTitle className="text-lg mt-2">{currentQ.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={selectedAnswer !== null ? String(selectedAnswer) : undefined}
                  onValueChange={(v) => handleSelectAnswer(Number(v))}
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value={String(index)} id={`option-${index}`} className="mt-0.5 shrink-0" />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm leading-relaxed">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex gap-2">
                  {currentQuestion > 0 && (
                    <Button variant="outline" onClick={() => handleNavigateQuestion(currentQuestion - 1)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  {currentQuestion < test.questions.length - 1 ? (
                    <Button className="flex-1" onClick={handleConfirmAnswer} disabled={selectedAnswer === null}>
                      次の問題へ
                    </Button>
                  ) : (
                    <Button className="flex-1" onClick={handleConfirmAnswer} disabled={selectedAnswer === null}>
                      回答を確定
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Question navigation */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {test.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleNavigateQuestion(i)}
                  className={`h-8 w-8 rounded-full text-xs font-medium transition-colors ${
                    i === currentQuestion
                      ? "bg-primary text-primary-foreground"
                      : answers[i] >= 0
                        ? "bg-green-100 text-green-700"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Submit button */}
            {answeredCount === test.questions.length && (
              <div className="mt-6 text-center">
                <Button size="lg" onClick={handleSubmitTest}>
                  テストを提出する
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}