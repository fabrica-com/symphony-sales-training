"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { saveTrainingSession, saveTestResult } from "@/app/actions/training-actions"
import { loadUserDataFromServer } from "@/app/actions/user-actions"

export interface User {
  id: string
  email: string
  name: string
  department: string
  joinDate: string
  role: "employee" | "manager" | "admin"
  authType: "supabase" | "demo" // 認証タイプを追跡
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
  duration: number // in seconds
  attemptNumber: number
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
  duration: number // in seconds
  attemptNumber: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  trainingLogs: TrainingLog[]
  userProgress: Map<number, UserProgress>
  addTrainingLog: (log: Omit<TrainingLog, "id" | "attemptNumber">) => Promise<void>
  testResults: TestResult[]
  addTestResult: (result: Omit<TestResult, "id" | "attemptNumber">) => Promise<void>
  getTestResultsByCategory: (categoryId: string) => TestResult[]
  getBestTestResult: (categoryId: string) => TestResult | undefined
  getTotalPoints: () => number
  getCompletedTrainings: () => number
  getProgressPercentage: () => number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for fallback testing
const DEMO_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "tanaka@example.com",
    password: "demo123",
    user: {
      id: "demo-user-1",
      email: "tanaka@example.com",
      name: "田中 太郎",
      department: "営業部",
      joinDate: "2024-04-01",
      role: "employee",
      authType: "demo",
    },
  },
  {
    email: "suzuki@example.com",
    password: "demo123",
    user: {
      id: "demo-user-2",
      email: "suzuki@example.com",
      name: "鈴木 花子",
      department: "営業部",
      joinDate: "2023-04-01",
      role: "employee",
      authType: "demo",
    },
  },
  {
    email: "yamada@example.com",
    password: "demo123",
    user: {
      id: "demo-user-3",
      email: "yamada@example.com",
      name: "山田 一郎",
      department: "営業部",
      joinDate: "2020-04-01",
      role: "manager",
      authType: "demo",
    },
  },
  {
    email: "admin@example.com",
    password: "admin123",
    user: {
      id: "demo-admin-1",
      email: "admin@example.com",
      name: "管理者",
      department: "人事部",
      joinDate: "2019-04-01",
      role: "admin",
      authType: "demo",
    },
  },
]

