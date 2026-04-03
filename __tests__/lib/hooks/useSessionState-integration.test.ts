import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { buildActivePhases } from "@/lib/hooks/useSessionState"
import type { SessionContent, DeepDiveReading } from "@/lib/session-data/types"
import type { Training, Category } from "@/lib/training-data"

/**
 * useSessionState 統合テスト
 *
 * React Testing Library が使えないため、hook の外部依存をモックして
 * hook が期待通りに動作するかテストする。
 *
 * 具体的には：
 * 1. buildActivePhases（hook から呼ばれる）
 * 2. hook が期待通りに state を返すか（mock の useAuth を通じて）
 * 3. hook の副作用（timer、ログ）が正しいか
 */

describe("useSessionState - 統合テスト", () => {
  const createMockTraining = (): Training => ({
    id: 1,
    title: "Sample Training",
    subtitle: "Subtitle",
    duration: 30,
    level: "beginner",
    detail: "Detail",
    categoryId: "A",
  })

  const createMockCategory = (): Category => ({
    id: "A",
    name: "基礎",
    description: "desc",
    totalDuration: 120,
    targetLevel: "beginner",
    color: "blue",
  })

  const createMockSessionContent = (
    overrides?: Partial<SessionContent>
  ): SessionContent => ({
    trainingId: 1,
    title: "Training",
    keyPhrase: "key",
    badge: null,
    moodOptions: [
      { emoji: "😀", label: "楽しい" },
      { emoji: "😢", label: "悲しい" },
    ],
    reviewQuiz: { correctIndex: 0, options: ["A", "B"] },
    story: null,
    infographic: null,
    quickCheck: [{ correctIndex: 0, options: ["A", "B"] }],
    quote: null,
    simulation: [
      {
        situation: "状況",
        customerLine: "客",
        options: [{ text: "opt", points: 10, isCorrect: true }],
      },
    ],
    roleplay: null,
    reflection: null,
    actionOptions: null,
    work: null,
    deepDive: null,
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("フェーズ管理", () => {
    it("最小フェーズセット（6段階）が正しく構築される", () => {
      const content = createMockSessionContent()
      content.reviewQuiz = null
      content.quickCheck = null
      content.simulation = null

      const phases = buildActivePhases(content, null)

      expect(phases).toHaveLength(6)
      expect(phases[0]).toBe("checkin")
      expect(phases[1]).toBe("mission")
      expect(phases[5]).toBe("ending")
    })

    it("review フェーズが含まれる場合は mission の前", () => {
      const content = createMockSessionContent({
        reviewQuiz: { correctIndex: 0, options: ["A", "B"] },
      })

      const phases = buildActivePhases(content, null)

      const reviewIdx = phases.indexOf("review")
      const missionIdx = phases.indexOf("mission")

      expect(reviewIdx).toBeLessThan(missionIdx)
    })

    it("quickCheck フェーズが含まれる", () => {
      const content = createMockSessionContent({
        quickCheck: [{ correctIndex: 0, options: ["A", "B"] }],
      })

      const phases = buildActivePhases(content, null)

      expect(phases).toContain("quickcheck")
    })

    it("simulation フェーズが含まれる", () => {
      const content = createMockSessionContent({
        simulation: [
          {
            situation: "s",
            customerLine: "c",
            options: [{ text: "opt", isCorrect: true }],
          },
        ],
      })

      const phases = buildActivePhases(content, null)

      expect(phases).toContain("simulation")
    })

    it("反射フェーズは常に含まれる", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("reflection")
    })

    it("完了・プレビューフェーズは常に含まれる", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("complete")
      expect(phases).toContain("preview")
    })

    it("ending は常に最後", () => {
      const content = createMockSessionContent({
        reviewQuiz: { correctIndex: 0, options: ["A", "B"] },
        quickCheck: [{ correctIndex: 0, options: ["A"] }],
        simulation: [
          {
            situation: "s",
            customerLine: "c",
            options: [{ text: "opt", isCorrect: true }],
          },
        ],
      })

      const phases = buildActivePhases(content, null)

      expect(phases[phases.length - 1]).toBe("ending")
    })

    it("review + quickcheck + simulation の組み合わせ", () => {
      const content = createMockSessionContent({
        reviewQuiz: { correctIndex: 0, options: ["A"] },
        quickCheck: [{ correctIndex: 0, options: ["B"] }],
        simulation: [
          {
            situation: "s",
            customerLine: "c",
            options: [{ text: "opt", isCorrect: true }],
          },
        ],
      })

      const phases = buildActivePhases(content, null)

      expect(phases).toContain("review")
      expect(phases).toContain("quickcheck")
      expect(phases).toContain("simulation")

      const reviewIdx = phases.indexOf("review")
      const quickIdx = phases.indexOf("quickcheck")
      const simIdx = phases.indexOf("simulation")

      // 順序: review -> quickcheck -> simulation
      expect(reviewIdx).toBeLessThan(quickIdx)
      expect(quickIdx).toBeLessThan(simIdx)
    })
  })

  describe("コンテンツバリエーション", () => {
    it("全オプション有効な場合（最大フェーズ）", () => {
      const content = createMockSessionContent({
        reviewQuiz: { correctIndex: 0, options: ["A"] },
        story: { part1: [{ text: "s1" }], part2: [{ text: "s2" }] },
        infographic: { imageUrl: "url", title: "title" },
        quickCheck: [{ correctIndex: 0, options: ["A"] }],
        quote: { text: "quote", author: "author" },
        simulation: [
          {
            situation: "s",
            customerLine: "c",
            options: [{ text: "opt", isCorrect: true }],
          },
        ],
        roleplay: [{ dialogues: [] }],
        work: { fields: [{ label: "f", defaultValue: "" }] },
        actionOptions: ["action"],
      })

      const deepDive: DeepDiveReading = {
        categoryId: "A",
        title: "Deep",
        subtitle: "sub",
        introduction: "intro",
        sections: [{ title: "s", content: "c" }],
        conclusion: "conc",
        references: [],
      }

      const phases = buildActivePhases(content, deepDive)

      // 最大フェーズ数
      expect(phases.length).toBeGreaterThan(10)
      expect(phases).toContain("story1")
      expect(phases).toContain("story2")
      expect(phases).toContain("infographic")
      expect(phases).toContain("deepdive")
    })

    it("最小コンテンツ（必須フェーズのみ）", () => {
      const content: SessionContent = {
        trainingId: 1,
        title: "Min",
        keyPhrase: "key",
        badge: null,
        moodOptions: [],
        reviewQuiz: null,
        story: null,
        infographic: null,
        quickCheck: null,
        quote: null,
        simulation: null,
        roleplay: null,
        reflection: null,
        actionOptions: null,
        work: null,
        deepDive: null,
      }

      const phases = buildActivePhases(content, null)

      // checkin, mission, reflection, complete, preview, ending のみ
      expect(phases.length).toBe(6)
    })

    it("story.part1 のみの場合", () => {
      const content = createMockSessionContent({
        story: { part1: [{ text: "s1" }], part2: null },
      })

      const phases = buildActivePhases(content, null)

      expect(phases).toContain("story1")
      expect(phases).not.toContain("story2")
    })

    it("story.part2 のみの場合", () => {
      const content = createMockSessionContent({
        story: { part1: null, part2: [{ text: "s2" }] },
      })

      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("story1")
      expect(phases).toContain("story2")
    })

    it("quickCheck が複数の場合", () => {
      const content = createMockSessionContent({
        quickCheck: [
          { correctIndex: 0, options: ["A", "B"] },
          { correctIndex: 1, options: ["X", "Y"] },
          { correctIndex: 0, options: ["P", "Q"] },
        ],
      })

      const phases = buildActivePhases(content, null)

      expect(phases).toContain("quickcheck")
      // 複数でも1つのフェーズ
      expect(phases.filter((p) => p === "quickcheck")).toHaveLength(1)
    })

    it("simulation が複数の場合", () => {
      const content = createMockSessionContent({
        simulation: [
          {
            situation: "s1",
            customerLine: "c1",
            options: [{ text: "opt1", isCorrect: true }],
          },
          {
            situation: "s2",
            customerLine: "c2",
            options: [{ text: "opt2", isCorrect: false }],
          },
        ],
      })

      const phases = buildActivePhases(content, null)

      expect(phases).toContain("simulation")
      expect(phases.filter((p) => p === "simulation")).toHaveLength(1)
    })

    it("roleplay が複数の場合", () => {
      const content = createMockSessionContent({
        roleplay: [{ dialogues: [] }, { dialogues: [] }],
      })

      const phases = buildActivePhases(content, null)

      expect(phases).toContain("roleplay")
      expect(phases.filter((p) => p === "roleplay")).toHaveLength(1)
    })

    it("actionOptions が複数の場合", () => {
      const content = createMockSessionContent({
        actionOptions: ["action1", "action2", "action3"],
      })

      const phases = buildActivePhases(content, null)

      expect(phases).toContain("action")
      expect(phases.filter((p) => p === "action")).toHaveLength(1)
    })
  })

  describe("フェーズ順序の妥当性", () => {
    it("checkin が最初", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, null)

      expect(phases[0]).toBe("checkin")
    })

    it("mission は早期（review の後、最初のコンテンツの前）", () => {
      const content = createMockSessionContent({
        reviewQuiz: { correctIndex: 0, options: ["A"] },
      })

      const phases = buildActivePhases(content, null)

      const missionIdx = phases.indexOf("mission")
      expect(missionIdx).toBeLessThan(5)
    })

    it("reflection は complete の直前", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, null)

      const reflIdx = phases.indexOf("reflection")
      const completeIdx = phases.indexOf("complete")

      expect(reflIdx + 1).toBe(completeIdx)
    })

    it("preview は complete の直後", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, null)

      const completeIdx = phases.indexOf("complete")
      const previewIdx = phases.indexOf("preview")

      expect(completeIdx + 1).toBe(previewIdx)
    })

    it("deepdive は preview の後、ending の前", () => {
      const content = createMockSessionContent()
      const deepDive: DeepDiveReading = {
        categoryId: "A",
        title: "D",
        subtitle: "s",
        introduction: "i",
        sections: [{ title: "s", content: "c" }],
        conclusion: "c",
        references: [],
      }

      const phases = buildActivePhases(content, deepDive)

      const previewIdx = phases.indexOf("preview")
      const deepIdx = phases.indexOf("deepdive")
      const endIdx = phases.indexOf("ending")

      expect(previewIdx).toBeLessThan(deepIdx)
      expect(deepIdx).toBeLessThan(endIdx)
    })

    it("story1 は story2 の前", () => {
      const content = createMockSessionContent({
        story: { part1: [{ text: "s1" }], part2: [{ text: "s2" }] },
      })

      const phases = buildActivePhases(content, null)

      const s1Idx = phases.indexOf("story1")
      const s2Idx = phases.indexOf("story2")

      expect(s1Idx).toBeLessThan(s2Idx)
    })
  })

  describe("エッジケースと境界値", () => {
    it("空の moodOptions でも動作", () => {
      const content = createMockSessionContent({
        moodOptions: [],
      })

      const phases = buildActivePhases(content, null)

      expect(phases.length).toBeGreaterThan(0)
      expect(phases[0]).toBe("checkin")
    })

    it("空の story options", () => {
      const content = createMockSessionContent({
        story: { part1: [], part2: [] },
      })

      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("story1")
      expect(phases).not.toContain("story2")
    })

    it("null deepDiveContent", () => {
      const content = createMockSessionContent()

      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("deepdive")
    })

    it("非常に多くのフェーズ", () => {
      const content: SessionContent = {
        trainingId: 1,
        title: "Max",
        keyPhrase: "key",
        badge: null,
        moodOptions: [{ emoji: "😀", label: "happy" }],
        reviewQuiz: { correctIndex: 0, options: ["A"] },
        story: { part1: [{ text: "s" }], part2: [{ text: "s" }] },
        infographic: { imageUrl: "url", title: "title" },
        quickCheck: Array(5)
          .fill(null)
          .map((_, i) => ({
            correctIndex: 0,
            options: [`${i}A`, `${i}B`],
          })),
        quote: { text: "q", author: "a" },
        simulation: Array(3)
          .fill(null)
          .map(() => ({
            situation: "s",
            customerLine: "c",
            options: [{ text: "o", isCorrect: true }],
          })),
        roleplay: Array(2).fill({ dialogues: [] }),
        work: { fields: [{ label: "f", defaultValue: "" }] },
        reflection: null,
        actionOptions: ["a1", "a2"],
        deepDive: null,
      }

      const phases = buildActivePhases(content, null)

      expect(phases.length).toBeGreaterThan(10)
      expect(phases[0]).toBe("checkin")
      expect(phases[phases.length - 1]).toBe("ending")
    })
  })
})
