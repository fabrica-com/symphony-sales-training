import { describe, it, expect } from 'vitest'
import { tailwindToHex } from '@/lib/colors'

describe('tailwindToHex', () => {
  it('DB に格納されている全カテゴリカラーを正しく変換する', () => {
    // backup.json に記録されている実際の DB 値
    // backup.json に記録されている実際の DB 値（全13カテゴリ）
    const dbColors: Record<string, string> = {
      'bg-blue-500': '#3b82f6',     // カテゴリ A
      'bg-teal-500': '#14b8a6',     // カテゴリ B
      'bg-amber-500': '#f59e0b',    // カテゴリ C
      'bg-rose-500': '#f43f5e',     // カテゴリ D
      'bg-emerald-500': '#10b981',  // カテゴリ E
      'bg-indigo-500': '#6366f1',   // カテゴリ F
      'bg-orange-500': '#f97316',   // カテゴリ G
      'bg-cyan-500': '#06b6d4',     // カテゴリ H
      'bg-violet-500': '#8b5cf6',   // カテゴリ I
      'bg-slate-600': '#475569',    // カテゴリ J
      'bg-pink-500': '#ec4899',     // カテゴリ K
      'bg-lime-500': '#84cc16',     // カテゴリ L
    }

    for (const [tw, expected] of Object.entries(dbColors)) {
      expect(tailwindToHex(tw)).toBe(expected)
    }
  })

  it('未知のクラス名にはフォールバック色を返す', () => {
    expect(tailwindToHex('bg-unknown-999')).toBe('#6b7280')
    expect(tailwindToHex('')).toBe('#6b7280')
    expect(tailwindToHex('text-red-500')).toBe('#6b7280')
  })

  it('返り値は常に # で始まる HEX 形式', () => {
    const knownClasses = [
      'bg-blue-500', 'bg-teal-500', 'bg-amber-500',
      'bg-rose-500', 'bg-green-500', 'bg-purple-500',
    ]
    for (const cls of knownClasses) {
      const hex = tailwindToHex(cls)
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})
