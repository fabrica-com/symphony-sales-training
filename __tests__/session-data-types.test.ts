import { describe, it, expect } from 'vitest'
import { commonMoodOptions } from '@/lib/session-data/types'

describe('commonMoodOptions', () => {
  it('4つのムードオプションが定義されている', () => {
    expect(commonMoodOptions).toHaveLength(4)
  })

  it('各オプションに emoji, label, response が含まれる', () => {
    for (const option of commonMoodOptions) {
      expect(option.emoji).toBeDefined()
      expect(option.emoji.length).toBeGreaterThan(0)
      expect(option.label).toBeDefined()
      expect(option.label.length).toBeGreaterThan(0)
      expect(option.response).toBeDefined()
      expect(option.response.length).toBeGreaterThan(0)
    }
  })

  it('emoji は絵文字である（非ASCII文字を含む）', () => {
    for (const option of commonMoodOptions) {
      // 絵文字は通常 ASCII 範囲外
      expect(option.emoji).not.toMatch(/^[\x00-\x7F]+$/)
    }
  })
})
