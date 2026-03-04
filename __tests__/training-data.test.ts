import { describe, it, expect } from 'vitest'
import { levelColors, type Level } from '@/lib/training-data'

describe('levelColors', () => {
  const allLevels: Level[] = ['新卒', '若手', '中堅', '上級', 'MGR', '全レベル']

  it('全レベルにカラーが定義されている', () => {
    for (const level of allLevels) {
      expect(levelColors[level]).toBeDefined()
      expect(typeof levelColors[level]).toBe('string')
      expect(levelColors[level].length).toBeGreaterThan(0)
    }
  })

  it('各カラーは bg- と text- の両方を含む', () => {
    for (const level of allLevels) {
      const color = levelColors[level]
      expect(color).toMatch(/bg-/)
      expect(color).toMatch(/text-/)
    }
  })

  it('定義されたレベル数は6つ', () => {
    expect(Object.keys(levelColors)).toHaveLength(6)
  })
})
