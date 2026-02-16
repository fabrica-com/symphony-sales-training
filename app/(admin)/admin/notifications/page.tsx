"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Save,
  Bot,
  Send,
  Users,
  MessageSquare,
  UserPlus,
  CheckCircle2,
} from "lucide-react"

// イベントタイプの定義
type EventType = "user_registered" | "task_completed" | "reflection_posted"

interface EventConfig {
  enabled: boolean
  roomId: string | null
  mentions: string[]
  messageTemplate: string
}

interface NotificationSettings {
  [key: string]: EventConfig
}

// モックデータ：Chatworkルーム一覧
const mockRooms = [
  { id: "room_001", name: "営業部全体" },
  { id: "room_002", name: "新人研修グループ" },
  { id: "room_003", name: "マネージャー会議" },
  { id: "room_004", name: "課題完了通知" },
]

// モックデータ：ルームメンバー一覧
const mockMembers: Record<string, Array<{ id: string; name: string; email: string }>> = {
  room_001: [
    { id: "user_001", name: "山田太郎", email: "yamada@example.com" },
    { id: "user_002", name: "佐藤花子", email: "sato@example.com" },
    { id: "user_003", name: "鈴木一郎", email: "suzuki@example.com" },
  ],
  room_002: [
    { id: "user_001", name: "山田太郎", email: "yamada@example.com" },
    { id: "user_004", name: "田中次郎", email: "tanaka@example.com" },
  ],
  room_003: [
    { id: "user_002", name: "佐藤花子", email: "sato@example.com" },
    { id: "user_005", name: "高橋三郎", email: "takahashi@example.com" },
  ],
  room_004: [
    { id: "user_002", name: "佐藤花子", email: "sato@example.com" },
  ],
}

// イベントのラベル
const eventLabels: Record<EventType, string> = {
  user_registered: "新規ユーザー登録",
  task_completed: "課題完了",
  reflection_posted: "感想投稿",
}

