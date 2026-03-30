import { describe, it, expect } from 'vitest'
import { buildActivePhases, type SessionPhase } from '@/lib/hooks/useSessionState'
import type { SessionContent, DeepDiveReading } from '@/lib/session-data/types'

// --- ヘルパー: フル構成の SessionContent ---
function makeSessionContent(overrides: Partial<SessionContent> = {}): SessionContent {
  return {
    trainingId: 1,
    title: 'テスト研修',
    keyPhrase: 'テスト',
    badge: { name: 'テストバッジ', icon: 'search' },
    moodOptions: [{ emoji: '😊', label: 'まあまあ', response: 'いいね' }],
    reviewQuiz: { question: 'Q?', options: ['A', 'B'], correctIndex: 0, explanation: '解説' },
    story: {
      part1: [{ title: 'S1', content: 'c', duration: 1 }],
      part2: [{ title: 'S2', content: 'c', duration: 1 }],
    },
    infographic: { title: 'Info', content: 'c', highlight: 'h' },
    quickCheck: [
      { question: 'QC1', options: ['A', 'B'], correctIndex: 0, explanation: '解説' },
    ],
    quote: { text: 'q', textJa: 'q', author: 'a' },
    simulation: [
      {
        situation: 's', customerLine: 'c',
        options: [
          { text: 'A', isCorrect: false, feedback: 'f', points: 0 },
          { text: 'B', isCorrect: true, feedback: 'f', points: 15 },
        ],
      },
    ],
    roleplay: [
      { title: 'RP', situation: 's', dialogue: [], keyPoints: [], successCriteria: '' },
    ],
    work: { title: 'W', description: 'd', fields: [{ label: 'L', placeholder: 'p' }] },
    reflection: { question: 'R?', placeholder: 'p' },
    actionOptions: ['action1', 'action2'],
    ...overrides,
  }
}

const fullDeepDive: DeepDiveReading = {
  title: 'DD', subtitle: '', introduction: '', sections: [], conclusion: '',
}