const STORAGE_KEYS = {
  USER: "symphony_user",
  LOGS: "symphony_training_logs",
  PROGRESS: "symphony_user_progress",
  TEST_RESULTS: "symphony_test_results",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([])
  const [userProgress, setUserProgress] = useState<Map<number, UserProgress>>(new Map())
  const [testResults, setTestResults] = useState<TestResult[]>([])

  // DB からユーザーデータを読み込む（Supabaseユーザー用、サーバーアクション経由でadmin keyを使用）
  const loadUserDataFromDB = async (userId: string) => {
    try {
      // Use server action to fetch data with admin privileges
      const result = await loadUserDataFromServer(userId)
      
      if (!result.success) {
        console.error("[v0] Failed to load user data:", result.error)
        return
      }

      // Process training sessions
      const sessions = result.sessions || []
      if (sessions.length > 0) {
        const logs: TrainingLog[] = sessions.map((s) => ({
          id: s.id,
          odaiNumber: s.training_id,
          trainingTitle: s.training_title || `トレーニング ${s.training_id}`,
          categoryId: s.category_id,
          categoryName: s.category_name || "",
          completedAt: s.created_at,
          score: s.overall_score || 0,
          maxScore: s.max_score || 200, // Use actual max_score from DB
          duration: s.duration_seconds || 0,
          attemptNumber: s.attempt_number || 1,
        }))
        setTrainingLogs(logs)
        console.log("[v0] Loaded training logs:", logs.length, "logs with total score:", logs.reduce((sum, l) => sum + l.score, 0))
      }

      // Process user progress
      const progress = result.progress || []
      if (progress.length > 0) {
        const progressMap = new Map<number, UserProgress>()
        progress.forEach((p) => {
          progressMap.set(p.training_id, {
            odaiNumber: p.training_id,
            completedCount: p.completed_count || 1,
            bestScore: p.best_score || 0,
            lastCompletedAt: p.completed_at || p.updated_at,
            totalTimeSpent: p.total_time_spent || 0,
          })
        })
        setUserProgress(progressMap)
      }

      // Process test results
      const tests = result.tests || []
      if (tests.length > 0) {
        const testResultsList: TestResult[] = tests.map((t) => ({
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
        setTestResults(testResultsList)
      }
    } catch (error) {
      console.error("[v0] Exception loading user data:", error)
    }
  }

  // localStorage からユーザーデータを読み込む（デモユーザー用）
  const loadUserDataFromLocalStorage = (userId: string) => {
    // Load training logs
    const storedLogs = localStorage.getItem(`${STORAGE_KEYS.LOGS}_${userId}`)
    if (storedLogs) {
      setTrainingLogs(JSON.parse(storedLogs))
    } else {
      setTrainingLogs([])
    }

    // Load user progress
    const storedProgress = localStorage.getItem(`${STORAGE_KEYS.PROGRESS}_${userId}`)
    if (storedProgress) {
      const progressArray: [number, UserProgress][] = JSON.parse(storedProgress)
      setUserProgress(new Map(progressArray))
    } else {
      setUserProgress(new Map())
    }

    // Load test results
    const storedTestResults = localStorage.getItem(`${STORAGE_KEYS.TEST_RESULTS}_${userId}`)
    if (storedTestResults) {
      setTestResults(JSON.parse(storedTestResults))
    } else {
      setTestResults([])
    }
  }

  // Load user and progress on mount - check Supabase first, then localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      // Small delay to ensure Supabase session is ready
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const supabase = createClient()
      
      // Check for existing Supabase session first
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Supabase user found - fetch profile from DB
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
        
        if (profile) {
          const supabaseUser: User = {
            id: session.user.id,
            email: session.user.email || "",
            name: profile.full_name || profile.email || "",
            department: profile.department || "未設定",
            joinDate: profile.created_at?.split("T")[0] || "",
            role: profile.role || "employee",
            authType: "supabase",
          }
          setUser(supabaseUser)
          console.log("[v0] Loading user data from DB for:", session.user.id)
          await loadUserDataFromDB(session.user.id)
          console.log("[v0] Supabase Auth: ユーザーセッション復元", session.user.email)
        }
      } else {
        // Check for demo user in localStorage as fallback
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          loadUserDataFromLocalStorage(parsedUser.id)
          console.log("[v0] Demo Auth (fallback): ローカルストレージからユーザー復元", parsedUser.email)
        }
      }
      
      setIsLoading(false)
    }
    
    initializeAuth()
    
    // Listen for Supabase auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Handle OAuth sign-in (e.g., Google)
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
        
        const supabaseUser: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email || "",
          department: profile?.department || "未設定",
          joinDate: profile?.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
          role: profile?.role || "employee",
          authType: "supabase",
        }
        
        setUser(supabaseUser)
        await loadUserDataFromDB(session.user.id)
        console.log("[v0] Supabase Auth: OAuthログイン成功", session.user.email)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setTrainingLogs([])
        setUserProgress(new Map())
        setTestResults([])
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadUserData = (userId: string) => {
    // Load training logs
    const storedLogs = localStorage.getItem(`${STORAGE_KEYS.LOGS}_${userId}`)
    if (storedLogs) {
      setTrainingLogs(JSON.parse(storedLogs))
    } else {
      setTrainingLogs([])
    }

    // Load user progress
    const storedProgress = localStorage.getItem(`${STORAGE_KEYS.PROGRESS}_${userId}`)
    if (storedProgress) {
      const progressArray: [number, UserProgress][] = JSON.parse(storedProgress)
      setUserProgress(new Map(progressArray))
    } else {
      setUserProgress(new Map())
    }

    // Load test results
    const storedTestResults = localStorage.getItem(`${STORAGE_KEYS.TEST_RESULTS}_${userId}`)
    if (storedTestResults) {
      setTestResults(JSON.parse(storedTestResults))
    } else {
      setTestResults([])
    }
  }

  const saveUserData = (
    userId: string,
    logs: TrainingLog[],
    progress: Map<number, UserProgress>,
    tests: TestResult[]
  ) => {
    localStorage.setItem(`${STORAGE_KEYS.LOGS}_${userId}`, JSON.stringify(logs))
    localStorage.setItem(`${STORAGE_KEYS.PROGRESS}_${userId}`, JSON.stringify(Array.from(progress.entries())))
    localStorage.setItem(`${STORAGE_KEYS.TEST_RESULTS}_${userId}`, JSON.stringify(tests))
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const supabase = createClient()
    
    // Try Supabase Auth first
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (data?.user && !error) {
      // Supabase login successful - fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()
      
      const supabaseUser: User = {
        id: data.user.id,
        email: data.user.email || "",
        name: profile?.full_name || profile?.email || email,
        department: profile?.department || "未設定",
        joinDate: profile?.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
        role: profile?.role || "employee",
        authType: "supabase",
      }
      
      setUser(supabaseUser)
      await loadUserDataFromDB(data.user.id)
      console.log("[v0] Supabase Auth: ログイン成功", email)
      return true
    }
    
    // Fallback to demo users
    const demoUser = DEMO_USERS.find((u) => u.email === email && u.password === password)
    
    if (demoUser) {
      setUser(demoUser.user)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser.user))
      // Set cookie for middleware to detect demo user
      document.cookie = `demo_user=${demoUser.user.id}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
      loadUserDataFromLocalStorage(demoUser.user.id)
      console.log("[v0] Demo Auth (fallback): デモユーザーでログイン", email)
      return true
    }
    
    console.log("[v0] Login failed: 認証失敗", email, error?.message)
    return false
  }

  const loginWithGoogle = async (): Promise<void> => {
    const supabase = createClient()
    
    // Get the current origin (works for both local and production)
    const redirectTo = `${window.location.origin}/auth/callback`
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })
    
    if (error) {
      console.error("[v0] Google OAuth error:", error)
      throw error
    }
    
    // OAuth will redirect automatically, so we don't need to do anything else here
  }

  const logout = async () => {
    const currentAuthType = user?.authType
    
    // Clear state
    setUser(null)
    setTrainingLogs([])
    setUserProgress(new Map())
    setTestResults([])
    localStorage.removeItem(STORAGE_KEYS.USER)
    // Clear demo user cookie
    document.cookie = "demo_user=; path=/; max-age=0"
    
    // Sign out from Supabase if was Supabase user
    if (currentAuthType === "supabase") {
      const supabase = createClient()
      await supabase.auth.signOut()
      console.log("[v0] Supabase Auth: ログアウト完了")
    } else {
      console.log("[v0] Demo Auth: ログアウト完了")
    }
  }

  const addTrainingLog = async (log: Omit<TrainingLog, "id" | "attemptNumber">) => {
    if (!user) return

    // Calculate attempt number
    const existingLogs = trainingLogs.filter((l) => l.odaiNumber === log.odaiNumber)
    const attemptNumber = existingLogs.length + 1

    const newLog: TrainingLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      attemptNumber,
    }

    const updatedLogs = [newLog, ...trainingLogs]
    setTrainingLogs(updatedLogs)

    // Update user progress
    const currentProgress = userProgress.get(log.odaiNumber)
    const newProgress: UserProgress = {
      odaiNumber: log.odaiNumber,
      completedCount: (currentProgress?.completedCount || 0) + 1,
      bestScore: Math.max(currentProgress?.bestScore || 0, log.score),
      lastCompletedAt: log.completedAt,
      totalTimeSpent: (currentProgress?.totalTimeSpent || 0) + log.duration,
    }

    const updatedProgress = new Map(userProgress)
    updatedProgress.set(log.odaiNumber, newProgress)
    setUserProgress(updatedProgress)

    // Save based on auth type
    if (user.authType === "supabase") {
      // Use server action to save (RLS disabled, passing userId)
      const result = await saveTrainingSession({
        userId: user.id,
        odaiNumber: log.odaiNumber,
        trainingTitle: log.trainingTitle,
        categoryId: log.categoryId,
        categoryName: log.categoryName,
        score: log.score,
        duration: log.duration,
        attemptNumber,
      })
      
      if (result.success) {
        console.log("[v0] Training log saved to DB:", log.trainingTitle)
      } else {
        console.log("[v0] Error saving training log:", result.error)
      }
    } else {
      // Demo user - save to localStorage
      saveUserData(user.id, updatedLogs, updatedProgress, testResults)
      console.log("[v0] Training log saved to localStorage (demo):", log.trainingTitle)
    }
  }

  const addTestResult = async (result: Omit<TestResult, "id" | "attemptNumber">) => {
    if (!user) return

    // Calculate attempt number for this category
    const existingTests = testResults.filter((t) => t.categoryId === result.categoryId)
    const attemptNumber = existingTests.length + 1

    const newResult: TestResult = {
      ...result,
      id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      attemptNumber,
    }

    const updatedTestResults = [newResult, ...testResults]
    setTestResults(updatedTestResults)

    // Save based on auth type
    if (user.authType === "supabase") {
      // Use server action to save (RLS disabled, passing userId)
      const serverResult = await saveTestResult({
        userId: user.id,
        categoryId: result.categoryId,
        categoryName: result.categoryName,
        score: result.score,
        percentage: result.percentage,
        passed: result.passed,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
        duration: result.duration,
        attemptNumber,
      })
      
      if (serverResult.success) {
        console.log("[v0] Test result saved to DB:", result.categoryName)
      } else {
        console.log("[v0] Error saving test result:", serverResult.error)
      }
    } else {
      // Demo user - save to localStorage
      saveUserData(user.id, trainingLogs, userProgress, updatedTestResults)
      console.log("[v0] Test result saved to localStorage (demo):", result.categoryName)
    }
  }

  const getTestResultsByCategory = (categoryId: string): TestResult[] => {
    return testResults.filter((t) => t.categoryId === categoryId)
  }

  const getBestTestResult = (categoryId: string): TestResult | undefined => {
    const categoryResults = getTestResultsByCategory(categoryId)
    if (categoryResults.length === 0) return undefined
    return categoryResults.reduce((best, current) =>
      current.percentage > best.percentage ? current : best
    )
  }

  const getTotalPoints = () => {
    return trainingLogs.reduce((sum, log) => sum + log.score, 0)
  }

  const getCompletedTrainings = () => {
    return userProgress.size
  }

  const getProgressPercentage = () => {
    // Assuming 100 total trainings
    const totalTrainings = 100
    return Math.round((userProgress.size / totalTrainings) * 100)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        trainingLogs,
        userProgress,
        addTrainingLog,
        testResults,
        addTestResult,
        getTestResultsByCategory,
        getBestTestResult,
        getTotalPoints,
        getCompletedTrainings,
        getProgressPercentage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
