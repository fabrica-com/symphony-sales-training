"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { saveTrainingSession, saveTestResult } from "@/app/actions/training-actions"
import { loadUserDataFromServer } from "@/app/actions/user-actions"

// --- Types ---
export interface User {
  id: string
  email: string
  name: string
  department: string
  joinDate: string
  role: "employee" | "manager" | "admin"
}

export interface TrainingLog {
  id: string
  odaiNumber: number
  trainingTitle: string
  categoryId: string
  categoryName: string
  completedAt: string
  score: number
  maxScore: number
  duration: number
  attemptNumber: number
  moodEmoji?: string
  moodLabel?: string
  reflectionText?: string
}

export interface UserProgress {
  odaiNumber: number
  completedCount: number
  bestScore: number
  lastCompletedAt: string
  totalTimeSpent: number
}

export interface TestResult {
  id: string
  categoryId: string
  categoryName: string
  completedAt: string
  score: number
  percentage: number
  passed: boolean
  correctCount: number
  totalQuestions: number
  duration: number
  attemptNumber: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  trainingLogs: TrainingLog[]
  userProgress: Record<number, UserProgress>
  addTrainingLog: (log: Omit<TrainingLog, "id" | "attemptNumber">) => Promise<void>
  testResults: TestResult[]
  addTestResult: (result: Omit<TestResult, "id" | "attemptNumber">, answers: number[]) => Promise<void>
  getTestResultsByCategory: (categoryId: string) => TestResult[]
  getBestTestResult: (categoryId: string) => TestResult | undefined
  getTotalPoints: () => number
  getCompletedTrainings: () => number
  getProgressPercentage: () => number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([])
  const [userProgress, setUserProgress] = useState<Record<number, UserProgress>>({})
  const [testResults, setTestResults] = useState<TestResult[]>([])

  // --- Data Loading Logic ---

  const loadUserDataFromDB = useCallback(async () => {
    try {
      const result = await loadUserDataFromServer()
      if (!result.success) return

      // Training Logs
      if (result.sessions) {
        const logs: TrainingLog[] = result.sessions.map((s: any) => ({
          id: s.id,
          odaiNumber: s.training_id,
          trainingTitle: s.training_title || `トレーニング ${s.training_id}`,
          categoryId: s.category_id,
          categoryName: s.category_name || "",
          completedAt: s.created_at,
          score: s.overall_score || 0,
          maxScore: s.max_score || 200,
          duration: s.duration_seconds || 0,
          attemptNumber: s.attempt_number || 1,
        }))
        setTrainingLogs(logs)
      }

      // User Progress
      if (result.progress) {
        const progressObj: Record<number, UserProgress> = {}
        result.progress.forEach((p: any) => {
          progressObj[p.training_id] = {
            odaiNumber: p.training_id,
            completedCount: p.completed_count || 1,
            bestScore: p.best_score || 0,
            lastCompletedAt: p.completed_at || p.updated_at,
            totalTimeSpent: p.total_time_spent || 0,
          }
        })
        setUserProgress(progressObj)
      }

      // Test Results
      if (result.tests) {
        const tests: TestResult[] = result.tests.map((t: any) => ({
          id: t.id,
          categoryId: t.category_id,
          categoryName: t.category_name || "",
          completedAt: t.created_at,
          score: t.score,
          percentage: t.percentage,
          passed: t.passed,
          correctCount: t.correct_count || 0,
          totalQuestions: t.total_questions || 0,
          duration: t.duration || 0,
          attemptNumber: t.attempt_number || 1,
        }))
        setTestResults(tests)
      }
    } catch (error) {
      console.error("[Auth] DB Load Error:", error)
    }
  }, [])

