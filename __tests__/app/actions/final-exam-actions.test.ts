import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getFinalExamAction,
  submitAndGradeFinalExamAction,
  getFinalExamResultsAction,
  checkFinalExamPassedAction,
} from "@/app/actions/final-exam-actions"

vi.mock("@/lib/db/categories", () => ({
  getFinalExamFromDb: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

vi.mock("@/lib/auth-server", () => ({
  getCurrentUserId: vi.fn(),
}))

vi.mock("@/lib/notify-chatwork", () => ({
  notifyChatworkTaskCompleted: vi.fn(),
}))

import { getFinalExamFromDb } from "@/lib/db/categories"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUserId } from "@/lib/auth-server"
import { notifyChatworkTaskCompleted } from "@/lib/notify-chatwork"

describe("final-exam-actions.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getFinalExamAction", () => {
    it("修了テストが見つからない場合は null を返す", async () => {
      vi.mocked(getFinalExamFromDb).mockResolvedValue(null)

      const result = await getFinalExamAction()

      expect(result).toBeNull()
    })

    it("修了テストを取得し correctAnswer / explanation を除外する", async () => {
      const mockExam = {
        totalQuestions: 100,
        passingScore: 70,
        timeLimit: 120,
        questions: [
          {
            id: 1,
            question: "問題1",
            options: ["A", "B", "C", "D"],
            source: "テキスト",
            difficulty: "basic",
            correctAnswer: 0,
            explanation: "解説1",
          },
          {
            id: 2,
            question: "問題2",
            options: ["X", "Y", "Z", "W"],
            source: "テキスト2",
            difficulty: "advanced",
            correctAnswer: 2,
            explanation: "解説2",
          },
        ],
      }

      vi.mocked(getFinalExamFromDb).mockResolvedValue(mockExam as any)

      const result = await getFinalExamAction()

      expect(result).not.toBeNull()
      expect(result?.totalQuestions).toBe(100)
      expect(result?.passingScore).toBe(70)
      expect(result?.timeLimit).toBe(120)
      expect(result?.questions).toHaveLength(2)
      expect(result?.questions[0]).not.toHaveProperty("correctAnswer")
      expect(result?.questions[0]).not.toHaveProperty("explanation")
      expect(result?.questions[0]?.question).toBe("問題1")
      expect(result?.questions[0]?.options).toEqual(["A", "B", "C", "D"])
    })

    it("各問題の必要なフィールドが全て含まれている", async () => {
      const mockExam = {
        totalQuestions: 10,
        passingScore: 70,
        timeLimit: 60,
        questions: [
          {
            id: 1,
            question: "Q1",
            options: ["A", "B"],
            source: "Source",
            difficulty: "basic",
            correctAnswer: 0,
            explanation: "Exp",
          },
        ],
      }

      vi.mocked(getFinalExamFromDb).mockResolvedValue(mockExam as any)

      const result = await getFinalExamAction()

      expect(result?.questions[0]).toHaveProperty("id")
      expect(result?.questions[0]).toHaveProperty("question")
      expect(result?.questions[0]).toHaveProperty("options")
      expect(result?.questions[0]).toHaveProperty("source")
      expect(result?.questions[0]).toHaveProperty("difficulty")
    })
  })

  describe("submitAndGradeFinalExamAction", () => {
    it("修了テスト設定が見つからない場合はエラー", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "final_exam_config") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: "Not found" },
                  }),
                }),
              }),
            }
          }
          if (table === "final_exam_questions") {
            return {
              select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: [],
                  error: null,
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await submitAndGradeFinalExamAction({
        answers: [0, 1, 0],
        duration: 300,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe("Exam data not found")
    })

    it.skip("全問正解で合格", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockConfig = {
        passing_score: 70,
        total_questions: 3,
        time_limit: 60,
      }

      const mockQuestions = [
        {
          question_number: 1,
          question: "Q1",
          options: ["A", "B"],
          correct_answer: 0,
          explanation: "Exp1",
          source: "Source1",
        },
        {
          question_number: 2,
          question: "Q2",
          options: ["X", "Y"],
          correct_answer: 1,
          explanation: "Exp2",
          source: "Source2",
        },
        {
          question_number: 3,
          question: "Q3",
          options: ["P", "Q"],
          correct_answer: 0,
          explanation: "Exp3",
          source: "Source3",
        },
      ]

      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => {
          if (table === "final_exam_config") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockConfig,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "final_exam_questions") {
            return {
              select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockQuestions,
                  error: null,
                }),
              }),
            }
          }
          if (table === "final_exam_results") {
            return {
              insert: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
          if (table === "profiles") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { name: "John" },
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await submitAndGradeFinalExamAction({
        answers: [0, 1, 0],
        duration: 300,
      })

      expect(result.success).toBe(true)
      expect(result.saved).toBe(true)
      expect(result.score).toBe(3)
      expect(result.passed).toBe(true)
      expect(result.percentage).toBe(100)
    })

    it.skip("部分正解で不合格", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockConfig = {
        passing_score: 70,
        total_questions: 3,
        time_limit: 60,
      }

      const mockQuestions = [
        {
          question_number: 1,
          question: "Q1",
          options: ["A", "B"],
          correct_answer: 0,
          explanation: "Exp1",
          source: "Source1",
        },
        {
          question_number: 2,
          question: "Q2",
          options: ["X", "Y"],
          correct_answer: 1,
          explanation: "Exp2",
          source: "Source2",
        },
        {
          question_number: 3,
          question: "Q3",
          options: ["P", "Q"],
          correct_answer: 0,
          explanation: "Exp3",
          source: "Source3",
        },
      ]

      const mockSupabase = {
        from: vi.fn().mockImplementation((table) => {
          if (table === "final_exam_config") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockConfig,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "final_exam_questions") {
            return {
              select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockQuestions,
                  error: null,
                }),
              }),
            }
          }
          if (table === "final_exam_results") {
            return {
              insert: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
          if (table === "profiles") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { name: "John" },
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await submitAndGradeFinalExamAction({
        answers: [0, 0, 1], // 1問目と2問目が不正解
        duration: 300,
      })

      expect(result.success).toBe(true)
      expect(result.saved).toBe(true)
      expect(result.score).toBe(1)
      expect(result.passed).toBe(false)
      expect(result.percentage).toBeLessThan(70)
    })

    it("未ログイン状態でも採点は実行され保存はされない", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue(null)

      const mockConfig = {
        passing_score: 70,
        total_questions: 2,
        time_limit: 60,
      }

      const mockQuestions = [
        {
          question_number: 1,
          question: "Q1",
          options: ["A", "B"],
          correct_answer: 0,
          explanation: "Exp",
          source: "Source",
        },
        {
          question_number: 2,
          question: "Q2",
          options: ["X", "Y"],
          correct_answer: 1,
          explanation: "Exp",
          source: "Source",
        },
      ]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "final_exam_config") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockConfig,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "final_exam_questions") {
            return {
              select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockQuestions,
                  error: null,
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await submitAndGradeFinalExamAction({
        answers: [0, 1],
        duration: 300,
      })

      expect(result.success).toBe(true)
      expect(result.saved).toBe(false)
      expect(result.score).toBe(2)
    })

    it("DB保存エラーでも採点結果は返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockConfig = {
        passing_score: 70,
        total_questions: 1,
        time_limit: 60,
      }

      const mockQuestions = [
        {
          question_number: 1,
          question: "Q1",
          options: ["A", "B"],
          correct_answer: 0,
          explanation: "Exp",
          source: "Source",
        },
      ]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "final_exam_config") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockConfig,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "final_exam_questions") {
            return {
              select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockQuestions,
                  error: null,
                }),
              }),
            }
          }
          if (table === "final_exam_results") {
            return {
              insert: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Insert failed", code: "ERR001" },
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await submitAndGradeFinalExamAction({
        answers: [0],
        duration: 300,
      })

      expect(result.success).toBe(true)
      expect(result.saved).toBe(false)
      expect(result.saveError).toBeDefined()
      expect(result.score).toBe(1)
    })

    it("Chatwork通知エラーはログされ採点は続行", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockConfig = {
        passing_score: 70,
        total_questions: 1,
        time_limit: 60,
      }

      const mockQuestions = [
        {
          question_number: 1,
          question: "Q1",
          options: ["A", "B"],
          correct_answer: 0,
          explanation: "Exp",
          source: "Source",
        },
      ]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "final_exam_config") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockConfig,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "final_exam_questions") {
            return {
              select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockQuestions,
                  error: null,
                }),
              }),
            }
          }
          if (table === "final_exam_results") {
            return {
              insert: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
          if (table === "profiles") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { name: "John" },
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(notifyChatworkTaskCompleted).mockRejectedValue(new Error("API error"))

      const result = await submitAndGradeFinalExamAction({
        answers: [0],
        duration: 300,
      })

      expect(result.success).toBe(true)
      expect(result.saved).toBe(true)
      expect(result.score).toBe(1)
      expect(notifyChatworkTaskCompleted).toHaveBeenCalled()
    })

    it("回答が不足している場合は -1 で埋める", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockConfig = {
        passing_score: 70,
        total_questions: 3,
        time_limit: 60,
      }

      const mockQuestions = [
        {
          question_number: 1,
          question: "Q1",
          options: ["A", "B"],
          correct_answer: 0,
          explanation: "Exp",
          source: "Source",
        },
        {
          question_number: 2,
          question: "Q2",
          options: ["X", "Y"],
          correct_answer: 1,
          explanation: "Exp",
          source: "Source",
        },
        {
          question_number: 3,
          question: "Q3",
          options: ["P", "Q"],
          correct_answer: 0,
          explanation: "Exp",
          source: "Source",
        },
      ]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "final_exam_config") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockConfig,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "final_exam_questions") {
            return {
              select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockQuestions,
                  error: null,
                }),
              }),
            }
          }
          if (table === "final_exam_results") {
            return {
              insert: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
          if (table === "profiles") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { name: "John" },
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await submitAndGradeFinalExamAction({
        answers: [0, 1], // 3問目の回答がない
        duration: 300,
      })

      expect(result.success).toBe(true)
      expect(result.questions).toHaveLength(3)
      expect(result.questions[2]?.userAnswer).toBe(-1)
      expect(result.questions[2]?.isCorrect).toBe(false)
    })

    it("例外発生時はエラーを返す", async () => {
      vi.mocked(getCurrentUserId).mockRejectedValue(new Error("Auth error"))

      const result = await submitAndGradeFinalExamAction({
        answers: [0],
        duration: 300,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe("Failed to grade exam")
    })

    it("graded 配列に全問題の詳細が含まれている", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockConfig = {
        passing_score: 70,
        total_questions: 2,
        time_limit: 60,
      }

      const mockQuestions = [
        {
          question_number: 1,
          question: "Q1",
          options: ["A", "B"],
          correct_answer: 0,
          explanation: "Explanation 1",
          source: "Source 1",
        },
        {
          question_number: 2,
          question: "Q2",
          options: ["X", "Y"],
          correct_answer: 1,
          explanation: "Explanation 2",
          source: "Source 2",
        },
      ]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "final_exam_config") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockConfig,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "final_exam_questions") {
            return {
              select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockQuestions,
                  error: null,
                }),
              }),
            }
          }
          if (table === "final_exam_results") {
            return {
              insert: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
          if (table === "profiles") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { name: "John" },
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await submitAndGradeFinalExamAction({
        answers: [0, 0],
        duration: 300,
      })

      expect(result.questions).toHaveLength(2)
      expect(result.questions[0]).toHaveProperty("id")
      expect(result.questions[0]).toHaveProperty("question")
      expect(result.questions[0]).toHaveProperty("explanation")
      expect(result.questions[0]).toHaveProperty("userAnswer")
      expect(result.questions[0]).toHaveProperty("isCorrect")
    })
  })

  describe("getFinalExamResultsAction", () => {
    it("未ログイン状態では空配列を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue(null)

      const result = await getFinalExamResultsAction()

      expect(result).toEqual([])
    })

    it("ユーザーの修了テスト結果を取得", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockResults = [
        {
          id: 1,
          user_id: "user-123",
          completed_at: "2026-04-02T10:00:00Z",
          score: 80,
          percentage: 80,
          passed: true,
        },
        {
          id: 2,
          user_id: "user-123",
          completed_at: "2026-04-01T10:00:00Z",
          score: 60,
          percentage: 60,
          passed: false,
        },
      ]

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockResults,
                error: null,
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getFinalExamResultsAction()

      expect(result).toHaveLength(2)
      expect(result[0]?.score).toBe(80)
      expect(result[1]?.passed).toBe(false)
    })

    it("結果がない場合は空配列を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getFinalExamResultsAction()

      expect(result).toEqual([])
    })

    it("DBエラー時は空配列を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Connection failed" },
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getFinalExamResultsAction()

      expect(result).toEqual([])
    })

    it("例外発生時は空配列を返す", async () => {
      vi.mocked(getCurrentUserId).mockRejectedValue(new Error("Auth error"))

      const result = await getFinalExamResultsAction()

      expect(result).toEqual([])
    })
  })

  describe("checkFinalExamPassedAction", () => {
    it("未ログイン状態では false を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue(null)

      const result = await checkFinalExamPassedAction()

      expect(result).toBe(false)
    })

    it("合格している場合は true を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: [{ passed: true }],
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkFinalExamPassedAction()

      expect(result).toBe(true)
    })

    it("合格していない場合は false を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkFinalExamPassedAction()

      expect(result).toBe(false)
    })

    it("DBエラー時は false を返す", async () => {
      vi.mocked(getCurrentUserId).mockResolvedValue("user-123")

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn()
              .mockReturnValueOnce({
                eq: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: "Error" },
                  }),
                }),
              }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await checkFinalExamPassedAction()

      expect(result).toBe(false)
    })

    it("例外発生時は false を返す", async () => {
      vi.mocked(getCurrentUserId).mockRejectedValue(new Error("Auth error"))

      const result = await checkFinalExamPassedAction()

      expect(result).toBe(false)
    })
  })
})
