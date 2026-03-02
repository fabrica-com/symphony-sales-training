"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, Trophy, RotateCcw } from "lucide-react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { calculateTestScore } from "@/lib/test-data"
import type { CategoryTest, Category } from "@/lib/db/types"
import { useAuth } from "@/lib/auth-context"
import { getCategoryByIdAction, getCategoryTestAction } from "@/app/actions/category-actions"

type TestPhase = "intro" | "test" | "result"

export default function CategoryTestPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string
  const { user, addTestResult } = useAuth()

  const [test, setTest] = useState<CategoryTest | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
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
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const categoryData = await getCategoryByIdAction(categoryId)
      const testData = await getCategoryTestAction(categoryId)
      
      if (categoryData) setCategory(categoryData)
      if (testData) {
        setTest(testData)
        setTimeRemaining(testData.timeLimit * 60)
        setAnswers(new Array(testData.questions.length).fill(-1))
      }
    }
    fetchData()
  }, [categoryId])

  const handleSubmitTest = useCallback(() => {
    if (!test) return
    
    const result = calculateTestScore(answers, test)
    setTestResult(result)
    setPhase("result")

    // Save test result if user is logged in（DB保存はサーバー再採点）
    if (user && addTestResult) {
      addTestResult({
        categoryId: test.categoryId,
        categoryName: test.categoryName,
        completedAt: new Date().toISOString(),
        score: result.score,
        percentage: result.percentage,
        passed: result.passed,
        correctCount: result.correctCount,
        totalQuestions: test.totalQuestions,
        duration: (test.timeLimit * 60) - timeRemaining,
      }, answers)
    }
  }, [test, answers, user, addTestResult, timeRemaining])

  // Timer
  useEffect(() => {
    if (phase !== "test" || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - submit test
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [phase, timeRemaining, handleSubmitTest])

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
    setTestResult(null)
    setShowExplanation(false)
  }

  if (!test || !category) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p>テストが見つかりません</p>
        </main>
        <Footer />
      </div>
    )
  }

  const answeredCount = answers.filter((a) => a >= 0).length
  const progressPercentage = (answeredCount / test.questions.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-secondary/30">
        {/* Intro Phase */}
        {phase === "intro" && (
          <div className="mx-auto max-w-3xl px-4 py-12">
            <Link
              href={`/category/${categoryId}`}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {category.name}に戻る
            </Link>

            <Card>
              <CardHeader className="text-center border-b">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-xl ${category.color} text-white mb-4`}>
                  <span className="text-2xl font-bold">{category.id}</span>
                </div>
                <CardTitle className="text-2xl">{category.name} 総合テスト</CardTitle>
                <p className="text-muted-foreground mt-2">研修内容と深掘り読み物の理解度を確認します</p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg border p-4">
                    <p className="text-3xl font-bold text-primary">{test.totalQuestions}</p>
                    <p className="text-sm text-muted-foreground">問題数</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-3xl font-bold text-primary">{test.timeLimit}分</p>
                    <p className="text-sm text-muted-foreground">制限時間</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-3xl font-bold text-primary">{test.passingScore}%</p>
                    <p className="text-sm text-muted-foreground">合格ライン</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-3xl font-bold text-primary">3〜4</p>
                    <p className="text-sm text-muted-foreground">選択肢数</p>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">注意事項</p>
                      <ul className="mt-2 text-sm text-amber-800 space-y-1">
                        <li>- テスト開始後は中断できません</li>
                        <li>- 制限時間を過ぎると自動的に採点されます</li>
                        <li>- 深掘り読み物の内容も出題されます</li>
                        <li>- 不合格の場合は再挑戦できます</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {!user && (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">ログインのおすすめ</p>
                        <p className="mt-1 text-sm text-blue-800">
                          ログインするとテスト結果が保存され、進捗を確認できます。
                        </p>
                        <Link href="/login" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                          ログインはこちら
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleStartTest} size="lg" className="w-full">
                  テストを開始する
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Phase */}
        {phase === "test" && (
          <div className="mx-auto max-w-4xl px-4 py-6">
            {/* Header with timer and progress */}
            <div className="sticky top-16 z-40 bg-secondary/95 backdrop-blur -mx-4 px-4 py-4 mb-6 border-b">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">問題 {currentQuestion + 1} / {test.questions.length}</span>
                </div>
                <div className={`flex items-center gap-2 ${timeRemaining < 300 ? "text-red-600" : ""}`}>
                  <Clock className="h-4 w-4" />
                  <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                回答済み: {answeredCount} / {test.questions.length}
              </p>
            </div>

            {/* Question */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <p className="text-xs text-muted-foreground mb-2">
                  出典: {test.questions[currentQuestion].source}
                </p>
                <h2 className="text-lg font-medium mb-6">
                  {test.questions[currentQuestion].question}
                </h2>

                <RadioGroup
                  value={selectedAnswer?.toString() ?? answers[currentQuestion]?.toString()}
                  onValueChange={(value) => handleSelectAnswer(parseInt(value))}
                  className="space-y-3"
                >
                  {test.questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors cursor-pointer hover:bg-secondary/50 ${
                        (selectedAnswer === index || answers[currentQuestion] === index) ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleSelectAnswer(index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
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
              
              {currentQuestion < test.questions.length - 1 ? (
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
                  className="bg-green-600 hover:bg-green-700"
                >
                  テストを提出する
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
                  {test.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigateQuestion(index)}
                      className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
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
          <div className="mx-auto max-w-3xl px-4 py-12">
            <Card>
              <CardHeader className={`text-center border-b ${testResult.passed ? "bg-green-50" : "bg-red-50"}`}>
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                  testResult.passed ? "bg-green-100" : "bg-red-100"
                } mb-4`}>
                  {testResult.passed ? (
                    <Trophy className="h-10 w-10 text-green-600" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-600" />
                  )}
                </div>
                <CardTitle className={`text-2xl ${testResult.passed ? "text-green-800" : "text-red-800"}`}>
                  {testResult.passed ? "合格！" : "不合格"}
                </CardTitle>
                <p className={`mt-2 ${testResult.passed ? "text-green-700" : "text-red-700"}`}>
                  {testResult.passed
                    ? `おめでとうございます！${category.name}の総合テストに合格しました。`
                    : `合格ラインは${test.passingScore}%です。深掘り読み物も含めて復習しましょう。`}
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Score Summary */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg border p-4">
                    <p className={`text-3xl font-bold ${testResult.passed ? "text-green-600" : "text-red-600"}`}>
                      {testResult.percentage}%
                    </p>
                    <p className="text-sm text-muted-foreground">正答率</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-3xl font-bold text-green-600">{testResult.correctCount}</p>
                    <p className="text-sm text-muted-foreground">正解数</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-3xl font-bold text-red-600">{testResult.incorrectCount}</p>
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
                    {test.questions.map((question, index) => {
                      const isCorrect = answers[index] === question.correctAnswer
                      return (
                        <div
                          key={question.id}
                          className={`rounded-lg border p-4 ${
                            isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            {isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            )}
                            <div>
                              <p className="font-medium text-sm">問{index + 1}. {question.question}</p>
                              <p className="text-xs text-muted-foreground mt-1">出典: {question.source}</p>
                            </div>
                          </div>
                          {!isCorrect && (
                            <div className="ml-7 mt-2 text-sm">
                              <p className="text-red-700">
                                あなたの回答: {answers[index] >= 0 ? question.options[answers[index]] : "未回答"}
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
                      )
                    })}
                  </div>
                )}

                {/* User Progress Saved */}
                {user && (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-800">
                      テスト結果がダッシュボードに保存されました。
                    </p>
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
                    <Link href={`/category/${categoryId}`}>{category.name}に戻る</Link>
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
