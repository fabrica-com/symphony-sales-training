"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, Trophy, RotateCcw, GraduationCap } from "lucide-react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { getFinalExamAction, submitAndGradeFinalExamAction } from "@/app/actions/final-exam-actions"
import { getAllCategoryNamesAction } from "@/app/actions/category-actions"

// テスト中の問題（correctAnswer/explanationはサーバー側のみ）
export interface FinalExamQuestion {
  id: number
  question: string
  options: string[]
  source: string
  difficulty: "basic" | "intermediate" | "advanced"
}

// 採点後にサーバーから返される問題（正解・解説付き）
export interface GradedQuestion {
  id: number
  question: string
  options: string[]
  source: string
  correctAnswer: number
  explanation: string
  userAnswer: number
  isCorrect: boolean
}

export interface FinalExam {
  totalQuestions: number
  passingScore: number
  timeLimit: number
  questions: FinalExamQuestion[]
}

type TestPhase = "intro" | "test" | "result"

export default function FinalExamPage() {
  const { user } = useAuth()

  const [exam, setExam] = useState<FinalExam | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [phase, setPhase] = useState<TestPhase>("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [testResult, setTestResult] = useState<{
    score: number
    percentage: number
    passed: boolean
    correctCount: number
    incorrectCount: number
  } | null>(null)
  const [gradedQuestions, setGradedQuestions] = useState<GradedQuestion[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [examData, categoryNames] = await Promise.all([
          getFinalExamAction(),
          getAllCategoryNamesAction(),
        ])
        if (examData) {
          setExam(examData)
          setTimeRemaining(examData.timeLimit * 60)
          setAnswers(new Array(examData.questions.length).fill(-1))
        }
        setCategories(categoryNames)
      } catch (error) {
        console.error("Failed to fetch exam:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmitTest = useCallback(async () => {
    if (!exam || submitting) return
    setSubmitting(true)

    try {
      const result = await submitAndGradeFinalExamAction({
        answers,
        duration: (exam.timeLimit * 60) - timeRemaining,
      })

      if (result.success) {
        setTestResult({
          score: result.score,
          percentage: result.percentage,
          passed: result.passed,
          correctCount: result.score,
          incorrectCount: result.totalQuestions - result.score,
        })
        setGradedQuestions(result.questions)
        setPhase("result")
      } else {
        console.error("Failed to grade exam:", result.error)
      }
    } catch (error) {
      console.error("Failed to submit exam:", error)
    } finally {
      setSubmitting(false)
    }
  }, [exam, answers, timeRemaining, submitting])

  // Timer - moved after handleSubmitTest to avoid reference error
  useEffect(() => {
    if (phase !== "test" || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [phase, timeRemaining])

  // Auto-submit when time runs out
  useEffect(() => {
    if (phase === "test" && timeRemaining === 0 && exam) {
      handleSubmitTest()
    }
  }, [phase, timeRemaining, exam, handleSubmitTest])

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
    if (selectedAnswer === null || !exam) return

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleNavigateQuestion = (index: number) => {
    setSelectedAnswer(answers[index] >= 0 ? answers[index] : null)
    setCurrentQuestion(index)
  }

  const handleRetryTest = () => {
    if (!exam) return
    setPhase("intro")
    setCurrentQuestion(0)
    setAnswers(new Array(exam.questions.length).fill(-1))
    setSelectedAnswer(null)
    setTimeRemaining(exam.timeLimit * 60)
    setTestResult(null)
    setGradedQuestions([])
    setShowExplanation(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p>読み込み中...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p>修了テストが見つかりません</p>
        </main>
        <Footer />
      </div>
    )
  }

  const answeredCount = answers.filter((a) => a >= 0).length
  const progressPercentage = (answeredCount / exam.questions.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-secondary/30">
        {/* Intro Phase */}
        {phase === "intro" && (
          <div className="mx-auto max-w-7xl px-4 py-12">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              ホームに戻る
            </Link>

            <Card>
              <CardHeader className="text-center border-b bg-linear-to-r from-primary/10 to-primary/5">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <GraduationCap className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl">営業研修 修了テスト</CardTitle>
                <p className="text-muted-foreground mt-2">全カテゴリの研修内容と深掘り読み物の理解度を総合的に評価します</p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg border p-4">
                    <p className="text-3xl font-bold text-primary">{exam.totalQuestions}</p>
                    <p className="text-sm text-muted-foreground">問題数</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-3xl font-bold text-primary">{exam.timeLimit}分</p>
                    <p className="text-sm text-muted-foreground">制限時間</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-3xl font-bold text-primary">{exam.passingScore}%</p>
                    <p className="text-sm text-muted-foreground">合格ライン</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-3xl font-bold text-primary">4択</p>
                    <p className="text-sm text-muted-foreground">選択形式</p>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-amber-900">注意事項</p>
                      <ul className="mt-2 text-sm text-amber-800 space-y-1">
                        <li>- テスト開始後は中断できません</li>
                        <li>- 制限時間30分を過ぎると自動採点されます</li>
                        <li>- 深掘り読み物の内容からも出題されます</li>
                        <li>- 合格ラインは90%（90問以上正解）です</li>
                        <li>- 不合格の場合は再挑戦できます</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900">出題範囲</p>
                      <ul className="mt-2 text-sm text-blue-800 space-y-1">
                        {categories.map((cat) => (
                          <li key={cat.id}>- {cat.id}: {cat.name}</li>
                        ))}
                        <li>- 各カテゴリの深掘り読み物</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {!user && (
                  <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-orange-900">ログインのおすすめ</p>
                        <p className="mt-1 text-sm text-orange-800">
                          ログインするとテスト結果が保存され、修了証を発行できます。
                        </p>
                        <Link href="/login" className="text-sm text-orange-600 hover:underline mt-2 inline-block">
                          ログインはこちら
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleStartTest} size="lg" className="w-full">
                  修了テストを開始する
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Phase */}
        {phase === "test" && (
          <div className="mx-auto max-w-7xl px-4 py-6">
            {/* Header with timer and progress */}
            <div className="sticky top-16 z-40 bg-secondary/95 backdrop-blur -mx-4 px-4 py-4 mb-6 border-b">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">問題 {currentQuestion + 1} / {exam.questions.length}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    exam.questions[currentQuestion].difficulty === "advanced" 
                      ? "bg-red-100 text-red-700" 
                      : exam.questions[currentQuestion].difficulty === "intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {exam.questions[currentQuestion].difficulty === "advanced" ? "応用" : 
                     exam.questions[currentQuestion].difficulty === "intermediate" ? "標準" : "基礎"}
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${timeRemaining < 300 ? "text-red-600" : ""}`}>
                  <Clock className="h-4 w-4" />
                  <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                回答済み: {answeredCount} / {exam.questions.length}
              </p>
            </div>

            {/* Question */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <p className="text-xs text-muted-foreground mb-2">
                  出典: {exam.questions[currentQuestion].source}
                </p>
                <h2 className="text-lg font-medium mb-6">
                  {exam.questions[currentQuestion].question}
                </h2>

                <RadioGroup
                  value={selectedAnswer?.toString() ?? answers[currentQuestion]?.toString()}
                  onValueChange={(value) => handleSelectAnswer(parseInt(value))}
                  className="space-y-3"
                >
                  {exam.questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors cursor-pointer hover:bg-secondary/50 ${
                        (selectedAnswer === index || answers[currentQuestion] === index) ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleSelectAnswer(index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-0.5 shrink-0" />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer leading-relaxed">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => handleNavigateQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
              >
                前の問題
              </Button>
              
              {currentQuestion < exam.questions.length - 1 ? (
                <Button
                  onClick={handleConfirmAnswer}
                  disabled={selectedAnswer === null && answers[currentQuestion] < 0}
                >
                  次の問題へ
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (selectedAnswer !== null) {
                      const newAnswers = [...answers]
                      newAnswers[currentQuestion] = selectedAnswer
                      setAnswers(newAnswers)
                    }
                    handleSubmitTest()
                  }}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? "採点中..." : "テストを提出する"}
                </Button>
              )}
            </div>

            {/* Question Navigator */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">問題一覧</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-10 gap-2">
                  {exam.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigateQuestion(index)}
                      className={`h-8 w-8 rounded text-xs font-medium transition-colors ${
                        currentQuestion === index
                          ? "bg-primary text-primary-foreground"
                          : answers[index] >= 0
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Result Phase */}
        {phase === "result" && testResult && (
          <div className="mx-auto max-w-7xl px-4 py-12">
            <Card>
              <CardHeader className={`text-center border-b ${testResult.passed ? "bg-linear-to-r from-green-50 to-emerald-50" : "bg-linear-to-r from-red-50 to-orange-50"}`}>
                <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${
                  testResult.passed ? "bg-green-100" : "bg-red-100"
                } mb-4`}>
                  {testResult.passed ? (
                    <Trophy className="h-12 w-12 text-green-600" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-600" />
                  )}
                </div>
                <CardTitle className={`text-3xl ${testResult.passed ? "text-green-800" : "text-red-800"}`}>
                  {testResult.passed ? "合格！おめでとうございます！" : "不合格"}
                </CardTitle>
                <p className={`mt-2 ${testResult.passed ? "text-green-700" : "text-red-700"}`}>
                  {testResult.passed
                    ? "営業研修の全課程を修了しました。修了証を発行できます。"
                    : `合格ラインは${exam.passingScore}%です。深掘り読み物も含めて復習してから再挑戦してください。`}
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Score Summary */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg border p-4">
                    <p className={`text-4xl font-bold ${testResult.passed ? "text-green-600" : "text-red-600"}`}>
                      {testResult.percentage}%
                    </p>
                    <p className="text-sm text-muted-foreground">正答率</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-4xl font-bold text-green-600">{testResult.correctCount}</p>
                    <p className="text-sm text-muted-foreground">正解数</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-4xl font-bold text-red-600">{testResult.incorrectCount}</p>
                    <p className="text-sm text-muted-foreground">不正解数</p>
                  </div>
                </div>

                {/* Show/Hide Explanations */}
                <Button
                  variant="outline"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full"
                >
                  {showExplanation ? "解説を隠す" : "解説を表示する"}
                </Button>

                {/* Explanations */}
                {showExplanation && (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {gradedQuestions.map((question, index) => (
                        <div
                          key={question.id}
                          className={`rounded-lg border p-4 ${
                            question.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            {question.isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">問{index + 1}. {question.question}</p>
                              <p className="text-xs text-muted-foreground mt-1">出典: {question.source}</p>
                            </div>
                          </div>
                          {!question.isCorrect && (
                            <div className="ml-7 mt-2 text-sm">
                              <p className="text-red-700">
                                あなたの回答: {question.userAnswer >= 0 ? question.options[question.userAnswer] : "未回答"}
                              </p>
                              <p className="text-green-700 font-medium">
                                正解: {question.options[question.correctAnswer]}
                              </p>
                            </div>
                          )}
                          <p className="ml-7 mt-2 text-sm text-muted-foreground">
                            {question.explanation}
                          </p>
                        </div>
                    ))}
                  </div>
                )}

                {/* User Progress Saved */}
                {user && testResult.passed && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">修了おめでとうございます！</p>
                        <p className="text-sm text-green-800">テスト結果がダッシュボードに保存されました。</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  {!testResult.passed && (
                    <Button onClick={handleRetryTest} className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      再挑戦する
                    </Button>
                  )}
                  {user && (
                    <Button asChild variant={testResult.passed ? "default" : "outline"}>
                      <Link href="/dashboard">ダッシュボードで進捗を確認</Link>
                    </Button>
                  )}
                  <Button asChild variant="outline">
                    <Link href="/">ホームに戻る</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
