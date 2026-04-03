import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getCategoryByIdFromDb,
  getCategoryTestFromDb,
  getDeepDiveContentFromDb,
  getCategoryDeepDiveFromDb,
  getFinalExamFromDb,
} from "@/lib/db/categories"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

import { createClient } from "@/lib/supabase/server"

describe("db/categories.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getCategoryByIdFromDb", () => {
    it("カテゴリが見つからない場合は null を返す", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Not found" },
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCategoryByIdFromDb("invalid-id")

      expect(result).toBeNull()
    })

    it("カテゴリを正しく取得する", async () => {
      const mockCategory = {
        id: "A",
        name: "基礎マインドセット",
        description: "基本的な知識",
        total_duration: 120,
        target_level: "beginner",
        color: "blue",
      }

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "training_categories") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockCategory,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "trainings") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "deep_dive_contents") {
            return {
              select: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({
                  count: 0,
                  error: null,
                }),
              }),
            }
          }
          if (table === "category_deep_dive_contents") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  count: 0,
                  error: null,
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCategoryByIdFromDb("A")

      expect(result).not.toBeNull()
      expect(result?.id).toBe("A")
      expect(result?.name).toBe("基礎マインドセット")
      expect(result?.totalDuration).toBe(120)
      expect(result?.color).toBe("blue")
    })

    it("カテゴリにトレーニングが含まれる", async () => {
      const mockCategory = {
        id: "A",
        name: "基礎",
        description: "基本",
        total_duration: 120,
        target_level: "beginner",
        color: "blue",
      }

      const mockTrainings = [
        {
          id: 1,
          title: "研修1",
          subtitle: "入門",
          duration: 60,
          level: "beginner",
          detail: "詳細1",
        },
        {
          id: 2,
          title: "研修2",
          subtitle: "中級",
          duration: 60,
          level: "intermediate",
          detail: "詳細2",
        },
      ]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "training_categories") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockCategory,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "trainings") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockTrainings,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "deep_dive_contents") {
            return {
              select: vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({
                  count: 0,
                  error: null,
                }),
              }),
            }
          }
          if (table === "category_deep_dive_contents") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  count: 0,
                  error: null,
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCategoryByIdFromDb("A")

      expect(result?.trainings).toHaveLength(2)
      expect(result?.trainings[0]?.id).toBe(1)
      expect(result?.trainings[1]?.title).toBe("研修2")
    })
  })

  describe("getCategoryTestFromDb", () => {
    it("テストが見つからない場合は null を返す", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: "PGRST116" }, // 正常な「見つからない」エラー
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCategoryTestFromDb("A")

      expect(result).toBeNull()
    })

    it("カテゴリテストと問題を正しく取得", async () => {
      const mockTestConfig = {
        id: 1,
        category_id: "A",
        category_name: "基礎",
        total_questions: 50,
        passing_score: 60,
        time_limit: 30,
      }

      const mockQuestions = [
        {
          question_number: 1,
          question: "問題1",
          options: ["A", "B", "C", "D"],
          correct_answer: 0,
          explanation: "解説1",
          source: "テキスト1",
        },
        {
          question_number: 2,
          question: "問題2",
          options: ["選択1", "選択2", "選択3", "選択4"],
          correct_answer: 1,
          explanation: "解説2",
          source: "テキスト2",
        },
      ]

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "category_tests") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockTestConfig,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "category_test_questions") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockQuestions,
                    error: null,
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCategoryTestFromDb("A")

      expect(result).not.toBeNull()
      expect(result?.categoryId).toBe("A")
      expect(result?.totalQuestions).toBe(50)
      expect(result?.passingScore).toBe(60)
      expect(result?.questions).toHaveLength(2)
      expect(result?.questions[0]?.question).toBe("問題1")
      expect(result?.questions[1]?.correctAnswer).toBe(1)
    })

    it("問題取得エラー時は null を返す", async () => {
      const mockTestConfig = {
        id: 1,
        category_id: "A",
        category_name: "基礎",
        total_questions: 50,
        passing_score: 60,
        time_limit: 30,
      }

      const mockSupabase = {
        from: vi.fn((table) => {
          if (table === "category_tests") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockTestConfig,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === "category_test_questions") {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: "Error" },
                  }),
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCategoryTestFromDb("A")

      expect(result).toBeNull()
    })
  })

  describe("getDeepDiveContentFromDb", () => {
    it("Deep Dive コンテンツを正しく取得", async () => {
      const mockContent = {
        id: 1,
        training_id: 42,
        title: "深掘り1",
        subtitle: "詳細解説",
        introduction: "はじめに",
        sections: [
          { title: "セクション1", content: "内容1" },
          { title: "セクション2", content: "内容2" },
        ],
        conclusion: "まとめ",
        reference_list: ["参考文献1", "参考文献2"],
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockContent,
                error: null,
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getDeepDiveContentFromDb(42)

      expect(result).not.toBeNull()
      expect(result?.trainingId).toBe(42)
      expect(result?.title).toBe("深掘り1")
      expect(result?.sections).toHaveLength(2)
      expect(result?.references).toEqual(["参考文献1", "参考文献2"])
    })

    it("Deep Dive コンテンツが見つからない場合は null を返す", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Not found" },
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getDeepDiveContentFromDb(999)

      expect(result).toBeNull()
    })
  })

  describe("getCategoryDeepDiveFromDb", () => {
    it("カテゴリ単位の Deep Dive コンテンツを取得", async () => {
      const mockContent = {
        category_id: "C",
        title: "中古車ビジネス概論",
        subtitle: "業界構造",
        body_html: "<h1>タイトル</h1><p>本文</p>",
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockContent,
                error: null,
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCategoryDeepDiveFromDb("C")

      expect(result).not.toBeNull()
      expect(result?.categoryId).toBe("C")
      expect(result?.title).toBe("中古車ビジネス概論")
      expect(result?.bodyHtml).toContain("<h1>")
    })

    it("カテゴリ Deep Dive が見つからない場合は null を返す", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: "Not found" },
              }),
            }),
          }),
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getCategoryDeepDiveFromDb("Z")

      expect(result).toBeNull()
    })
  })

  describe("getFinalExamFromDb", () => {
    it("修了テストを正しく取得", async () => {
      const mockConfig = {
        id: 1,
        total_questions: 100,
        passing_score: 70,
        time_limit: 120,
      }

      const mockQuestions = [
        {
          question_number: 1,
          question: "修了問題1",
          options: ["A", "B", "C", "D"],
          correct_answer: 0,
          explanation: "解説",
          source: "テキスト",
          difficulty: "basic",
        },
        {
          question_number: 2,
          question: "修了問題2",
          options: ["X", "Y", "Z", "W"],
          correct_answer: 2,
          explanation: "解説2",
          source: "テキスト2",
          difficulty: "advanced",
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

      const result = await getFinalExamFromDb()

      expect(result).not.toBeNull()
      expect(result?.totalQuestions).toBe(100)
      expect(result?.passingScore).toBe(70)
      expect(result?.timeLimit).toBe(120)
      expect(result?.questions).toHaveLength(2)
      expect(result?.questions[0]?.difficulty).toBe("basic")
      expect(result?.questions[1]?.difficulty).toBe("advanced")
    })

    it("修了テスト設定が見つからない場合は null を返す", async () => {
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

      const result = await getFinalExamFromDb()

      expect(result).toBeNull()
    })

    it("修了テスト問題が見つからない場合は null を返す", async () => {
      const mockConfig = {
        id: 1,
        total_questions: 100,
        passing_score: 70,
        time_limit: 120,
      }

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
                  data: null,
                  error: { message: "Error" },
                }),
              }),
            }
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await getFinalExamFromDb()

      expect(result).toBeNull()
    })
  })
})
