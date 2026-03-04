import { describe, it, expect } from 'vitest'
import { computeSimMax, computeMaxScore, clampScore } from '@/lib/score-calc'
import type { SessionContent } from '@/lib/session-data/types'

// --- ヘルパー: 最小限の SessionContent を生成 ---
function makeSessionContent(overrides: Partial<SessionContent> = {}): SessionContent {
  return {
    trainingId: 1,
    title: 'テスト研修',
    keyPhrase: 'テスト',
    badge: { name: 'テスト', icon: 'search' },
    moodOptions: [
      { emoji: '😊', label: 'まあまあ', response: 'いいね' },
    ],
    reviewQuiz: { question: 'Q?', options: ['A', 'B'], correctIndex: 0, explanation: '解説' },
    story: { part1: [{ title: 'S1', content: 'c', duration: 1 }], part2: [{ title: 'S2', content: 'c', duration: 1 }] },
    infographic: { title: 'Info', content: 'c', highlight: 'h' },
    quickCheck: [
      { question: 'QC1', options: ['A', 'B'], correctIndex: 0, explanation: '解説' },
      { question: 'QC2', options: ['A', 'B'], correctIndex: 1, explanation: '解説' },
    ],
    quote: { text: 'q', textJa: 'q', author: 'a' },
    simulation: [
      { situation: 'S1', customerLine: 'C1', options: [
        { text: 'A', isCorrect: false, feedback: 'f', points: 0 },
        { text: 'B', isCorrect: true, feedback: 'f', points: 30 },
      ]},
    ],
    reflection: { question: 'R?', placeholder: 'p' },
    actionOptions: ['action1'],
    ...overrides,
  }
}

// =========================================================
// computeSimMax
// =========================================================
describe('computeSimMax', () => {
  it('points が設定されている場合、各シナリオの最大値を合計する', () => {
    const sim: SessionContent['simulation'] = [
      { situation: '', customerLine: '', options: [
        { text: 'A', isCorrect: false, feedback: '', points: 0 },
        { text: 'B', isCorrect: true, feedback: '', points: 30 },
      ]},
      { situation: '', customerLine: '', options: [
        { text: 'A', isCorrect: true, feedback: '', points: 25 },
        { text: 'B', isCorrect: false, feedback: '', points: 5 },
      ]},
    ]
    expect(computeSimMax(sim)).toBe(55) // 30 + 25
  })

  it('points が未設定の場合、isCorrect=true → 15 でフォールバック', () => {
    const sim: SessionContent['simulation'] = [
      { situation: '', customerLine: '', options: [
        { text: 'A', isCorrect: false, feedback: '', points: undefined as any },
        { text: 'B', isCorrect: true, feedback: '', points: undefined as any },
      ]},
    ]
    expect(computeSimMax(sim)).toBe(15)
  })

  it('simulation が null/undefined の場合は 0', () => {
    expect(computeSimMax(null as any)).toBe(0)
    expect(computeSimMax(undefined as any)).toBe(0)
  })

  it('空配列の場合は 0', () => {
    expect(computeSimMax([])).toBe(0)
  })
})

// =========================================================
// computeMaxScore
// =========================================================
describe('computeMaxScore', () => {
  it('全フェーズありの場合（training_id=1 相当）', () => {
    const sc = makeSessionContent({
      simulation: [
        { situation: '', customerLine: '', options: [
          { text: 'A', isCorrect: false, feedback: '', points: 0 },
          { text: 'B', isCorrect: true, feedback: '', points: 30 },
        ]},
        { situation: '', customerLine: '', options: [
          { text: 'A', isCorrect: false, feedback: '', points: 0 },
          { text: 'B', isCorrect: true, feedback: '', points: 30 },
        ]},
        { situation: '', customerLine: '', options: [
          { text: 'A', isCorrect: false, feedback: '', points: 0 },
          { text: 'B', isCorrect: true, feedback: '', points: 30 },
        ]},
      ],
      work: { title: 'W', description: 'd', fields: [{ label: 'L', placeholder: 'p' }] },
    })
    const deepDive = { title: 'DD', subtitle: '', introduction: '', sections: [], conclusion: '' }
    // mood:10 + review:10 + story1:20 + qc:2*15=30 + story2:20 + sim:90 + roleplay:0 + work:50 + reflection:10 + action:20 + deepDive:30
    expect(computeMaxScore(sc, deepDive)).toBe(290)
  })

  it('最小構成（mood + reflection + action のみ）', () => {
    const sc = makeSessionContent({
      reviewQuiz: undefined as any,
      story: { part1: [], part2: [] },
      quickCheck: [],
      simulation: [],
      roleplay: undefined,
      work: undefined,
    })
    // mood:10 + reflection:10 + action:20 = 40
    expect(computeMaxScore(sc, null)).toBe(40)
  })

  it('deepDive なしの場合は 30 少ない', () => {
    const sc = makeSessionContent()
    const withDD = computeMaxScore(sc, { title: '', subtitle: '', introduction: '', sections: [], conclusion: '' })
    const withoutDD = computeMaxScore(sc, null)
    expect(withDD - withoutDD).toBe(30)
  })

  it('roleplay ありの場合は +20', () => {
    const base = makeSessionContent({ roleplay: undefined })
    const withRoleplay = makeSessionContent({
      roleplay: [{ title: 'RP', situation: 's', dialogue: [], keyPoints: [], successCriteria: '' }],
    })
    expect(computeMaxScore(withRoleplay, null) - computeMaxScore(base, null)).toBe(20)
  })

  it('work ありの場合は +50', () => {
    const base = makeSessionContent({ work: undefined })
    const withWork = makeSessionContent({
      work: { title: 'W', description: 'd', fields: [{ label: 'L', placeholder: 'p' }] },
    })
    expect(computeMaxScore(withWork, null) - computeMaxScore(base, null)).toBe(50)
  })

  it('quickCheck の問題数に応じて 15pt ずつ増える', () => {
    const sc0 = makeSessionContent({ quickCheck: [] })
    const sc1 = makeSessionContent({ quickCheck: [
      { question: 'Q', options: ['A'], correctIndex: 0, explanation: '' },
    ]})
    const sc3 = makeSessionContent({ quickCheck: [
      { question: 'Q1', options: ['A'], correctIndex: 0, explanation: '' },
      { question: 'Q2', options: ['A'], correctIndex: 0, explanation: '' },
      { question: 'Q3', options: ['A'], correctIndex: 0, explanation: '' },
    ]})
    const base = computeMaxScore(sc0, null)
    expect(computeMaxScore(sc1, null) - base).toBe(15)
    expect(computeMaxScore(sc3, null) - base).toBe(45)
  })
})

// =========================================================
// clampScore
// =========================================================
describe('clampScore', () => {
  it('正常値はそのまま返す', () => {
    expect(clampScore(150, 290)).toBe(150)
  })

  it('maxScore を超える場合はクランプ', () => {
    expect(clampScore(300, 290)).toBe(290)
  })

  it('負の値は 0 にクランプ', () => {
    expect(clampScore(-10, 290)).toBe(0)
  })

  it('小数は四捨五入', () => {
    expect(clampScore(99.6, 290)).toBe(100)
    expect(clampScore(99.4, 290)).toBe(99)
  })

  it('NaN は 0 にフォールバック', () => {
    expect(clampScore(NaN, 290)).toBe(0)
  })

  it('Infinity は 0 にフォールバック', () => {
    expect(clampScore(Infinity, 290)).toBe(0)
  })

  it('maxScore が 0 の場合は常に 0', () => {
    expect(clampScore(100, 0)).toBe(0)
  })
})