// =========================================================
// buildActivePhases
// =========================================================
describe('buildActivePhases', () => {
  it('全コンテンツありで全17フェーズを含む', () => {
    const phases = buildActivePhases(makeSessionContent(), fullDeepDive)
    expect(phases).toEqual([
      'checkin', 'review', 'mission',
      'story1', 'infographic', 'quickcheck', 'story2',
      'quote', 'simulation', 'roleplay', 'work',
      'reflection', 'complete', 'preview',
      'action', 'deepdive', 'ending',
    ])
  })

  it('checkin / mission / reflection / complete / preview / ending は常に含まれる', () => {
    const minimal = makeSessionContent({
      reviewQuiz: undefined as any,
      story: { part1: [], part2: [] },
      infographic: undefined as any,
      quickCheck: [],
      quote: undefined as any,
      simulation: [],
      roleplay: undefined,
      work: undefined,
      actionOptions: [],
    })
    const phases = buildActivePhases(minimal, null)
    expect(phases).toContain('checkin')
    expect(phases).toContain('mission')
    expect(phases).toContain('reflection')
    expect(phases).toContain('complete')
    expect(phases).toContain('preview')
    expect(phases).toContain('ending')
  })

  it('reviewQuiz なし → review フェーズ除外', () => {
    const phases = buildActivePhases(makeSessionContent({ reviewQuiz: undefined as any }), null)
    expect(phases).not.toContain('review')
  })

  it('story.part1 が空配列 → story1 フェーズ除外', () => {
    const sc = makeSessionContent({ story: { part1: [], part2: [{ title: 'S2', content: 'c', duration: 1 }] } })
    const phases = buildActivePhases(sc, null)
    expect(phases).not.toContain('story1')
    expect(phases).toContain('story2')
  })

  it('story.part2 が空配列 → story2 フェーズ除外', () => {
    const sc = makeSessionContent({ story: { part1: [{ title: 'S1', content: 'c', duration: 1 }], part2: [] } })
    const phases = buildActivePhases(sc, null)
    expect(phases).toContain('story1')
    expect(phases).not.toContain('story2')
  })

  it('infographic なし → infographic フェーズ除外', () => {
    const phases = buildActivePhases(makeSessionContent({ infographic: undefined as any }), null)
    expect(phases).not.toContain('infographic')
  })

  it('quickCheck が空配列 → quickcheck フェーズ除外', () => {
    const phases = buildActivePhases(makeSessionContent({ quickCheck: [] }), null)
    expect(phases).not.toContain('quickcheck')
  })

  it('quote なし → quote フェーズ除外', () => {
    const phases = buildActivePhases(makeSessionContent({ quote: undefined as any }), null)
    expect(phases).not.toContain('quote')
  })

  it('simulation が空配列 → simulation フェーズ除外', () => {
    const phases = buildActivePhases(makeSessionContent({ simulation: [] }), null)
    expect(phases).not.toContain('simulation')
  })

  it('roleplay なし/空配列 → roleplay フェーズ除外', () => {
    expect(buildActivePhases(makeSessionContent({ roleplay: undefined }), null)).not.toContain('roleplay')
    expect(buildActivePhases(makeSessionContent({ roleplay: [] }), null)).not.toContain('roleplay')
  })

  it('work なし → work フェーズ除外', () => {
    const phases = buildActivePhases(makeSessionContent({ work: undefined }), null)
    expect(phases).not.toContain('work')
  })

  it('work.fields が空配列 → work フェーズ除外', () => {
    const phases = buildActivePhases(makeSessionContent({ work: { title: 'W', description: 'd', fields: [] } }), null)
    expect(phases).not.toContain('work')
  })

  it('actionOptions が空配列 → action フェーズ除外', () => {
    const phases = buildActivePhases(makeSessionContent({ actionOptions: [] }), null)
    expect(phases).not.toContain('action')
  })

  it('deepDiveContent が null → deepdive フェーズ除外', () => {
    const phases = buildActivePhases(makeSessionContent(), null)
    expect(phases).not.toContain('deepdive')
  })

  it('deepDiveContent あり → deepdive フェーズ含む', () => {
    const phases = buildActivePhases(makeSessionContent(), fullDeepDive)
    expect(phases).toContain('deepdive')
  })

  it('ending は常に最後', () => {
    const phases = buildActivePhases(makeSessionContent(), fullDeepDive)
    expect(phases[phases.length - 1]).toBe('ending')
  })

  it('複数スキップの組み合わせ: review/story/simulation/deepdive なし', () => {
    const sc = makeSessionContent({
      reviewQuiz: undefined as any,
      story: { part1: [], part2: [] },
      simulation: [],
    })
    const phases = buildActivePhases(sc, null)
    expect(phases).not.toContain('review')
    expect(phases).not.toContain('story1')
    expect(phases).not.toContain('story2')
    expect(phases).not.toContain('simulation')
    expect(phases).not.toContain('deepdive')
    // 残るもの
    expect(phases).toContain('checkin')
    expect(phases).toContain('mission')
    expect(phases).toContain('infographic')
    expect(phases).toContain('quickcheck')
    expect(phases).toContain('reflection')
  })

  it('フェーズ順序: checkin → mission → reflection → complete → preview → ending の相対順序', () => {
    const phases = buildActivePhases(makeSessionContent(), fullDeepDive)
    const idx = (p: SessionPhase) => phases.indexOf(p)
    expect(idx('checkin')).toBeLessThan(idx('mission'))
    expect(idx('mission')).toBeLessThan(idx('reflection'))
    expect(idx('reflection')).toBeLessThan(idx('complete'))
    expect(idx('complete')).toBeLessThan(idx('preview'))
    expect(idx('preview')).toBeLessThan(idx('ending'))
  })

  it('story1 は infographic より前', () => {
    const phases = buildActivePhases(makeSessionContent(), null)
    expect(phases.indexOf('story1')).toBeLessThan(phases.indexOf('infographic'))
  })

  it('story2 は quickcheck より後', () => {
    const phases = buildActivePhases(makeSessionContent(), null)
    expect(phases.indexOf('quickcheck')).toBeLessThan(phases.indexOf('story2'))
  })

  it('simulation は undefined でも除外される (optional chaining)', () => {
    const phases = buildActivePhases(makeSessionContent({ simulation: undefined as any }), null)
    expect(phases).not.toContain('simulation')
  })
})