  const waitForProfile = useCallback(async (userId: string, maxRetries = 10): Promise<any> => {
    const supabaseClient = createClient()
    for (let i = 0; i < maxRetries; i++) {
      const { data: profile, error } = await supabaseClient.from("profiles").select("*").eq("id", userId).single()
      if (profile && !error) return profile
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected
        console.error("[Auth] Error fetching profile:", error)
      }
      if (i < maxRetries - 1) {
        await new Promise(res => setTimeout(res, 500))
      }
    }
    return null
  }, [])

  const handleUserSession = useCallback(async (session: any, isNewUser = false) => {
    if (!session?.user) {
      setUser(null)
      return
    }

    try {
      const supabaseClient = createClient()
      let profile = null
      if (isNewUser) {
        // 新規ユーザーの場合：プロファイルが作成されるまで待機
        profile = await waitForProfile(session.user.id)
      } else {
        // 既存ユーザーの場合：すぐにプロファイルを取得
        const { data, error } = await supabaseClient.from("profiles").select("*").eq("id", session.user.id).single()
        if (error && error.code !== 'PGRST116') {
          console.error("[Auth] Error fetching profile:", error)
        }
        profile = data
      }

      const userData: User = {
        id: session.user.id,
        email: session.user.email || "",
        name: profile?.name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || "ユーザー",
        department: profile?.department || "未設定",
        joinDate: profile?.join_date || new Date().toISOString().split("T")[0],
        role: profile?.role || "employee",
      }

      setUser(userData)
      await loadUserDataFromDB()
    } catch (e) {
      console.error("[Auth] Session Handler Error:", e)
    }
  }, [loadUserDataFromDB, waitForProfile])

  // --- Auth Lifecycle ---

  useEffect(() => {
    let mounted = true
    const supabaseClient = createClient()

    const initAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      if (mounted && session) {
        // 既存セッションの場合、プロファイルが存在するかチェック
        const { data: existingProfile } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
        const isNewUser = !existingProfile
        await handleUserSession(session, isNewUser)
      }
      if (mounted) setIsLoading(false)

      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return
        
        if (event === "INITIAL_SESSION" && session) {
          // 初期セッション（ページロード時）
          const { data: existingProfile } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
          const isNewUser = !existingProfile
          await handleUserSession(session, isNewUser)
          if (mounted) setIsLoading(false)
        } else if (event === "SIGNED_IN" && session) {
          // OAuthログインなど、新しいサインイン
          setIsLoading(true)
          // プロファイルが既に存在するかチェック（新規ユーザー判定）
          const { data: existingProfile } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
          const isNewUser = !existingProfile
          await handleUserSession(session, isNewUser)
          if (mounted) setIsLoading(false)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
          setTrainingLogs([])
          setUserProgress({})
          setTestResults([])
        }
      })

      return subscription
    }

    const subPromise = initAuth()
    return () => {
      mounted = false
      subPromise.then(sub => sub?.unsubscribe())
    }
  }, [handleUserSession])

  // --- Actions ---

  const loginWithGoogle = async (): Promise<void> => {
    const supabaseClient = createClient()
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "select_account" },
      },
    })
    if (error) {
      console.error("[v0] Google OAuth error:", error)
      throw error
    }
  }

  const logout = async () => {
    const supabaseClient = createClient()
    await supabaseClient.auth.signOut()
    window.location.href = "/login"
  }

  const addTrainingLog = async (log: Omit<TrainingLog, "id" | "attemptNumber">) => {
    if (!user) return
    const attemptNumber = trainingLogs.filter(l => l.odaiNumber === log.odaiNumber).length + 1
    
    const newLog: TrainingLog = { ...log, id: crypto.randomUUID(), attemptNumber }
    setTrainingLogs(prev => [newLog, ...prev])

    // Update Progress State
    const current = userProgress[log.odaiNumber]
    setUserProgress(prev => ({
      ...prev,
      [log.odaiNumber]: {
        odaiNumber: log.odaiNumber,
        completedCount: (current?.completedCount || 0) + 1,
        bestScore: Math.max(current?.bestScore || 0, log.score),
        lastCompletedAt: log.completedAt,
        totalTimeSpent: (current?.totalTimeSpent || 0) + log.duration,
      }
    }))

    await saveTrainingSession({
      odaiNumber: log.odaiNumber,
      trainingTitle: log.trainingTitle,
      categoryId: log.categoryId,
      categoryName: log.categoryName,
      score: log.score,
      maxScore: log.maxScore,
      duration: log.duration,
      attemptNumber,
      moodEmoji: log.moodEmoji,
      moodLabel: log.moodLabel,
      reflectionText: log.reflectionText,
    })
  }

  const addTestResult = async (result: Omit<TestResult, "id" | "attemptNumber">, answers: number[]) => {
    if (!user) return
    const attemptNumber = testResults.filter(t => t.categoryId === result.categoryId).length + 1

    // in-memory state は client 採点値で即時更新（表示用）
    const newResult: TestResult = { ...result, id: crypto.randomUUID(), attemptNumber }
    setTestResults(prev => [newResult, ...prev])

    // DB 保存はサーバー側で正解を取得して再採点
    await saveTestResult({
      categoryId: result.categoryId,
      duration: result.duration,
      attemptNumber,
      answers,
    })
  }

  // --- Getters ---
  const getTestResultsByCategory = (cid: string) => testResults.filter(t => t.categoryId === cid)
  const getBestTestResult = (cid: string) => {
    const res = getTestResultsByCategory(cid)
    return res.length ? res.reduce((a, b) => (a.percentage > b.percentage ? a : b)) : undefined
  }
  const getTotalPoints = () => trainingLogs.reduce((s, l) => s + l.score, 0)
  const getCompletedTrainings = () => Object.keys(userProgress).length
  const getProgressPercentage = () => Math.round((getCompletedTrainings() / 100) * 100)

  return (
    <AuthContext.Provider value={{
      user, isLoading, loginWithGoogle, logout, trainingLogs, userProgress,
      addTrainingLog, testResults, addTestResult, getTestResultsByCategory,
      getBestTestResult, getTotalPoints, getCompletedTrainings, getProgressPercentage
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
