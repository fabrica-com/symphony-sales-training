"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, UserCheck, User } from "lucide-react"
import { getAllUsers, updateUserRole } from "@/app/actions/admin-actions"

interface User {
  id: string
  name: string | null
  email: string | null
  role: "employee" | "manager" | "admin"
  department: string | null
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const result = await getAllUsers()
    if (result.success && result.users) {
      setUsers(result.users as User[])
    }
    setLoading(false)
  }

  const handleRoleChange = async (userId: string, newRole: "employee" | "manager" | "admin") => {
    setUpdating((prev) => ({ ...prev, [userId]: true }))
    const result = await updateUserRole(userId, newRole)
    if (result.success) {
      // ローカル状態を更新
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      )
    } else {
      alert(`ロールの更新に失敗しました: ${result.error}`)
    }
    setUpdating((prev) => ({ ...prev, [userId]: false }))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "manager":
        return <UserCheck className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "管理者"
      case "manager":
        return "マネージャー"
      default:
        return "従業員"
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Users className="h-6 w-6" />
            ユーザー管理
          </h1>
          <p className="text-muted-foreground">
            登録ユーザーのロール（管理者・マネージャー・従業員）を切り替えできます
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              ユーザー一覧
            </CardTitle>
            <CardDescription>
              各ユーザーの権限を管理できます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>ユーザーが見つかりません</p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {user.name || user.email || "未設定"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {user.email || "メールアドレス未設定"}
                          </p>
                          {user.department && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">
                                {user.department}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          user.role === "admin"
                            ? "default"
                            : user.role === "manager"
                            ? "secondary"
                            : "outline"
                        }
                        className="flex items-center gap-1"
                      >
                        {getRoleIcon(user.role)}
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => handleRoleChange(user.id, "employee")}
                        disabled={
                          user.role === "employee" || updating[user.id]
                        }
                        variant={user.role === "employee" ? "default" : "outline"}
                        size="sm"
                      >
                        従業員
                      </Button>
                      <Button
                        onClick={() => handleRoleChange(user.id, "manager")}
                        disabled={
                          user.role === "manager" || updating[user.id]
                        }
                        variant={user.role === "manager" ? "default" : "outline"}
                        size="sm"
                      >
                        マネージャー
                      </Button>
                      <Button
                        onClick={() => handleRoleChange(user.id, "admin")}
                        disabled={user.role === "admin" || updating[user.id]}
                        variant={user.role === "admin" ? "default" : "outline"}
                        size="sm"
                      >
                        管理者
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

