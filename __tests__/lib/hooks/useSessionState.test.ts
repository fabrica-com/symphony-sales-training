import { describe, it, expect } from "vitest"
import { buildActivePhases } from "@/lib/hooks/useSessionState"
import type { SessionContent, DeepDiveReading } from "@/lib/session-data/types"

describe("useSessionState.ts", () => {
  describe("buildActivePhases", () => {
    const createMockSessionContent = (overrides?: Partial<SessionContent>): SessionContent => ({
      trainingId: 1,
      title: "Sample Training",
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
      ...overrides,
    })

    const mockDeepDive: DeepDiveReading = {
      categoryId: "A",
      title: "Deep Dive",
      subtitle: "subtitle",
      introduction: "intro",
      sections: [{ title: "section1", content: "content1" }],
      conclusion: "conclusion",
      references: ["ref1"],
    }

    it("最小構成：checkin, mission, reflection, complete, preview, ending のみ", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, null)

      expect(phases).toEqual([
        "checkin",
        "mission",
        "reflection",
        "complete",
        "preview",
        "ending",
      ])
    })

    it("reviewQuiz がある場合は review フェーズが追加される", () => {
      const content = createMockSessionContent({
        reviewQuiz: { correctIndex: 0, options: ["A", "B"] },
      })
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("review")
      expect(phases.indexOf("review")).toBeLessThan(phases.indexOf("mission"))
    })

    it("story.part1 がある場合は story1 フェーズが追加される", () => {
      const content = createMockSessionContent({
        story: { part1: [{ text: "story" }], part2: null },
      })
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("story1")
    })

    it("story.part2 がある場合は story2 フェーズが追加される", () => {
      const content = createMockSessionContent({
        story: { part1: null, part2: [{ text: "story" }] },
      })
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("story2")
    })

    it("story がない場合は story1, story2 は追加されない", () => {
      const content = createMockSessionContent({
        story: null,
      })
      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("story1")
      expect(phases).not.toContain("story2")
    })

    it("infographic がある場合は infographic フェーズが追加される", () => {
      const content = createMockSessionContent({
        infographic: { imageUrl: "url", title: "title" },
      })
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("infographic")
    })

    it("quickCheck が空配列の場合は quickcheck フェーズは追加されない", () => {
      const content = createMockSessionContent({
        quickCheck: [],
      })
      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("quickcheck")
    })

    it("quickCheck に要素がある場合は quickcheck フェーズが追加される", () => {
      const content = createMockSessionContent({
        quickCheck: [{ correctIndex: 0, options: ["A", "B"] }],
      })
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("quickcheck")
    })

    it("quote がある場合は quote フェーズが追加される", () => {
      const content = createMockSessionContent({
        quote: { text: "quote", author: "author" },
      })
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("quote")
    })

    it("simulation が空配列の場合は simulation フェーズは追加されない", () => {
      const content = createMockSessionContent({
        simulation: [],
      })
      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("simulation")
    })

    it("simulation に要素がある場合は simulation フェーズが追加される", () => {
      const content = createMockSessionContent({
        simulation: [{ situation: "s", customerLine: "c", options: [] }],
      })
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("simulation")
    })

    it("roleplay が空配列の場合は roleplay フェーズは追加されない", () => {
      const content = createMockSessionContent({
        roleplay: [],
      })
      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("roleplay")
    })

    it("roleplay に要素がある場合は roleplay フェーズが追加される", () => {
      const content = createMockSessionContent({
        roleplay: [{ dialogues: [] }],
      })
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("roleplay")
    })

    it("work.fields が空配列の場合は work フェーズは追加されない", () => {
      const content = createMockSessionContent({
        work: { fields: [] },
      })
      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("work")
    })

    it("work.fields に要素がある場合は work フェーズが追加される", () => {
      const content = createMockSessionContent({
        work: { fields: [{ label: "field1", defaultValue: "" }] },
      })
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("work")
    })

    it("actionOptions が空配列の場合は action フェーズは追加されない", () => {
      const content = createMockSessionContent({
        actionOptions: [],
      })
      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("action")
    })

    it("actionOptions に要素がある場合は action フェーズが追加される", () => {
      const content = createMockSessionContent({
        actionOptions: ["action1"],
      })
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("action")
    })

    it("deepDiveContent がない場合は deepdive フェーズは追加されない", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("deepdive")
    })

    it("deepDiveContent がある場合は deepdive フェーズが追加される", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, mockDeepDive)

      expect(phases).toContain("deepdive")
    })

    it("deepdive は preview の後、ending の前に追加される", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, mockDeepDive)

      const previewIndex = phases.indexOf("preview")
      const deepdiveIndex = phases.indexOf("deepdive")
      const endingIndex = phases.indexOf("ending")

      expect(previewIndex).toBeLessThan(deepdiveIndex)
      expect(deepdiveIndex).toBeLessThan(endingIndex)
    })

    it("全フェーズが含まれている場合の順序を確認", () => {
      const content = createMockSessionContent({
        reviewQuiz: { correctIndex: 0, options: ["A", "B"] },
        story: { part1: [{ text: "s1" }], part2: [{ text: "s2" }] },
        infographic: { imageUrl: "url", title: "title" },
        quickCheck: [{ correctIndex: 0, options: ["A"] }],
        quote: { text: "quote", author: "author" },
        simulation: [{ situation: "s", customerLine: "c", options: [] }],
        roleplay: [{ dialogues: [] }],
        work: { fields: [{ label: "f", defaultValue: "" }] },
        actionOptions: ["action1"],
      })
      const phases = buildActivePhases(content, mockDeepDive)

      expect(phases[0]).toBe("checkin")
      expect(phases[1]).toBe("review")
      expect(phases[2]).toBe("mission")
      expect(phases[phases.length - 1]).toBe("ending")
      expect(phases).toContain("complete")
      expect(phases).toContain("preview")
    })

    it("mission と reflection は常に含まれる", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("mission")
      expect(phases).toContain("reflection")
    })

    it("complete と preview は常に含まれる", () => {
      const content = createMockSessionContent()
      const phases = buildActivePhases(content, null)

      expect(phases).toContain("complete")
      expect(phases).toContain("preview")
    })

    it("ending は常に最後", () => {
      const content = createMockSessionContent({
        reviewQuiz: { correctIndex: 0, options: ["A", "B"] },
        story: { part1: [{ text: "s" }], part2: null },
      })
      const phases = buildActivePhases(content, mockDeepDive)

      expect(phases[phases.length - 1]).toBe("ending")
    })

    it("story.part1 が空配列の場合は story1 は追加されない", () => {
      const content = createMockSessionContent({
        story: { part1: [], part2: [{ text: "s2" }] },
      })
      const phases = buildActivePhases(content, null)

      expect(phases).not.toContain("story1")
      expect(phases).toContain("story2")
    })

    it("story.part1 と part2 が両方ある場合、story1 の後に story2", () => {
      const content = createMockSessionContent({
        story: { part1: [{ text: "s1" }], part2: [{ text: "s2" }] },
      })
      const phases = buildActivePhases(content, null)

      const story1Index = phases.indexOf("story1")
      const story2Index = phases.indexOf("story2")

      expect(story1Index).toBeLessThan(story2Index)
    })

    it("複数のコンテンツがない場合の最小フェーズセット", () => {
      const content = createMockSessionContent({
        reviewQuiz: null,
        story: null,
        infographic: null,
        quickCheck: null,
        quote: null,
        simulation: null,
        roleplay: null,
        work: null,
        actionOptions: null,
      })
      const phases = buildActivePhases(content, null)

      expect(phases.length).toBe(6)
      expect(phases).toEqual([
        "checkin",
        "mission",
        "reflection",
        "complete",
        "preview",
        "ending",
      ])
    })

    it("quickCheck と simulation 両方がある場合、quickcheck が先", () => {
      const content = createMockSessionContent({
        quickCheck: [{ correctIndex: 0, options: ["A"] }],
        simulation: [{ situation: "s", customerLine: "c", options: [] }],
      })
      const phases = buildActivePhases(content, null)

      const quickcheckIndex = phases.indexOf("quickcheck")
      const simulationIndex = phases.indexOf("simulation")

      expect(quickcheckIndex).toBeLessThan(simulationIndex)
    })

    it("roleplay と work 両方がある場合、roleplay が先", () => {
      const content = createMockSessionContent({
        roleplay: [{ dialogues: [] }],
        work: { fields: [{ label: "f", defaultValue: "" }] },
      })
      const phases = buildActivePhases(content, null)

      const roleplayIndex = phases.indexOf("roleplay")
      const workIndex = phases.indexOf("work")

      expect(roleplayIndex).toBeLessThan(workIndex)
    })

    it("action は preview の後、ending の前", () => {
      const content = createMockSessionContent({
        actionOptions: ["action1"],
      })
      const phases = buildActivePhases(content, null)

      const actionIndex = phases.indexOf("action")
      const previewIndex = phases.indexOf("preview")
      const endingIndex = phases.indexOf("ending")

      expect(previewIndex).toBeLessThan(actionIndex)
      expect(actionIndex).toBeLessThan(endingIndex)
    })
  })
})
