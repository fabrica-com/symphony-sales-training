import { describe, it, expect } from 'vitest'
import { getScoreColor, getScoreBgColor } from '@/lib/training-results-types'

describe('getScoreColor', () => {
  it('90以上はエメラルド', () => {
    expect(getScoreColor(90)).toBe('text-emerald-600')
    expect(getScoreColor(95)).toBe('text-emerald-600')
    expect(getScoreColor(100)).toBe('text-emerald-600')
  })

  it('80-89はブルー', () => {
    expect(getScoreColor(80)).toBe('text-blue-600')
    expect(getScoreColor(85)).toBe('text-blue-600')
    expect(getScoreColor(89)).toBe('text-blue-600')
  })

  it('70-79はアンバー', () => {
    expect(getScoreColor(70)).toBe('text-amber-600')
    expect(getScoreColor(75)).toBe('text-amber-600')
    expect(getScoreColor(79)).toBe('text-amber-600')
  })

  it('70未満はレッド', () => {
    expect(getScoreColor(69)).toBe('text-red-600')
    expect(getScoreColor(50)).toBe('text-red-600')
    expect(getScoreColor(0)).toBe('text-red-600')
  })

  it('境界値の正確性', () => {
    expect(getScoreColor(89)).toBe('text-blue-600')
    expect(getScoreColor(90)).toBe('text-emerald-600')
    expect(getScoreColor(79)).toBe('text-amber-600')
    expect(getScoreColor(80)).toBe('text-blue-600')
    expect(getScoreColor(69)).toBe('text-red-600')
    expect(getScoreColor(70)).toBe('text-amber-600')
  })
})

describe('getScoreBgColor', () => {
  it('90以上はエメラルド背景', () => {
    expect(getScoreBgColor(90)).toBe('bg-emerald-100 border-emerald-300')
    expect(getScoreBgColor(100)).toBe('bg-emerald-100 border-emerald-300')
  })

  it('80-89はブルー背景', () => {
    expect(getScoreBgColor(80)).toBe('bg-blue-100 border-blue-300')
    expect(getScoreBgColor(89)).toBe('bg-blue-100 border-blue-300')
  })

  it('70-79はアンバー背景', () => {
    expect(getScoreBgColor(70)).toBe('bg-amber-100 border-amber-300')
    expect(getScoreBgColor(79)).toBe('bg-amber-100 border-amber-300')
  })

  it('70未満はレッド背景', () => {
    expect(getScoreBgColor(69)).toBe('bg-red-100 border-red-300')
    expect(getScoreBgColor(0)).toBe('bg-red-100 border-red-300')
  })
})
