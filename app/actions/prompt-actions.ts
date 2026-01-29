"use server"

import { generateText } from "ai"
import { getTrainingById } from "@/lib/training-data"
import { updateTrainingPrompt, getTrainingPrompt } from "@/lib/prompt-data"

export async function savePrompts(trainingId: number, roleplayPrompt: string, evaluationPrompt: string) {
  // プロンプトを保存（実際はDBに保存）
  updateTrainingPrompt(trainingId, { roleplayPrompt, evaluationPrompt })
  return { success: true }
}

export async function generatePromptWithAI(trainingId: number, type: "roleplay" | "evaluation"): Promise<string> {
  const result = getTrainingById(trainingId)
  if (!result) {
    throw new Error("研修が見つかりません")
  }

  const { training, category } = result
  const currentPrompt = getTrainingPrompt(trainingId)

  if (type === "roleplay") {
    // ロープレプロンプトを生成
    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: `あなたは営業研修のプロンプト設計の専門家です。
指定された研修内容に基づいて、リアルタイム音声AIがロールプレイで演じる顧客キャラクターのプロンプトを作成してください。

以下の要素を含めてください：
- 店舗設定（店舗名、規模、従業員数、主な課題）
- キャラクターの性格・態度
- 会話での反応パターン
- 研修テーマに関連した具体的なシナリオ

日本語で、実践的で具体的なプロンプトを作成してください。`,
      prompt: `以下の研修用のロープレプロンプトを作成してください。

【カテゴリ】${category.name}
【研修タイトル】${training.title}
【サブタイトル】${training.subtitle || "なし"}
【対象レベル】${training.level}
【研修の詳細】
${training.detail ? `目的: ${training.detail.purpose}\nゴール: ${training.detail.goal}` : "詳細情報なし"}

現在のプロンプト（参考）:
${currentPrompt.roleplayPrompt}`,
    })

    return text
  } else {
    // 評価プロンプトを生成
    const { text } = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: `あなたは営業研修の評価基準設計の専門家です。
指定された研修内容に基づいて、ロールプレイ後の評価に使用するシステムプロンプトを作成してください。

以下の要素を含めてください：
- 研修テーマに特化した評価観点
- 具体的な採点基準（点数配分）
- 評価のポイント
- フィードバックの出力形式

日本語で、公平で建設的な評価ができるプロンプトを作成してください。`,
      prompt: `以下の研修用の評価プロンプトを作成してください。

【カテゴリ】${category.name}
【研修タイトル】${training.title}
【サブタイトル】${training.subtitle || "なし"}
【対象レベル】${training.level}
【研修の詳細】
${training.detail ? `目的: ${training.detail.purpose}\nゴール: ${training.detail.goal}\nまとめ: ${training.detail.summary.join(", ")}` : "詳細情報なし"}

現在のプロンプト（参考）:
${currentPrompt.evaluationPrompt}`,
    })

    return text
  }
}