// デフォルトのメッセージテンプレート
const defaultTemplates: Record<EventType, string> = {
  user_registered: "{{name}}さんが新規登録しました！",
  task_completed: "{{name}}さんが課題を完了しました！",
  reflection_posted: "{{name}}さんが感想を投稿しました。",
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    user_registered: {
      enabled: false,
      roomId: null,
      mentions: [],
      messageTemplate: defaultTemplates.user_registered,
    },
    task_completed: {
      enabled: false,
      roomId: null,
      mentions: [],
      messageTemplate: defaultTemplates.task_completed,
    },
    reflection_posted: {
      enabled: false,
      roomId: null,
      mentions: [],
      messageTemplate: defaultTemplates.reflection_posted,
    },
  })

  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<Record<string, boolean>>({})
  const [botInviting, setBotInviting] = useState<Record<string, boolean>>({})
  const [botStatus, setBotStatus] = useState<Record<string, boolean>>({})

  // 初期化時にボットの参加状況をチェック（モック）
  useEffect(() => {
    // モック：一部のルームにはボットが参加済み
    setBotStatus({
      room_001: true,
      room_002: false,
      room_003: true,
      room_004: false,
    })
  }, [])

  const updateEventSetting = (
    eventType: EventType,
    updates: Partial<EventConfig>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [eventType]: {
        ...prev[eventType],
        ...updates,
      },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    // モック：保存処理
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert("設定を保存しました")
    setSaving(false)
  }

  const handleInviteBot = async (roomId: string) => {
    setBotInviting((prev) => ({ ...prev, [roomId]: true }))
    // モック：ボット招待処理
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setBotStatus((prev) => ({ ...prev, [roomId]: true }))
    setBotInviting((prev) => ({ ...prev, [roomId]: false }))
    alert("ボットを招待しました")
  }

  const handleTestSend = async (eventType: EventType) => {
    const config = settings[eventType]
    if (!config.enabled || !config.roomId) {
      alert("通知を有効にして、ルームを選択してください")
      return
    }

    setTesting((prev) => ({ ...prev, [eventType]: true }))
    // モック：テスト送信処理
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setTesting((prev) => ({ ...prev, [eventType]: false }))
    alert("テストメッセージを送信しました")
  }

  const toggleMention = (eventType: EventType, memberId: string) => {
    const config = settings[eventType]
    const mentions = config.mentions.includes(memberId)
      ? config.mentions.filter((id) => id !== memberId)
      : [...config.mentions, memberId]
    updateEventSetting(eventType, { mentions })
  }

  const getCurrentRoomMembers = (roomId: string | null) => {
    if (!roomId) return []
    return mockMembers[roomId] || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Chatwork通知設定
          </h1>
          <p className="text-muted-foreground">
            各イベントの通知設定を管理できます
          </p>
        </div>

        <div className="space-y-6">
          {/* 各イベントの設定カード */}
          {(Object.keys(eventLabels) as EventType[]).map((eventType) => {
            const config = settings[eventType]
            const roomMembers = getCurrentRoomMembers(config.roomId)
            const isBotInRoom = config.roomId ? botStatus[config.roomId] : false

            return (
              <Card key={eventType}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        {eventLabels[eventType]}
                      </CardTitle>
                      <CardDescription>
                        このイベント発生時にChatworkへ通知を送信します
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor={`switch-${eventType}`} className="cursor-pointer">
                        通知を有効にする
                      </Label>
                      <Switch
                        id={`switch-${eventType}`}
                        checked={config.enabled}
                        onCheckedChange={(checked) =>
                          updateEventSetting(eventType, { enabled: checked })
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {config.enabled && (
                    <>
                      {/* 通知先ルーム選択 */}
                      <div className="space-y-2">
                        <Label>通知先チャットルーム</Label>
                        <div className="flex items-center gap-3">
                          <Select
                            value={config.roomId || ""}
                            onValueChange={(value) =>
                              updateEventSetting(eventType, {
                                roomId: value,
                                mentions: [], // ルーム変更時はメンションをリセット
                              })
                            }
                          >
                            <SelectTrigger className="w-64">
                              <SelectValue placeholder="ルームを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockRooms.map((room) => (
                                <SelectItem key={room.id} value={room.id}>
                                  {room.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {config.roomId && !isBotInRoom && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleInviteBot(config.roomId!)}
                              disabled={botInviting[config.roomId!]}
                            >
                              {botInviting[config.roomId!] ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                                  招待中...
                                </>
                              ) : (
                                <>
                                  <Bot className="h-4 w-4 mr-2" />
                                  ボットを招待
                                </>
                              )}
                            </Button>
                          )}
                          {config.roomId && isBotInRoom && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              ボット参加済み
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* メンション設定 */}
                      {config.roomId && roomMembers.length > 0 && (
                        <div className="space-y-2">
                          <Label>宛先（メンション）</Label>
                          <div className="rounded-lg border p-4 space-y-2 max-h-48 overflow-y-auto">
                            {roomMembers.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center gap-2 p-2 rounded hover:bg-muted/50"
                              >
                                <Checkbox
                                  id={`mention-${eventType}-${member.id}`}
                                  checked={config.mentions.includes(member.id)}
                                  onCheckedChange={() =>
                                    toggleMention(eventType, member.id)
                                  }
                                />
                                <Label
                                  htmlFor={`mention-${eventType}-${member.id}`}
                                  className="cursor-pointer flex-1"
                                >
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {member.email}
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </div>
                          {config.mentions.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {config.mentions.length}人にメンションを送信します
                            </p>
                          )}
                        </div>
                      )}

                      {/* メッセージテンプレート */}
                      <div className="space-y-2">
                        <Label>通知メッセージ</Label>
                        <Textarea
                          value={config.messageTemplate}
                          onChange={(e) =>
                            updateEventSetting(eventType, {
                              messageTemplate: e.target.value,
                            })
                          }
                          placeholder="通知メッセージを入力..."
                          className="min-h-24"
                        />
                        <p className="text-xs text-muted-foreground">
                          使用可能な変数: <code className="bg-muted px-1 rounded">{"{{name}}"}</code>（ユーザー名）
                        </p>
                      </div>

                      {/* テスト送信 */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="font-medium">連携テスト</p>
                          <p className="text-sm text-muted-foreground">
                            実際にメッセージを送信して動作を確認できます
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handleTestSend(eventType)}
                          disabled={testing[eventType] || !config.roomId}
                        >
                          {testing[eventType] ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                              送信中...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              テスト送信
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {/* 保存ボタン */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} size="lg">
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      設定を保存
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

