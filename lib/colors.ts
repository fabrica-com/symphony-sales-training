/**
 * Tailwind CSS クラス名 → HEX カラー値の変換ユーティリティ
 * DB の training_categories.color には "bg-blue-500" のような Tailwind クラス名が格納されている。
 * inline style の backgroundColor / color に使う場合は HEX 値が必要なため、このマッピングを使う。
 */

const TAILWIND_COLOR_MAP: Record<string, string> = {
  "bg-blue-500": "#3b82f6",
  "bg-teal-500": "#14b8a6",
  "bg-amber-500": "#f59e0b",
  "bg-rose-500": "#f43f5e",
  "bg-green-500": "#22c55e",
  "bg-emerald-500": "#10b981",
  "bg-purple-500": "#a855f7",
  "bg-violet-500": "#8b5cf6",
  "bg-orange-500": "#f97316",
  "bg-red-500": "#ef4444",
  "bg-indigo-500": "#6366f1",
  "bg-cyan-500": "#06b6d4",
  "bg-pink-500": "#ec4899",
  "bg-yellow-500": "#eab308",
  "bg-lime-500": "#84cc16",
  "bg-slate-600": "#475569",
}

const FALLBACK_COLOR = "#6b7280" // gray-500

export function tailwindToHex(twClass: string): string {
  return TAILWIND_COLOR_MAP[twClass] ?? FALLBACK_COLOR
}
