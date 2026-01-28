"use client"

import { useState, useTransition } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Sparkles, RotateCcw, Mic, ClipboardCheck, Loader2 } from "lucide-react"
import { type TrainingPrompt, defaultRoleplayPrompt, defaultEvaluationPrompt } from "@/lib/prompt-data"
import { savePrompts, generatePromptWithAI } from "@/app/actions/prompt-actions"

interface PromptEditorProps {
  trainingId: number
  initialPromptData: TrainingPrompt
}

export function PromptEditor({ trainingId, initialPromptData }: PromptEditorProps) {
  const [roleplayPrompt, setRoleplayPrompt] = useState(initialPromptData.roleplayPrompt)
  const [evaluationPrompt, setEvaluationPrompt] = useState(initialPromptData.evaluationPrompt)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const [isSaving, startSaveTransition] = useTransition()
  const [isGeneratingRoleplay, startGenerateRoleplayTransition] = useTransition()
  const [isGeneratingEvaluation, startGenerateEvaluationTransition] = useTransition()

  const handleSave = () => {
    startSaveTransition(async () => {
      try {
        await savePrompts(trainingId, roleplayPrompt, evaluationPrompt)
        setSavedAt(new Date().toLocaleString("ja-JP"))
      } catch (error) {
        console.error("保存に失敗しました:", error)
      }
    })
  }

  const handleGenerate = (type: "roleplay" | "evaluation") => {
    if (type === "roleplay") {
      startGenerateRoleplayTransition(async () => {
        try {
          const result = await generatePromptWithAI(trainingId, type)
          setRoleplayPrompt(result)
        } catch (error) {
          console.error("生成に失敗しました:", error)
        }
      })
    } else {
      startGenerateEvaluationTransition(async () => {
        try {
          const result = await generatePromptWithAI(trainingId, type)
          setEvaluationPrompt(result)
        } catch (error) {
          console.error("生成に失敗しました:", error)
        }
      })
    }
  }

  const handleReset = (type: "roleplay" | "evaluation") => {
    if (type === "roleplay") {
      setRoleplayPrompt(defaultRoleplayPrompt)
    } else {
      setEvaluationPrompt(defaultEvaluationPrompt)
    }
  }

  const isGenerating = isGeneratingRoleplay || isGeneratingEvaluation

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">プロンプト設定</h2>
          <p className="text-sm text-muted-foreground mt-1">AIロープレと評価に使用するプロンプトを編集できます</p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && <span className="text-sm text-muted-foreground">最終保存: {savedAt}</span>}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="ml-2">保存</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="roleplay" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roleplay" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            ロープレプロンプト
          </TabsTrigger>
          <TabsTrigger value="evaluation" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            AI評価プロンプト
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roleplay">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-primary" />
                    リアルタイムAPI ロープレプロンプト
                  </CardTitle>
                  <CardDescription className="mt-1">
                    AIがロールプレイで演じるキャラクターの設定を記述します。
                    顧客役の性格、店舗設定、会話のルールなどを指定してください。
                  </CardDescription>
                </div>
                <Badge variant="outline">リアルタイム音声API</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={roleplayPrompt}
                onChange={(e) => setRoleplayPrompt(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="ロープレプロンプトを入力..."
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleGenerate("roleplay")} disabled={isGenerating}>
                  {isGeneratingRoleplay ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="ml-2">AIで生成</span>
                </Button>
                <Button variant="ghost" onClick={() => handleReset("roleplay")}>
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-2">デフォルトに戻す</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    AI評価システムプロンプト
                  </CardTitle>
                  <CardDescription className="mt-1">
                    ロープレ終了後の評価に使用するプロンプトです。
                    評価観点、採点基準、フィードバックの形式などを指定してください。
                  </CardDescription>
                </div>
                <Badge variant="outline">Claude API</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={evaluationPrompt}
                onChange={(e) => setEvaluationPrompt(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="評価プロンプトを入力..."
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handleGenerate("evaluation")} disabled={isGenerating}>
                  {isGeneratingEvaluation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="ml-2">AIで生成</span>
                </Button>
                <Button variant="ghost" onClick={() => handleReset("evaluation")}>
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-2">デフォルトに戻す</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">処理フロー</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Badge variant="secondary">1. リアルタイムAPIで会話</Badge>
            <span>→</span>
            <Badge variant="secondary">2. 録音・文字起こし</Badge>
            <span>→</span>
            <Badge variant="secondary">3. 要約</Badge>
            <span>→</span>
            <Badge variant="secondary">4. Claude APIで評価</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
